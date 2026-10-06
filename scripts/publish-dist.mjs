#!/usr/bin/env node
/**
 * publish-dist — 从当前工作树重建"干净分发"，供本地 marketplace 安装使用。
 *
 * 为什么需要它：插件管理器会把插件目录整体复制进安装缓存。直接指向工作树会连 `.git/`
 * 一起复制（本机实测：theme-repo 的安装缓存因此多出约 2.8 MB 的 Git 元数据），
 * 既占体积也让静态评估失真。分发包只带运行时文件。
 *
 * 用法：
 *   node scripts/publish-dist.mjs [--target <分发根>] [--quiet]
 *
 * 行为：
 *   1) 在私有临时目录构建并校验，再原子替换旧分发目录；
 *   2) 在分发里跑主题校验（分发自校验），失败即返回非零；
 *   3) 打印分发路径和后续安装命令。
 */
import fs from 'node:fs';
import path from 'node:path';
import {spawnSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import {
  assertNoLinksRecursively,
  assertOutsideCheckout,
  assertPathHasNoLinks,
  requireRegularFile,
} from './path-safety.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const EXCLUDED = new Set(['.git', 'dist', 'node_modules', 'temp', '.plugin-eval']);

export function defaultDistRoot(pluginPath = root) {
  return path.resolve(path.join(path.dirname(path.resolve(pluginPath)), 'dist'));
}

function parseArgs(argv) {
  const out = {target: null, quiet: false};
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === '--target') {
      const value = argv[++i];
      if (!value || value.startsWith('-')) throw new Error('--target requires a directory');
      out.target = path.resolve(value);
    } else if (arg === '--quiet') out.quiet = true;
    else if (arg === '-h' || arg === '--help') out.help = true;
    else throw new Error('unknown option: ' + arg);
  }
  return out;
}

function countFiles(dir) {
  let total = 0;
  for (const entry of fs.readdirSync(dir, {withFileTypes: true})) {
    if (entry.isDirectory()) total += countFiles(path.join(dir, entry.name));
    else total += 1;
  }
  return total;
}

function isExcludedSource(source) {
  const relative = path.relative(root, source);
  return relative !== ''
    && relative.split(path.sep).some((segment) => EXCLUDED.has(segment));
}

function copyFilter(source) {
  if (isExcludedSource(source)) return false;
  const stat = fs.lstatSync(source);
  if (stat.isSymbolicLink()) throw new Error(`refusing symlinked source path: ${source}`);
  if (!stat.isDirectory() && !stat.isFile()) {
    throw new Error(`refusing non-regular source path: ${source}`);
  }
  return true;
}

function moveDirectory(source, destination) {
  assertPathHasNoLinks(destination);
  assertPathHasNoLinks(source);
  assertPathHasNoLinks(path.dirname(destination));
  try {
    fs.renameSync(source, destination);
    return;
  } catch (error) {
    if (error?.code !== 'EPERM' && error?.code !== 'EXDEV') throw error;
  }

  // Reserve the destination before copying so a pre-existing path is never
  // removed as part of the fallback.
  fs.mkdirSync(destination);
  const marker = path.join(destination, `.codex-publish-${process.pid}-${Date.now()}-${Math.random().toString(16).slice(2)}`);
  fs.writeFileSync(marker, 'reserved', {flag: 'wx'});
  try {
    fs.cpSync(source, destination, {recursive: true});
    fs.rmSync(marker, {force: true});
    fs.rmSync(source, {recursive: true, force: true});
  } catch (error) {
    try {
      if (fs.readFileSync(marker, 'utf8') === 'reserved') {
        fs.rmSync(destination, {recursive: true, force: true});
      }
    } catch {
      // Leave an unowned destination untouched if another actor replaced it.
    }
    throw error;
  }
}

