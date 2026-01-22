# Hooks API

Composables provided by Trix Admin.

## useSchemaMethods

Schema built-in methods hook, providing navigation, tab, and window methods that can be called in JSON Schema.

### Import

```typescript
import { useSchemaMethods } from '@/hooks'
```

### Usage

```typescript
const { $nav, $tab, $window, schemaMethods } = useSchemaMethods()

// Use in DynamicPage
<VSchema :schema="schema" :methods="schemaMethods" />
```

### Returns

#### $nav - Navigation Methods

| Method | Parameters | Description |
|--------|------------|-------------|
| `push` | `path: string \| object` | Navigate to specified path |
| `replace` | `path: string \| object` | Replace current page (no history) |
| `back` | `delta?: number` | Go back, default 1 step |
| `forward` | `delta?: number` | Go forward, default 1 step |

#### $tab - Tab Methods

| Method | Parameters | Description |
|--------|------------|-------------|
| `close` | `tabId?: string` | Close tab, default current tab |
| `closeAndGo` | `path?: string` | Close current tab and navigate |
| `closeOthers` | `tabId?: string` | Close other tabs |
| `closeLeft` | `tabId?: string` | Close tabs on the left |
| `closeRight` | `tabId?: string` | Close tabs on the right |
| `open` | `path: string, title?: string` | Open new tab and navigate |
| `openIframe` | `url: string, title: string` | Open iframe tab |
| `refresh` | - | Refresh current tab |
| `fix` | `tabId?: string` | Pin tab |
| `unfix` | `tabId?: string` | Unpin tab |
| `isFixed` | `tabId?: string` | Check if tab is pinned |

#### $window - Window Methods

| Method | Parameters | Description |
|--------|------------|-------------|
| `open` | `url: string, target?: string, features?: string` | Open URL in new window |
| `close` | - | Close current window |
| `print` | - | Print current page |

### Usage in Schema

Access these built-in methods via `$methods`:

```json
{
  "com": "NButton",
  "events": {
    "click": { "call": "$methods.$nav.push", "args": ["/user/profile"] }
  },
  "children": "Go to Profile"
}
```

```json
{
  "com": "NButton",
  "events": {
    "click": { "call": "$methods.$tab.close" }
  },
  "children": "Close Current Tab"
}
```

```json
{
  "com": "NButton",
  "events": {
    "click": { "call": "$methods.$window.open", "args": ["https://example.com"] }
  },
  "children": "Open New Window"
}
```

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
  errorStatus,
  retryCount,
  maxRetries,
  retry
} = useSchemaLoader({
  source: '/mock/schema/page.json',
  watchSource: true,
  immediate: true,
  requireSource: true,
  missingSourceMessage: 'Schema source not configured',
  maxRetries: 3,
  initialLoading: true,
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
| `requireSource` | `Ref<boolean> \| boolean` | `true` | Whether source is required |
| `missingSourceMessage` | `string` | - | Error message when source is missing |
| `maxRetries` | `number` | `3` | Max retry count |
| `initialLoading` | `boolean` | `true` | Initial loading state |
| `onLoading` | `() => void` | - | Loading callback |
| `onLoaded` | `(schema) => void` | - | Loaded callback |
| `onError` | `(error) => void` | - | Error callback |

### Returns

| Property | Type | Description |
|----------|------|-------------|
| `schema` | `Ref<JsonNode \| null>` | Loaded schema |
| `loading` | `Ref<boolean>` | Loading state |
| `error` | `Ref<string \| null>` | Error message |
| `errorStatus` | `Ref<number \| null>` | HTTP error status code |
| `retryCount` | `Ref<number>` | Current retry count |
| `maxRetries` | `number` | Max retry count |
| `retry` | `() => void` | Retry method |

## useBoolean

Boolean state management hook.

### Import

```typescript
import { useBoolean } from '@/hooks'
```

### Usage

```typescript
const { bool, setTrue, setFalse, toggle, set } = useBoolean(false)

setTrue()   // Set to true
setFalse()  // Set to false
toggle()    // Toggle value
set(true)   // Set specific value
```

### Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `initialValue` | `boolean` | `false` | Initial value |

### Returns

| Property | Type | Description |
|----------|------|-------------|
| `bool` | `Ref<boolean>` | Boolean value |
| `setTrue` | `() => void` | Set to true |
| `setFalse` | `() => void` | Set to false |
| `toggle` | `() => void` | Toggle value |
| `set` | `(value: boolean) => void` | Set specific value |

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

// With delay
const { loading, startLoading, endLoading } = useLoading(true, 300)
```

### Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `initialValue` | `boolean` | `false` | Initial value |
| `delay` | `number` | `0` | Delay time (milliseconds) |

### Returns

| Property | Type | Description |
|----------|------|-------------|
| `loading` | `Ref<boolean>` | Loading state |
| `startLoading` | `() => void` | Start loading |
| `endLoading` | `() => void` | End loading |

## useContext

Context hook.

### Import

```typescript
import { useContext } from '@/hooks'
```

### Usage

```typescript
const { isMobile, locale, darkMode } = useContext()
```

### Returns

| Property | Type | Description |
|----------|------|-------------|
| `isMobile` | `ComputedRef<boolean>` | Is mobile device |
| `locale` | `ComputedRef<string>` | Current locale |
| `darkMode` | `ComputedRef<boolean>` | Is dark mode |

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

### Returns

| Method | Parameters | Returns | Description |
|--------|------------|---------|-------------|
| `hasPermission` | `string` | `boolean` | Check single permission |
| `hasAnyPermission` | `string[]` | `boolean` | Check any permission |
| `hasAllPermissions` | `string[]` | `boolean` | Check all permissions |
