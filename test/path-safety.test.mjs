import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {assertNoLinksRecursively, requireRegularFile} from '../scripts/path-safety.mjs';

test('path safety rejects linked files and directories', (t) => {
  const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'theme-path-safety-'));
  const victim = path.join(tempRoot, 'victim.txt');
  const linkedFile = path.join(tempRoot, 'linked.txt');
  const linkedDir = path.join(tempRoot, 'linked-dir');
  fs.writeFileSync(victim, 'safe');
  fs.mkdirSync(path.join(tempRoot, 'tree'));
  try {
    try {
      fs.symlinkSync(victim, linkedFile, 'file');
      fs.symlinkSync(tempRoot, linkedDir, process.platform === 'win32' ? 'junction' : 'dir');
    } catch (error) {
      t.skip(`links unavailable: ${error.message}`);
      return;
    }
    assert.throws(() => requireRegularFile(linkedFile), /symlinked path component|must not be a symlink/);
    assert.throws(() => assertNoLinksRecursively(tempRoot), /symlinked path/);
  } finally {
    fs.rmSync(tempRoot, {recursive: true, force: true});
  }
});
