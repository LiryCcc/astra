# 主题方案

## 依赖

`shared_preferences`（持久化）

## ThemeData 定义

```dart
// utils/app_theme.dart
class AppTheme {
  static ThemeData light = ThemeData(
    useMaterial3: true,
    colorScheme: ColorScheme.fromSeed(
      seedColor: seedColor,
      brightness: Brightness.light,
    ),
  );

  static ThemeData dark = ThemeData(
    useMaterial3: true,
    colorScheme: ColorScheme.fromSeed(
      seedColor: seedColor,
      brightness: Brightness.dark,
    ),
  );
}
```

## 状态管理

```dart
enum AppThemePreference { light, dark, system }

// store/theme_store.dart
@riverpod
class ThemeModeNotifier extends _$ThemeModeNotifier {
  @override
  Future<ThemeMode> build() async {
    final prefs = await SharedPreferences.getInstance();
    final value = prefs.getString('theme_mode') ?? 'system';
    return _toThemeMode(value);
  }

  Future<void> setTheme(AppThemePreference preference) async { ... }
}
```

## MaterialApp 绑定

```dart
MaterialApp(
  theme: AppTheme.light,
  darkTheme: AppTheme.dark,
  themeMode: ref.watch(themeModeProvider).value ?? ThemeMode.system,
)
```

## 持久化

| 键 | 值 | 说明 |
|----|-----|------|
| `theme_mode` | `light` / `dark` / `system` | 用户偏好 |

## 自动模式

- `ThemeMode.system` 由 Flutter 根据平台系统设置自动选择 light/dark
- 无需额外监听，系统切换时 Flutter 自动重建
