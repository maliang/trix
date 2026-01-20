# JSON 渲染器配置

JSON 渲染器配置定义在 `src/config/json-renderer.ts` 中。

## 完整配置

```typescript
export const jsonRendererConfig: JsonRendererConfig = {
  // API 基础 URL
  baseURL: import.meta.env.VITE_SERVICE_BASE_URL || '',
  
  // 响应数据提取路径
  responseDataPath: 'data',
  
  // API 响应格式配置（业务状态码判断）
  responseFormat: {
    codeField: 'code',      // 业务状态码字段名
    msgField: 'msg',        // 消息字段名
    dataField: 'data',      // 数据字段名
    successCode: 0          // 业务成功状态码
  },
  
  // 默认请求头
  defaultHeaders: {
    'Content-Type': 'application/json'
  },
  
  // 开发模式
  devMode: import.meta.env.DEV,
  
  // 全局状态注入配置
  globalState: {
    injectUser: true,
    injectPermissions: true,
    injectTheme: true,
    injectRoute: true
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

## 配置说明

### baseURL

API 请求的基础 URL，JSON Schema 中的 `fetch` 会自动拼接：

```typescript
baseURL: '/api'

// fetch: '/users' → 实际请求 /api/users
```

### responseDataPath

响应数据提取路径，`$response` 会自动提取该路径的数据：

```typescript
responseDataPath: 'data'

// 后端返回：{ code: 0, data: { list: [] }, msg: 'ok' }
// $response = { list: [] }
```

::: tip 提示
如果配置了 `responseFormat`，系统会优先使用 `responseFormat.dataField` 提取数据，`responseDataPath` 仅在响应中不包含业务状态码时生效。
:::

### responseFormat

API 响应格式配置，用于业务状态码判断和数据提取：

```typescript
responseFormat: {
  codeField: 'code',      // 业务状态码字段名，默认 'code'
  msgField: 'msg',        // 消息字段名，默认 'msg'
  dataField: 'data',      // 数据字段名，默认 'data'
  successCode: 0          // 业务成功状态码，默认 0
}
```

::: tip 配置同步
`responseFormat` 从 `src/config/response.ts` 中的 `responseConfig` 自动映射，确保 JSON Schema 请求与普通请求使用相同的响应格式判断逻辑。

| responseConfig | responseFormat | 说明 |
|----------------|----------------|------|
| `codeField` | `codeField` | 业务状态码字段 |
| `messageField` | `msgField` | 消息字段（注意字段名不同） |
| `dataField` | `dataField` | 数据字段 |
| `successCode` | `successCode` | 成功状态码 |

修改 `responseConfig` 后，`responseFormat` 会自动同步更新。
:::

#### 业务状态码判断

当 API 返回的业务状态码不等于 `successCode` 时：
- 自动触发 `catch` 回调
- 错误信息从 `msgField` 字段提取
- `$error.message` 包含错误消息

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

#### 自定义响应格式

如果后端响应格式不同，修改 `responseFormat`：

```typescript
// 后端返回格式：{ status: 200, result: {...}, message: '...' }
responseFormat: {
  codeField: 'status',
  msgField: 'message',
  dataField: 'result',
  successCode: 200
}

// 支持多个成功码
responseFormat: {
  successCode: [0, 200]  // 0 和 200 都表示成功
}
```

### globalState

控制注入到 Schema 的全局状态：

```typescript
globalState: {
  injectUser: true,        // 注入 $user
  injectPermissions: true, // 注入 $permissions
  injectTheme: true,       // 注入 $theme
  injectRoute: true        // 注入 $route
}
```

### withToken

是否自动在请求头中携带 token：

```typescript
withToken: true
tokenHeaderName: 'Authorization'
tokenPrefix: 'Bearer '

// 请求头：Authorization: Bearer xxx
```

## 插件初始化

在 `src/plugins/json-renderer.ts` 中初始化：

```typescript
import { createVSchemaPlugin } from '@maliang47/vschema'

export function setupJsonRenderer(app: App): void {
  const plugin = createVSchemaPlugin({
    baseURL: jsonRendererConfig.baseURL,
    responseDataPath: jsonRendererConfig.responseDataPath,
    defaultHeaders: jsonRendererConfig.defaultHeaders,
    // API 响应格式配置
    responseFormat: jsonRendererConfig.responseFormat,
    
    // 请求拦截器
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
    
    // 注册组件
    components: getAllComponents()
  })
  
  app.use(plugin)
}
```
```

## 组件注册

### NaiveUI 组件

```typescript
export const naiveUIComponentNames = [
  'NButton',
  'NInput',
  'NSelect',
  'NDataTable',
  // ...
]
```

### 自定义组件

```typescript
export const customComponents = {
  SvgIcon,
  ButtonIcon,
  VueECharts,
  IconPicker,
  // ...
}
```

### 获取所有组件

```typescript
export function getAllComponents() {
  return {
    ...getNaiveUIComponents(),
    ...customComponents
  }
}
```

## 添加自定义组件

1. 创建组件文件
2. 在 `json-renderer.ts` 中导入并注册

```typescript
// 导入组件
import MyComponent from '@/components/custom/MyComponent.vue'

// 添加到 customComponents
export const customComponents = {
  // ...
  MyComponent
}
```

3. 在 JSON Schema 中使用

```json
{
  "com": "MyComponent",
  "props": { "title": "标题" }
}
```

## 自定义配置

```typescript
import { createJsonRendererConfig } from '@/config/json-renderer'

// 创建自定义配置
const customConfig = createJsonRendererConfig({
  baseURL: '/custom-api',
  timeout: 60000,
  defaultHeaders: {
    'X-Custom-Header': 'value'
  }
})
```

## 环境差异配置

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

## 调试模式

开发模式下可以使用 SchemaEditor 组件：

```json
{
  "com": "SchemaEditor",
  "if": "{{ import.meta.env.DEV }}",
  "props": {
    "schema": "{{ currentSchema }}"
  }
}
```