export function publishDist({target = null, quiet = false} = {}) {
  const manifestPath = path.join(root, '.codex-plugin', 'plugin.json');
  requireRegularFile(manifestPath);
  const pluginName = JSON.parse(fs.readFileSync(manifestPath, 'utf8')).name;
  if (pluginName !== 'theme-repo' || !/^[A-Za-z0-9][A-Za-z0-9._-]*$/.test(pluginName)) {
    throw new Error(`refusing unsafe plugin name: ${JSON.stringify(pluginName)}`);
  }
  const resolvedTarget = path.resolve(target || defaultDistRoot(root));
  const dist = path.join(resolvedTarget, pluginName);

  // 在创建或删除任何内容前，拒绝目标路径中的链接，并用规范路径检查工作树边界。
  assertPathHasNoLinks(resolvedTarget);
  assertOutsideCheckout(root, dist);
  assertNoLinksRecursively(root, {skipNames: EXCLUDED});
  fs.mkdirSync(resolvedTarget, {recursive: true});
  assertPathHasNoLinks(resolvedTarget);
  assertOutsideCheckout(root, dist);

  // 在目标父目录下构建，校验通过后再替换现有分发，避免旧目录删除失败时留下半成品。
  const stagingParent = fs.mkdtempSync(path.join(resolvedTarget, `.${pluginName}.staging-`));
  const staging = path.join(stagingParent, pluginName);
  let backupParent = null;
  let backup = null;
  let preserveBackup = false;
  try {
    fs.cpSync(root, staging, {
      recursive: true,
      filter: copyFilter,
    });
    assertNoLinksRecursively(staging);

    const verify = spawnSync(process.execPath, [path.join(staging, 'scripts', 'validate-themes.mjs')], {
      encoding: 'utf8',
      windowsHide: true,
      cwd: staging,
    });
    if (verify.status !== 0) {
      throw new Error('distribution theme validation failed: ' + (verify.stderr || verify.stdout || 'exit ' + verify.status).trim());
    }
    const report = JSON.parse(String(verify.stdout).trim());

    assertPathHasNoLinks(dist);
    if (fs.existsSync(dist)) {
      assertNoLinksRecursively(dist);
      backupParent = fs.mkdtempSync(path.join(resolvedTarget, `.${pluginName}.previous-`));
      backup = path.join(backupParent, pluginName);
      assertPathHasNoLinks(resolvedTarget);
      assertOutsideCheckout(root, dist);
      moveDirectory(dist, backup);
    }
    try {
      assertPathHasNoLinks(resolvedTarget);
      assertOutsideCheckout(root, dist);
      moveDirectory(staging, dist);
    } catch (error) {
      if (backup && fs.existsSync(backup)) {
        try {
          moveDirectory(backup, dist);
          backup = null;
          backupParent = null;
        } catch {
          preserveBackup = true;
          // Keep the backup if restoration itself fails.
        }
      }
      throw error;
    }
    if (backupParent) {
      try {
        assertPathHasNoLinks(resolvedTarget);
        assertOutsideCheckout(root, backupParent);
        assertNoLinksRecursively(backupParent);
        fs.rmSync(backupParent, {recursive: true, force: true});
        backupParent = null;
        backup = null;
      } catch {
        preserveBackup = true;
        // Leave a backup in place if the target path changed during cleanup.
      }
    }

    const result = {
      dist,
      target: resolvedTarget,
      pluginName,
      files: countFiles(dist),
      themes: report.themeCount,
      sharedEntries: report.sharedEntries,
      manifestValid: report.manifestValid,
      install: 'codex plugin add ' + pluginName + '@personal',
    };
    if (!quiet) {
      console.log(`[publish-dist] ${dist} (${result.files} files, ${result.themes} themes + ${report.sharedEntries.join(', ')})`);
      console.log(`[publish-dist] next: ${result.install}`);
    }
    return result;
  } finally {
    if (!preserveBackup && backupParent && fs.existsSync(backupParent)) {
      try {
        assertPathHasNoLinks(resolvedTarget);
        assertOutsideCheckout(root, backupParent);
        assertNoLinksRecursively(backupParent);
        fs.rmSync(backupParent, {recursive: true, force: true});
      } catch {
        // Preserve the original error and leave the backup for later cleanup.
      }
    }
    if (fs.existsSync(stagingParent)) {
      try {
        assertPathHasNoLinks(resolvedTarget);
        assertNoLinksRecursively(stagingParent);
        fs.rmSync(stagingParent, {recursive: true, force: true});
      } catch {
        // Preserve the original error and leave the staging directory for review.
      }
    }
  }
}

if (process.argv[1] && path.resolve(process.argv[1]) === path.resolve(fileURLToPath(import.meta.url))) {
  try {
    const options = parseArgs(process.argv.slice(2));
    if (options.help) {
      console.log('Usage: publish-dist.mjs [--target <distribution root>] [--quiet]');
      process.exit(0);
    }
    publishDist(options);
    process.exit(0);
  } catch (error) {
    console.error('[publish-dist] ' + (error?.message || error));
    process.exit(1);
  }
}
