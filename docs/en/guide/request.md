# Request Configuration

Trix Admin provides unified request configuration and interceptor mechanisms.

## Request Service

Request service is located in the `src/service/` directory:

```
service/
├── api/            # API interface definitions
├── request/        # Request encapsulation
└── index.ts        # Exports
```

## Response Format

Backend API should return a unified format:

```json
{
  "code": 0,
  "data": { ... },
  "message": "success"
}
```

### Response Configuration

Configure in `src/config/response.ts`:

```typescript
export const responseConfig = {
  codeField: 'code',      // Status code field
  dataField: 'data',      // Data field
  messageField: 'msg',    // Message field
  successCode: 0          // Success status code
}
```

## Request Interceptors

### Adding Token

```typescript
instance.interceptors.request.use((config) => {
  const token = getToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})
```

### Response Handling

```typescript
instance.interceptors.response.use(
  (response) => {
    const { code, data, message } = response.data
    
    if (code === 0) {
      return data
    }
    
    // Not logged in
    if (code === 401) {
      removeToken()
      router.push('/login')
    }
    
    window.$message?.error(message)
    return Promise.reject(new Error(message))
  },
  (error) => {
    window.$message?.error('Network error')
    return Promise.reject(error)
  }
)
```

## Using in JSON Schema

### Basic Request

```json
{
  "fetch": "/api/users",
  "then": [
    { "set": "list", "value": "{{ $response }}" }
  ]
}
```

### POST Request

```json
{
  "fetch": "/api/user",
  "method": "POST",
  "body": "{{ form }}",
  "then": [
    { "call": "$message.success", "args": ["Saved successfully"] }
  ]
}
```

### Error Handling

```json
{
  "fetch": "/api/data",
  "then": [
    { "set": "data", "value": "{{ $response }}" }
  ],
  "catch": [
    { "call": "$message.error", "args": ["Failed to load"] }
  ],
  "finally": [
    { "set": "loading", "value": false }
  ]
}
```

## JSON Renderer Request

Requests in JSON Schema use independent configuration:

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

### Request Interception

Configure in `src/plugins/json-renderer.ts`:

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

## Mock Data

Use static JSON files as mock data during development:

```
public/mock/
├── api/                # API responses
│   ├── users.json
│   └── menus.json
└── schema/             # Page Schema
    └── login.json
```

### Using Mock

```json
{
  "fetch": "/mock/api/users.json",
  "then": [
    { "set": "list", "value": "{{ $response }}" }
  ]
}
```

## Proxy Configuration

Configure proxy for development environment:

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

Environment variable control:

```bash
# .env
VITE_HTTP_PROXY=Y
```
