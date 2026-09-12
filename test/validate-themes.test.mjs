import test from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const validator = path.join(repoRoot, 'scripts', 'validate-themes.mjs');

test('theme validator accepts all 28 themes and the shared theme-color entry', () => {
  const result = spawnSync(process.execPath, [validator], {
    cwd: repoRoot,
    encoding: 'utf8',
  });

  assert.equal(result.status, 0, result.stderr || result.stdout);
  const report = JSON.parse(result.stdout);
  assert.equal(report.themeCount, 28);
  assert.deepEqual(report.sharedEntries, ['theme-color']);
  assert.equal(report.invalid.length, 0);
});
