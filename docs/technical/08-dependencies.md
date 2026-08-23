# 依赖清单

## pubspec.yaml

```yaml
name: astra
description: Cross-platform todo app with Material Design 3.
publish_to: 'none'
version: 1.0.0+1

environment:
  sdk: ^3.5.0

dependencies:
  flutter:
    sdk: flutter
  flutter_localizations:
    sdk: flutter
  flutter_riverpod: ^2.6.1
  riverpod_annotation: ^2.6.1
  go_router: ^14.6.2
  shared_preferences: ^2.3.3
  hive: ^2.2.3
  hive_flutter: ^1.1.0
  intl: any
  package_info_plus: ^8.1.2

dev_dependencies:
  flutter_test:
    sdk: flutter
  flutter_lints: ^5.0.0
  build_runner: ^2.4.13
  riverpod_generator: ^2.6.3
  hive_generator: ^2.0.1
```

## 依赖说明

| 包 | 用途 |
|----|------|
| flutter_riverpod | 状态管理 |
| riverpod_annotation + riverpod_generator | Provider 代码生成 |
| go_router | 声明式路由 |
| shared_preferences | 主题、语言偏好持久化 |
| hive + hive_flutter | Todo 本地存储 |
| hive_generator | Todo 模型 Adapter 生成 |
| package_info_plus | 首页读取应用版本号 |
| intl | 国际化格式化 |
| flutter_lints | 静态分析规则 |

## 初始化命令

```bash
flutter create --org com.astra --platforms=android,ios,windows,macos .
flutter pub add flutter_riverpod riverpod_annotation go_router shared_preferences hive hive_flutter package_info_plus
flutter pub add dev:build_runner dev:riverpod_generator dev:hive_generator dev:flutter_lints
flutter pub get
dart run build_runner build
```
