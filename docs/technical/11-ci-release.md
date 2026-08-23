# CI / GitHub Release

## 概述

推送 `v*` 标签或手动触发 [Release 工作流](../../.github/workflows/release.yml)，在四个平台并行构建并上传到 **GitHub Release**。

详细操作与产物说明见 [config/github/release.md](../../config/github/release.md)。

## 产物清单

| 平台 | 文件 |
|------|------|
| Android | `astra-android-<version>.apk` |
| iOS | `astra-ios-unsigned-<version>.ipa`（未签名） |
| Windows | `astra-windows-<version>.zip` |
| macOS | `astra-macos-<version>.zip` |

## 发布新版本

```bash
# 确保代码已提交
git tag v1.0.0
git push origin v1.0.0
```

在 Actions 完成后，于 GitHub **Releases** 页面查看附件。

## 注意事项

- iOS 产物为 **未签名 IPA**，需自行用开发者证书重签后再安装或分发
- 工作流 pinned Flutter 版本见 `release.yml` 中的 `FLUTTER_VERSION`
- 首次发布前确认仓库 Settings → Actions → General 允许 workflow 写入 contents
