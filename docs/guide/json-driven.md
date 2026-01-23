# JSON 驱动

Trix Admin 的核心特性是通过 JSON Schema 配置来驱动页面渲染，本节介绍 JSON 驱动的核心概念和工作原理。

## 工作原理

```
JSON Schema → VSchema 渲染引擎 → Vue 组件 → 页面
```

1. **JSON Schema**：描述页面结构、数据、事件的 JSON 配置文件
2. **VSchema 渲染引擎**：解析 JSON Schema 并渲染为 Vue 组件
3. **Vue 组件**：NaiveUI 组件和自定义组件
4. **页面**：最终呈现给用户的界面

## 核心组件

### DynamicPage

`DynamicPage` 是 JSON 驱动的核心组件，负责：

- 根据路由配置加载 JSON Schema
- 注入全局状态（用户信息、主题、权限等）
- 处理加载状态和错误状态
- 将 Schema 传递给 VSchema 渲染

```vue
<!-- 使用示例 -->
<DynamicPage :schema-source="/mock/schema/my-page.json" />
```

### VSchema

`VSchema` 是 JSON Schema 渲染引擎，由 `vschema-ui` 提供：

```typescript
import { createVSchemaPlugin } from 'vschema-ui'

// 注册组件和配置
const plugin = createVSchemaPlugin({
  baseURL: '/api',
  components: {
    ...naiveUIComponents,
    ...customComponents
  }
})

app.use(plugin)
```

## 路由配置

在路由中配置 `schemaSource` 指定 JSON Schema 文件路径：

```typescript
{
  path: 'user',
  name: 'system-user',
  component: createDynamicPage('system-user'),
  meta: {
    title: '用户管理',
    icon: 'mdi:account-group',
    requiresAuth: true,
    layoutType: 'normal',
    useJsonRenderer: true,
    schemaSource: '/mock/schema/system/user-list.json'
  }
}
```

### 路由 meta 配置

| 属性 | 类型 | 说明 |
|------|------|------|
| `title` | `string` | 页面标题 |
| `icon` | `string` | 菜单图标 |
| `requiresAuth` | `boolean` | 是否需要登录 |
| `layoutType` | `'normal' \| 'blank'` | 布局类型 |
| `useJsonRenderer` | `boolean` | 是否使用 JSON 渲染 |
| `schemaSource` | `string` | JSON Schema 文件路径 |
| `hideInMenu` | `boolean` | 是否在菜单中隐藏 |
| `order` | `number` | 菜单排序 |

## 全局状态注入

DynamicPage 会自动将全局状态注入到 Schema 的 `data` 中：

```json
{
  "data": {
    "$app": {
      "locale": "zh-CN",
      "isMobile": false
    },
    "$theme": {
      "darkMode": false,
      "themeColor": "#646cff",
      "layoutMode": "vertical"
    },
    "$user": {
      "id": 1,
      "username": "admin",
      "nickname": "管理员"
    },
    "$permissions": ["user:read", "user:write"]
  }
}
```

在 Schema 中可以直接使用这些全局状态：

```json
{
  "com": "NText",
  "children": "当前用户：{{ $user.nickname }}"
}
```

```json
{
  "com": "NButton",
  "if": "$permissions.includes('user:write')",
  "children": "编辑"
}
```

## JSON Schema 基本结构

```json
{
  "data": {},           // 页面数据
  "methods": {},        // 方法定义
  "onMounted": {},      // 挂载时执行
  "com": "NCard",       // 组件名称
  "props": {},          // 组件属性
  "children": [],       // 子组件
  "events": {},         // 事件处理
  "if": "",             // 条件渲染
  "for": ""             // 循环渲染
}
```

## 组件注册

Trix Admin 预注册了以下组件：

### NaiveUI 组件

所有常用的 NaiveUI 组件都已注册，如：
- 基础：`NButton`、`NIcon`、`NText`
- 布局：`NSpace`、`NGrid`、`NFlex`、`NCard`
- 表单：`NForm`、`NInput`、`NSelect`、`NDatePicker`
- 数据：`NDataTable`、`NTree`、`NDescriptions`
- 反馈：`NModal`、`NDrawer`、`NMessage`

### 自定义组件

- `SvgIcon`：SVG 图标
- `ButtonIcon`：图标按钮
- `VueECharts`：ECharts 图表
- `IconPicker`：图标选择器
- `FlowEditor`：流程编辑器
- `MarkdownEditor`：Markdown 编辑器
- `RichEditor`：富文本编辑器

### 布局组件

- `SystemLogo`：系统 Logo
- `ThemeSchemaSwitch`：主题切换
- `LangSwitch`：语言切换
- `FullScreen`：全屏切换
- `UserAvatar`：用户头像

## 开发模式

在开发模式下，可以使用 `SchemaEditor` 组件实时编辑和预览 JSON Schema：

```json
{
  "com": "SchemaEditor",
  "props": {
    "schema": "{{ currentSchema }}"
  }
}
```

## 最佳实践

### 1. 合理拆分 Schema

对于复杂页面，建议将 Schema 拆分为多个文件，通过 `$ref` 引用：

```json
{
  "com": "div",
  "children": [
    { "$ref": "/mock/schema/components/header.json" },
    { "$ref": "/mock/schema/components/content.json" }
  ]
}
```

### 2. 复用数据和方法

将通用的数据和方法提取到公共 Schema 中：

```json
{
  "data": {
    "pagination": {
      "page": 1,
      "pageSize": 10,
      "total": 0
    }
  },
  "methods": {
    "handlePageChange": [
      { "set": "pagination.page", "value": "{{ $args[0] }}" },
      { "call": "loadData" }
    ]
  }
}
```

### 3. 使用条件渲染控制权限

```json
{
  "com": "NButton",
  "if": "$permissions.includes('user:delete')",
  "props": { "type": "error" },
  "children": "删除"
}
```

## 下一步

- [JSON Schema 基础](/schema/) - 详细学习 JSON Schema 语法
- [数据绑定](/schema/data-binding) - 了解数据绑定机制
- [事件处理](/schema/events) - 学习事件处理方式
