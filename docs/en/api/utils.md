# Utilities API

Utility functions provided by Trix Admin.

## Storage

Local storage utilities with type safety.

### Import

```typescript
import { localStg, sessionStg } from '@/utils/storage'
```

### localStorage

```typescript
// Set
localStg.set('token', 'xxx')
localStg.set('user', { id: 1, name: 'John' })

// Get
const token = localStg.get('token')
const user = localStg.get('user')

// Remove
localStg.remove('token')

// Clear
localStg.clear()
```

### sessionStorage

```typescript
// Set
sessionStg.set('tempData', { foo: 'bar' })

// Get
const data = sessionStg.get('tempData')

// Remove
sessionStg.remove('tempData')
```

## Common

Common utility functions.

### Import

```typescript
import { toggleHtmlClass, deepClone, debounce, throttle } from '@/utils/common'
```

### toggleHtmlClass

Toggle HTML element class:

```typescript
const { add, remove } = toggleHtmlClass('dark')

add()     // Add class
remove()  // Remove class
```

### deepClone

Deep clone object:

```typescript
const original = { a: 1, b: { c: 2 } }
const cloned = deepClone(original)
```

### debounce

Debounce function:

```typescript
const debouncedFn = debounce(() => {
  console.log('Executed')
}, 300)
```

### throttle

Throttle function:

```typescript
const throttledFn = throttle(() => {
  console.log('Executed')
}, 300)
```

## Service

Service-related utilities.

### Import

```typescript
import { getToken, setToken, removeToken } from '@/utils/service'
```

### Token Management

```typescript
setToken('xxx')           // Set token
const token = getToken()  // Get token
removeToken()             // Remove token
```

## Color Utilities

Color processing utilities (from @trix/color).

### Import

```typescript
import { 
  getColorPalette, 
  getPaletteColorByNumber,
  addColorAlpha,
  getRgb 
} from '@trix/color'
```

### getColorPalette

Generate color palette:

```typescript
const palette = getColorPalette('#1890ff')
// Map { 50 => '#e6f7ff', 100 => '#bae7ff', ... }
```

### addColorAlpha

Add transparency:

```typescript
const colorWithAlpha = addColorAlpha('#1890ff', 0.5)
// 'rgba(24, 144, 255, 0.5)'
```

## Date Utilities

Date processing uses dayjs.

### Import

```typescript
import dayjs from 'dayjs'
```

### Common Operations

```typescript
// Format
dayjs().format('YYYY-MM-DD HH:mm:ss')

// Parse
dayjs('2024-01-01')

// Relative time
dayjs('2024-01-01').fromNow()

// Compare
dayjs('2024-01-01').isBefore('2024-02-01')

// Add/Subtract
dayjs().add(1, 'day')
dayjs().subtract(1, 'month')
```
