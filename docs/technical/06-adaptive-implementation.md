# 多端适配方案

对应需求文档：[多端适配](../requirements/11-adaptive-layout.md)

## 断点常量

```dart
// core/constants/breakpoints.dart
abstract final class Breakpoints {
  static const double compact = 600;   // 手机上限
  static const double medium = 1200;   // 平板上限

  static ScreenType screenTypeOf(double width) {
    if (width < compact) return ScreenType.compact;
    if (width < medium) return ScreenType.medium;
    return ScreenType.expanded;
  }
}

enum ScreenType { compact, medium, expanded }
```

## ResponsiveBuilder

```dart
class ResponsiveBuilder extends StatelessWidget {
  const ResponsiveBuilder({
    required this.compact,
    this.medium,
    required this.expanded,
  });

  final Widget compact;
  final Widget? medium;
  final Widget expanded;

  @override
  Widget build(BuildContext context) {
    final width = MediaQuery.sizeOf(context).width;
    return switch (Breakpoints.screenTypeOf(width)) {
      ScreenType.compact  => compact,
      ScreenType.medium   => medium ?? expanded,
      ScreenType.expanded => expanded,
    };
  }
}
```

## AdaptiveScaffold

根据 `ScreenType` 切换导航组件：

```dart
class AdaptiveScaffold extends StatelessWidget {
  const AdaptiveScaffold({required this.child});

  final Widget child;

  @override
  Widget build(BuildContext context) {
    final width = MediaQuery.sizeOf(context).width;
    final screenType = Breakpoints.screenTypeOf(width);
    final location = GoRouterState.of(context).uri.path;

    return switch (screenType) {
      ScreenType.compact => Scaffold(
          body: child,
          bottomNavigationBar: _BottomNav(location: location),
        ),
      _ => Scaffold(
          body: Row(
            children: [
              _NavigationRail(location: location, extended: screenType == ScreenType.expanded),
              Expanded(child: child),
            ],
          ),
        ),
    };
  }
}
```

## 内容限宽

```dart
class ContentContainer extends StatelessWidget {
  const ContentContainer({required this.maxWidth, required this.child});

  final double maxWidth;
  final Widget child;

  @override
  Widget build(BuildContext context) {
    return Center(
      child: ConstrainedBox(
        constraints: BoxConstraints(maxWidth: maxWidth),
        child: child,
      ),
    );
  }
}
```

### 各页 maxWidth

| 页面 | maxWidth |
|------|----------|
| 首页 | 不限宽（全屏居中） |
| 设置页 | 720 |
| Todo 页 | 800 |

## 首页居中布局

```dart
Center(
  child: Column(
    mainAxisAlignment: MainAxisAlignment.center,
    children: [
      Image.asset('assets/logo.png', width: 96, height: 96),
      const SizedBox(height: 16),
      Text('Astra', style: Theme.of(context).textTheme.headlineMedium),
      const SizedBox(height: 8),
      Text('1.0.0', style: Theme.of(context).textTheme.bodyMedium),
    ],
  ),
)
```

版本号建议通过 `package_info_plus` 读取 `pubspec.yaml` 中的 `version` 字段，避免硬编码。

## 桌面 Hover 态

Todo 列表项在桌面端包裹 `MouseRegion`：

```dart
MouseRegion(
  onEnter: (_) => setState(() => _hovered = true),
  onExit: (_) => setState(() => _hovered = false),
  child: ListTile(
    tileColor: _hovered ? Theme.of(context).hoverColor : null,
    ...
  ),
)
```

## 测试断点的方式

| 平台 | 方法 |
|------|------|
| Windows/macOS | 拖动窗口边缘改变宽度 |
| Android 模拟器 | 切换手机/平板设备配置 |
| iOS 模拟器 | iPhone / iPad 设备；iPad 分屏 |
| Flutter DevTools | 调整设备尺寸预览 |

## 注意点

- 断点判断统一使用 `MediaQuery.sizeOf(context).width`，不要在多处写魔法数字
- `NavigationRail` 的 `extended` 属性在 expanded 断点下可设为 `true` 显示文字标签
- 旋转屏幕时 `MediaQuery` 自动更新，无需手动监听
