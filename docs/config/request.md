# 请求配置

请求相关配置定义在 `src/config/response.ts` 中。

## 响应配置

```typescript
// src/config/response.ts
export const responseConfig = {
  // 状态码字段名
  codeField: 'code',
  
  // 数据字段名
  dataField: 'data',
  
  // 消息字段名
  messageField: 'msg',
  
  // 成功状态码
  successCode: 0
}
```

## 响应格式

后端 API 应返回统一格式：

```json
{
  "code": 0,
  "data": {
    "list": [],
    "total": 100
  },
  "msg": "success"
}
```

### 成功响应

```json
{
  "code": 0,
  "data": { "id": 1, "name": "张三" },
  "msg": "操作成功"
}
```

### 错误响应

```json
{
  "code": 500,
  "data": null,
  "msg": "服务器错误"
}
```

### 常用状态码

| 状态码 | 说明 |
|--------|------|
| `0` | 成功 |
| `401` | 未登录 |
| `403` | 无权限 |
| `404` | 资源不存在 |
| `500` | 服务器错误 |

## 请求拦截器

在 `src/service/request/` 中配置请求拦截器：

```typescript
// 请求拦截器
instance.interceptors.request.use(
  (config) => {
    // 添加 token
    const token = getToken()
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)
```

## 响应拦截器

```typescript
// 响应拦截器
instance.interceptors.response.use(
  (response) => {
    const { code, data, msg } = response.data
    
    // 成功
    if (code === responseConfig.successCode) {
      return data
    }
    
    // 未登录
    if (code === 401) {
      // 跳转登录页
      router.push('/login')
      return Promise.reject(new Error(msg))
    }
    
    // 其他错误
    window.$message?.error(msg)
    return Promise.reject(new Error(msg))
  },
  (error) => {
    // 网络错误
    window.$message?.error('网络错误')
    return Promise.reject(error)
  }
)
```

## JSON 渲染器请求配置

JSON Schema 中的 `fetch` 请求使用独立配置：

```typescript
// src/config/json-renderer.ts
export const jsonRendererConfig = {
  // API 基础 URL
  baseURL: import.meta.env.VITE_SERVICE_BASE_URL || '',
  
  // 响应数据提取路径
  responseDataPath: responseConfig.dataField,
  
  // API 响应格式配置（与 responseConfig 保持一致）
  responseFormat: {
    codeField: responseConfig.codeField,
    msgField: responseConfig.messageField,
    dataField: responseConfig.dataField,
    successCode: responseConfig.successCode
  },
  
  // 默认请求头
  defaultHeaders: {
    'Content-Type': 'application/json'
  },
  
  // 请求超时时间（毫秒）
  timeout: 30000,
  
  // 是否自动携带 token
  withToken: true,
  
  // token 存储 key
  tokenKey: 'token',
  
  // token 请求头名称
  tokenHeaderName: 'Authorization',
  
  // token 前缀
  tokenPrefix: 'Bearer '
}
```

::: tip 配置同步
`jsonRendererConfig.responseFormat` 从 `responseConfig` 获取配置，确保 JSON Schema 请求与普通请求使用相同的响应格式判断逻辑。
:::

## 在 JSON Schema 中使用

### 基本请求

```json
{
  "fetch": "/api/users",
  "then": [
    { "set": "list", "value": "{{ $response }}" }
  ]
}
```

`$response` 会自动提取 `responseFormat.dataField` 指定的数据。

### 业务状态码判断

vschema 会自动根据 `responseFormat.successCode` 判断请求是否成功：

```json
{
  "fetch": "/api/user",
  "then": [
    { "set": "user", "value": "{{ $response }}" },
    { "call": "$message.success", "args": ["加载成功"] }
  ],
  "catch": [
    { "call": "$message.error", "args": ["{{ $error.message }}"] }
  ]
}
```

当后端返回 `{ code: 500, msg: "服务器错误", data: null }` 时：
- 自动触发 `catch` 回调
- `$error.message` = "服务器错误"

### 完整请求

```json
{
  "fetch": "/api/user",
  "method": "POST",
  "headers": {
    "X-Custom-Header": "value"
  },
  "body": "{{ form }}",
  "then": [
    { "call": "$message.success", "args": ["保存成功"] }
  ],
  "catch": [
    { "call": "$message.error", "args": ["保存失败：{{ $error.message }}"] }
  ]
}
```

## 自定义响应格式

如果后端响应格式不同，修改 `responseConfig`：

```typescript
// 后端返回格式：{ status: 'ok', result: {...}, message: '...' }
export const responseConfig = {
  codeField: 'status',
  dataField: 'result',
  messageField: 'message',
  successCode: 'ok'
}
```

修改后，`jsonRendererConfig.responseFormat` 会自动同步更新。

## 文件上传

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

## 错误处理最佳实践

```json
{
  "methods": {
    "loadData": [
      { "set": "loading", "value": true },
      { "set": "error", "value": null },
      {
        "fetch": "/api/data",
        "then": [
          { "set": "data", "value": "{{ $response }}" }
        ],
        "catch": [
          { "set": "error", "value": "{{ $error.message }}" },
          { "call": "$message.error", "args": ["加载失败"] }
        ],
        "finally": [
          { "set": "loading", "value": false }
        ]
      }
    ]
  }
}
```
