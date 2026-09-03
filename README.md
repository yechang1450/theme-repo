# theme-repo

一个**玻璃拟态主题 token 仓库**：为前端项目提供一套"五行元素融合 / 毛玻璃"风格的、可复用的设计 token（颜色、背景、阴影、渐变等）。

> 通用性：主题以**标准 Markdown + token 文件**（`THEME.md` / `tokens.json`）描述，任何前端/UI 框架都能按这套 token 落地，不绑定特定 agent。目录里的 `.codex-plugin/` 仅是 Codex 安装清单。

## 主题

按五行元素融合命名，覆盖冷暖与中性风格：

- 五行融合：`five-elements-fused`（多元素融合）
- 定制日期主题：`20260903`（深空紫蓝·毛玻璃，人脸识别系统同款视觉）
- 火金属性：`flame-metal` / `flame-soil` / `flame-soil-metal` / `flame-soil-metal-water` / `flames`
- 金属性：`metal` / `metal-water` / `metal-water-wood` / `metal-water-wood-flame` / `metal-wood`
- 土属性：`soil` / `soil-metal` / `soil-metal-water` / `soil-metal-water-wood` / `soil-water`
- 水属性：`water` / `water-flame` / `water-wood` / `water-wood-flame` / `water-wood-flame-soil` / `wet-soil-metal`
- 木属性：`wood` / `wood-flame` / `wood-flame-soil` / `wood-flame-soil-metal` / `wood-soil`

每个主题含 `THEME.md`（说明）与 `tokens.json`（可直接给前端框架/设计体系的 design token）。

## 使用

把目标主题目录下的 `tokens.json` / `THEME.md` 引入你的项目，按指示设置 CSS 变量/主题即可。例如 `flame-soil` 提供"火土成慈"的暖玻璃拟态组合。
