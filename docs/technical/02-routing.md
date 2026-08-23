# 路由方案

## 依赖

`go_router`

## 路由表

```dart
/           → HomePage
/settings   → SettingsPage
/todos      → TodoPage
```

## 结构设计

使用 `ShellRoute` 包裹三个子路由，共享 `AdaptiveScaffold`（导航栏 + 内容区）：

```dart
final appRouter = GoRouter(
  initialLocation: '/',
  routes: [
    ShellRoute(
      builder: (context, state, child) => AdaptiveScaffold(child: child),
      routes: [
        GoRoute(path: '/', builder: (_, __) => const HomePage()),
        GoRoute(path: '/todos', builder: (_, __) => const TodoPage()),
        GoRoute(path: '/settings', builder: (_, __) => const SettingsPage()),
      ],
    ),
  ],
);
```

## 导航与路由同步

- `AdaptiveScaffold` 根据 `GoRouterState.uri.path` 高亮当前 Tab
- 点击导航项调用 `context.go('/path')`
- 三个路由平级，不使用嵌套子路由

## 与 Riverpod 集成

- `GoRouter` 可作为 `Provider` 注入，便于测试
- 首版不需要 `refreshListenable` 监听认证等状态

## 首版不包含

- Deep Link / Universal Link 配置
- 路由守卫（Guard）
- 命名路由参数
