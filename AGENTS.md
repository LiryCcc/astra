# Astra — Agent Instructions

本文件为 AI Agent 与本项目协作时的持久约定。开发、重构、新建文件时 **必须** 遵循以下规范。

## 文件命名规范

Flutter / Dart 官方惯例为 **snake_case**（`lower_case_with_underscores`）。本项目所有可自主命名的 **文件** 与 **目录** 统一使用 snake_case。

| 风格 | 格式 | 示例 |
|------|------|------|
| snake_case | 小写，单词用 `_` 连接 | `home_page.dart`、`app_theme.dart`、`adaptive_layout.md` |

### 选用原则

1. **Dart 源文件**：`home_page.dart`、`todo_repository.dart`、`home_page_test.dart`
2. **目录名**：单词目录用全小写（`pages`、`utils`）；多词目录用 snake_case（`todo_widgets/`）
3. **文档与脚本**：`adaptive_layout.md`、`check_format.ps1`
4. **生成文件**保持工具既定命名：`*.g.dart`、`*.freezed.dart`

### 正确示例

```
docs/requirements/adaptive_layout.md       # 文档
tool/check_format.ps1                      # 脚本
assets/images/app_logo.png                 # 资源
lib/pages/home_page.dart                   # 路由页面
lib/components/adaptive_scaffold.dart      # 公共组件
lib/utils/app_router.dart                  # 工具库
lib/adapters/windows/window_adapter.dart   # 平台适配
```

### 错误示例

```
lib/pages/home-page.dart                   # ❌ kebab-case
lib/pages/HomePage.dart                    # ❌ PascalCase
lib/pages/homePage.dart                    # ❌ camelCase
lib/features/home_page.dart                # ❌ 使用未定义的 features 目录
```

### 不适用本规范的例外

以下保持平台或工具既定名称，**不要** 强行改名：

| 类型 | 示例 |
|------|------|
| 平台强制文件 | `Info.plist`、`AndroidManifest.xml`、`pubspec.yaml` |
| 生成文件 | `*.g.dart`、`*.freezed.dart` |
| 隐藏/工具目录 | `.git/`、`.vscode/`、`.dart_tool/` |
| 官方模板目录 | `android/`、`ios/`、`windows/`、`macos/`、`lib/`、`test/` |

## 代码归档规范

`lib/` 目录按职责分层归档。**整体必须单向依赖，禁止任何反向依赖。**

### 目录结构

```
lib/
├── main.dart                 # 入口文件：初始化、启动应用
├── app.dart                  # 应用根：MaterialApp、主题、路由挂载
├── pages/                    # 路由页面（与路由表一一对应）
│   ├── home_page.dart        #   /         首页
│   ├── settings_page.dart    #   /settings 设置页
│   └── todos_page.dart       #   /todos    TodoMVC 页
├── components/               # 公共组件（跨页面复用的 UI）
│   └── adaptive_scaffold.dart
├── utils/                    # 工具库（纯逻辑、常量、路由配置、Provider 等）
│   ├── app_router.dart
│   ├── app_theme.dart
│   └── breakpoints.dart
└── adapters/                 # 平台特定逻辑
    ├── android/
    ├── ios/
    ├── mac/
    └── windows/
```

### 各目录职责

| 目录 | 职责 | 可包含 |
|------|------|--------|
| `lib/main.dart`、`lib/app.dart` | **入口层** | 应用启动、全局依赖注入、`MaterialApp` 组装 |
| `lib/pages/` | **页面层** | 路由表中的每个页面对应一个文件（或同名子目录），仅负责该路由的 UI 与页面级状态 |
| `lib/components/` | **组件层** | 多个页面复用的 Widget，不含业务路由逻辑 |
| `lib/utils/` | **工具层** | 主题、路由表、断点、格式化、通用 Provider/Repository 等与 UI 无关或可复用的逻辑 |
| `lib/adapters/` | **适配层** | 各平台差异实现（文件 IO、窗口、权限等），按平台分子目录 |

### 路由表与 pages 映射

新增路由时，**必须** 同时在路由表与 `pages/` 中增加对应项，保持一一对应：

| 路由 | 页面文件 |
|------|----------|
| `/` | `pages/home_page.dart` |
| `/settings` | `pages/settings_page.dart` |
| `/todos` | `pages/todos_page.dart` |

页面私有 Widget 放在该页面同级子目录，例如 `pages/home/widgets/`；**只有**跨页面复用才提升到 `components/`。

### 单向依赖规则

依赖方向 **只能从上到下**，下层 **禁止** import 上层：

```
入口（main.dart / app.dart）
    ↓
pages/
    ↓
components/
    ↓
utils/
    ↓
adapters/（android / ios / mac / windows）
```

| 层级 | 允许依赖 | 禁止依赖 |
|------|----------|----------|
| 入口 | `pages`、`components`、`utils`、`adapters` | — |
| `pages/` | `components`、`utils`、`adapters` | `main.dart` / `app.dart`、其他 `pages/` |
| `components/` | `utils`、`adapters` | `pages/`、入口 |
| `utils/` | `adapters` | `pages/`、`components/`、入口 |
| `adapters/` | 仅 SDK / 第三方包 | `pages/`、`components/`、`utils/`、入口、其他平台子目录（通过抽象接口解耦） |

### 禁止反向依赖（示例）

```dart
// ❌ adapters 引用 pages
import '../pages/home_page.dart';

// ❌ utils 引用 components
import '../components/adaptive_scaffold.dart';

// ❌ components 引用 pages
import '../pages/settings_page.dart';

// ❌ pages 互相引用（应通过路由跳转，而非直接 import 其他页面）
import 'todos_page.dart';
```

### 跨平台适配约定

- 平台无关代码放在 `utils/` 或 `components/`，通过 **抽象接口** 定义行为
- 各平台实现在 `adapters/<platform>/` 中完成
- `adapters/` 子目录固定为：`android`、`ios`、`mac`、`windows`（不使用 `macos` 等其他命名）
- 页面与组件 **不得** 直接编写 `Platform.isX` 分支；应调用 `utils/` 中的抽象 API，由 `adapters/` 提供实现

## 代码与文档

- 语言：Dart 3.x + Flutter；Material Design 3
- 平台：Android、iOS、Windows、macOS
- 格式化与 Lint：见 `docs/technical/09-code-quality.md`，提交前运行 `tool/check.ps1` 或 `tool/check.sh`
- 需求 / 技术 / 实施文档：见 `docs/README.md`

## Agent 行为要求

- 所有新建文件与目录统一使用 snake_case，禁止使用 kebab-case、camelCase、PascalCase 文件名
- 新建代码时放入 `AGENTS.md` 规定的目录，不得随意创建 `features/`、`shared/` 等未定义顶层目录
- 新增路由必须同步更新 `pages/` 与路由配置（`utils/app_router.dart`）
- 发现不符合规范且可安全重命名的旧文件，重构时一并修正并更新引用
- 添加 import 前检查单向依赖，拒绝引入反向依赖
- 仅修改与任务相关的文件，保持最小 diff
