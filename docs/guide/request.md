# 请求配置

Trix Admin 提供统一的请求配置和拦截器机制。

## 请求服务

请求服务位于 `src/service/` 目录：

```
service/
├── api/            # API 接口定义
├── request/        # 请求封装
└── index.ts        # 导出
```

## 响应格式

后端 API 应返回统一格式：

```json
{
  "code": 0,
  "data": { ... },
  "msg": "success"
}
```

### 响应配置

在 `src/config/response.ts` 中配置：

```typescript
export const responseConfig = {
  codeField: 'code',      // 状态码字段
  dataField: 'data',      // 数据字段
  messageField: 'msg', // 消息字段
  successCode: 0          // 成功状态码
}
```

## 请求拦截器

### 添加 Token

```typescript
instance.interceptors.request.use((config) => {
  const token = getToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})
```

### 响应处理

```typescript
instance.interceptors.response.use(
  (response) => {
    const { code, data, msg } = response.data
    
    if (code === 0) {
      return data
    }
    
    // 未登录
    if (code === 401) {
      removeToken()
      router.push('/login')
    }
    
    window.$message?.error(msg)
    return Promise.reject(new Error(msg))
  },
  (error) => {
    window.$message?.error('网络错误')
    return Promise.reject(error)
  }
)
```

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

### POST 请求

```json
{
  "fetch": "/api/user",
  "method": "POST",
  "body": "{{ form }}",
  "then": [
    { "call": "$message.success", "args": ["保存成功"] }
  ]
}
```

### 错误处理

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

## JSON 渲染器请求

JSON Schema 中的请求使用独立配置：

```typescript
// src/config/json-renderer.ts
export const jsonRendererConfig = {
  baseURL: '',
  responseDataPath: 'data',
  timeout: 30000,
  withToken: true,
  tokenHeaderName: 'Authorization',
  tokenPrefix: 'Bearer '
}
```

### 请求拦截

在 `src/plugins/json-renderer.ts` 中配置：

```typescript
const plugin = createVSchemaPlugin({
  requestInterceptor: (config) => {
    const token = localStg.get('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  }
})
```

## Mock 数据

开发时使用静态 JSON 文件作为 Mock 数据：

```
public/mock/
├── api/                # API 响应
│   ├── users.json
│   └── menus.json
└── schema/             # 页面 Schema
    └── login.json
```

### 使用 Mock

```json
{
  "fetch": "/mock/api/users.json",
  "then": [
    { "set": "list", "value": "{{ $response }}" }
  ]
}
```

## 代理配置

开发环境可配置代理：

```typescript
// vite.config.ts
export default {
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true
      }
    }
  }
}
```

环境变量控制：

```bash
# .env
VITE_HTTP_PROXY=Y
```
