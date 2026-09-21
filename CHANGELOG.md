# Changelog

## 0.1.19

- 新增 `scripts/publish-dist.mjs`：从工作树重建 `<克隆父目录>/dist/theme-repo` 干净分发（排除 `.git/`、`temp/`、`node_modules/` 等），并在分发里重跑主题校验后才算成功。
- 本地安装改走插件管理器 + 干净分发：README 增加「在 Codex 中安装（插件管理器）」一节（个人 marketplace 条目、`codex plugin add theme-repo@personal`、更新流程与首次安装的最小 marketplace 内容），并说明 `source.path` 相对 `<home>` 解析。
- 实测背景：此前 marketplace 条目指向工作树，安装缓存里复制了约 2.8 MB 的 Git 元数据；改指向分发后缓存只含运行时文件。
- 校验命令改为 `node --test test/*.test.mjs`，新增 `test/publish-dist.test.mjs` 覆盖分发重建、`.git/` 排除与陈旧文件清理。

## 0.1.18

- 增加 `theme-color` 统一取色入口。
- 保持 28 个主题的 token 和图标结构一致。
- 增加公开前的主题目录与 token 校验。
