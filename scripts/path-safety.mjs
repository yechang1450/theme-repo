import fs from 'node:fs';
import path from 'node:path';

function statOrNull(target) {
  try {
    return fs.lstatSync(target);
  } catch (error) {
    if (error?.code === 'ENOENT') return null;
    throw error;
  }
}

function normalized(value) {
  const resolved = path.resolve(value);
  return process.platform === 'win32' ? resolved.toLowerCase() : resolved;
}

export function isWithin(root, candidate) {
  const relative = path.relative(normalized(root), normalized(candidate));
  return relative === ''
    || (relative !== '..'
      && !relative.startsWith(`..${path.sep}`)
      && !path.isAbsolute(relative));
}

export function assertPathHasNoLinks(target) {
  let current = path.resolve(target);
  while (true) {
    const stat = statOrNull(current);
    if (stat?.isSymbolicLink()) {
      throw new Error(`refusing symlinked path component: ${current}`);
    }
    const parent = path.dirname(current);
    if (parent === current) break;
    current = parent;
  }
  return target;
}

export function assertNoLinksRecursively(root, {skipNames = new Set()} = {}) {
  const skipped = skipNames instanceof Set ? skipNames : new Set(skipNames);

  function visit(current) {
    const stat = statOrNull(current);
    if (!stat) throw new Error(`path disappeared during safety check: ${current}`);
    if (stat.isSymbolicLink()) {
      throw new Error(`refusing symlinked path: ${current}`);
    }
    if (stat.isDirectory()) {
      for (const entry of fs.readdirSync(current, {withFileTypes: true})) {
        if (!skipped.has(entry.name)) visit(path.join(current, entry.name));
      }
      return;
    }
    if (!stat.isFile()) {
      throw new Error(`refusing non-regular path: ${current}`);
    }
  }

  visit(path.resolve(root));
  return root;
}

export function requireRegularFile(file) {
  assertPathHasNoLinks(file);
  const stat = statOrNull(file);
  if (!stat) throw new Error('missing required file');
  if (stat.isSymbolicLink()) throw new Error('required file must not be a symlink');
  if (!stat.isFile()) throw new Error('required path must be a regular file');
  return file;
}

export function assertOutsideCheckout(checkout, candidate) {
  const checkoutReal = fs.realpathSync(checkout);
  const candidatePath = path.resolve(candidate);
  const candidateReal = fs.existsSync(candidatePath)
    ? fs.realpathSync(candidatePath)
    : path.join(fs.realpathSync(path.dirname(candidatePath)), path.basename(candidatePath));
  if (isWithin(checkoutReal, candidateReal)) {
    throw new Error(`refusing to publish inside the checkout: ${candidatePath}`);
  }
  return candidateReal;
}
