# theme-repo

28 themes and a shared `theme-color` entry for interfaces, charts, documents, and visual work. The repository provides composable palettes inspired by the five elements, with optional glass effects.

[简体中文](../README.md) · [Theme selection guide](../skills/theme-color/SKILL.md) · [Validation workflow](https://github.com/yechang1450/theme-repo/actions/workflows/validate.yml) · [Contributing](../CONTRIBUTING.md) · [Security](../SECURITY.md) · [Code of Conduct](../CODE_OF_CONDUCT.md)

Design tokens are reusable values for colors, gradients, panels, and visual effects. Each theme is a standalone skill (a task-focused instruction file for coding agents) carrying its tokens, a design guide, and icons; Codex selects them through the skills, and other tools can read the Markdown and JSON files directly without a framework dependency. The theme guidance is primarily in Chinese.

## Use with Codex

With the plugin installed, start with [theme-color](../skills/theme-color/SKILL.md): it guides theme selection and composition, then directs the assistant to read the selected theme's `SKILL.md`, `THEME.md`, and `tokens.json`. No theme name is required up front.

```text
Use theme-repo to choose colors for this page while preserving its layout and brand colors.
Read the flame-soil theme and choose background, text, and accent colors for the charts in this report.
Use theme-color to compose a palette from existing themes and record the token sources.
```

## Install in Codex (plugin manager)

Skills load automatically only after the plugin is registered with the plugin manager:

```powershell
$Repo = Join-Path $HOME 'plugins\theme-repo'       # your checkout; clone it first on a new machine
git -C $Repo pull --ff-only
node (Join-Path $Repo 'scripts/publish-dist.mjs')  # rebuilds <checkout-parent>/dist/theme-repo and validates it
codex plugin add theme-repo@personal               # register and install
```

The marketplace entry (`<home>/.agents/plugins/marketplace.json`, discovered implicitly by Codex) must point at the **clean distribution**, not the working tree — the manager copies the plugin directory into its own cache, so a working-tree source also copies `.git/` (measured in this repository: about 2.8 MB of Git metadata per install).

<details>
<summary>Minimal marketplace entry for a first install + a fail-fast one-shot script</summary>

On a first install the marketplace file may not exist yet; at minimum it must contain this entry (`source.path` resolves relative to `<home>`, not relative to the directory that holds `marketplace.json`):

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

A fail-fast one-shot script for a first install (stops at the first failing step):

```powershell
& {
  $ErrorActionPreference = 'Stop'
  $Repo = Join-Path $HOME 'plugins\theme-repo'
  git -C $Repo pull --ff-only
  if ($LASTEXITCODE -ne 0) { throw 'Update failed.' }
  node (Join-Path $Repo 'scripts/publish-dist.mjs')
  if ($LASTEXITCODE -ne 0) { throw 'Distribution build failed.' }
  codex plugin add theme-repo@personal
  if ($LASTEXITCODE -ne 0) { throw 'Install failed.' }
}
```

</details>

Skills load in a **new conversation**; `codex plugin list` should list `theme-repo@personal  installed, enabled`. Moving to another machine or checkout only requires rebuilding the distribution and re-running `codex plugin add theme-repo@personal` (update the entry path first if it still points at an old location).

## Read the files directly

```sh
git clone https://github.com/yechang1450/theme-repo.git
```

For example, the [flame-soil guide](../skills/flame-soil/THEME.md) and [tokens](../skills/flame-soil/tokens.json) (the "fire-earth" palette). Reading requires no script execution or third-party dependencies; cloning only downloads the repository — it does not install a Codex plugin.

## Applying a palette

- Preserve brand colors, the current visual style, and the target light or dark mode.
- Use glass effects, gradients, and rounded corners only when the work needs them.
- Read token values from the selected files and document any derived adjustments.
- Check readability and state distinctions against the final background. Structural validation is not an accessibility certification.
- Keep composed palettes in the current project. Add a permanent repository theme only when explicitly requested.

## Themes and token fields

The `skills/` directory contains 29 directories: 28 themes and one shared selection entry. The five elements — wood, fire, earth, metal, and water — organize theme names and design ideas. See the [full theme catalog](../README.md#主题目录) for links to every theme.

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

The checks cover theme counts, required documents and top-level token fields, theme names, selected skill metadata, and plugin manifest fields; `publish-dist.mjs` re-runs the same validation inside the clean distribution, and `test/publish-dist.test.mjs` additionally asserts that the distribution contains no `.git/` and that a rebuild removes stale files. They do not render designs or establish readability in the final work.

## Contributing and rights

[Contributing](../CONTRIBUTING.md) · [Issues](https://github.com/yechang1450/theme-repo/issues) · [Security](../SECURITY.md) · [Changelog](../CHANGELOG.md) · [Code of Conduct](../CODE_OF_CONDUCT.md)

Copyright © 2026 yechang1450. All rights reserved.

No additional license or permission is granted beyond rights provided by
GitHub's Terms of Service or applicable law. Third-party components remain
subject to their own license notices.

[Privacy](privacy.md) · [Terms](terms.md)
