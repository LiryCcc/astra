# CI / GitHub Actions

## 工作流

| 文件                                                                 | 说明                          |
| -------------------------------------------------------------------- | ----------------------------- |
| [.github/workflows/ci.yml](../../.github/workflows/ci.yml)           | 推送 / PR 时代码检查          |
| [.github/workflows/release.yml](../../.github/workflows/release.yml) | 八端独立打包；任意成功即发布 GitHub Release |

## CI 检查（`ci.yml`）

在 `main` 分支 push 或 PR 时自动运行：

1. `pnpm generate:icons` 动态生成各平台启动图标
2. `dart format` 格式检查（120 列）
3. `dart analyze --fatal-infos` 静态分析 / Linter
4. `flutter test` 单元 / Widget 测试

本地等价命令：

```bash
pnpm check
```

CI 工作流同样调用 `pnpm check`。

## Release 构建（`release.yml`）

**先执行与 CI 相同的代码质量检查**，通过后再 **并行** 构建八个独立 job；**任意一个 job 成功** 即上传对应产物并创建 GitHub Release（仅包含本次成功的附件）。

检查步骤：format → analyze → test → 八 job 并行 build + package → release（合并已成功 job 的产物）

| Job                  | Runner           | 产物                                       |
| -------------------- | ---------------- | ------------------------------------------ |
| `android-apk`        | `ubuntu-latest`  | `astra-android-<version>.apk`              |
| `ios-ipa`            | `macos-latest`   | `astra-ios-unsigned-<version>.ipa`         |
| `macos-zip`          | `macos-latest`   | `astra-macos-<version>-portable.zip`       |
| `macos-dmg`          | `macos-latest`   | `astra-macos-<version>.dmg`                |
| `macos-standalone`   | `macos-latest`   | `astra-macos-<version>-standalone.run`     |
| `windows-zip`        | `windows-latest` | `astra-windows-<version>-portable.zip`     |
| `windows-setup`      | `windows-latest` | `astra-windows-<version>-setup.exe`        |
| `windows-standalone` | `windows-latest` | `astra-windows-<version>-standalone.exe`   |

单个 job 失败不会阻断其他 job；`release` job 在 **至少一个** 构建 job 成功时运行，并仅上传已成功 job 的 artifact。

CI / Release 脚本使用 **Node.js ESM（`.js`）**，分两类：

| 目录                                   | 职责                                 |
| -------------------------------------- | ------------------------------------ |
| [`tool/lib/`](../../tool/lib/)         | 仅导出工具函数（`export const ...`） |
| [`tool/scripts/`](../../tool/scripts/) | 可执行入口，`main()` 中编排逻辑      |

| `pnpm` 命令                               | 入口脚本                                          | 用途                          |
| ----------------------------------------- | ------------------------------------------------- | ----------------------------- |
| `pnpm check`                              | `tool/scripts/check.js`                           | 生成图标 + 格式 + analyze + test |
| `pnpm generate:icons`                     | `tool/scripts/generate_app_icons.js`              | 用 canvas 生成各平台图标         |
| `pnpm ci:rename-android-apk`              | `tool/scripts/rename_android_apk.js`              | 重命名 Android APK            |
| `pnpm ci:package-ios-ipa`                 | `tool/scripts/package_ios_ipa.js`                 | 打包未签名 iOS IPA            |
| `pnpm ci:install-windows-packaging-tools` | `tool/scripts/install_windows_packaging_tools.js` | 安装并校验 Inno Setup / 7-Zip |
| `pnpm ci:configure-static-link`           | `tool/scripts/configure_static_link.js`           | 校验静态链接配置              |
| `pnpm ci:package-macos-artifact`          | `tool/scripts/package_macos_artifact.js`          | macOS 单产物（zip / dmg / standalone） |
| `pnpm ci:package-macos-release`           | `tool/scripts/package_macos_release.js`           | macOS 三件套打包（本地）               |
| `pnpm ci:package-windows-artifact`        | `tool/scripts/package_windows_artifact.js`        | Windows 单产物（zip / setup / standalone） |
| `pnpm ci:package-windows-release`         | `tool/scripts/package_windows_release.js`         | Windows 三件套打包（本地）             |

CI 中通过环境变量 `ASTRA_PACKAGE_TARGET` 指定单产物类型（`zip` / `dmg` / `standalone` 或 `zip` / `setup` / `standalone`）；`ASTRA_WORKSPACE` 与 `ASTRA_RELEASE_TAG` 由工作流注入。

## 触发方式

### 1. 推送版本标签（推荐）

```bash
git tag v1.0.0
git push origin v1.0.0
```

### 2. 推送分支（自动生成标签）

向任意分支 push 时也会触发 Release 工作流。此时 GitHub Release 标签为 `build-<commit SHA>`（例如 `build-7663c7eb1763c8ad6957b45bc848715ee629d6bd`），因为 GitHub 不允许使用 40/64 位纯十六进制字符串作为 tag 名。产物文件名仍使用 7 位短 SHA（如 `astra-android-7663c7e.apk`）。

### 3. 手动触发

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

见上文 **八个独立 job** 表；`release` 上传 job 运行于 `ubuntu-latest`。

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
