# 启动步骤

Flutter SDK 安装完成后，按以下步骤开始实施。

## 1. 验证环境

```bash
flutter --version
flutter doctor -v
```

确认目标平台（Android、iOS、Windows、macOS）对应的 toolchain 均已就绪。

## 2. 创建项目

在仓库根目录执行：

```bash
flutter create --org com.astra --platforms=android,ios,windows,macos .
```

若目录非空，可在子目录创建后移动，或使用 `.` 在当前 `astra` 目录初始化。

## 3. 安装依赖

```bash
flutter pub add flutter_riverpod riverpod_annotation go_router shared_preferences hive hive_flutter package_info_plus
flutter pub add dev:build_runner dev:riverpod_generator dev:hive_generator dev:flutter_lints
flutter pub get
```

## 4. 配置国际化

1. 创建 `l10n.yaml` 与 `l10n/app_en.arb` 等文件（见 [国际化方案](../technical/04-i18n.md)）
2. 在 `pubspec.yaml` 中启用 `generate: true`
3. 运行 `flutter gen-l10n`

## 5. 代码生成

```bash
dart run build_runner build --delete-conflicting-outputs
```

## 6. 运行

```bash
# 任选一个可用平台
flutter run -d windows
flutter run -d macos
flutter run -d android
flutter run -d ios
```

## 7. 按阶段实施

从 [P0 项目骨架](01-plan.md#p0--项目骨架) 开始，逐阶段完成至 P6。

## 通知开发者

环境就绪后，请提供 `flutter doctor -v` 输出，以便确认目标平台并开始 P0 编码。
