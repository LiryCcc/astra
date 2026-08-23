# Astra 项目文档

跨平台 Flutter 应用（Android、iOS、Windows、macOS），Material 风格，支持手机 / 平板 / 桌面自适应。

## 文档结构

### 需求文档 (`requirements/`)

| 文档 | 说明 |
|------|------|
| [项目概述](requirements/01-overview.md) | 项目目标与范围 |
| [平台与设备](requirements/02-platforms.md) | 目标平台、最低版本 |
| [路由与页面](requirements/03-routing-and-pages.md) | 三个路由总览 |
| [主题模式](requirements/04-theme.md) | 日间 / 夜间 / 自动 |
| [国际化](requirements/05-localization.md) | 中文 / 英文 / 日语 |
| [UI 风格](requirements/06-ui-style.md) | Material Design 3 |
| [首页](requirements/07-home-page.md) | 首页功能需求 |
| [设置页](requirements/08-settings-page.md) | 设置页功能需求 |
| [TodoMVC 页](requirements/09-todo-page.md) | Todo 功能需求 |
| [全局导航](requirements/10-navigation.md) | 页面间导航需求 |
| [多端适配](requirements/11-adaptive-layout.md) | 手机 / 平板 / 桌面适配需求 |
| [验收标准](requirements/12-acceptance-criteria.md) | 交付验收 checklist |
| [待确认项](requirements/13-open-questions.md) | 尚未敲定的选项 |

### 技术方案 (`technical/`)

| 文档 | 说明 |
|------|------|
| [架构与目录](technical/01-architecture.md) | 技术栈、项目结构 |
| [路由方案](technical/02-routing.md) | go_router 设计 |
| [主题方案](technical/03-theme.md) | 主题与持久化 |
| [国际化方案](technical/04-i18n.md) | Dart 文案与 Locale 管理 |
| [数据层](technical/05-data-layer.md) | Todo 模型与存储 |
| [多端适配方案](technical/06-adaptive-implementation.md) | 断点、导航、布局实现 |
| [平台注意事项](technical/07-platform-notes.md) | 各平台差异处理 |
| [依赖清单](technical/08-dependencies.md) | pubspec 依赖 |
| [代码质量工具](technical/09-code-quality.md) | 格式化与 Linter 配置 |

### 实施计划 (`implementation/`)

| 文档 | 说明 |
|------|------|
| [分阶段计划](implementation/01-plan.md) | P0–P6 实施阶段 |
| [启动步骤](implementation/02-getting-started.md) | SDK 就绪后的命令与流程 |
