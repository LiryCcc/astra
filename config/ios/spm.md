# iOS — Swift Package Manager (SPM)

## 策略

本项目的 iOS 依赖管理 **仅使用 SPM**，不使用 CocoaPods。

Flutter 3.24+ 在启用 SPM 后：

- 不生成 / 不使用 `Podfile`、`Pods/`
- 插件通过 `ios/Flutter/ephemeral/Packages/FlutterGeneratedPluginSwiftPackage` 以本地 Swift Package 形式接入
- Xcode 工程中可见 `XCLocalSwiftPackageReference` → `FlutterGeneratedPluginSwiftPackage`

## 本地环境

确保全局启用 SPM（一次性）：

```bash
flutter config --enable-swift-package-manager
```

验证：

```bash
flutter config
# 应包含 enable-swift-package-manager: true
```

## 最低系统版本

- **iOS 18.0+**
- 配置位置：`ios/Runner.xcodeproj/project.pbxproj` → `IPHONEOS_DEPLOYMENT_TARGET = 18.0`

## 新增原生依赖

- 优先通过支持 SPM 的 Flutter 插件
- 若需手写 Swift 原生代码，在 Xcode 中为 Runner 添加 Swift Package 依赖，**不要** 引入 `Podfile`

## 常见问题

| 现象           | 处理                                                                                           |
| -------------- | ---------------------------------------------------------------------------------------------- |
| 仍生成 Podfile | 运行 `flutter config --enable-swift-package-manager` 后删除 `ios/Podfile` 并 `flutter pub get` |
| 插件不支持 SPM | 查阅插件文档，或评估替代插件；避免回退到 CocoaPods                                             |
