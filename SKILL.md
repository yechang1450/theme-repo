---
name: theme-repo
description: 主题仓库，含通用取色入口和28个主题技能。Use whenever a task needs theme colors or coordinated palettes, or when viewing tokens and managing themes.
---

# theme-repo · 主题仓库

凡需要主题配色，先使用 [theme-color](skills/theme-color/SKILL.md) 通用入口，再读取目标主题资源。没有指定主题名时也适用；保留已有视觉约束，不将取色扩大为整体换肤。

每个主题是一个独立 skill（`skills/<name>/`），内含 `SKILL.md`（套用说明）+ `tokens.json`（设计 token）+ `THEME.md`（设计理念与配色）+ `assets/icon.svg|png`（图标=主题色）。

## 统一 token schema
- `flames`：背景渐变——`from` → `to` + `primary` 主色（softBlue/softPink 为柔光）。
- `water`：半透明毛玻璃面板——glassTop `rgba(255,255,255,.10)` → glassBottom 主题深色 `rgba(...,.55)`，panelStroke `rgba(255,255,255,.18)` / titleBar `.08` / innerBar `.06`。
- `glass`：玻璃效果层（blur / saturation / highlight / edge / radius）。
- `yang`：点缀色（对应主题的能量色）。
- `line`：前景/文字色；`radius`：圆角。
- 元数据：`relation`（element/generation/overcoming/continuous-generation/wet-earth-generation/fused）+ `elements`（数组）。

## 28 个主题

### 基础色（单元素）
- **wood 木（青）** · **flames 火（赤）** · **soil 土（黄）** · **metal 金（白）** · **water 水（黑）**

### 双元素配色
- water-wood 水灵木秀（蓝）· wood-flame 木火通明（紫）· flame-soil 火土成慈（棕）· soil-metal 土金毓秀（橙）· metal-water 金白水清（灰）
- metal-wood 金木栋梁 · wood-soil 木土疏通 · soil-water 土水池沼 · water-flame 水火既济 · flame-metal 火金器皿

### 三元素连续
- water-wood-flame 水木火 · wood-flame-soil 木火土 · flame-soil-metal 火土金 · soil-metal-water 土金水 · metal-water-wood 金水木

### 四元素连续
- water-wood-flame-soil 水木火土 · wood-flame-soil-metal 木火土金 · flame-soil-metal-water 火土金水 · soil-metal-water-wood 土金水木 · metal-water-wood-flame 金水木火

### 特殊配色
- **wet-soil-metal 湿土生金**（湿润土壤生金属，反白光）
- **深空紫蓝玻璃拟态**（深空蓝紫渐变 + 半透明毛玻璃面板 + 霓虹蓝紫点缀，定制主题）

### 全元素融合
- **five-elements-fused 全元素融合**（融合色 `#97876E`，即本插件图标色）

## 套用
读目标主题 skill 的 `tokens.json` 写 CSS 变量：body 用 `flames.from → flames.to` 渐变（`flames.primary` 主色）、面板用 `water` 半透明毛玻璃 + `glass` 磨砂（blur/sat/高光）、点缀用 `yang`、文字用 `line`。

## Web 主题自动组合（不永久入库，保持清爽）
当用户需要"设计/套用一个 Web 主题"而没指定具体现有主题时，本插件**自行从本仓库主题色中挑选组合**出一种新的 theme color：
- **组合规则（与现有主题统一风格）**：从现有主题的 `flames`（背景渐变主色）里选 1 个做主背景，叠加 `water` 半透明毛玻璃面板 + `glass` 磨砂层；`yang` 取与主色呼应的点缀、`line` 取对比明显的前景、`radius` 用统一圆角。图标/名称沿用 `relation` + `elements` 元数据风格。
- **只用于当前任务**：组合出的新主题颜色**只在本次设计/套用中使用**，产出给当前前端项目；**不**新增一个永久 skill、**不**写入 `skills/` 目录（避免每次组合导致仓库无限膨胀）。若项目要求沉淀，可让用户显式要求"存为新主题 skill"再入库。
- 命名：组合主题可用 `auto-<主色元素>-<点缀元素>` 风格示意（如 `auto-fire-water`），仅作当前任务命名，不入库。
