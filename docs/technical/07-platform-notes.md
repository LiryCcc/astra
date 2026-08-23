# 平台注意事项

## Android

| 项            | 说明                                                                   |
| ------------- | ---------------------------------------------------------------------- |
| minSdkVersion | 33（Android 13.0），见 `android/app/build.gradle.kts`                  |
| Maven 镜像    | 腾讯云 + 阿里云，见 `config/android/` 与 `android/settings.gradle.kts` |
| Gradle 下载   | 腾讯云镜像，见 `android/gradle/wrapper/gradle-wrapper.properties`      |
| 主题          | `styles.xml` 使用 Material 主题                                        |
| 平板          | `sw600dp` 资源可选；逻辑上由断点处理                                   |
| 全面屏        | 使用 `SafeArea`，必要时 `SystemChrome.setEnabledSystemUIMode`          |
| 启动图标      | `pnpm generate:icons`（`@napi-rs/canvas` 动态生成，CI 自动运行）       |

## Web

| 项       | 说明                                                                     |
| -------- | ------------------------------------------------------------------------ |
| 启动图标 | `web/favicon.png`、`web/icons/Icon-*.png`，由 `pnpm generate:icons` 生成 |
| PWA      | `web/manifest.json` 主题色与图标背景对齐（`#080B14`）                    |
| 调试     | `flutter run -d chrome` 或 Cursor **Run and Debug → astra (chrome)**     |

## iOS

| 项         | 说明                                                                       |
| ---------- | -------------------------------------------------------------------------- |
| 最低版本   | iOS 18+（`IPHONEOS_DEPLOYMENT_TARGET = 18.0`）                             |
| 依赖管理   | **SPM**（Swift Package Manager），不使用 CocoaPods，见 `config/ios/spm.md` |
| iPad       | 支持所有方向；分屏时按实际宽度走断点                                       |
| SafeArea   | 刘海、底部 Home Indicator                                                  |
| Info.plist | 无需额外权限（首版无相机/定位等）                                          |

## Windows

| 项           | 说明                                                         |
| ------------ | ------------------------------------------------------------ |
| 默认窗口大小 | 建议 1280×720                                                |
| 最小窗口     | 建议 400×600，低于 600 宽走 compact 断点                     |
| 高 DPI       | Flutter 自动处理 Per-Monitor DPI                             |
| 标题栏       | 使用默认 Flutter 窗口装饰                                    |
| C 运行时     | **UCRT** 静态 `/MT`，见 `windows/cmake/static_runtime.cmake` |

## macOS

| 项       | 说明                                        |
| -------- | ------------------------------------------- |
| 最低版本 | 12.0+（`MACOSX_DEPLOYMENT_TARGET = 12.0`）  |
| 窗口缩放 | 支持自由缩放，断点实时响应                  |
| 沙盒     | 上架 Mac App Store 时需配置；开发阶段可忽略 |
| 菜单栏   | 首版使用系统默认，不自定义菜单              |
| C++ 链接 | Release 含 `StaticLink.xcconfig`（`-lc++`） |

## 通用

- 各平台通过 `flutter create --platforms=android,ios,windows,macos,web` 生成
- 移动端最低版本：**Android 13.0（API 33）**、**iOS 18**
- 桌面端最低版本：**Windows 10**、**macOS 12.0**
- 原生工具链与 C 运行时详见 [平台工具链与 C 运行时](12-platform-toolchains.md)
- 平台专属代码首版尽量少用，必要时通过 `adapters/` 抽象，不在页面中直接写 `Platform.isX`
