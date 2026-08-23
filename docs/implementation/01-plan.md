# 分阶段实施计划

## 总览

| 阶段 | 目标 | 产出 |
|------|------|------|
| P0 | 项目骨架 | 四端可运行的空壳应用 |
| P1 | 主题 + 语言 | 设置偏好可切换并持久化 |
| P2 | 路由 + 导航 | 三页可切换，自适应导航壳 |
| P3 | TodoMVC | Todo 完整 CRUD + 持久化 |
| P4 | 首页 | Logo、名称与版本号展示 |
| P5 | 多端打磨 | 手机/平板/桌面布局优化 |
| P6 | 测试与收尾 | 验收通过、可交付 |

---

## P0 — 项目骨架

**目标**：创建 Flutter 项目，接入依赖，四端可编译运行。

**任务**：

1. `flutter create --org com.astra --platforms=android,ios,windows,macos`
2. 添加 pubspec 依赖（见 [依赖清单](../technical/08-dependencies.md)）
3. 搭建目录结构（见 [架构与目录](../technical/01-architecture.md)）
4. 配置 `analysis_options.yaml`、`l10n.yaml`
5. 创建占位 `HomePage`、`SettingsPage`、`TodoPage`
6. 验证 `flutter run` 在至少一个目标平台成功

**完成标志**：应用启动显示占位首页，无编译错误。

---

## P1 — 主题与国际化基础

**目标**：设置页可切换主题和语言，重启后保持。

**任务**：

1. 实现 `AppTheme`（light/dark）
2. 实现 `ThemeModeNotifier` + shared_preferences 持久化
3. 创建三份 ARB 文件，运行 `flutter gen-l10n`
4. 实现 `LocaleNotifier` + 持久化
5. 完成 `SettingsPage` 主题与语言 UI
6. `MaterialApp` 绑定 theme、darkTheme、themeMode、locale

**完成标志**：设置页切换主题/语言立即生效，重启后恢复。

---

## P2 — 路由与自适应导航

**目标**：三页通过 go_router 导航，导航形态随断点切换。

**任务**：

1. 配置 `go_router` + `ShellRoute`（见 [路由方案](../technical/02-routing.md)）
2. 实现 `Breakpoints` 常量
3. 实现 `AdaptiveScaffold`（BottomBar / NavigationRail）
4. 导航项与路由同步高亮
5. 各页接入 `ContentContainer` 限宽

**完成标志**：三页可切换；宽窗口显示 Rail，窄窗口显示 BottomBar。

---

## P3 — TodoMVC 功能

**目标**：Todo 页功能完整，数据持久化。

**任务**：

1. 定义 `Todo` 模型 + Hive Adapter
2. 实现 `TodoRepository`
3. 实现 `TodoList`、`TodoFilter`、`uncompletedCount` Provider
4. 完成 Todo 页 UI：输入、列表、勾选、编辑、删除
5. 实现过滤（All / Active / Completed）
6. 实现「全部完成」「清除已完成」
7. 空状态文案

**完成标志**：Todo 增删改查、过滤、批量操作均可用，重启数据不丢。

---

## P4 — 首页

**目标**：首页展示 Logo、应用名称与版本号。

**任务**：

1. 添加应用 Logo 资源（`assets/`）
2. 居中布局：Logo → 应用名称（Astra）→ 版本号
3. 版本号读取 `pubspec.yaml`（初始值 `1.0.0`）
4. 各断点下保持垂直水平居中

**完成标志**：首页仅显示 Logo、名称、`1.0.0` 版本号，布局在各设备上居中正常。

---

## P5 — 多端打磨

**目标**：三端布局体验达标。

**任务**：

1. 按 [多端适配需求](../requirements/11-adaptive-layout.md) 逐页检查布局
2. 桌面端 Todo 列表 hover 态
3. 横竖屏旋转测试与修复
4. iPad 分屏宽度测试
5. Windows 窗口缩放断点切换测试
6. 字体缩放（无障碍）下检查溢出
7. 三语文案逐页校对

**完成标志**：满足 [验收标准](../requirements/12-acceptance-criteria.md) 中「多端适配」条目。

---

## P6 — 测试与收尾

**目标**：稳定可交付。

**任务**：

1. 编写核心单元测试（TodoRepository、过滤逻辑）
2. 编写 Widget 测试（SettingsPage 切换、Todo 添加）
3. 四端编译验证
4. 修复 linter 警告
5. 对照 [验收标准](../requirements/12-acceptance-criteria.md) 全量检查

**完成标志**：验收 checklist 全部通过。

---

## 依赖关系

```
P0 → P1 → P2 → P3 → P4 → P5 → P6
              ↘ P3 与 P4 可在 P2 后并行
```

P3（Todo）与 P4（首页）均依赖 P2，可在 P2 完成后并行实施。
