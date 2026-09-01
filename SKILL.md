---
name: theme-repo
description: 主题仓库：27 个主题色即 27 个 skill，每个 skill 的图标=对应主题色，统一玻璃拟态 token。Use when 需要给前端项目套用主题色、查看主题设计 token，或新增/管理主题。
---

# theme-repo · 主题仓库

每个主题是一个独立 skill（`skills/<name>/`），内含 `SKILL.md`（套用说明）+ `tokens.json`（设计 token）+ `THEME.md`（设计理念与配色）+ `assets/icon.svg|png`（图标=主题色）。

## 统一 token schema
- `flames`：背景渐变（from/to/primary + softBlue/softPink）。
- `water`：玻璃面板（glassTop/glassBottom/panelStroke/titleBar/innerBar）。
- `glass`：玻璃效果层（blur 14px / saturation 140% / highlight / edge / radius）——全部主题统一。
- `yang`：点缀色（对应主题的能量色）。
- `line`：前景/文字色；`radius`：圆角。
- 元数据：`relation`（element/generation/overcoming/continuous-generation/wet-earth-generation/fused）+ `elements`（数组）。

## 27 个主题

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

### 全元素融合
- **five-elements-fused 全元素融合**（融合色 `#97876E`，即本插件图标色）

## 套用
读目标主题 skill 的 `tokens.json` 写 CSS 变量：body 用 `flames` 渐变、面板用 `water` 玻璃 + `glass` 磨砂（blur/sat/高光）、点缀用 `yang`、文字用 `line`。
