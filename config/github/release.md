# CI / GitHub Actions

## 工作流

| 文件 | 说明 |
|------|------|
| [.github/workflows/ci.yml](../../.github/workflows/ci.yml) | 推送 / PR 时代码检查 |
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

## Release 构建（`release.yml`）

**先执行与 CI 相同的代码质量检查**，通过后再并行构建四端产物并上传 GitHub Release。

检查步骤：format → analyze → test → build (android / ios / windows / macos) → release

## 触发方式

### 1. 推送版本标签（推荐）

```bash
git tag v1.0.0
git push origin v1.0.0
```

### 2. 手动触发

在 GitHub **Actions → Release → Run workflow** 中输入标签（如 `v1.0.0`）。

## 构建产物

| 平台 | 产物 | 说明 |
|------|------|------|
| Android | `astra-android-<version>.apk` | Release APK |
| iOS | `astra-ios-unsigned-<version>.ipa` | **未签名** IPA（`--no-codesign`） |
| Windows | `astra-windows-<version>.zip` | `Release/` 目录压缩包 |
| macOS | `astra-macos-<version>.zip` | `astra.app` 压缩包 |

`<version>` 为标签去掉 `v` 前缀，例如标签 `v1.0.0` → `1.0.0`。

## Runner 分配

| Job | Runner |
|-----|--------|
| Android | `ubuntu-latest` |
| iOS | `macos-latest` |
| Windows | `windows-latest` |
| macOS | `macos-latest` |
| Release 上传 | `ubuntu-latest` |

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
