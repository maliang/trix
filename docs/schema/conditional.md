# 条件渲染

使用 `if` 属性控制组件的条件渲染。

## 基本用法

```json
{
  "data": { "show": true },
  "com": "NButton",
  "if": "show",
  "children": "显示的按钮"
}
```

## 表达式

### 布尔值

```json
{ "if": "visible" }
{ "if": "!hidden" }
```

### 比较运算

```json
{ "if": "count > 0" }
{ "if": "status === 'active'" }
{ "if": "age >= 18" }
{ "if": "type !== 'admin'" }
```

### 逻辑运算

```json
{ "if": "isLogin && hasPermission" }
{ "if": "isAdmin || isSuperUser" }
{ "if": "!(disabled || loading)" }
```

### 包含判断

```json
{ "if": "$permissions.includes('user:write')" }
{ "if": "['active', 'pending'].includes(status)" }
{ "if": "list.length > 0" }
```

### 空值判断

```json
{ "if": "username" }
{ "if": "list && list.length" }
{ "if": "user?.name" }
```

## 权限控制

### 单个权限

```json
{
  "com": "NButton",
  "if": "$permissions.includes('user:write')",
  "children": "编辑"
}
```

### 多个权限（或）

```json
{
  "com": "NButton",
  "if": "$permissions.includes('user:write') || $permissions.includes('user:admin')",
  "children": "编辑"
}
```

### 多个权限（且）

```json
{
  "com": "NButton",
  "if": "$permissions.includes('user:read') && $permissions.includes('user:write')",
  "children": "查看并编辑"
}
```

## 全局状态判断

### 移动端适配

```json
{
  "com": "NDrawer",
  "if": "$app.isMobile",
  "children": "移动端抽屉"
}
```

```json
{
  "com": "NModal",
  "if": "!$app.isMobile",
  "children": "桌面端弹窗"
}
```

### 深色模式

```json
{
  "com": "img",
  "if": "$theme.darkMode",
  "props": { "src": "/logo-dark.svg" }
}
```

```json
{
  "com": "img",
  "if": "!$theme.darkMode",
  "props": { "src": "/logo-light.svg" }
}
```

### 用户状态

```json
{
  "com": "NButton",
  "if": "$user.role === 'admin'",
  "children": "管理员操作"
}
```

## 条件分支

### 使用多个 if

```json
{
  "com": "div",
  "children": [
    {
      "com": "NTag",
      "if": "status === 'success'",
      "props": { "type": "success" },
      "children": "成功"
    },
    {
      "com": "NTag",
      "if": "status === 'error'",
      "props": { "type": "error" },
      "children": "失败"
    },
    {
      "com": "NTag",
      "if": "status === 'pending'",
      "props": { "type": "warning" },
      "children": "处理中"
    }
  ]
}
```

### 使用三元表达式

在 props 中使用三元表达式：

```json
{
  "com": "NTag",
  "props": {
    "type": "{{ status === 'success' ? 'success' : status === 'error' ? 'error' : 'default' }}"
  },
  "children": "{{ status === 'success' ? '成功' : status === 'error' ? '失败' : '未知' }}"
}
```

## 表格中的条件渲染

### 操作列

```json
{
  "com": "NDataTable",
  "props": {
    "columns": [
      { "title": "名称", "key": "name" },
      {
        "title": "操作",
        "key": "actions",
        "render": {
          "com": "NSpace",
          "children": [
            {
              "com": "NButton",
              "if": "row.status === 'draft'",
              "props": { "size": "small" },
              "children": "编辑"
            },
            {
              "com": "NButton",
              "if": "row.status === 'draft'",
              "props": { "size": "small", "type": "primary" },
              "children": "发布"
            },
            {
              "com": "NButton",
              "if": "row.status === 'published'",
              "props": { "size": "small", "type": "warning" },
              "children": "下架"
            }
          ]
        }
      }
    ]
  }
}
```

### 状态标签

```json
{
  "render": {
    "com": "NTag",
    "props": {
      "type": "{{ row.status === 1 ? 'success' : 'error' }}"
    },
    "children": "{{ row.status === 1 ? '启用' : '禁用' }}"
  }
}
```

## 空状态处理

```json
{
  "com": "div",
  "children": [
    {
      "com": "NDataTable",
      "if": "list.length > 0",
      "props": { "data": "{{ list }}" }
    },
    {
      "com": "NEmpty",
      "if": "list.length === 0 && !loading",
      "props": { "description": "暂无数据" }
    },
    {
      "com": "NSpin",
      "if": "loading",
      "props": { "show": true }
    }
  ]
}
```

## 加载状态

```json
{
  "com": "div",
  "children": [
    {
      "com": "NSpin",
      "if": "loading",
      "props": { "size": "large" }
    },
    {
      "com": "NCard",
      "if": "!loading && !error",
      "children": "内容"
    },
    {
      "com": "NResult",
      "if": "!loading && error",
      "props": { "status": "error", "title": "加载失败" }
    }
  ]
}
```

## 注意事项

### 1. 避免复杂表达式

```json
// ❌ 不推荐
{ "if": "list.filter(i => i.status === 1).length > 0 && user.permissions.some(p => p.startsWith('admin'))" }

// ✅ 推荐：使用计算属性或方法
{
  "data": {
    "hasActiveItems": false,
    "isAdmin": false
  },
  "if": "hasActiveItems && isAdmin"
}
```

### 2. 性能考虑

频繁切换的内容建议使用 CSS 控制显示隐藏：

```json
{
  "com": "div",
  "style": {
    "display": "{{ show ? 'block' : 'none' }}"
  }
}
```

### 3. 与 for 配合

`if` 和 `for` 可以同时使用，`for` 优先执行：

```json
{
  "com": "NTag",
  "for": "item in list",
  "if": "item.visible",
  "children": "{{ item.name }}"
}
```
