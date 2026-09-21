# theme-repo

28 个主题 + theme-color 统一取色入口，面向界面、图表、文档与视觉作品；提供可组合的五行配色与玻璃拟态设计变量。

[English](docs/README.md) · [统一取色入口](skills/theme-color/SKILL.md) · [自动校验](https://github.com/yechang1450/theme-repo/actions/workflows/validate.yml)

每个主题提供设计 token（可复用的颜色、渐变、面板和玻璃效果参数）、说明和图标。Codex 可通过 skill（指导智能体完成特定任务的说明文件）选择和使用这些资源；其他工具也可以直接读取 Markdown 和 JSON 文件，再映射到已有样式变量或色板。

## 使用

### 在 Codex 中使用

已安装该插件时，先使用 [theme-color](skills/theme-color/SKILL.md) 选择或组合配色，再读取选中主题的 `SKILL.md`、`THEME.md` 和 `tokens.json`。无需提前指定主题名。

示例请求：

```text
使用 theme-repo 为当前页面选择配色，保留现有布局和品牌色。
读取 flame-soil 主题，给这份报告的图表搭配背景、文字和强调色。
用 theme-color 从现有主题中组合配色，并注明使用的主题和 token 来源。
```

### 在 Codex 中安装（插件管理器）

主题技能要在新对话里自动加载，需要先注册进 Codex 的插件管理器。个人 marketplace 文件位于 `<home>/.agents/plugins/marketplace.json`（Codex 隐式发现），条目指向**干净分发**而不是工作树——管理器会把插件目录整体复制进安装缓存，指向工作树会连 `.git/` 一起复制（本机实测：theme-repo 的缓存因此多出约 2.8 MB 的 Git 元数据）。

```powershell
& {
  $ErrorActionPreference = 'Stop'
  $Repo = Join-Path $HOME 'plugins\theme-repo'       # 你的克隆位置；首次安装时改为 git clone
  git -C $Repo pull --ff-only
  if ($LASTEXITCODE -ne 0) { throw '更新失败。' }
  node (Join-Path $Repo 'scripts/publish-dist.mjs')  # 重建 <克隆父目录>/dist/theme-repo 并自校验
  if ($LASTEXITCODE -ne 0) { throw '分发重建失败。' }
  codex plugin add theme-repo@personal               # 注册并安装
  if ($LASTEXITCODE -ne 0) { throw '安装失败。' }
}
```

首次安装时 marketplace 文件可能还不存在，至少要包含本插件条目（`source.path` 相对 `<home>` 解析，不是相对 `marketplace.json` 所在目录）：

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

装完后**新开一个 Codex 对话**技能才会加载；`codex plugin list` 里应显示 `theme-repo@personal  installed, enabled`。

### 直接读取主题文件

```sh
git clone https://github.com/yechang1450/theme-repo.git
cd theme-repo
```

例如，[flame-soil 的说明](skills/flame-soil/THEME.md)和 [token 文件](skills/flame-soil/tokens.json)提供“火土成慈”配色。读取资源无需运行脚本或安装第三方依赖；上述命令只下载仓库，不会自动完成 Codex 插件安装。

## 应用原则

- 先保留用户指定的品牌色、已有视觉风格和深浅模式，再选择适合的主题。
- 只需要配色时，不强制增加毛玻璃、渐变、圆角，也不改变布局或交互。
- 组合颜色应来自实际读取的 token；必要的派生调整应说明来源。
- 文字、图表系列和状态颜色需要在最终背景上检查可辨识性；结构校验不等于可读性认证。
- 组合结果保存在当前作品中；只有明确要求保存新主题时，才向仓库新增主题。

## 主题目录

`skills/` 下共有 29 个目录：1 个 `theme-color` 通用入口和以下 28 个主题。五行（木、火、土、金、水）用于组织主题名称和设计理念。

| 分类 | 主题 |
| --- | --- |
| 单元素 · 5 | [wood](skills/wood/THEME.md)、[flames](skills/flames/THEME.md)、[soil](skills/soil/THEME.md)、[metal](skills/metal/THEME.md)、[water](skills/water/THEME.md) |
| 双元素 · 10 | [water-wood](skills/water-wood/THEME.md)、[wood-flame](skills/wood-flame/THEME.md)、[flame-soil](skills/flame-soil/THEME.md)、[soil-metal](skills/soil-metal/THEME.md)、[metal-water](skills/metal-water/THEME.md)、[metal-wood](skills/metal-wood/THEME.md)、[wood-soil](skills/wood-soil/THEME.md)、[soil-water](skills/soil-water/THEME.md)、[water-flame](skills/water-flame/THEME.md)、[flame-metal](skills/flame-metal/THEME.md) |
| 三元素 · 5 | [water-wood-flame](skills/water-wood-flame/THEME.md)、[wood-flame-soil](skills/wood-flame-soil/THEME.md)、[flame-soil-metal](skills/flame-soil-metal/THEME.md)、[soil-metal-water](skills/soil-metal-water/THEME.md)、[metal-water-wood](skills/metal-water-wood/THEME.md) |
| 四元素 · 5 | [water-wood-flame-soil](skills/water-wood-flame-soil/THEME.md)、[wood-flame-soil-metal](skills/wood-flame-soil-metal/THEME.md)、[flame-soil-metal-water](skills/flame-soil-metal-water/THEME.md)、[soil-metal-water-wood](skills/soil-metal-water-wood/THEME.md)、[metal-water-wood-flame](skills/metal-water-wood-flame/THEME.md) |
| 特殊配色 · 1 | [wet-soil-metal](skills/wet-soil-metal/THEME.md) |
| 定制主题 · 1 | [深空紫蓝玻璃拟态](skills/深空紫蓝玻璃拟态/THEME.md) |
| 全元素融合 · 1 | [five-elements-fused](skills/five-elements-fused/THEME.md) |

## 文件与字段

每个主题包含 `SKILL.md`（使用指引）、`THEME.md`（设计说明）、`tokens.json`（参数）、`agents/openai.yaml`（技能展示信息）和 `assets/`（图标）。`theme-color` 提供选择规则，不是第 29 个主题。

| token 字段 | 用途 |
| --- | --- |
| `flames.primary/from/to` | 主色及背景渐变 |
| `water` | 半透明面板与边框 |
| `glass` | 模糊、饱和度、高光及玻璃边缘 |
| `yang` | 点缀色 |
| `line` | 前景和文字色 |
| `radius` | 圆角 |
| `relation` / `elements` | 主题关系及元素元数据 |

以所选主题的实际文件为准，按作品需要选用字段。

## 本地校验

维护者校验使用 Node.js，现有自动校验覆盖 Node.js 20 和 22。无需安装 npm 依赖，在仓库根目录执行：

```sh
node scripts/validate-themes.mjs
node --test test/*.test.mjs
```

当前校验检查主题数量、必需文档与 token 顶层字段、主题名称、部分技能元数据及插件清单；`scripts/publish-dist.mjs` 重建干净分发时会在分发目录里再跑一次同样的校验，`test/publish-dist.test.mjs` 额外确认分发不带 `.git/` 且重建会清掉旧内容。校验不渲染最终作品，也不替代实际使用中的可读性检查。

## 参与与许可

[贡献指南](CONTRIBUTING.md) · [问题反馈](https://github.com/yechang1450/theme-repo/issues) · [安全报告](SECURITY.md) · [变更记录](CHANGELOG.md)

采用 [MIT License](LICENSE)。作者：[Yang Wenchàng](https://github.com/yechang1450)。

[隐私说明](docs/privacy.md) · [使用条款](docs/terms.md)
