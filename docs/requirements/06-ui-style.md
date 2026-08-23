# UI 风格

## 设计体系

- **Material Design 3**（`useMaterial3: true`）
- 统一色彩、字体、圆角、阴影（elevation）规范
- 遵循 Flutter Material 组件默认交互规范（涟漪、焦点态等）

## 组件使用原则

| 场景 | 推荐组件 |
|------|----------|
| 列表项 | `ListTile` |
| 设置分组 | `ListTile` + 分组标题 |
| 主操作按钮 | `FilledButton` / `ElevatedButton` |
| 次要操作 | `TextButton` / `OutlinedButton` |
| 输入 | `TextField` |
| 卡片信息 | `Card` |
| 单选（主题/语言） | `RadioListTile` 或 `SegmentedButton` |

## 一致性要求

- 三页面使用同一套 `ThemeData`，不出现各页风格割裂
- 图标使用 Material Icons，语义统一
- 间距采用 8dp 网格（8、16、24、32…）

## 无障碍（基础）

- 可点击区域不小于 48×48 dp（移动端）
- 图标按钮提供语义标签（`tooltip` / `Semantics`）
- 主题对比度满足基本可读性
