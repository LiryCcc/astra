# 平台原生工具链与 C 运行时

本文档汇总 Astra 四端（Android、iOS、Windows、macOS）涉及的原生编译工具链，以及各平台 **C 运行时**（libc / CRT）的选用与链接方式。

> 业务逻辑主语言为 **Dart**（AOT 经 `gen_snapshot`，不走下文 C/Swift 工具链）。下文 C/C++/Swift 主要用于 Runner 壳层、Flutter 引擎与插件 native 代码。

## 全平台共用

| 类别                 | 工具                                    | 版本 / 说明                           |
| -------------------- | --------------------------------------- | ------------------------------------- |
| 应用框架             | Flutter                                 | CI 固定 `3.47.1`（stable）            |
| 语言                 | Dart                                    | `^3.13.0`（`pubspec.yaml`）           |
| 包管理               | pub                                     | `flutter pub get`                     |
| 格式化 / 分析 / 测试 | dart format、dart analyze、flutter test | 见 [代码质量工具](09-code-quality.md) |
| CI                   | GitHub Actions                          | `ci.yml`、`release.yml`               |

**非目标平台（首版）**：Web、Linux、watchOS、tvOS

---

## 各平台工具链

### Android

| 类别         | 工具                          | 版本 / 说明                         |
| ------------ | ----------------------------- | ----------------------------------- |
| 构建系统     | Gradle                        | `9.3.1`（腾讯云镜像）               |
| Android 插件 | AGP                           | `9.1.0`                             |
| 语言         | Kotlin                        | `2.4.0`                             |
| JVM          | Java                          | 17                                  |
| Flutter 集成 | Flutter Gradle Plugin         | `dev.flutter.flutter-gradle-plugin` |
| 原生工具链   | Android NDK + Clang/LLVM      | `ndkVersion = flutter.ndkVersion`   |
| 最低版本     | minSdk                        | 33（Android 13.0）                  |
| 构建命令     | `flutter build apk --release` |                                     |

### iOS

| 类别       | 工具                                        | 版本 / 说明                              |
| ---------- | ------------------------------------------- | ---------------------------------------- |
| IDE / 编译 | Xcode                                       | `flutter build ios`                      |
| 语言       | Swift                                       | 5.0                                      |
| 依赖管理   | SPM                                         | 不使用 CocoaPods，见 `config/ios/spm.md` |
| C/C++ 编译 | Clang / LLVM                                | `gnu++0x`，`libc++`                      |
| 最低版本   | iOS                                         | 18.0                                     |
| 构建命令   | `flutter build ios --release --no-codesign` | CI 产出未签名 IPA                        |

### Windows

| 类别     | 工具                              | 版本 / 说明                           |
| -------- | --------------------------------- | ------------------------------------- |
| 构建系统 | CMake                             | `>= 3.14`                             |
| 编译器   | MSVC `cl.exe`                     | C++17（`cxx_std_17`）                 |
| 构建后端 | MSBuild                           | 经 Visual Studio                      |
| 打包     | Inno Setup 6、7-Zip               | 见 `tool/package_windows_release.ps1` |
| 构建命令 | `flutter build windows --release` |                                       |

### macOS

| 类别       | 工具              | 版本 / 说明                        |
| ---------- | ----------------- | ---------------------------------- |
| IDE / 编译 | Xcode             | `flutter build macos`              |
| 语言       | Swift             | 5.0                                |
| C/C++ 编译 | Clang / LLVM      | `gnu++14`，`libc++`                |
| 最低版本   | macOS             | 12.0（`MACOSX_DEPLOYMENT_TARGET`） |
| 打包       | zip、hdiutil、tar | 见 `tool/package_macos_release.sh` |

---

## 编译器前后端

### C / C++

| 平台    | 前端          | 后端                 | 链接器     |
| ------- | ------------- | -------------------- | ---------- |
| Android | Clang         | LLVM CodeGen         | lld（NDK） |
| iOS     | Clang         | LLVM CodeGen         | ld64       |
| Windows | MSVC `cl.exe` | MSVC `c2`（非 LLVM） | `link.exe` |
| macOS   | Clang         | LLVM CodeGen         | ld64       |

**流水线示意：**

```
Android:  Clang → LLVM IR → LLVM CodeGen → lld → .so
iOS:      Clang → LLVM IR → LLVM CodeGen → ld64 → .o / .dylib
Windows:  cl.exe → c1/c1xx → c2 (MSVC) → link.exe → .exe / .lib
macOS:    Clang → LLVM IR → LLVM CodeGen → ld64
```

### Swift（仅 iOS / macOS）

| 环节 | 工具                             |
| ---- | -------------------------------- |
| 前端 | swiftc（词法 / 语法 / 类型检查） |
| 中端 | SIL 优化                         |
| 后端 | LLVM（SIL → LLVM IR → 机器码）   |
| 链接 | ld64                             |

