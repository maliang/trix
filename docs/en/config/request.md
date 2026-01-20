# Request Configuration

Request configuration is defined in `src/config/response.ts`.

## Response Configuration

```typescript
// src/config/response.ts
export const responseConfig = {
  // Status code field name
  codeField: 'code',
  
  // Data field name
  dataField: 'data',
  
  // Message field name
  messageField: 'msg',
  
  // Success status code
  successCode: 0
}
```

## Response Format

Backend API should return a unified format:

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

### Success Response

```json
{
  "code": 0,
  "data": { "id": 1, "name": "John" },
  "msg": "Operation successful"
}
```

### Error Response

```json
{
  "code": 500,
  "data": null,
  "msg": "Server error"
}
```

### Common Status Codes

| Code | Description |
|------|-------------|
| `0` | Success |
| `401` | Unauthorized |
| `403` | Forbidden |
| `404` | Not Found |
| `500` | Server Error |

## Request Interceptor

Configure request interceptor in `src/service/request/`:

```typescript
// Request interceptor
instance.interceptors.request.use(
  (config) => {
    // Add token
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

## Response Interceptor

```typescript
// Response interceptor
instance.interceptors.response.use(
  (response) => {
    const { code, data, msg } = response.data
    
    // Success
    if (code === responseConfig.successCode) {
      return data
    }
    
    // Unauthorized
    if (code === 401) {
      router.push('/login')
      return Promise.reject(new Error(msg))
    }
    
    // Other errors
    window.$message?.error(msg)
    return Promise.reject(new Error(msg))
  },
  (error) => {
    // Network error
    window.$message?.error('Network error')
    return Promise.reject(error)
  }
)
```

## JSON Renderer Request Configuration

JSON Schema `fetch` requests use independent configuration:

```typescript
// src/config/json-renderer.ts
export const jsonRendererConfig = {
  // API base URL
  baseURL: import.meta.env.VITE_SERVICE_BASE_URL || '',
  
  // Response data extraction path
  responseDataPath: responseConfig.dataField,
  
  // API response format configuration (synced with responseConfig)
  responseFormat: {
    codeField: responseConfig.codeField,
    msgField: responseConfig.messageField,
    dataField: responseConfig.dataField,
    successCode: responseConfig.successCode
  },
  
  // Default headers
  defaultHeaders: {
    'Content-Type': 'application/json'
  },
  
  // Request timeout (ms)
  timeout: 30000,
  
  // Auto-attach token
  withToken: true,
  
  // Token storage key
  tokenKey: 'token',
  
  // Token header name
  tokenHeaderName: 'Authorization',
  
  // Token prefix
  tokenPrefix: 'Bearer '
}
```

::: tip Configuration Sync
`jsonRendererConfig.responseFormat` is derived from `responseConfig`, ensuring JSON Schema requests use the same response format validation logic as regular requests.
:::

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

`$response` automatically extracts data from the `responseFormat.dataField` path.

### Business Status Code Validation

VSchema automatically validates requests based on `responseFormat.successCode`:

```json
{
  "fetch": "/api/user",
  "then": [
    { "set": "user", "value": "{{ $response }}" },
    { "call": "$message.success", "args": ["Load successful"] }
  ],
  "catch": [
    { "call": "$message.error", "args": ["{{ $error.message }}"] }
  ]
}
```

When backend returns `{ code: 500, msg: "Server error", data: null }`:
- Automatically triggers `catch` callback
- `$error.message` = "Server error"

### Complete Request

```json
{
  "fetch": "/api/user",
  "method": "POST",
  "headers": {
    "X-Custom-Header": "value"
  },
  "body": "{{ form }}",
  "then": [
    { "call": "$message.success", "args": ["Save successful"] }
  ],
  "catch": [
    { "call": "$message.error", "args": ["Save failed: {{ $error.message }}"] }
  ]
}
```

## Custom Response Format

If backend response format differs, modify `responseConfig`:

```typescript
// Backend format: { status: 'ok', result: {...}, message: '...' }
export const responseConfig = {
  codeField: 'status',
  dataField: 'result',
  messageField: 'message',
  successCode: 'ok'
}
```

After modification, `jsonRendererConfig.responseFormat` will automatically sync.

## File Upload

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

## Error Handling Best Practices

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
          { "call": "$message.error", "args": ["Load failed"] }
        ],
        "finally": [
          { "set": "loading", "value": false }
        ]
      }
    ]
  }
}
```
