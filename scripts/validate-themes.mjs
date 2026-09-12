import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const skillsRoot = path.join(repoRoot, 'skills');
const requiredFiles = ['SKILL.md', 'THEME.md', 'tokens.json', 'agents/openai.yaml'];
const requiredTokenFields = [
  'name',
  'idea',
  'relation',
  'elements',
  'flames',
  'water',
  'glass',
  'yang',
  'line',
  'radius',
];

const entries = fs.readdirSync(skillsRoot, { withFileTypes: true })
  .filter((entry) => entry.isDirectory())
  .map((entry) => entry.name)
  .sort((a, b) => a.localeCompare(b));

const sharedEntries = entries.filter((name) => name === 'theme-color');
const themeNames = entries.filter((name) => name !== 'theme-color');
const invalid = [];

let manifestValid = false;
try {
  const manifest = JSON.parse(fs.readFileSync(path.join(repoRoot, '.codex-plugin', 'plugin.json'), 'utf8'));
  manifestValid = Boolean(manifest.name === 'theme-repo'
    && manifest.version
    && manifest.license === 'MIT'
    && manifest.skills === './skills/'
    && manifest.homepage === 'https://github.com/yechang1450/theme-repo'
    && manifest.interface?.websiteURL === manifest.homepage
    && manifest.interface?.privacyPolicyURL?.endsWith('/docs/privacy.md')
    && manifest.interface?.termsOfServiceURL?.endsWith('/docs/terms.md'));
  if (!manifestValid) invalid.push('plugin.json: public metadata is incomplete or inconsistent');
} catch (error) {
  invalid.push(`plugin.json: invalid JSON (${error.message})`);
}

let metadataCount = 0;

for (const name of themeNames) {
  const themeRoot = path.join(skillsRoot, name);
  for (const relativePath of requiredFiles) {
    if (!fs.statSync(path.join(themeRoot, relativePath), { throwIfNoEntry: false })?.isFile()) {
      invalid.push(`${name}: missing ${relativePath}`);
    }
  }

  const tokenFile = path.join(themeRoot, 'tokens.json');
  try {
    const tokens = JSON.parse(fs.readFileSync(tokenFile, 'utf8'));
    for (const field of requiredTokenFields) {
      if (!(field in tokens)) invalid.push(`${name}: missing token field ${field}`);
    }
    if (tokens.name !== name) invalid.push(`${name}: tokens.name is ${JSON.stringify(tokens.name)}`);
    if (!Array.isArray(tokens.elements) || tokens.elements.length === 0) {
      invalid.push(`${name}: elements must be a non-empty array`);
    }
  } catch (error) {
    invalid.push(`${name}: invalid tokens.json (${error.message})`);
  }

  const metadata = fs.readFileSync(path.join(themeRoot, 'agents', 'openai.yaml'), 'utf8');
  const expectedPrompt = `default_prompt: "Use $theme-repo:${name} to apply this theme to a frontend project."`;
  if (!metadata.includes(expectedPrompt)) invalid.push(`${name}: default_prompt does not match directory name`);
  if (!metadata.includes('icon_small: "./assets/icon.png"') || !metadata.includes('icon_large: "./assets/icon.svg"')) {
    invalid.push(`${name}: icon metadata is incomplete`);
  }
  metadataCount += 1;
}

const report = {
  themeCount: themeNames.length,
  sharedEntries,
  metadataCount,
  manifestValid,
  invalid,
};

process.stdout.write(`${JSON.stringify(report, null, 2)}\n`);
if (themeNames.length !== 28 || sharedEntries.length !== 1 || invalid.length > 0) {
  process.exitCode = 1;
}
