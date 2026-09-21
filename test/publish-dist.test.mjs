import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {spawnSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import {publishDist} from '../scripts/publish-dist.mjs';

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const TEST_TEMP = path.join(repoRoot, 'temp');
fs.mkdirSync(TEST_TEMP, {recursive: true});

test('publish-dist builds a clean distribution and re-validates it in place', () => {
  const target = fs.mkdtempSync(path.join(os.tmpdir(), 'theme-publish-dist-'));
  try {
    const result = publishDist({target, quiet: true});
    assert.equal(result.pluginName, 'theme-repo');
    assert.equal(result.themes, 28);
    assert.deepEqual(result.sharedEntries, ['theme-color']);
    assert.equal(result.manifestValid, true);
    assert.equal(fs.existsSync(path.join(result.dist, '.git')), false, '分发不能带 .git');
    assert.equal(fs.existsSync(path.join(result.dist, '.codex-plugin', 'plugin.json')), true);
    const skills = fs.readdirSync(path.join(result.dist, 'skills'), {withFileTypes: true}).filter((entry) => entry.isDirectory());
    assert.equal(skills.length, 29);

    const verify = spawnSync(process.execPath, [path.join(result.dist, 'scripts', 'validate-themes.mjs')], {encoding: 'utf8', cwd: result.dist});
    assert.equal(verify.status, 0, verify.stderr || verify.stdout);
    assert.equal(JSON.parse(verify.stdout).themeCount, 28);

    // 重建必须清掉旧内容，避免新旧混合冒充当前版本
    fs.writeFileSync(path.join(result.dist, 'stale.txt'), 'stale');
    const again = publishDist({target, quiet: true});
    assert.equal(fs.existsSync(path.join(again.dist, 'stale.txt')), false);
  } finally {
    fs.rmSync(target, {recursive: true, force: true});
  }
});

test('publish-dist refuses to write a distribution inside the checkout', () => {
  assert.throws(() => publishDist({target: repoRoot, quiet: true}), /refusing to publish inside the checkout/);
  assert.throws(() => publishDist({target: TEST_TEMP, quiet: true}), /refusing to publish inside the checkout/);
});

test('publish-dist CLI reports unknown options and prints usage on demand', () => {
  const cli = path.join(repoRoot, 'scripts', 'publish-dist.mjs');
  const bad = spawnSync(process.execPath, [cli, '--nope'], {encoding: 'utf8', cwd: repoRoot});
  assert.equal(bad.status, 1);
  assert.match(bad.stderr, /unknown option/);
  const help = spawnSync(process.execPath, [cli, '--help'], {encoding: 'utf8', cwd: repoRoot});
  assert.equal(help.status, 0);
  assert.match(help.stdout, /Usage: publish-dist\.mjs/);
});
