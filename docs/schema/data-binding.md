# 数据绑定

JSON Schema 使用 `{{ }}` 语法实现数据绑定，支持表达式计算和全局状态访问。

## 基本语法

### 简单绑定

```json
{
  "data": { "name": "张三" },
  "com": "NText",
  "children": "{{ name }}"
}
```

### 属性绑定

```json
{
  "data": { "disabled": true },
  "com": "NButton",
  "props": {
    "disabled": "{{ disabled }}"
  }
}
```

### 样式绑定

```json
{
  "data": { "color": "red" },
  "com": "div",
  "style": {
    "color": "{{ color }}"
  }
}
```

## 表达式

### 算术运算

```json
{
  "data": { "count": 5 },
  "com": "NText",
  "children": "总数：{{ count * 2 }}"
}
```

### 字符串拼接

```json
{
  "data": { "firstName": "张", "lastName": "三" },
  "com": "NText",
  "children": "{{ firstName + lastName }}"
}
```

### 三元表达式

```json
{
  "data": { "score": 85 },
  "com": "NTag",
  "props": {
    "type": "{{ score >= 60 ? 'success' : 'error' }}"
  },
  "children": "{{ score >= 60 ? '及格' : '不及格' }}"
}
```

### 逻辑运算

```json
{
  "props": {
    "disabled": "{{ !username || !password }}",
    "show": "{{ isAdmin && hasPermission }}"
  }
}
```

### 比较运算

```json
{
  "if": "count > 0",
  "children": "{{ count === 1 ? '1 项' : count + ' 项' }}"
}
```

## 对象和数组

### 访问对象属性

```json
{
  "data": {
    "user": { "name": "张三", "age": 25 }
  },
  "com": "NText",
  "children": "{{ user.name }}，{{ user.age }} 岁"
}
```

### 访问数组元素

```json
{
  "data": {
    "items": ["苹果", "香蕉", "橙子"]
  },
  "com": "NText",
  "children": "第一个：{{ items[0] }}"
}
```

### 数组方法

```json
{
  "data": { "list": [1, 2, 3, 4, 5] },
  "com": "NText",
  "children": "总数：{{ list.length }}，总和：{{ list.reduce((a, b) => a + b, 0) }}"
}
```

## 双向绑定

### model 语法

```json
{
  "data": { "form": { "username": "" } },
  "com": "NInput",
  "model": "form.username"
}
```

### 自定义 model 属性

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

```json
{
  "com": "NSelect",
  "model:value": "form.status",
  "props": {
    "options": [
      { "label": "启用", "value": 1 },
      { "label": "禁用", "value": 0 }
    ]
  }
}
```

## 全局状态

DynamicPage 会注入全局状态，可直接使用：

### $app - 应用状态

```json
{
  "com": "NText",
  "children": "当前语言：{{ $app.locale }}"
}
```

```json
{
  "com": "div",
  "if": "$app.isMobile",
  "children": "移动端内容"
}
```

### $theme - 主题状态

```json
{
  "com": "SvgIcon",
  "props": {
    "icon": "{{ $theme.darkMode ? 'mdi:weather-night' : 'mdi:weather-sunny' }}"
  }
}
```

```json
{
  "style": {
    "color": "{{ $theme.themeColor }}"
  }
}
```

### $user - 用户信息

```json
{
  "com": "NText",
  "children": "欢迎，{{ $user.nickname }}"
}
```

```json
{
  "com": "NAvatar",
  "props": {
    "src": "{{ $user.avatar }}"
  }
}
```

### $permissions - 权限列表

```json
{
  "com": "NButton",
  "if": "$permissions.includes('user:write')",
  "children": "编辑"
}
```

## 内置变量

### $response

API 请求的响应数据：

```json
{
  "fetch": "/api/user",
  "then": [
    { "set": "user", "value": "{{ $response }}" }
  ]
}
```

### $args

事件参数：

```json
{
  "events": {
    "click": { "set": "selectedId", "value": "{{ $args[0] }}" }
  }
}
```

### $event

原生事件对象：

```json
{
  "events": {
    "input": { "set": "value", "value": "{{ $event.target.value }}" }
  }
}
```

### row / item / index

循环渲染中的变量：

```json
{
  "for": "item in list",
  "children": "{{ index + 1 }}. {{ item.name }}"
}
```

## 方法调用

### 内置方法

```json
{
  "children": "{{ JSON.stringify(form) }}"
}
```

```json
{
  "children": "{{ Math.round(score * 100) / 100 }}"
}
```

### 国际化

```json
{
  "children": "{{ $t('common.submit') }}"
}
```

```json
{
  "children": "{{ $t('message.total', { count: list.length }) }}"
}
```

## 注意事项

### 1. 避免复杂表达式

```json
// ❌ 不推荐
{
  "children": "{{ list.filter(i => i.status === 1).map(i => i.name).join(', ') }}"
}

// ✅ 推荐：在 methods 中处理
{
  "methods": {
    "getActiveNames": "{{ list.filter(i => i.status === 1).map(i => i.name).join(', ') }}"
  },
  "children": "{{ getActiveNames() }}"
}
```

### 2. 空值处理

```json
{
  "children": "{{ user?.name || '未知' }}"
}
```

### 3. 类型转换

```json
{
  "props": {
    "value": "{{ Number(inputValue) }}",
    "label": "{{ String(count) }}"
  }
}
```