Release 配置：`SWIFT_COMPILATION_MODE = wholemodule`，`SWIFT_OPTIMIZATION_LEVEL = -O`。

### C#

本仓库 **不使用 C#**。无 `.cs` 文件，无 Roslyn / .NET 工具链。

---

## 各平台 C 运行时

「C 运行时」指提供 `malloc`、`printf`、进程启动 / 退出等能力的底层库。下表区分 **C 标准库（libc）** 与 **C++ 标准库（STL 实现）**。

| 平台    | C 标准库（libc）                | C++ 标准库    | 链接方式                                          | 项目配置                                   |
| ------- | ------------------------------- | ------------- | ------------------------------------------------- | ------------------------------------------ |
| Android | **Bionic libc**                 | libc++（NDK） | 动态链接系统 `libc.so`                            | NDK 默认                                   |
| iOS     | **Apple libc**（libSystem）     | libc++        | 动态链接系统库                                    | Xcode SDK                                  |
| Windows | **UCRT**（Universal C Runtime） | MSVC STL      | Runner **静态 `/MT`**（`libucrt.lib` 等编入 exe） | `windows/cmake/static_runtime.cmake`       |
| macOS   | **Apple libc**（libSystem）     | libc++        | 动态链接系统库                                    | `macos/Runner/Configs/StaticLink.xcconfig` |

### Android — Bionic libc

- Android 专用 C 库，**非 glibc**。
- 由系统提供，native `.so` 在运行时动态链接 `libc.so`。
- 无类似 Windows 的独立 CRT 安装包；C/C++ 代码主要来自 Flutter 引擎与带 native 的插件。

### iOS — Apple libc（libSystem）

- C 库经 **libSystem** 提供，随 iOS SDK / 系统分发，不打包进 IPA。
- C++ 使用 **libc++**（`CLANG_CXX_LIBRARY = "libc++"`）。
- Objective-C 经 Clang 前端编译，与 C/C++ 共用 LLVM 后端。

### Windows — UCRT（静态链接）

Windows 上的 C 标准库实现为 **UCRT**（Universal C Runtime）。本项目 Release 构建对 Runner 启用 **静态 `/MT`**，将 UCRT 与 MSVC 运行库静态编入可执行文件：

| 组件          | 说明                                                          |
| ------------- | ------------------------------------------------------------- |
| **UCRT**      | C 标准库（`malloc`、`printf` 等）；静态链接时为 `libucrt.lib` |
| **VCRuntime** | 编译器运行库（异常处理等）；静态链接时为 `libvcruntime.lib`   |
| **MSVC STL**  | C++ 标准库；随 `/MT` 一并静态链接                             |

配置文件：

- `windows/cmake/static_runtime.cmake`（`CMAKE_MSVC_RUNTIME_LIBRARY`、`APPLY_STATIC_UCRT_RUNTIME`）
- `windows/CMakeLists.txt`（`include(cmake/static_runtime.cmake)`）
- `windows/runner/CMakeLists.txt`、`windows/flutter/CMakeLists.txt`（对各 native target 调用 `apply_static_ucrt_runtime`）

效果：Runner（`astra.exe`）**不依赖** `ucrtbase.dll`、`vcruntime140.dll`、`msvcp140.dll` 等旁路 DLL。

> **注意**：`flutter_windows.dll` 仍为动态库，其 CRT 链接方式由引擎构建决定，与 Runner 的 `/MT` 配置相互独立。

### macOS — Apple libc（libSystem）

- C 库经 **libSystem.dylib** 提供，动态链接系统库。
- C++ 使用 **libc++**；Release 通过 `StaticLink.xcconfig` 附加 `-lc++`、LTO 与 dead code stripping。
- `FlutterMacOS.framework` 及插件 framework 仍为动态链接；macOS 无法将系统 C 库完全静态编入可执行文件。

---

## 相关文件索引

| 平台       | 配置文件                                                                             |
| ---------- | ------------------------------------------------------------------------------------ |
| Android    | `android/app/build.gradle.kts`、`android/settings.gradle.kts`                        |
| iOS        | `ios/Runner.xcodeproj/project.pbxproj`、`config/ios/spm.md`                          |
| Windows    | `windows/CMakeLists.txt`、`windows/cmake/static_runtime.cmake`                       |
| macOS      | `macos/Runner.xcodeproj/project.pbxproj`、`macos/Runner/Configs/StaticLink.xcconfig` |
| 仓库级约定 | `config/flutter/project_config.yaml`、`config/README.md`                             |
| CI         | `.github/workflows/ci.yml`、`.github/workflows/release.yml`                          |
