# Astra — Agent Instructions

本文件为 AI Agent 与本项目协作时的持久约定。开发、重构、新建文件时 **必须** 遵循以下规范。

## 文件命名规范

Flutter / Dart 官方惯例为 **snake_case**（`lower_case_with_underscores`）。本项目所有可自主命名的 **文件** 与 **目录** 统一使用 snake_case。

| 风格       | 格式                  | 示例                                                     |
| ---------- | --------------------- | -------------------------------------------------------- |
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
lib/store/locale_store.dart                # 全局状态
lib/i18n/schema.dart                       # i18n 文案表
lib/utils/app_router.dart                  # 工具库
lib/adapters/windows/window_adapter.dart   # 平台适配
test/store/todo_store_test.dart            # 单元测试
```

### 错误示例

```
lib/pages/home-page.dart                   # ❌ kebab-case
lib/pages/HomePage.dart                    # ❌ PascalCase
lib/pages/homePage.dart                    # ❌ camelCase
lib/features/home_page.dart                # ❌ 使用未定义的 features 目录
lib/i18n/strings.json                      # ❌ 文案不得放在 JSON/YAML 等文件
```

### 不适用本规范的例外

以下保持平台或工具既定名称，**不要** 强行改名：

| 类型          | 示例                                                      |
| ------------- | --------------------------------------------------------- |
| 平台强制文件  | `Info.plist`、`AndroidManifest.xml`、`pubspec.yaml`       |
| 生成文件      | `*.g.dart`、`*.freezed.dart`                              |
| 隐藏/工具目录 | `.git/`、`.vscode/`、`.dart_tool/`                        |
| 官方模板目录  | `android/`、`ios/`、`windows/`、`macos/`、`lib/`、`test/` |

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
├── store/                    # 全局状态（Riverpod Provider / Notifier）
│   ├── theme_store.dart
│   ├── locale_store.dart
│   └── todo_store.dart
├── i18n/                     # 国际化文案（纯 Dart，禁止 JSON/YAML/ARB）
│   ├── schema.dart           # 文案表定义（key 与类型契约）
│   ├── zh_cn.dart            # 简体中文
│   ├── en.dart               # 英文
│   └── jp.dart               # 日语
├── utils/                    # 工具库（路由配置、主题数据、常量等）
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

| 目录                            | 职责       | 可包含                                                                         |
| ------------------------------- | ---------- | ------------------------------------------------------------------------------ |
| `lib/main.dart`、`lib/app.dart` | **入口层** | 应用启动、全局依赖注入、`MaterialApp` 组装                                     |
| `lib/pages/`                    | **页面层** | 路由表中的每个页面对应一个文件（或同名子目录），仅负责该路由的 UI 与页面级状态 |
| `lib/components/`               | **组件层** | 多个页面复用的 Widget，不含业务路由逻辑                                        |
| `lib/store/`                    | **状态层** | 全局状态逻辑：主题、语言偏好、Todo 列表等 Riverpod `Provider` / `Notifier`     |
| `lib/i18n/`                     | **文案层** | 各语言文案 Dart 文件；`schema.dart` 定义文案表结构                             |
| `lib/utils/`                    | **工具层** | 路由表、主题 `ThemeData`、断点常量等与 UI 无强绑定的纯逻辑                     |
| `lib/adapters/`                 | **适配层** | 各平台差异实现（文件 IO、窗口、权限等），按平台分子目录                        |

### 路由表与 pages 映射

新增路由时，**必须** 同时在路由表与 `pages/` 中增加对应项，保持一一对应：

| 路由        | 页面文件                   |
| ----------- | -------------------------- |
| `/`         | `pages/home_page.dart`     |
| `/settings` | `pages/settings_page.dart` |
| `/todos`    | `pages/todos_page.dart`    |

页面私有 Widget 放在该页面同级子目录，例如 `pages/home/widgets/`；**只有**跨页面复用才提升到 `components/`。

页面级临时状态留在 `pages/` 内；**跨页面共享或需持久化的状态** 放入 `store/`。

### 测试文件归档

Flutter/Dart 测试放在项目根目录的 **`test/`**，与 `lib/` 平级，**镜像** `lib/` 的子目录结构。禁止把测试放进 `lib/`。

```
test/
├── store/
│   ├── theme_store_test.dart
│   ├── locale_store_test.dart
│   └── todo_store_test.dart
├── utils/
│   ├── app_router_test.dart
│   └── breakpoints_test.dart
├── components/
│   └── adaptive_scaffold_test.dart
├── pages/
│   ├── home_page_test.dart
│   ├── settings_page_test.dart
│   └── todos_page_test.dart
└── i18n/
    └── i18n_schema_test.dart      # 校验各语言文件实现 schema 完整性
