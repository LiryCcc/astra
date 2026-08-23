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
flutter create --org org.liry --platforms=android,ios,windows,macos .
```

若目录非空，可在子目录创建后移动，或使用 `.` 在当前 `astra` 目录初始化。

## 2.1 配置移动端最低版本

创建项目后，将 Android / iOS 最低版本设为 **Android 13.0（API 33）** 与 **iOS 18**：

**Android** — `android/app/build.gradle.kts`（或 `build.gradle`）：

```kotlin
defaultConfig {
    minSdk = 33
}
```

**iOS** — 启用 SPM 并在 `ios/Runner.xcodeproj` 中将 **iOS Deployment Target** 设为 `18.0`：

```bash
flutter config --enable-swift-package-manager
```

**macOS** — 在 `macos/Runner.xcodeproj` 中将 **macOS Deployment Target** 设为 `12.0`。

构建镜像与 SPM 配置见仓库 [`config/README.md`](../../config/README.md)：

- Android：Maven 国内镜像 + Gradle 腾讯云下载（`config/android/`）
- iOS：SPM 集成，执行 `flutter config --enable-swift-package-manager`

## 3. 安装依赖

国内网络建议使用镜像脚本（见 [Flutter 镜像配置](../../config/flutter/mirrors.md)）：

```powershell
# Windows
.\tool\flutter_china.ps1 pub get
```

```bash
# macOS / Linux
./tool/flutter_china.sh pub get
```

或手动设置环境变量后执行 `flutter pub get`：

```bash
# TUNA 镜像
export PUB_HOSTED_URL=https://mirrors.tuna.tsinghua.edu.cn/dart-pub
export FLUTTER_STORAGE_BASE_URL=https://mirrors.tuna.tsinghua.edu.cn/flutter
flutter pub get
```

添加项目依赖（若尚未添加）：

```bash
flutter pub add flutter_riverpod go_router shared_preferences package_info_plus
flutter pub get
```

## 4. 配置国际化

1. 创建 `lib/i18n/schema.dart` 及 `zh_cn.dart`、`en.dart`、`jp.dart`（见 [国际化方案](../technical/04-i18n.md)）
2. 在 `store/` 中实现 `locale_store.dart` 与 `i18n_provider.dart`

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

### Web 调试

项目初始化时未包含 Web 平台，首次需生成 `web/` 目录：

```bash
flutter create . --platforms=web
flutter pub get
```

启动调试（热重载 + DevTools）：

```bash
# Chrome（推荐）
flutter run -d chrome

# Edge
flutter run -d edge

# 仅启动本地服务，不自动打开浏览器（默认 http://localhost:8080）
flutter run -d web-server --web-port=8080
```

国内镜像（Windows）：

```powershell
.\tool\flutter_china.ps1 create . --platforms=web
.\tool\flutter_china.ps1 run -d chrome
```

在 Cursor / VS Code 中也可使用 **Run and Debug** 面板，选择 `astra (chrome)` 后按 F5（配置见 `.vscode/launch.json`）。

## 7. 按阶段实施

从 [P0 项目骨架](01-plan.md#p0--项目骨架) 开始，逐阶段完成至 P6。

## 通知开发者

环境就绪后，请提供 `flutter doctor -v` 输出，以便确认目标平台并开始 P0 编码。
