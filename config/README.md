# 构建与环境配置

本目录保存 Flutter 四端构建的**仓库级配置说明与模板**。`flutter create` 后，`android/`、`ios/` 中的实际文件应与本目录约定保持一致。

## Android

| 文件                                                                                  | 说明                          |
| ------------------------------------------------------------------------------------- | ----------------------------- |
| [android/settings.gradle.kts](android/settings.gradle.kts)                            | Maven 国内镜像（插件解析）    |
| [android/build.gradle.kts](android/build.gradle.kts)                                  | Maven 国内镜像（依赖解析）    |
| [android/gradle/wrapper/gradle-wrapper.properties](android/gradle-wrapper.properties) | Gradle 发行包从腾讯云下载     |
| [android/gradle.properties](android/gradle.properties)                                | Gradle 构建参数               |
| [android/app/build.gradle.kts](android/app/build.gradle.kts)                          | `minSdk = 33`（Android 13.0） |

### Maven 镜像源

优先使用以下国内镜像，不可用时回退官方源：

- 腾讯云：`https://mirrors.cloud.tencent.com/nexus/repository/maven-public/`
- 阿里云 Google：`https://maven.aliyun.com/repository/google`
- 阿里云 Public：`https://maven.aliyun.com/repository/public`
- 阿里云 Gradle Plugin：`https://maven.aliyun.com/repository/gradle-plugin`

### Gradle 发行包

`gradle-wrapper.properties` 中 `distributionUrl` 使用腾讯云：

```properties
distributionUrl=https\://mirrors.cloud.tencent.com/gradle/gradle-<version>-all.zip
```

版本号须与 Flutter 模板生成的 Gradle 版本一致（当前见 `android/gradle/wrapper/gradle-wrapper.properties`）。

## iOS

| 项       | 配置                                                     |
| -------- | -------------------------------------------------------- |
| 依赖管理 | **Swift Package Manager（SPM）**，不使用 CocoaPods       |
| 最低版本 | iOS 18.0（`IPHONEOS_DEPLOYMENT_TARGET`）                 |
| 插件集成 | `FlutterGeneratedPluginSwiftPackage`（Flutter 自动生成） |

### SPM 说明

Flutter 3.24+ 默认通过 SPM 集成插件，本仓库 **不包含 `Podfile`**。若本地 Flutter 仍生成 Podfile，请执行：

```bash
flutter config --enable-swift-package-manager
flutter pub get
```

详见 [ios/spm.md](ios/spm.md)。

## Windows

| 项       | 配置                                                        |
| -------- | ----------------------------------------------------------- |
| C 运行时 | **UCRT** 静态 `/MT`（`windows/cmake/static_runtime.cmake`） |
| 验证脚本 | `tool/configure_static_link.ps1`（Release CI 构建前执行）   |

## macOS

| 项       | 配置                                                       |
| -------- | ---------------------------------------------------------- |
| 最低版本 | macOS 12.0（`MACOSX_DEPLOYMENT_TARGET`）                   |
| Release  | `macos/Runner/Configs/StaticLink.xcconfig`（`-lc++`、LTO） |
| 验证脚本 | `tool/configure_static_link.sh`（Release CI 构建前执行）   |

## Flutter / Dart 依赖镜像

| 文件                                                   | 说明                               |
| ------------------------------------------------------ | ---------------------------------- |
| [flutter/mirrors.md](flutter/mirrors.md)               | Pub / Flutter Storage 国内镜像说明 |
| [flutter/mirror.env](flutter/mirror.env)               | 环境变量模板                       |
| [../tool/flutter_china.ps1](../tool/flutter_china.ps1) | Windows 镜像包装脚本               |
| [../tool/flutter_china.sh](../tool/flutter_china.sh)   | macOS / Linux 镜像包装脚本         |

国内开发安装依赖：

```powershell
.\tool\flutter_china.ps1 pub get
```

`.vscode/settings.json` 已配置 `dart.env` 与终端环境变量，IDE 内 `pub get` 同样走镜像。

## 应用配置

[flutter/project_config.yaml](flutter/project_config.yaml) 汇总移动端最低版本与镜像策略，供 CI / 脚本读取。

## GitHub Actions

四端 Release 构建与上传见 [github/release.md](github/release.md)。
