# CI / GitHub Actions

## 工作流

| 文件                                                                 | 说明                          |
| -------------------------------------------------------------------- | ----------------------------- |
| [.github/workflows/ci.yml](../../.github/workflows/ci.yml)           | 推送 / PR 时代码检查          |
| [.github/workflows/release.yml](../../.github/workflows/release.yml) | 四端打包并发布 GitHub Release |

## CI 检查（`ci.yml`）

在 `main` 分支 push 或 PR 时自动运行：

1. `dart format` 格式检查（120 列）
2. `dart analyze --fatal-infos` 静态分析 / Linter
3. `flutter test` 单元 / Widget 测试

本地等价命令：

```powershell
.\tool\check.ps1
```

CI 工作流调用 `bash tool/check.sh`。

## Release 构建（`release.yml`）

**先执行与 CI 相同的代码质量检查**，通过后再并行构建四端产物并上传 GitHub Release。

检查步骤：format → analyze → test → build (android / ios / windows / macos) → release

CI / Release 中的长脚本统一放在 [`tool/ci/`](../../tool/ci/)，工作流仅调用脚本入口：

| 脚本                                          | 用途                                                          |
| --------------------------------------------- | ------------------------------------------------------------- |
| `tool/ci/resolve_release_version.sh` / `.ps1` | 将 tag 或 commit SHA 解析为产物版本号                         |
| `tool/ci/rename_android_apk.sh`               | 重命名 Android APK                                            |
| `tool/ci/package_ios_ipa.sh`                  | 打包未签名 iOS IPA                                            |
| `tool/ci/install_windows_packaging_tools.ps1` | 安装并校验 Inno Setup / 7-Zip                                 |
| `tool/ci/package_windows_release.ps1`         | Windows 三件套打包（调用 `tool/package_windows_release.ps1`） |
| `tool/ci/package_macos_release.sh`            | macOS 三件套打包（调用 `tool/package_macos_release.sh`）      |

## 触发方式

### 1. 推送版本标签（推荐）

```bash
git tag v1.0.0
git push origin v1.0.0
```

### 2. 手动触发

在 GitHub **Actions → Release → Run workflow** 中输入标签（如 `v1.0.0`）。

## 构建产物

| 平台    | 产物                                     | 说明                                 |
| ------- | ---------------------------------------- | ------------------------------------ |
| Android | `astra-android-<version>.apk`            | Release APK                          |
| iOS     | `astra-ios-unsigned-<version>.ipa`       | **未签名** IPA（`--no-codesign`）    |
| Windows | `astra-windows-<version>-portable.zip`   | 便携版（解压即用）                   |
| Windows | `astra-windows-<version>-setup.exe`      | Inno Setup 安装包                    |
| Windows | `astra-windows-<version>-standalone.exe` | 单文件自解压（含静态 UCRT `/MT`）    |
| macOS   | `astra-macos-<version>-portable.zip`     | 便携版（`.app` 压缩包）              |
| macOS   | `astra-macos-<version>.dmg`              | DMG 安装镜像                         |
| macOS   | `astra-macos-<version>-standalone.run`   | 单文件自解压（解压到临时目录后启动） |

`<version>` 为标签去掉 `v` 前缀，例如标签 `v1.0.0` → `1.0.0`。

## Windows / macOS 单文件说明

Flutter 引擎（`flutter_windows.dll` / `Frameworks/`）无法静态链接进单个可执行文件。Release 构建前会执行静态链接配置：

- **Windows**：`Configure static linking` 启用 `/MT` 静态 UCRT（`windows/cmake/static_runtime.cmake`）
- **macOS**：`Configure static linking` 启用 `StaticLink.xcconfig`（`-lc++`、LTO、dead code stripping）

因此：

- **Windows `standalone.exe`**：7-Zip 自解压单文件；无需 `ucrtbase.dll`、`vcruntime140*.dll`，但引擎 DLL 与 `data/` 仍在包内。
- **macOS `standalone.run`**：自解压 shell 脚本 + tar.gz，运行后解压到临时目录并启动 `.app`。

便携 zip 与安装包为完整、推荐的分发方式。

## Runner 分配

| Job          | Runner           |
| ------------ | ---------------- |
| Android      | `ubuntu-latest`  |
| iOS          | `macos-latest`   |
| Windows      | `windows-latest` |
| macOS        | `macos-latest`   |
| Release 上传 | `ubuntu-latest`  |

## iOS 未签名 IPA

CI 执行：

```bash
flutter build ios --release --no-codesign
# 手动打包 Payload/Runner.app → .ipa
```

产物 **未经 Apple 签名**，不可直接上架 App Store，需自行签名后再分发。

## 环境

- Flutter 版本见工作流 `FLUTTER_VERSION`（与本地开发保持一致）
- iOS 启用 SPM：`flutter config --enable-swift-package-manager`
- Android 使用仓库内 Maven / Gradle 镜像配置

## 权限

Release job 需要 `contents: write`（默认 `GITHUB_TOKEN` 即可创建 Release 并上传附件）。