```

| 测试类型    | 目录                | 命名                   | 运行命令                        |
| ----------- | ------------------- | ---------------------- | ------------------------------- |
| 单元测试    | `test/`             | `<源文件名>_test.dart` | `flutter test`                  |
| Widget 测试 | `test/`（同上）     | `<源文件名>_test.dart` | `flutter test`                  |
| 集成测试    | `integration_test/` | `<场景名>_test.dart`   | `flutter test integration_test` |

**路径映射规则**：`lib/<路径>/<name>.dart` → `test/<路径>/<name>_test.dart`

```
lib/store/todo_store.dart       → test/store/todo_store_test.dart
lib/pages/home_page.dart        → test/pages/home_page_test.dart
lib/utils/breakpoints.dart      → test/utils/breakpoints_test.dart
```

**约定**：

- 文件名使用 snake_case，必须以 `_test.dart` 结尾（Dart 官方惯例）
- 单元测试优先覆盖 `store/`、`utils/`、`i18n/` 中的纯逻辑
- Widget 测试覆盖 `pages/`、`components/`
- 测试只 import `lib/` 中的被测代码，**不得** 与 `lib/` 形成反向依赖
- `integration_test/` 用于跨页面、跨平台的端到端场景，目录结构可扁平，不必完全镜像 `lib/`

### i18n 规范

- 文案 **只写在 Dart 代码中**，禁止使用 JSON、YAML、ARB 等外部文案文件
- 文件固定为四份：

| 文件          | 职责                                                     |
| ------------- | -------------------------------------------------------- |
| `schema.dart` | 定义文案表（字段 / key、类型契约），作为各语言文件的约束 |
| `zh_cn.dart`  | 简体中文文案实现                                         |
| `en.dart`     | 英文文案实现                                             |
| `jp.dart`     | 日语文案实现                                             |

- 新增文案时：**先** 在 `schema.dart` 增加字段，**再** 同步更新 `zh_cn.dart`、`en.dart`、`jp.dart`
- 语言切换由 `store/locale_store.dart` 管理；页面通过 store 获取当前语言并读取对应文案

```dart
// schema.dart — 文案表定义
abstract class I18nSchema {
  String get appTitle;
  String get navHome;
  // ...
}

// en.dart — 英文实现
class EnI18n implements I18nSchema {
  @override
  String get appTitle => 'Astra';
  @override
  String get navHome => 'Home';
}

// 使用
final strings = ref.watch(i18nProvider); // store 根据 locale 返回对应 I18nSchema 实现
Text(strings.navHome);
```

### 单向依赖规则

依赖方向 **只能从上到下**，下层 **禁止** import 上层：

```
入口（main.dart / app.dart）
    ↓
pages/
    ↓
components/
    ↓
store/
    ↓
utils/
    ↓
adapters/（android / ios / mac / windows）

pages / components 可读 → i18n/（文案层，与 store 并列消费，i18n 自身不依赖上层）
i18n/zh_cn.dart、en.dart、jp.dart → 仅依赖 i18n/schema.dart
```

| 层级          | 允许依赖                                                    | 禁止依赖                                                       |
| ------------- | ----------------------------------------------------------- | -------------------------------------------------------------- |
| 入口          | `pages`、`components`、`store`、`i18n`、`utils`、`adapters` | —                                                              |
| `pages/`      | `components`、`store`、`i18n`、`utils`、`adapters`          | 入口、其他 `pages/`                                            |
| `components/` | `store`、`i18n`、`utils`、`adapters`                        | `pages/`、入口                                                 |
| `store/`      | `utils`、`adapters`                                         | `pages/`、`components/`、`i18n/`、入口                         |
| `i18n/`       | 仅 `schema.dart`（语言文件之间互不依赖）                    | `pages/`、`components/`、`store/`、`utils/`、`adapters/`、入口 |
| `utils/`      | `adapters`                                                  | `pages/`、`components/`、`store/`、`i18n/`、入口               |
| `adapters/`   | 仅 SDK / 第三方包                                           | 上层所有目录                                                   |

### 禁止反向依赖（示例）

```dart
// ❌ store 引用 pages
import '../pages/home_page.dart';

// ❌ i18n 引用 store
import '../store/locale_store.dart';

// ❌ utils 引用 store
import '../store/theme_store.dart';

// ❌ 文案放在 JSON/YAML
// assets/i18n/en.json

// ❌ pages 互相引用
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
- 全局状态放 `store/`，不得散落在 `pages/` 或 `utils/`；文案放 `i18n/`，禁止 JSON/YAML/ARB
- 新增 i18n 文案先改 `schema.dart`，再同步三语言文件
- 新增路由必须同步更新 `pages/` 与路由配置（`utils/app_router.dart`）
- 新增可测逻辑时同步在 `test/` 镜像路径下添加 `*_test.dart`
- 发现不符合规范且可安全重命名的旧文件，重构时一并修正并更新引用
- 添加 import 前检查单向依赖，拒绝引入反向依赖
- 仅修改与任务相关的文件，保持最小 diff
