# JSON Renderer Configuration

JSON renderer configuration is defined in `src/config/json-renderer.ts`.

## Complete Configuration

```typescript
export const jsonRendererConfig: JsonRendererConfig = {
  // API base URL
  baseURL: import.meta.env.VITE_SERVICE_BASE_URL || '',
  
  // Response data extraction path
  responseDataPath: 'data',
  
  // API response format configuration (business status code validation)
  responseFormat: {
    codeField: 'code',      // Business status code field name
    msgField: 'msg',        // Message field name
    dataField: 'data',      // Data field name
    successCode: 0          // Business success status code
  },
  
  // Default headers
  defaultHeaders: {
    'Content-Type': 'application/json'
  },
  
  // Development mode
  devMode: import.meta.env.DEV,
  
  // Global state injection configuration
  globalState: {
    injectUser: true,
    injectPermissions: true,
    injectTheme: true,
    injectRoute: true
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

## Configuration Options

### baseURL

Base URL for API requests, automatically concatenated with `fetch` paths in JSON Schema:

```typescript
baseURL: '/api'

// fetch: '/users' → actual request /api/users
```

### responseDataPath

Response data extraction path, `$response` automatically extracts data from this path:

```typescript
responseDataPath: 'data'

// Backend returns: { code: 0, data: { list: [] }, msg: 'ok' }
// $response = { list: [] }
```

::: tip
If `responseFormat` is configured, the system prioritizes using `responseFormat.dataField` to extract data. `responseDataPath` only takes effect when the response doesn't contain a business status code.
:::

### responseFormat

API response format configuration for business status code validation and data extraction:

```typescript
responseFormat: {
  codeField: 'code',      // Business status code field, default 'code'
  msgField: 'msg',        // Message field, default 'msg'
  dataField: 'data',      // Data field, default 'data'
  successCode: 0          // Business success code, default 0
}
```

::: tip Configuration Sync
`responseFormat` is automatically mapped from `responseConfig` in `src/config/response.ts`, ensuring JSON Schema requests use the same response format validation logic as regular requests.

| responseConfig | responseFormat | Description |
|----------------|----------------|-------------|
| `codeField` | `codeField` | Business status code field |
| `messageField` | `msgField` | Message field (note different field names) |
| `dataField` | `dataField` | Data field |
| `successCode` | `successCode` | Success status code |

After modifying `responseConfig`, `responseFormat` will automatically sync.
:::

#### Business Status Code Validation

When API returns a business status code not equal to `successCode`:
- Automatically triggers `catch` callback
- Error message is extracted from `msgField` field
- `$error.message` contains the error message

```json
{
  "fetch": "/api/user",
  "then": [
    { "set": "user", "value": "{{ $response }}" }
  ],
  "catch": [
    { "call": "$message.error", "args": ["{{ $error.message }}"] }
  ]
}
```

#### Custom Response Format

If backend response format differs, modify `responseFormat`:

```typescript
// Backend format: { status: 200, result: {...}, message: '...' }
responseFormat: {
  codeField: 'status',
  msgField: 'message',
  dataField: 'result',
  successCode: 200
}

// Support multiple success codes
responseFormat: {
  successCode: [0, 200]  // Both 0 and 200 indicate success
}
```

### globalState

Control global state injection into Schema:

```typescript
globalState: {
  injectUser: true,        // Inject $user
  injectPermissions: true, // Inject $permissions
  injectTheme: true,       // Inject $theme
  injectRoute: true        // Inject $route
}
```

### withToken

Whether to automatically attach token in request headers:

```typescript
withToken: true
tokenHeaderName: 'Authorization'
tokenPrefix: 'Bearer '

// Request header: Authorization: Bearer xxx
```

## Plugin Initialization

Initialize in `src/plugins/json-renderer.ts`:

```typescript
import { createVSchemaPlugin } from '@maliang47/vschema'

export function setupJsonRenderer(app: App): void {
  const plugin = createVSchemaPlugin({
    baseURL: jsonRendererConfig.baseURL,
    responseDataPath: jsonRendererConfig.responseDataPath,
    defaultHeaders: jsonRendererConfig.defaultHeaders,
    // API response format configuration
    responseFormat: jsonRendererConfig.responseFormat,
    
    // Request interceptor
    requestInterceptor: (config) => {
      if (jsonRendererConfig.withToken) {
        const token = localStg.get('token')
        if (token) {
          config.headers[jsonRendererConfig.tokenHeaderName] = 
            `${jsonRendererConfig.tokenPrefix}${token}`
        }
      }
      return config
    },
    
    // Register components
    components: getAllComponents()
  })
  
  app.use(plugin)
}
```

## Component Registration

### NaiveUI Components

```typescript
export const naiveUIComponentNames = [
  'NButton',
  'NInput',
  'NSelect',
  'NDataTable',
  // ...
]
```

### Custom Components

```typescript
export const customComponents = {
  SvgIcon,
  ButtonIcon,
  VueECharts,
  IconPicker,
  // ...
}
```

### Get All Components

```typescript
export function getAllComponents() {
  return {
    ...getNaiveUIComponents(),
    ...customComponents
  }
}
```

## Adding Custom Components

1. Create component file
2. Import and register in `json-renderer.ts`

```typescript
// Import component
import MyComponent from '@/components/custom/MyComponent.vue'

// Add to customComponents
export const customComponents = {
  // ...
  MyComponent
}
```

3. Use in JSON Schema

```json
{
  "com": "MyComponent",
  "props": { "title": "Title" }
}
```

## Custom Configuration

```typescript
import { createJsonRendererConfig } from '@/config/json-renderer'

// Create custom configuration
const customConfig = createJsonRendererConfig({
  baseURL: '/custom-api',
  timeout: 60000,
  defaultHeaders: {
    'X-Custom-Header': 'value'
  }
})
```

## Environment-specific Configuration

```typescript
export function getJsonRendererConfig(): JsonRendererConfig {
  const env = import.meta.env.MODE
  
  if (env === 'production') {
    return {
      ...jsonRendererConfig,
      devMode: false,
      baseURL: 'https://api.example.com'
    }
  }
  
  return jsonRendererConfig
}
```

## Debug Mode

Use SchemaEditor component in development mode:

```json
{
  "com": "SchemaEditor",
  "if": "{{ import.meta.env.DEV }}",
  "props": {
    "schema": "{{ currentSchema }}"
  }
}
```
