# JSON Schema 概述

Trix Admin 使用 JSON Schema 来描述页面结构，通过 `vschema-ui` 渲染引擎将 JSON 配置转换为 Vue 组件。

## 什么是 JSON Schema

JSON Schema 是一种用 JSON 格式描述 UI 界面的配置规范。通过 JSON Schema，你可以：

- 定义页面结构和组件层级
- 配置组件属性和样式
- 绑定数据和处理事件
- 实现条件渲染和循环渲染

## 基本示例

```json
{
  "data": {
    "message": "Hello, World!",
    "count": 0
  },
  "com": "NCard",
  "props": {
    "title": "示例卡片"
  },
  "children": [
    {
      "com": "NText",
      "children": "{{ message }}"
    },
    {
      "com": "NButton",
      "props": { "type": "primary" },
      "events": {
        "click": { "set": "count", "value": "{{ count + 1 }}" }
      },
      "children": "点击次数：{{ count }}"
    }
  ]
}
```

## Schema 结构

一个完整的 JSON Schema 包含以下部分：

```json
{
  "data": {},           // 页面数据
  "methods": {},        // 方法定义
  "onMounted": {},      // 挂载时执行
  "onUnmounted": {},    // 卸载时执行
  "com": "div",         // 组件名称
  "props": {},          // 组件属性
  "style": {},          // 内联样式
  "class": "",          // CSS 类名
  "children": [],       // 子组件
  "slots": {},          // 插槽
  "events": {},         // 事件处理
  "model": "",          // 双向绑定
  "if": "",             // 条件渲染
  "for": "",            // 循环渲染
  "key": ""             // 循环 key
}
```

## 核心概念

### 组件 (com)

指定要渲染的组件名称：

```json
{ "com": "NButton" }
{ "com": "NInput" }
{ "com": "div" }
```

### 属性 (props)

传递给组件的属性：

```json
{
  "com": "NButton",
  "props": {
    "type": "primary",
    "size": "large",
    "disabled": false
  }
}
```

### 子组件 (children)

组件的子内容，可以是字符串或组件数组：

```json
{
  "com": "NCard",
  "children": [
    { "com": "NText", "children": "标题" },
    { "com": "NButton", "children": "按钮" }
  ]
}
```

### 数据绑定

使用 `{{ }}` 语法绑定数据：

```json
{
  "data": { "name": "张三" },
  "com": "NText",
  "children": "你好，{{ name }}"
}
```

### 事件处理

通过 `events` 配置事件处理：

```json
{
  "com": "NButton",
  "events": {
    "click": { "set": "count", "value": "{{ count + 1 }}" }
  }
}
```

## 可用组件

### NaiveUI 组件

所有 NaiveUI 组件都可以直接使用：

- 基础：`NButton`、`NIcon`、`NText`、`NTag`
- 布局：`NSpace`、`NGrid`、`NFlex`、`NCard`、`NDivider`
- 表单：`NForm`、`NInput`、`NSelect`、`NDatePicker`、`NSwitch`
- 数据：`NDataTable`、`NTree`、`NDescriptions`、`NStatistic`
- 反馈：`NModal`、`NDrawer`、`NPopconfirm`、`NMessage`

### 自定义组件

Trix Admin 提供的自定义组件：

- `SvgIcon`：SVG 图标
- `ButtonIcon`：图标按钮
- `VueECharts`：ECharts 图表
- `IconPicker`：图标选择器
- `FlowEditor`：流程编辑器
- `MarkdownEditor`：Markdown 编辑器
- `RichEditor`：富文本编辑器

## 文件位置

JSON Schema 文件通常放在 `public/mock/schema/` 目录下：

```
public/mock/schema/
├── login.json          # 登录页
├── dashboard.json      # 仪表盘
├── 403.json            # 403 页面
├── 404.json            # 404 页面
└── system/             # 系统管理
    ├── user-list.json  # 用户列表
    ├── role-list.json  # 角色列表
    └── menu-list.json  # 菜单列表
```

## 下一步

- [基本结构](/schema/basic-structure) - 详细了解 Schema 结构
- [数据绑定](/schema/data-binding) - 学习数据绑定语法
- [事件处理](/schema/events) - 掌握事件处理方式
- [条件渲染](/schema/conditional) - 实现条件渲染
- [循环渲染](/schema/loop) - 实现列表渲染
