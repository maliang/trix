# Hooks API

Trix Admin 提供的组合式函数（Composables）。

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
