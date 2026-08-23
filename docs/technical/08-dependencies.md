# 依赖清单

## pubspec.yaml

```yaml
name: astra
description: Cross-platform todo app with Material Design 3.
publish_to: "none"
version: 1.0.0+1

environment:
  sdk: ^3.13.0

dependencies:
  flutter:
    sdk: flutter
  flutter_riverpod: ^3.4.2
  go_router: ^17.5.0
  package_info_plus: ^10.2.1
  shared_preferences: ^2.5.5

dev_dependencies:
  flutter_test:
    sdk: flutter
  flutter_lints: ^6.0.0
```

> 版本策略：直接依赖使用 pub.dev **最新稳定版**（`^` 约束）。升级后运行 `flutter pub upgrade --major-versions` 并提交 `pubspec.lock`。

## 依赖说明

| 包 | 用途 |
|----|------|
| flutter_riverpod | 状态管理 |
| go_router | 声明式路由 |
| shared_preferences | 主题、语言偏好持久化 |
| package_info_plus | 首页读取应用版本号 |
| flutter_lints | 静态分析规则 |

## 升级命令

```bash
# 国内镜像
.\tool\flutter_china.ps1 pub upgrade --major-versions

# 查看可更新项
.\tool\flutter_china.ps1 pub outdated
```

## 初始化命令

```bash
flutter create --org com.astra --platforms=android,ios,windows,macos .
.\tool\flutter_china.ps1 pub add flutter_riverpod go_router shared_preferences package_info_plus
.\tool\flutter_china.ps1 pub add dev:flutter_lints
.\tool\flutter_china.ps1 pub get
```

代码格式化与 Lint 见 [代码质量工具](09-code-quality.md)。
