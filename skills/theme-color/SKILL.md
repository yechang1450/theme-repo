---
name: theme-color
description: 从 theme repo 选择和组合主题配色。Use whenever a task needs theme colors or a coordinated palette for UI, websites, components, charts, slides, documents, or graphics, including implicit color decisions without a named theme.
---

# theme-color · 统一取色入口

凡任务需要 theme color（主题配色，即背景、前景和点缀色的协调组合），先通过本技能读取 theme repo 的实际主题资源，再落实到当前作品。不凭记忆编造仓库色值。

## 选择与读取

1. 已有项目先检查当前主题变量、深浅模式和用户指定颜色，延续现有配色；仅修业务逻辑或文案而不涉及配色时，无需改主题。
2. 用户指定主题时，读取对应的 `../<主题名>/SKILL.md`、`THEME.md` 与 `tokens.json`。未指定时，从[仓库主题目录](../../SKILL.md)选择贴合现有风格及用途的主题；只读取选中的资源，不一次加载全部主题。
3. 需要组合时，用一个主题的背景为基础，从现有主题选协调的点缀和前景。颜色必须能追溯到所读的 `tokens.json`；用户给定品牌色优先，围绕它从仓库选择搭配，不擅自替换品牌色。

## 应用

- `flames.primary/from/to` 提供主色与渐变；`water` 提供面板；`yang` 提供点缀；`line` 提供文字/前景。字段以实际 token 文件为准。
- 把色值映射到项目已有的 CSS 变量、组件主题或文档/图表色板，保持统一来源。主题里的 `glass`、圆角等不是必须新增的视觉效果；只需配色时不改变布局、交互或材料风格。
- 核对文字与背景、按钮状态、图表系列以及深浅模式的可辨识性。玻璃层应按最终叠加背景检查；不能仅靠颜色表达错误或状态。必要的透明度、明度调整应从已选色值派生，并保留来源说明。
- 在项目现有主题文件的注释或设计说明中简要注明采用的主题名、来源 token 和必要派生。只保存最终使用的配色，不另建一次性色板文件。
- 自动组合只用于当前项目。除非用户明确要求保存为新主题，不往仓库追加永久主题技能。

完成后检查实际输出：已有 UI 的视觉约束、文本可读性、状态区分和目标深浅模式。调用本技能不代表授权给现有项目整体换肤。
