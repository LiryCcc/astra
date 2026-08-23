# 代码质量工具

对应 `.editorconfig` 的格式化与静态检查方案。Dart/Flutter 生态中：

| JS 生态 | Dart/Flutter 等价 |
|---------|-------------------|
| Prettier | `dart format` |
| ESLint | `dart analyze` + `flutter_lints` |

## 配置文件

| 文件 | 作用 |
|------|------|
| `.editorconfig` | 编辑器基础风格（缩进、换行、行宽） |
| `analysis_options.yaml` | Linter 规则、analyzer 严格模式、格式化行宽 |
| `.vscode/settings.json` | Cursor/VS Code 保存时自动格式化 |
| `pubspec.yaml` | `flutter_lints` 开发依赖 |

## 与 .editorconfig 对齐

| .editorconfig | Dart 配置 |
|---------------|-----------|
| `indent_size = 2` | `dart format` 默认 2 空格；VS Code `tabSize: 2` |
| `max_line_length = 120` | `analysis_options.yaml` → `formatter.page_width: 120` |
| `end_of_line = lf` | `files.eol: "\n"` |
| `trim_trailing_whitespace` | `dart format` 自动处理 |
| `insert_final_newline` | `dart format` 自动处理 |

## 命令

安装 Flutter SDK 并执行 `flutter pub get` 后：

```bash
# 格式化（类似 prettier --write）
dart format --line-length=120 .

# 静态分析（类似 eslint）
dart analyze --fatal-infos

# CI 检查：格式 + lint 一并验证
./tool/check.sh      # macOS / Linux
.\tool\check.ps1     # Windows
```

### 脚本说明

| 脚本 | 说明 |
|------|------|
| `tool/format.ps1` / `format.sh` | 格式化所有 Dart 文件 |
| `tool/lint.ps1` / `lint.sh` | 运行 `dart analyze` |
| `tool/check.ps1` / `check.sh` | 格式检查 + analyze + `flutter test`（CI 用） |

## Linter 规则

基于 [`flutter_lints`](https://pub.dev/packages/flutter_lints) 推荐规则，额外启用：

- `prefer_single_quotes` — 单引号
- `require_trailing_commas` — 尾随逗号（便于 diff）
- `avoid_print` — 禁止 `print`，使用 `debugPrint` 或 logger
- `always_declare_return_types` — 显式返回类型
- `strict-casts` / `strict-inference` / `strict-raw-types` — 严格类型推断

生成文件（`*.g.dart`）已从 analyze 中排除。

## 编辑器集成

安装推荐扩展（见 `.vscode/extensions.json`）：

- **Dart** (`Dart-Code.dart-code`)
- **Flutter** (`Dart-Code.flutter`)
- **EditorConfig** (`editorconfig.editorconfig`)

保存 `.dart` 文件时自动执行 `dart format`（`formatOnSave: true`）。

## 推荐工作流

1. 开发时：保存自动格式化
2. 提交前：运行 `.\tool\check.ps1`
3. CI：在 pipeline 中执行 `tool/check.sh`
