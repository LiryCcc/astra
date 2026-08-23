# Flutter / Dart 国内镜像

加速 `flutter pub get`、Flutter SDK 组件与引擎下载。

## 环境变量

| 变量                       | 作用                         | TUNA 镜像（推荐）                               |
| -------------------------- | ---------------------------- | ----------------------------------------------- |
| `PUB_HOSTED_URL`           | Dart / Flutter 包（pub.dev） | `https://mirrors.tuna.tsinghua.edu.cn/dart-pub` |
| `FLUTTER_STORAGE_BASE_URL` | Flutter 引擎、工具链资源     | `https://mirrors.tuna.tsinghua.edu.cn/flutter`  |

备选（Flutter 社区 CFUG）：

| 变量                       | 地址                            |
| -------------------------- | ------------------------------- |
| `PUB_HOSTED_URL`           | `https://pub.flutter-io.cn`     |
| `FLUTTER_STORAGE_BASE_URL` | `https://storage.flutter-io.cn` |

## 使用方式

### 1. 项目脚本（推荐）

```powershell
# Windows — 在镜像环境下执行任意 flutter 命令
.\tool\flutter_china.ps1 pub get
.\tool\flutter_china.ps1 run -d windows
```

```bash
# macOS / Linux
./tool/flutter_china.sh pub get
./tool/flutter_china.sh run -d macos
```

### 2. 当前终端临时生效

**PowerShell：**

```powershell
$env:PUB_HOSTED_URL = "https://mirrors.tuna.tsinghua.edu.cn/dart-pub"
$env:FLUTTER_STORAGE_BASE_URL = "https://mirrors.tuna.tsinghua.edu.cn/flutter"
flutter pub get
```

**Bash：**

```bash
export PUB_HOSTED_URL=https://mirrors.tuna.tsinghua.edu.cn/dart-pub
export FLUTTER_STORAGE_BASE_URL=https://mirrors.tuna.tsinghua.edu.cn/flutter
flutter pub get
```

### 3. Cursor / VS Code

仓库已配置 `.vscode/settings.json`：

- `dart.env` — IDE 内 `pub get`、分析器使用镜像
- `terminal.integrated.env.windows` — 集成终端默认带镜像环境变量

重新打开终端或重载窗口后生效。

### 4. 用户级永久配置（可选）

将 [mirror.env](mirror.env) 中的变量写入系统环境变量，或写入 shell 配置文件（`~/.bashrc`、`$PROFILE`）。

## 与 Android 镜像的关系

| 层级              | 配置位置                                                     |
| ----------------- | ------------------------------------------------------------ |
| Dart / Flutter 包 | 本文档（`PUB_HOSTED_URL` 等）                                |
| Gradle 发行包     | `android/gradle/wrapper/gradle-wrapper.properties`（腾讯云） |
| Maven 依赖        | `android/settings.gradle.kts`、`android/build.gradle.kts`    |

## CI 说明

GitHub Actions 海外 Runner **不需要** 配置上述镜像；仅本地国内开发环境使用。
