# 平台注意事项

## Android

| 项 | 说明 |
|----|------|
| minSdkVersion | 21 |
| 主题 | `styles.xml` 使用 Material 主题 |
| 平板 | `sw600dp` 资源可选；逻辑上由断点处理 |
| 全面屏 | 使用 `SafeArea`，必要时 `SystemChrome.setEnabledSystemUIMode` |
| 启动图标 | `flutter_launcher_icons`（可选，非首版必须） |

## iOS

| 项 | 说明 |
|----|------|
| 最低版本 | iOS 12+（`ios/Podfile` platform） |
| iPad | 支持所有方向；分屏时按实际宽度走断点 |
| SafeArea | 刘海、底部 Home Indicator |
| Info.plist | 无需额外权限（首版无相机/定位等） |

## Windows

| 项 | 说明 |
|----|------|
| 默认窗口大小 | 建议 1280×720 |
| 最小窗口 | 建议 400×600，低于 600 宽走 compact 断点 |
| 高 DPI | Flutter 自动处理 Per-Monitor DPI |
| 标题栏 | 使用默认 Flutter 窗口装饰 |

## macOS

| 项 | 说明 |
|----|------|
| 最低版本 | 10.14+ |
| 窗口缩放 | 支持自由缩放，断点实时响应 |
| 沙盒 | 上架 Mac App Store 时需配置；开发阶段可忽略 |
| 菜单栏 | 首版使用系统默认，不自定义菜单 |

## 通用

- 四端均通过 `flutter create --platforms=android,ios,windows,macos` 生成
- 平台专属代码首版尽量少用，必要时通过 `Platform.isX` 或 `defaultTargetPlatform` 判断
