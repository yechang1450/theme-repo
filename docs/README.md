# theme-repo

28 themes and a shared `theme-color` entry for interfaces, charts, documents, and visual work. The repository provides composable palettes inspired by the five elements, with optional glass effects.

[简体中文](../README.md) · [Theme selection guide](../skills/theme-color/SKILL.md) · [Validation workflow](https://github.com/yechang1450/theme-repo/actions/workflows/validate.yml)

Design tokens are reusable values for colors, gradients, panels, and visual effects. Each theme includes Markdown guidance, a JSON token file, skill metadata, and icons. Codex can use the skill instructions; other tools can read the files directly without a framework dependency. The theme guidance is primarily in Chinese.

## Use with Codex

With the plugin installed, start with [theme-color](../skills/theme-color/SKILL.md). It guides theme selection and composition, then directs the assistant to read the selected theme's `SKILL.md`, `THEME.md`, and `tokens.json`.

Example requests:

```text
Use theme-repo to choose colors for this page while preserving its layout and brand colors.
Read the flame-soil theme and choose background, text, and accent colors for the charts in this report.
Use theme-color to compose a palette from existing themes and record the token sources.
```

## Install in Codex (plugin manager)

Skills load automatically only after the plugin is registered with the plugin manager. The personal marketplace file lives at `<home>/.agents/plugins/marketplace.json` (Codex discovers it implicitly), and its entry should point at the **clean distribution** rather than the working tree: the manager copies the plugin directory into its own cache, so a working-tree source also copies `.git/` (measured in this repository: about 2.8 MB of Git metadata per install, 271 files; the distribution carries runtime files only, 245 files).

```powershell
& {
  $ErrorActionPreference = 'Stop'
  $Repo = Join-Path $HOME 'plugins\theme-repo'       # your checkout; clone it first on a new machine
  git -C $Repo pull --ff-only
  if ($LASTEXITCODE -ne 0) { throw 'Update failed.' }
  node (Join-Path $Repo 'scripts/publish-dist.mjs')  # rebuilds <checkout-parent>/dist/theme-repo and validates it
  if ($LASTEXITCODE -ne 0) { throw 'Distribution build failed.' }
  codex plugin add theme-repo@personal               # register and install
  if ($LASTEXITCODE -ne 0) { throw 'Install failed.' }
}
```

On a first install the marketplace file may not exist yet; at minimum it must contain this entry. `source.path` resolves relative to `<home>`, not relative to the directory that holds `marketplace.json`:

```json
{
  "name": "personal",
  "interface": { "displayName": "Personal" },
  "plugins": [
    {
      "name": "theme-repo",
      "source": { "source": "local", "path": "./plugins/dist/theme-repo" },
      "policy": { "installation": "AVAILABLE", "authentication": "ON_INSTALL" },
      "category": "Productivity"
    }
  ]
}
```

Skills load in a **new conversation**; `codex plugin list` should list `theme-repo@personal  installed, enabled`. Moving to another machine or checkout only requires rebuilding the distribution and re-running `codex plugin add theme-repo@personal`; if the existing entry still points at an old path, update that path first.

## Read the files directly

```sh
git clone https://github.com/yechang1450/theme-repo.git
cd theme-repo
```

For example, read the [flame-soil guide](../skills/flame-soil/THEME.md) and [tokens](../skills/flame-soil/tokens.json), then map the values to your existing style variables or palette. Reading the files requires no script execution or third-party dependencies. Cloning downloads the repository; it does not install a Codex plugin automatically.

## Applying a palette

- Preserve brand colors, the current visual style, and the target light or dark mode.
- Use glass effects, gradients, and rounded corners only when the work needs them.
- Read token values from the selected files and document any derived adjustments.
- Check readability and state distinctions against the final background. Structural validation is not an accessibility certification.
- Keep composed palettes in the current project. Add a permanent repository theme only when explicitly requested.

## Themes and token fields

The `skills/` directory contains 29 directories: 28 themes and one shared selection entry. See the [full theme catalog](../README.md#主题目录) for links to every theme. The five elements — wood, fire, earth, metal, and water — organize theme names and design ideas.

| Field | Purpose |
| --- | --- |
| `flames.primary/from/to` | Primary color and background gradient |
| `water` | Translucent panels and borders |
| `glass` | Blur, saturation, highlights, and glass edges |
| `yang` | Accent colors |
| `line` | Foreground and text color |
| `radius` | Corner radius |
| `relation` / `elements` | Theme relationship and element metadata |

Use the actual selected token file as the reference and apply only the fields you need.

## Validate locally

Maintainer validation uses Node.js; the workflow currently covers Node.js 20 and 22. From the repository root, without installing npm dependencies:

```sh
node scripts/validate-themes.mjs
node --test test/*.test.mjs
```

The current checks cover theme counts, required documents and top-level token fields, theme names, selected skill metadata, and plugin manifest fields; `scripts/publish-dist.mjs` re-runs the same validation inside the clean distribution, and `test/publish-dist.test.mjs` additionally asserts that the distribution contains no `.git/` and that a rebuild removes stale files. They do not render designs or establish readability in the final work.

## Contributing and license

[Contributing](../CONTRIBUTING.md) · [Issues](https://github.com/yechang1450/theme-repo/issues) · [Security](../SECURITY.md) · [Changelog](../CHANGELOG.md)

Licensed under the [MIT License](../LICENSE). Author: [Yang Wenchàng](https://github.com/yechang1450).

[Privacy](privacy.md) · [Terms](terms.md)
