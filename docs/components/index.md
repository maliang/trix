# 组件概述

Trix Admin 预注册了丰富的组件，可在 JSON Schema 中直接使用。

## 组件分类

### NaiveUI 组件

所有常用的 NaiveUI 组件都已注册，包括：

- **基础组件**：Button、Icon、Text、Tag 等
- **布局组件**：Space、Grid、Flex、Card、Divider 等
- **表单组件**：Form、Input、Select、DatePicker、Switch 等
- **数据展示**：DataTable、Tree、Descriptions、Statistic 等
- **反馈组件**：Modal、Drawer、Popconfirm、Message 等
- **导航组件**：Menu、Dropdown、Breadcrumb、Tabs 等

### 自定义组件

Trix Admin 提供的自定义组件：

| 组件 | 说明 |
|------|------|
| `SvgIcon` | SVG 图标组件 |
| `ButtonIcon` | 图标按钮 |
| `CountTo` | 数字动画 |
| `VueECharts` | ECharts 图表 |
| `BetterScroll` | 滚动容器 |
| `WaveBg` | 波浪背景 |

### 业务组件

| 组件 | 说明 |
|------|------|
| `IconPicker` | 图标选择器 |
| `FlowEditor` | 流程编辑器 |
| `MarkdownEditor` | Markdown 编辑器 |
| `RichEditor` | 富文本编辑器 |

### 布局组件

| 组件 | 说明 |
|------|------|
| `SystemLogo` | 系统 Logo |
| `ThemeSchemaSwitch` | 主题切换 |
| `LangSwitch` | 语言切换 |
| `FullScreen` | 全屏切换 |
| `MenuToggler` | 菜单折叠切换 |
| `UserAvatar` | 用户头像 |
| `GlobalSearch` | 全局搜索 |
| `ThemeButton` | 主题配置按钮 |

### 高级组件

| 组件 | 说明 |
|------|------|
| `TableHeaderOperation` | 表格头部操作栏 |
| `TableColumnSetting` | 表格列设置 |
| `JsonDataTable` | JSON 数据表格 |
| `SchemaEditor` | Schema 编辑器 |
| `ErrorBoundary` | 错误边界 |

## 使用方式

在 JSON Schema 中直接使用组件名：

```json
{
  "com": "NButton",
  "props": { "type": "primary" },
  "children": "按钮"
}
```

```json
{
  "com": "SvgIcon",
  "props": { "icon": "carbon:home" }
}
```

## 组件属性

组件属性通过 `props` 传递：

```json
{
  "com": "NInput",
  "props": {
    "placeholder": "请输入",
    "clearable": true,
    "maxlength": 100
  }
}
```

动态属性：

```json
{
  "com": "NButton",
  "props": {
    "disabled": "{{ !form.username }}",
    "loading": "{{ submitting }}"
  }
}
```

## 组件事件

通过 `events` 配置事件处理：

```json
{
  "com": "NButton",
  "events": {
    "click": { "call": "handleClick" }
  }
}
```

## 组件插槽

通过 `slots` 配置具名插槽：

```json
{
  "com": "NInput",
  "slots": {
    "prefix": [
      { "com": "SvgIcon", "props": { "icon": "carbon:search" } }
    ]
  }
}
```

## 双向绑定

使用 `model` 实现双向绑定：

```json
{
  "com": "NInput",
  "model": "form.username"
}
```

## 查看更多

- [NaiveUI 组件](/components/naive-ui) - NaiveUI 组件列表
- [SvgIcon](/components/svg-icon) - SVG 图标组件
- [VueECharts](/components/vue-echarts) - ECharts 图表组件
- [IconPicker](/components/icon-picker) - 图标选择器
