# 工具函数 API

Trix Admin 提供的工具函数。

## Storage

本地存储工具，支持类型安全。

### 导入

```typescript
import { localStg, sessionStg } from '@/utils/storage'
```

### localStorage

```typescript
// 设置
localStg.set('token', 'xxx')
localStg.set('user', { id: 1, name: '张三' })

// 获取
const token = localStg.get('token')
const user = localStg.get('user')

// 删除
localStg.remove('token')

// 清空
localStg.clear()
```

### sessionStorage

```typescript
// 设置
sessionStg.set('tempData', { foo: 'bar' })

// 获取
const data = sessionStg.get('tempData')

// 删除
sessionStg.remove('tempData')
```

### 类型定义

在 `src/typings/storage.d.ts` 中定义存储类型：

```typescript
interface StorageData {
  token: string
  userInfo: {
    id: number
    name: string
    avatar: string
  }
  themeSettings: App.Theme.ThemeSetting
}
```

## Common

通用工具函数。

### 导入

```typescript
import { toggleHtmlClass, deepClone, debounce, throttle } from '@/utils/common'
```

### toggleHtmlClass

切换 HTML 元素的 class：

```typescript
const { add, remove } = toggleHtmlClass('dark')

// 添加 class
add()

// 移除 class
remove()
```

### deepClone

深拷贝对象：

```typescript
const original = { a: 1, b: { c: 2 } }
const cloned = deepClone(original)
```

### debounce

防抖函数：

```typescript
const debouncedFn = debounce(() => {
  console.log('执行')
}, 300)

// 多次调用只执行最后一次
debouncedFn()
debouncedFn()
debouncedFn()
```

### throttle

节流函数：

```typescript
const throttledFn = throttle(() => {
  console.log('执行')
}, 300)

// 300ms 内只执行一次
throttledFn()
throttledFn()
```

## Service

服务相关工具。

### 导入

```typescript
import { getToken, setToken, removeToken } from '@/utils/service'
```

### Token 管理

```typescript
// 设置 token
setToken('xxx')

// 获取 token
const token = getToken()

// 移除 token
removeToken()
```

## 颜色工具

颜色处理工具（来自 @trix/color）。

### 导入

```typescript
import { 
  getColorPalette, 
  getPaletteColorByNumber,
  addColorAlpha,
  getRgb 
} from '@trix/color'
```

### getColorPalette

生成颜色调色板：

```typescript
const palette = getColorPalette('#1890ff')
// Map { 50 => '#e6f7ff', 100 => '#bae7ff', ... }
```

### getPaletteColorByNumber

获取调色板中指定编号的颜色：

```typescript
const color = getPaletteColorByNumber('#1890ff', 500)
// '#1890ff'
```

### addColorAlpha

添加透明度：

```typescript
const colorWithAlpha = addColorAlpha('#1890ff', 0.5)
// 'rgba(24, 144, 255, 0.5)'
```

### getRgb

获取 RGB 值：

```typescript
const { r, g, b } = getRgb('#1890ff')
// { r: 24, g: 144, b: 255 }
```

## 日期工具

日期处理使用 dayjs。

### 导入

```typescript
import dayjs from 'dayjs'
```

### 常用操作

```typescript
// 格式化
dayjs().format('YYYY-MM-DD HH:mm:ss')

// 解析
dayjs('2024-01-01')

// 相对时间
dayjs('2024-01-01').fromNow()

// 比较
dayjs('2024-01-01').isBefore('2024-02-01')

// 加减
dayjs().add(1, 'day')
dayjs().subtract(1, 'month')
```

## 类型工具

### 导入

```typescript
import type { Nullable, Recordable } from '@/typings/global'
```

### 类型定义

```typescript
// 可空类型
type Nullable<T> = T | null

// 记录类型
type Recordable<T = any> = Record<string, T>

// 深度部分类型
type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P]
}
```
