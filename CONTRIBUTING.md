# Contributing

感谢参与 `theme-repo`。请保持每个主题目录自洽，并让改动可以在没有第三方依赖的环境中校验。

## 提交前检查

```powershell
node scripts/validate-themes.mjs
node --test test/*.test.mjs
```

新增主题时，请同时提供 `SKILL.md`、`THEME.md`、`tokens.json`、`agents/openai.yaml` 和 `assets/icon.svg|png`，并在根目录文档中登记。不要提交密钥、个人路径、运行缓存或生成目录。

## 提交方式

小范围改动请使用清晰的 commit，并在 Pull Request 中说明变更目的、校验命令和结果。涉及 token 的改动应说明兼容性影响。
