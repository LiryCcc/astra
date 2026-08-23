# CI / GitHub Release

## 概述

| 工作流                                         | 触发               | 作用                           |
| ---------------------------------------------- | ------------------ | ------------------------------ |
| [CI](../../.github/workflows/ci.yml)           | push / PR → `main` | 格式、Linter、测试             |
| [Release](../../.github/workflows/release.yml) | push / 手动        | 先检查，再八 job 并行打包；任意成功即发布 |

详细说明见 [config/github/release.md](../../config/github/release.md)。

## 产物清单

| 平台    | 文件                                               |
| ------- | -------------------------------------------------- |
| Android | `astra-android-<version>.apk`                      |
| iOS     | `astra-ios-unsigned-<version>.ipa`（未签名）       |
| Windows | `astra-windows-<version>-portable.zip`（便携）     |
| Windows | `astra-windows-<version>-setup.exe`（安装包）      |
| Windows | `astra-windows-<version>-standalone.exe`（单文件） |
| macOS   | `astra-macos-<version>-portable.zip`（便携）       |
| macOS   | `astra-macos-<version>.dmg`（安装包）              |
| macOS   | `astra-macos-<version>-standalone.run`（单文件）   |

## 发布新版本

```bash
# 确保代码已提交
git tag v1.0.0
git push origin v1.0.0
```

在 Actions 完成后，于 GitHub **Releases** 页面查看附件。

## 注意事项

- Release 分为 **8 个独立 job**（Android / iOS / macOS×3 / Windows×3），互不影响；至少一个成功即创建 Release 并附上对应产物
- iOS 产物为 **未签名 IPA**，需自行用开发者证书重签后再安装或分发
- 工作流 pinned Flutter 版本见 `release.yml` 中的 `FLUTTER_VERSION`
- 首次发布前确认仓库 Settings → Actions → General 允许 workflow 写入 contents
