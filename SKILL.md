---
name: theme-repo
description: 五行主题仓库：27 个主题色即 27 个 skill，每个 skill 的图标=对应主题色，统一玻璃拟态 token。Use when 需要给前端项目套用五行主题色、查看主题设计 token，或新增/管理主题。
---

# theme-repo · 五行主题仓库

每个主题是一个独立 skill（`skills/<name>/`），内含 `SKILL.md`（套用说明）+ `tokens.json`（设计 token）+ `THEME.md`（设计理念与配色）+ `assets/icon.svg|png`（图标=主题色）。

## 统一 token schema
- `fire`：背景渐变（from/to/primary + softBlue/softPink）。
- `water`：玻璃面板（glassTop/glassBottom/panelStroke/titleBar/innerBar）。
- `glass`：玻璃效果层（blur 14px / saturation 140% / highlight / edge / radius）——全部主题统一。
- `yang`：点缀色（对应主题的能量色）。
- `line`：前景/文字色；`radius`：圆角。
- 元数据：`relation`（element/generation/overcoming/continuous-generation/wet-earth-generation/fused）+ `elements`（五行数组）。

## 27 个主题

### 基础五行
- **wood 木（青）** · **fire 火（赤）** · **soil 土（黄）** · **metal 金（白）** · **water 水（黑）**

### 完美相生（融合态）
- water-wood 水灵木秀（蓝）· wood-flame 木火通明（紫）· flame-soil 火土成慈（棕）· soil-gold 土金毓秀（橙）· gold-water 金白水清（灰）

### 完美相克（天平平衡）
- gold-wood 金木栋梁 · wood-soil 木土疏通 · soil-water 土水池沼 · water-flame 水火既济 · flame-gold 火金器皿

### 连续相生（三行/四行，融合态）
- water-wood-flame 水木火 · wood-flame-soil 木火土 · flame-soil-gold 火土金 · soil-gold-water 土金水 · gold-water-wood 金水木
- water-wood-flame-soil 水木火土 · wood-flame-soil-gold 木火土金 · flame-soil-gold-water 火土金水 · soil-gold-water-wood 土金水木 · gold-water-wood-flame 金水木火

### 特殊地支关系
- **wet-soil-gold 湿土生金**（丑土辰土湿土容器，土生金通道，戊辰大运最重要的能量关系）

### 五行融合
- **five-elements-fused 五行融合**（融合色 `#97876E`，即本插件图标色）

## 套用
读目标主题 skill 的 `tokens.json` 写 CSS 变量：body 用 `fire` 渐变、面板用 `water` 玻璃 + `glass` 磨砂（blur/sat/高光）、点缀用 `yang`、文字用 `line`。
