# theme-repo

一个**玻璃拟态主题 token 仓库**：为前端项目提供一套"五行元素融合 / 毛玻璃"风格的、可复用的设计 token（颜色、背景、阴影、渐变等）。仓库包含 28 个主题 skill，以及 1 个用于统一选色的 `theme-color` 入口。

> 通用性：主题以**标准 Markdown + token 文件**（`THEME.md` / `tokens.json`）描述，任何前端/UI 框架都能按这套 token 落地，不绑定特定 agent。目录里的 `.codex-plugin/` 仅是 Codex 安装清单。

统一 token：`flames.primary/from/to`（背景渐变）、`water`（半透明毛玻璃 rgba 面板）、`glass`（blur/sat/highlight/edge/radius）、`yang`（点缀）、`line`（前景）。

## 主题

按五行元素融合命名，覆盖冷暖与中性风格：

- 五行融合：`five-elements-fused`（多元素融合）
- 定制主题：`深空紫蓝玻璃拟态`（深空紫蓝·毛玻璃，人脸识别系统同款视觉）
- 火金属性：`flame-metal` / `flame-soil` / `flame-soil-metal` / `flame-soil-metal-water` / `flames`
- 金属性：`metal` / `metal-water` / `metal-water-wood` / `metal-water-wood-flame` / `metal-wood`
- 土属性：`soil` / `soil-metal` / `soil-metal-water` / `soil-metal-water-wood` / `soil-water`
- 水属性：`water` / `water-flame` / `water-wood` / `water-wood-flame` / `water-wood-flame-soil` / `wet-soil-metal`
- 木属性：`wood` / `wood-flame` / `wood-flame-soil` / `wood-flame-soil-metal` / `wood-soil`

每个主题含 `THEME.md`（说明）与 `tokens.json`（可直接给前端框架/设计体系的 design token）。

## 使用

凡需要主题配色，先使用 [theme-color 通用取色技能](skills/theme-color/SKILL.md)，再读取选中主题的 `SKILL.md`、`tokens.json` 和 `THEME.md` 取色或组合。适用于界面、组件、图表、文档和视觉作品，不要求用户先说出主题名。

保留用户指定品牌色与项目现有视觉约束。颜色映射到现有主题变量或色板，检查实际背景下的可读性；只需要配色时不强制增加玻璃效果或改变布局。组合仅保存在当前项目，除非明确要求，不新增永久主题。

## 本地校验

无需安装第三方依赖即可运行目录和 token 校验：

```powershell
node scripts/validate-themes.mjs
node --test test/validate-themes.test.mjs
```

插件现有 28 个主题技能，加 1 个通用取色入口。示例：`flame-soil` 提供“火土成慈”的暖色组合。
