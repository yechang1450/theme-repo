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
 *   1) 删除旧分发目录（避免新旧混合），再按排除清单复制当前工作树；
 *   2) 在分发里跑主题校验（分发自校验），失败即返回非零；
 *   3) 打印分发路径和后续安装命令。
 */
import fs from 'node:fs';
import path from 'node:path';
import {spawnSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';

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

export function publishDist({target = null, quiet = false} = {}) {
  const pluginName = JSON.parse(fs.readFileSync(path.join(root, '.codex-plugin', 'plugin.json'), 'utf8')).name;
  const resolvedTarget = path.resolve(target || defaultDistRoot(root));
  const dist = path.join(resolvedTarget, pluginName);
  // 分发目录必须落在工作树之外：否则要么自拷贝报错，要么把生成目录混进仓库。
  const insideRoot = path.relative(root, path.resolve(dist));
  if (!insideRoot.startsWith('..') && !path.isAbsolute(insideRoot)) {
    throw new Error(`refusing to publish inside the checkout: ${dist} (choose a target outside ${root})`);
  }
  fs.mkdirSync(resolvedTarget, {recursive: true});
  // 先删旧分发再重建，避免新旧文件混在一起冒充当前版本。
  fs.rmSync(dist, {recursive: true, force: true});
  fs.cpSync(root, dist, {
    recursive: true,
    filter: (source) => !EXCLUDED.has(path.basename(source)),
  });
  const verify = spawnSync(process.execPath, [path.join(dist, 'scripts', 'validate-themes.mjs')], {encoding: 'utf8', windowsHide: true, cwd: dist});
  if (verify.status !== 0) {
    throw new Error('distribution theme validation failed: ' + (verify.stderr || verify.stdout || 'exit ' + verify.status).trim());
  }
  const report = JSON.parse(String(verify.stdout).trim());
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
