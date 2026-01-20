# 基本结构

本节详细介绍 JSON Schema 的基本结构和各个字段的用法。

## 完整结构

```json
{
  "data": {
    "form": { "name": "", "age": 0 },
    "list": [],
    "loading": false
  },
  "methods": {
    "submit": [
      { "set": "loading", "value": true },
      { "fetch": "/api/submit", "method": "POST", "body": "{{ form }}" }
    ]
  },
  "onMounted": { "call": "loadData" },
  "onUnmounted": { "call": "cleanup" },
  "com": "NCard",
  "props": { "title": "表单" },
  "style": { "marginTop": "20px" },
  "class": "my-card",
  "children": [],
  "slots": {},
  "events": {},
  "if": "showCard",
  "for": "",
  "key": ""
}
```

## 数据定义 (data)

`data` 定义页面的响应式数据：

```json
{
  "data": {
    "message": "Hello",
    "count": 0,
    "visible": true,
    "form": {
      "username": "",
      "password": ""
    },
    "list": [],
    "pagination": {
      "page": 1,
      "pageSize": 10,
      "total": 0
    }
  }
}
```

### 数据类型

支持所有 JSON 数据类型：

- 字符串：`"message": "Hello"`
- 数字：`"count": 0`
- 布尔：`"visible": true`
- 对象：`"form": { "name": "" }`
- 数组：`"list": []`
- null：`"data": null`

## 组件 (com)

`com` 指定要渲染的组件：

```json
{ "com": "NButton" }
{ "com": "NCard" }
{ "com": "div" }
{ "com": "span" }
```

### HTML 元素

可以使用原生 HTML 元素：

```json
{ "com": "div", "children": "内容" }
{ "com": "span", "props": { "class": "text-red" } }
{ "com": "a", "props": { "href": "https://example.com" } }
```

### Vue 组件

可以使用已注册的 Vue 组件：

```json
{ "com": "NButton" }
{ "com": "SvgIcon" }
{ "com": "VueECharts" }
```

## 属性 (props)

`props` 传递给组件的属性：

```json
{
  "com": "NButton",
  "props": {
    "type": "primary",
    "size": "large",
    "disabled": false,
    "loading": "{{ loading }}"
  }
}
```

### 动态属性

使用 `{{ }}` 绑定动态值：

```json
{
  "props": {
    "disabled": "{{ !form.username }}",
    "placeholder": "{{ $t('common.input') }}"
  }
}
```

## 样式 (style)

`style` 定义内联样式：

```json
{
  "com": "div",
  "style": {
    "padding": "20px",
    "backgroundColor": "#f5f5f5",
    "borderRadius": "8px"
  }
}
```

### 动态样式

```json
{
  "style": {
    "color": "{{ active ? 'red' : 'black' }}",
    "display": "{{ visible ? 'block' : 'none' }}"
  }
}
```

## 类名 (class)

`class` 定义 CSS 类名：

```json
{
  "com": "div",
  "class": "container flex items-center"
}
```

### 动态类名

```json
{
  "class": "{{ active ? 'active' : '' }} base-class"
}
```

## 子组件 (children)

`children` 定义子内容：

### 文本内容

```json
{
  "com": "NButton",
  "children": "点击我"
}
```

### 动态文本

```json
{
  "com": "NText",
  "children": "你好，{{ username }}"
}
```

### 组件数组

```json
{
  "com": "NSpace",
  "children": [
    { "com": "NButton", "children": "按钮1" },
    { "com": "NButton", "children": "按钮2" }
  ]
}
```

### 嵌套结构

```json
{
  "com": "NCard",
  "props": { "title": "卡片" },
  "children": [
    {
      "com": "NForm",
      "children": [
        {
          "com": "NFormItem",
          "props": { "label": "用户名" },
          "children": [
            { "com": "NInput", "model": "form.username" }
          ]
        }
      ]
    }
  ]
}
```

## 插槽 (slots)

`slots` 定义具名插槽：

```json
{
  "com": "NCard",
  "slots": {
    "header": [
      { "com": "NText", "children": "自定义头部" }
    ],
    "footer": [
      { "com": "NButton", "children": "确定" }
    ]
  },
  "children": "卡片内容"
}
```

### 常用插槽示例

```json
{
  "com": "NInput",
  "model": "form.username",
  "slots": {
    "prefix": [
      { "com": "SvgIcon", "props": { "icon": "carbon:user" } }
    ],
    "suffix": [
      { "com": "SvgIcon", "props": { "icon": "carbon:close" } }
    ]
  }
}
```

## 事件 (events)

`events` 定义事件处理：

```json
{
  "com": "NButton",
  "events": {
    "click": { "set": "count", "value": "{{ count + 1 }}" }
  }
}
```

详见 [事件处理](/schema/events)。

## 双向绑定 (model)

`model` 实现双向数据绑定：

```json
{
  "com": "NInput",
  "model": "form.username"
}
```

### 自定义 model

```json
{
  "com": "NSwitch",
  "model:value": "form.enabled"
}
```

```json
{
  "com": "NCheckbox",
  "model:checked": "form.agree"
}
```

## 条件渲染 (if)

`if` 控制组件是否渲染：

```json
{
  "com": "NButton",
  "if": "showButton",
  "children": "按钮"
}
```

详见 [条件渲染](/schema/conditional)。

## 循环渲染 (for)

`for` 实现列表渲染：

```json
{
  "com": "NTag",
  "for": "item in list",
  "key": "item.id",
  "children": "{{ item.name }}"
}
```

详见 [循环渲染](/schema/loop)。

## 方法定义 (methods)

`methods` 定义可复用的方法：

```json
{
  "methods": {
    "loadData": [
      { "set": "loading", "value": true },
      { "fetch": "/api/list", "then": [{ "set": "list", "value": "{{ $response }}" }] },
      { "set": "loading", "value": false }
    ],
    "handleSubmit": [
      { "call": "validate" },
      { "fetch": "/api/submit", "method": "POST", "body": "{{ form }}" }
    ]
  }
}
```

详见 [方法定义](/schema/methods)。

## 生命周期

### onMounted

组件挂载时执行：

```json
{
  "onMounted": { "call": "loadData" }
}
```

### onUnmounted

组件卸载时执行：

```json
{
  "onUnmounted": { "call": "cleanup" }
}
```

详见 [生命周期](/schema/lifecycle)。
