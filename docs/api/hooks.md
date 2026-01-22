# Hooks API

Trix Admin 提供的组合式函数（Composables）。

## useSchemaMethods

Schema 内置方法 Hook，提供可在 JSON Schema 中调用的导航、标签页、窗口等方法。

### 导入

```typescript
import { useSchemaMethods } from '@/hooks'
```

### 用法

```typescript
const { $nav, $tab, $window, schemaMethods } = useSchemaMethods()

// 在 DynamicPage 中使用
<VSchema :schema="schema" :methods="schemaMethods" />
```

### 返回值

#### $nav - 导航方法

| 方法 | 参数 | 说明 |
|------|------|------|
| `push` | `path: string \| object` | 跳转到指定路径 |
| `replace` | `path: string \| object` | 替换当前页面（不产生历史记录） |
| `back` | `delta?: number` | 返回上一页，默认 1 步 |
| `forward` | `delta?: number` | 前进，默认 1 步 |

#### $tab - 标签页方法

| 方法 | 参数 | 说明 |
|------|------|------|
| `close` | `tabId?: string` | 关闭标签页，默认关闭当前标签 |
| `closeAndGo` | `path?: string` | 关闭当前标签并跳转到指定页面 |
| `closeOthers` | `tabId?: string` | 关闭其他标签页 |
| `closeLeft` | `tabId?: string` | 关闭左侧标签页 |
| `closeRight` | `tabId?: string` | 关闭右侧标签页 |
| `open` | `path: string, title?: string` | 新建标签页并跳转 |
| `openIframe` | `url: string, title: string` | 新建 iframe 标签页 |
| `refresh` | - | 刷新当前标签页 |
| `fix` | `tabId?: string` | 固定标签页 |
| `unfix` | `tabId?: string` | 取消固定标签页 |
| `isFixed` | `tabId?: string` | 判断标签页是否固定 |

#### $window - 窗口方法

| 方法 | 参数 | 说明 |
|------|------|------|
| `open` | `url: string, target?: string, features?: string` | 在新窗口打开 URL |
| `close` | - | 关闭当前窗口 |
| `print` | - | 打印当前页面 |

### 在 Schema 中使用

通过 `$methods` 访问这些内置方法：

```json
{
  "com": "NButton",
  "events": {
    "click": { "call": "$methods.$nav.push", "args": ["/user/profile"] }
  },
  "children": "跳转到个人资料"
}
```

```json
{
  "com": "NButton",
  "events": {
    "click": { "call": "$methods.$tab.close" }
  },
  "children": "关闭当前标签"
}
```

```json
{
  "com": "NButton",
  "events": {
    "click": { "call": "$methods.$window.open", "args": ["https://example.com"] }
  },
  "children": "打开新窗口"
}
```

## useSchemaLoader

加载 JSON Schema 的 Hook。

### 导入

```typescript
import { useSchemaLoader } from '@/hooks'
```

### 用法

```typescript
const {
  schema,
  loading,
  error,
  retryCount,
  maxRetries,
  retry
} = useSchemaLoader({
  source: '/mock/schema/page.json',
  watchSource: true,
  immediate: true,
  maxRetries: 3,
  onLoading: () => console.log('加载中'),
  onLoaded: (schema) => console.log('加载完成', schema),
  onError: (err) => console.error('加载失败', err)
})
```

### 参数

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `source` | `Ref<string> \| string` | - | Schema 来源 URL |
| `watchSource` | `boolean` | `false` | 是否监听 source 变化 |
| `immediate` | `boolean` | `true` | 是否立即加载 |
| `requireSource` | `Ref<boolean> \| boolean` | `true` | 是否必须有 source |
| `missingSourceMessage` | `string` | - | source 缺失时的错误信息 |
| `maxRetries` | `number` | `3` | 最大重试次数 |
| `initialLoading` | `boolean` | `true` | 初始加载状态 |
| `onLoading` | `() => void` | - | 开始加载回调 |
| `onLoaded` | `(schema) => void` | - | 加载完成回调 |
| `onError` | `(error) => void` | - | 加载失败回调 |

### 返回值

| 属性 | 类型 | 说明 |
|------|------|------|
| `schema` | `Ref<JsonNode \| null>` | 加载的 Schema |
| `loading` | `Ref<boolean>` | 加载状态 |
| `error` | `Ref<string \| null>` | 错误信息 |
| `retryCount` | `Ref<number>` | 当前重试次数 |
| `maxRetries` | `number` | 最大重试次数 |
| `retry` | `() => void` | 重试方法 |

## useBoolean

布尔值状态管理 Hook。

### 导入

```typescript
import { useBoolean } from '@/hooks'
```

### 用法

```typescript
const { bool, setTrue, setFalse, toggle } = useBoolean(false)

// 设置为 true
setTrue()

// 设置为 false
setFalse()

// 切换
toggle()
```

### 参数

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `initialValue` | `boolean` | `false` | 初始值 |

### 返回值

| 属性 | 类型 | 说明 |
|------|------|------|
| `bool` | `Ref<boolean>` | 布尔值 |
| `setTrue` | `() => void` | 设置为 true |
| `setFalse` | `() => void` | 设置为 false |
| `toggle` | `() => void` | 切换值 |
| `set` | `(value: boolean) => void` | 设置值 |

## useLoading

加载状态管理 Hook。

### 导入

```typescript
import { useLoading } from '@/hooks'
```

### 用法

```typescript
const { loading, startLoading, endLoading } = useLoading()

// 开始加载
startLoading()

// 结束加载
endLoading()

// 带延迟的加载
const { loading, startLoading, endLoading } = useLoading(true, 300)
```

### 参数

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `initialValue` | `boolean` | `false` | 初始值 |
| `delay` | `number` | `0` | 延迟时间（毫秒） |

### 返回值

| 属性 | 类型 | 说明 |
|------|------|------|
| `loading` | `Ref<boolean>` | 加载状态 |
| `startLoading` | `() => void` | 开始加载 |
| `endLoading` | `() => void` | 结束加载 |

## useContext

获取上下文 Hook。

### 导入

```typescript
import { useContext } from '@/hooks'
```

### 用法

```typescript
const { isMobile, locale, darkMode } = useContext()
```

### 返回值

| 属性 | 类型 | 说明 |
|------|------|------|
| `isMobile` | `ComputedRef<boolean>` | 是否移动端 |
| `locale` | `ComputedRef<string>` | 当前语言 |
| `darkMode` | `ComputedRef<boolean>` | 是否深色模式 |

## usePermission

权限检查 Hook。

### 导入

```typescript
import { usePermission } from '@/hooks'
```

### 用法

```typescript
const { hasPermission, hasAnyPermission, hasAllPermissions } = usePermission()

// 检查单个权限
if (hasPermission('user:write')) {
  // ...
}

// 检查任一权限
if (hasAnyPermission(['user:write', 'user:admin'])) {
  // ...
}

// 检查所有权限
if (hasAllPermissions(['user:read', 'user:write'])) {
  // ...
}
```

### 返回值

| 方法 | 参数 | 返回值 | 说明 |
|------|------|--------|------|
| `hasPermission` | `string` | `boolean` | 检查单个权限 |
| `hasAnyPermission` | `string[]` | `boolean` | 检查任一权限 |
| `hasAllPermissions` | `string[]` | `boolean` | 检查所有权限 |
