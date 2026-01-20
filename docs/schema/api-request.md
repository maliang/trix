# API 请求

使用 `fetch` 动作发起 HTTP 请求。

## 基本语法

```json
{
  "fetch": "/api/endpoint",
  "method": "GET",
  "then": [],
  "catch": [],
  "finally": []
}
```

## GET 请求

### 简单请求

```json
{
  "fetch": "/api/users",
  "then": [
    { "set": "list", "value": "{{ $response }}" }
  ]
}
```

### 带查询参数

```json
{
  "fetch": "/api/users?page={{ pagination.page }}&pageSize={{ pagination.pageSize }}",
  "then": [
    { "set": "list", "value": "{{ $response.list }}" },
    { "set": "pagination.total", "value": "{{ $response.total }}" }
  ]
}
```

### 动态 URL

```json
{
  "fetch": "/api/user/{{ userId }}",
  "then": [
    { "set": "userDetail", "value": "{{ $response }}" }
  ]
}
```

## POST 请求

### 提交表单

```json
{
  "fetch": "/api/user",
  "method": "POST",
  "body": "{{ form }}",
  "then": [
    { "call": "$message.success", "args": ["创建成功"] }
  ]
}
```

### 自定义请求头

```json
{
  "fetch": "/api/upload",
  "method": "POST",
  "headers": {
    "Content-Type": "multipart/form-data"
  },
  "body": "{{ formData }}",
  "then": [
    { "set": "uploadResult", "value": "{{ $response }}" }
  ]
}
```

## PUT 请求

```json
{
  "fetch": "/api/user/{{ editingUser.id }}",
  "method": "PUT",
  "body": "{{ editingUser }}",
  "then": [
    { "call": "$message.success", "args": ["更新成功"] },
    { "call": "loadData" }
  ]
}
```

## DELETE 请求

```json
{
  "fetch": "/api/user/{{ userId }}",
  "method": "DELETE",
  "then": [
    { "call": "$message.success", "args": ["删除成功"] },
    { "call": "loadData" }
  ]
}
```

## 响应处理

### $response

请求成功后的响应数据：

```json
{
  "fetch": "/api/data",
  "then": [
    { "set": "data", "value": "{{ $response }}" },
    { "set": "total", "value": "{{ $response.total }}" },
    { "set": "list", "value": "{{ $response.list }}" }
  ]
}
```

### $error

请求失败时的错误信息：

```json
{
  "fetch": "/api/data",
  "catch": [
    { "set": "error", "value": "{{ $error.message }}" },
    { "call": "$message.error", "args": ["请求失败：{{ $error.message }}"] }
  ]
}
```

## 错误处理

### catch

```json
{
  "fetch": "/api/data",
  "then": [
    { "set": "data", "value": "{{ $response }}" }
  ],
  "catch": [
    { "call": "$message.error", "args": ["加载失败"] },
    { "set": "error", "value": true }
  ]
}
```

### finally

无论成功失败都会执行：

```json
{
  "fetch": "/api/data",
  "then": [
    { "set": "data", "value": "{{ $response }}" }
  ],
  "catch": [
    { "call": "$message.error", "args": ["加载失败"] }
  ],
  "finally": [
    { "set": "loading", "value": false }
  ]
}
```

## 完整示例

### 列表加载

```json
{
  "data": {
    "list": [],
    "loading": false,
    "pagination": {
      "page": 1,
      "pageSize": 10,
      "total": 0
    }
  },
  "methods": {
    "loadData": [
      { "set": "loading", "value": true },
      {
        "fetch": "/api/users?page={{ pagination.page }}&pageSize={{ pagination.pageSize }}&keyword={{ searchKeyword }}",
        "then": [
          { "set": "list", "value": "{{ $response.list }}" },
          { "set": "pagination.total", "value": "{{ $response.total }}" }
        ],
        "catch": [
          { "call": "$message.error", "args": ["加载失败"] }
        ],
        "finally": [
          { "set": "loading", "value": false }
        ]
      }
    ]
  },
  "onMounted": { "call": "loadData" }
}
```

### 表单提交

```json
{
  "data": {
    "form": { "name": "", "email": "", "phone": "" },
    "submitting": false
  },
  "methods": {
    "handleSubmit": [
      {
        "if": "!form.name || !form.email",
        "then": { "call": "$message.warning", "args": ["请填写必填项"] },
        "else": [
          { "set": "submitting", "value": true },
          {
            "fetch": "/api/user",
            "method": "POST",
            "body": "{{ form }}",
            "then": [
              { "call": "$message.success", "args": ["提交成功"] },
              { "set": "form", "value": "{{ ({ name: '', email: '', phone: '' }) }}" }
            ],
            "catch": [
              { "call": "$message.error", "args": ["提交失败：{{ $error.message }}"] }
            ],
            "finally": [
              { "set": "submitting", "value": false }
            ]
          }
        ]
      }
    ]
  }
}
```

### CRUD 操作

```json
{
  "methods": {
    "create": [
      {
        "fetch": "/api/items",
        "method": "POST",
        "body": "{{ form }}",
        "then": [
          { "call": "$message.success", "args": ["创建成功"] },
          { "call": "closeModal" },
          { "call": "loadData" }
        ]
      }
    ],
    "update": [
      {
        "fetch": "/api/items/{{ editingItem.id }}",
        "method": "PUT",
        "body": "{{ editingItem }}",
        "then": [
          { "call": "$message.success", "args": ["更新成功"] },
          { "call": "closeModal" },
          { "call": "loadData" }
        ]
      }
    ],
    "delete": [
      {
        "fetch": "/api/items/{{ $args[0] }}",
        "method": "DELETE",
        "then": [
          { "call": "$message.success", "args": ["删除成功"] },
          { "call": "loadData" }
        ]
      }
    ]
  }
}
```

## 请求配置

### 全局配置

在 `src/config/json-renderer.ts` 中配置：

```typescript
export const jsonRendererConfig = {
  baseURL: '/api',
  responseDataPath: 'data',
  timeout: 30000,
  withToken: true,
  tokenHeaderName: 'Authorization',
  tokenPrefix: 'Bearer '
}
```

### 响应数据提取

配置 `responseDataPath` 后，`$response` 会自动提取指定路径的数据：

```json
// 后端返回：{ code: 0, data: { list: [], total: 100 }, msg: 'success' }
// responseDataPath: 'data'
// $response = { list: [], total: 100 }
```

## 并发请求

```json
{
  "methods": {
    "loadAllData": [
      { "set": "loading", "value": true },
      {
        "fetch": "/api/users",
        "then": [{ "set": "users", "value": "{{ $response }}" }]
      },
      {
        "fetch": "/api/roles",
        "then": [{ "set": "roles", "value": "{{ $response }}" }]
      },
      {
        "fetch": "/api/permissions",
        "then": [{ "set": "permissions", "value": "{{ $response }}" }]
      },
      { "set": "loading", "value": false }
    ]
  }
}
```

## 注意事项

### 1. 始终处理错误

```json
{
  "fetch": "/api/data",
  "catch": [
    { "call": "$message.error", "args": ["请求失败"] }
  ]
}
```

### 2. 显示加载状态

```json
{
  "methods": {
    "loadData": [
      { "set": "loading", "value": true },
      { "fetch": "/api/data" },
      { "set": "loading", "value": false }
    ]
  }
}
```

### 3. 防止重复提交

```json
{
  "com": "NButton",
  "props": {
    "loading": "{{ submitting }}",
    "disabled": "{{ submitting }}"
  },
  "events": {
    "click": { "call": "handleSubmit" }
  }
}
```
