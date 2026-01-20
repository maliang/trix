# Hooks API

Composables provided by Trix Admin.

## useSchemaLoader

Hook for loading JSON Schema.

### Import

```typescript
import { useSchemaLoader } from '@/hooks'
```

### Usage

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
  onLoading: () => console.log('Loading'),
  onLoaded: (schema) => console.log('Loaded', schema),
  onError: (err) => console.error('Error', err)
})
```

### Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `source` | `Ref<string> \| string` | - | Schema source URL |
| `watchSource` | `boolean` | `false` | Watch source changes |
| `immediate` | `boolean` | `true` | Load immediately |
| `maxRetries` | `number` | `3` | Max retry count |
| `onLoading` | `() => void` | - | Loading callback |
| `onLoaded` | `(schema) => void` | - | Loaded callback |
| `onError` | `(error) => void` | - | Error callback |

### Returns

| Property | Type | Description |
|----------|------|-------------|
| `schema` | `Ref<JsonNode \| null>` | Loaded schema |
| `loading` | `Ref<boolean>` | Loading state |
| `error` | `Ref<string \| null>` | Error message |
| `retry` | `() => void` | Retry method |

## useBoolean

Boolean state management hook.

### Import

```typescript
import { useBoolean } from '@/hooks'
```

### Usage

```typescript
const { bool, setTrue, setFalse, toggle } = useBoolean(false)

setTrue()   // Set to true
setFalse()  // Set to false
toggle()    // Toggle value
```

## useLoading

Loading state management hook.

### Import

```typescript
import { useLoading } from '@/hooks'
```

### Usage

```typescript
const { loading, startLoading, endLoading } = useLoading()

startLoading()  // Start loading
endLoading()    // End loading
```

## usePermission

Permission check hook.

### Import

```typescript
import { usePermission } from '@/hooks'
```

### Usage

```typescript
const { hasPermission, hasAnyPermission, hasAllPermissions } = usePermission()

// Check single permission
if (hasPermission('user:write')) { }

// Check any permission
if (hasAnyPermission(['user:write', 'user:admin'])) { }

// Check all permissions
if (hasAllPermissions(['user:read', 'user:write'])) { }
```
