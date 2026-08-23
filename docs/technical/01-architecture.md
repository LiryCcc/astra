# 架构与目录

## 技术栈

| 类别 | 选型 | 理由 |
|------|------|------|
| 框架 | Flutter 3.x（stable） | 官方跨平台方案 |
| 语言 | Dart 3.x | 空安全、现代语法 |
| 状态管理 | Riverpod | 轻量、可测试、与 `MaterialApp` 配合好 |
| 路由 | go_router | 声明式路由、ShellRoute 支持好 |
| 本地存储 | shared_preferences + Hive | 设置简单、Todo 结构化 |
| 国际化 | flutter_localizations + intl + ARB | 官方 i18n 流程 |
| 响应式 | LayoutBuilder + 自定义断点 | 无额外依赖、可控 |

## 项目结构

```
astra/
├── lib/
│   ├── main.dart                      # 入口、ProviderScope
│   ├── app.dart                       # MaterialApp、主题与 locale 绑定
│   ├── core/
│   │   ├── constants/
│   │   │   └── breakpoints.dart       # 断点常量
│   │   ├── theme/
│   │   │   ├── app_theme.dart         # light/dark ThemeData
│   │   │   └── theme_provider.dart    # ThemeMode 状态与持久化
│   │   ├── l10n/
│   │   │   └── locale_provider.dart   # Locale 状态与持久化
│   │   └── router/
│   │       └── app_router.dart        # go_router 配置
│   ├── features/
│   │   ├── home/
│   │   │   ├── home_page.dart
│   │   │   └── widgets/
│   │   ├── settings/
│   │   │   ├── settings_page.dart
│   │   │   └── widgets/
│   │   └── todos/
│   │       ├── todo_page.dart
│   │       ├── models/todo.dart
│   │       ├── repositories/todo_repository.dart
│   │       ├── providers/todo_provider.dart
│   │       └── widgets/
│   └── shared/
│       └── widgets/
│           ├── adaptive_scaffold.dart # 自适应导航外壳
│           └── responsive_builder.dart
├── l10n/
│   ├── app_en.arb                     # 英文模板
│   ├── app_zh.arb
│   └── app_ja.arb
├── android/
├── ios/
├── windows/
├── macos/
├── pubspec.yaml
├── l10n.yaml
└── analysis_options.yaml
```

## 分层原则

| 层 | 职责 |
|----|------|
| `features/` | 按功能模块组织 UI 与模块内状态 |
| `core/` | 主题、路由、国际化、常量等全局能力 |
| `shared/` | 跨模块复用组件（如 AdaptiveScaffold） |

## 入口流程

```
main()
  → WidgetsFlutterBinding.ensureInitialized()
  → Hive.initFlutter() / SharedPreferences
  → runApp(ProviderScope(child: AstraApp()))
       → AstraApp 监听 themeProvider、localeProvider
       → MaterialApp.router(routerConfig: appRouter)
```
