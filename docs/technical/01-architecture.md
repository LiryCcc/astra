# 架构与目录

## 技术栈

| 类别     | 选型                       | 理由                                  |
| -------- | -------------------------- | ------------------------------------- |
| 框架     | Flutter 3.x（stable）      | 官方跨平台方案                        |
| 语言     | Dart 3.x                   | 空安全、现代语法                      |
| 状态管理 | Riverpod                   | 轻量、可测试、与 `MaterialApp` 配合好 |
| 路由     | go_router                  | 声明式路由、ShellRoute 支持好         |
| 本地存储 | shared_preferences + Hive  | 设置简单、Todo 结构化                 |
| 国际化   | `lib/i18n/` 纯 Dart 文案   | 类型安全、无代码生成                  |
| 响应式   | LayoutBuilder + 自定义断点 | 无额外依赖、可控                      |

## 项目结构

```
astra/
├── lib/
│   ├── main.dart
│   ├── app.dart
│   ├── pages/
│   │   ├── home_page.dart
│   │   ├── settings_page.dart
│   │   └── todos_page.dart
│   ├── components/
│   │   └── adaptive_scaffold.dart
│   ├── store/
│   │   ├── theme_store.dart
│   │   ├── locale_store.dart
│   │   ├── todo_store.dart
│   │   └── i18n_provider.dart
│   ├── i18n/
│   │   ├── schema.dart
│   │   ├── zh_cn.dart
│   │   ├── en.dart
│   │   └── jp.dart
│   ├── utils/
│   │   ├── app_router.dart
│   │   ├── app_theme.dart
│   │   └── breakpoints.dart
│   └── adapters/
│       ├── android/
│       ├── ios/
│       ├── mac/
│       └── windows/
├── android/
├── ios/
├── windows/
├── macos/
├── pubspec.yaml
└── analysis_options.yaml
```

完整归档与依赖规则见根目录 `AGENTS.md`。

## 分层原则

| 层            | 职责                            |
| ------------- | ------------------------------- |
| `pages/`      | 路由页面 UI                     |
| `components/` | 跨页面公共组件                  |
| `store/`      | 全局状态（主题、语言、Todo 等） |
| `i18n/`       | 文案表与各语言实现              |
| `utils/`      | 路由、主题数据、常量            |
| `adapters/`   | 平台特定实现                    |

## 入口流程

```
main()
  → WidgetsFlutterBinding.ensureInitialized()
  → Hive.initFlutter() / SharedPreferences
  → runApp(ProviderScope(child: AstraApp()))
       → AstraApp 监听 themeStore、localeStore
       → MaterialApp.router(routerConfig: appRouter)
```
