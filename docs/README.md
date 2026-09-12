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
node --test test/validate-themes.test.mjs
```

The current checks cover theme counts, required documents and top-level token fields, theme names, selected skill metadata, and plugin manifest fields. They do not render designs or establish readability in the final work.

## Contributing and license

[Contributing](../CONTRIBUTING.md) · [Issues](https://github.com/yechang1450/theme-repo/issues) · [Security](../SECURITY.md) · [Changelog](../CHANGELOG.md)

Licensed under the [MIT License](../LICENSE). Author: [Yang Wenchàng](https://github.com/yechang1450).

[Privacy](privacy.md) · [Terms](terms.md)
