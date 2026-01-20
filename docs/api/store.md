# Store API

Trix Admin 使用 Pinia 进行状态管理，提供以下 Store 模块。

## App Store

应用级别状态管理。

### 导入

```typescript
import { useAppStore } from '@/store/modules/app'
```

### 状态

| 属性 | 类型 | 说明 |
|------|------|------|
| `locale` | `'zh-CN' \| 'en-US'` | 当前语言 |
| `isMobile` | `boolean` | 是否移动端 |

### 方法

```typescript
const appStore = useAppStore()

// 设置语言
appStore.setLocale('en-US')

// 切换语言
appStore.toggleLocale()
```

## Auth Store

用户认证状态管理。

### 导入

```typescript
import { useAuthStore } from '@/store/modules/auth'
```

### 状态

| 属性 | 类型 | 说明 |
|------|------|------|
| `userInfo` | `object \| null` | 用户信息 |
| `permissions` | `string[]` | 权限列表 |
| `token` | `string` | 访问令牌 |

### 方法

```typescript
const authStore = useAuthStore()

// 登录
await authStore.login(username, password)

// 登出
await authStore.logout()

// 获取用户信息
await authStore.getUserInfo()

// 检查权限
authStore.hasPermission('user:write')

// 检查多个权限（或）
authStore.hasAnyPermission(['user:write', 'user:admin'])

// 检查多个权限（且）
authStore.hasAllPermissions(['user:read', 'user:write'])
```

## Theme Store

主题配置状态管理。

### 导入

```typescript
import { useThemeStore } from '@/store/modules/theme'
```

### 状态

| 属性 | 类型 | 说明 |
|------|------|------|
| `darkMode` | `boolean` | 是否深色模式 |
| `themeColor` | `string` | 主题色 |
| `themeScheme` | `'light' \| 'dark' \| 'auto'` | 主题方案 |
| `layout` | `object` | 布局配置 |
| `header` | `object` | 头部配置 |
| `sider` | `object` | 侧边栏配置 |
| `tab` | `object` | 标签页配置 |
| `footer` | `object` | 底部配置 |

### 方法

```typescript
const themeStore = useThemeStore()

// 切换深色模式
themeStore.toggleDarkMode()

// 设置主题方案
themeStore.setThemeScheme('dark')

// 设置主题色
themeStore.setThemeColor('#1890ff')

// 设置布局模式
themeStore.setLayoutMode('horizontal')

// 更新配置
themeStore.updateSettings({
  header: { breadcrumb: { visible: false } }
})

// 重置配置
themeStore.resetSettings()
```

## Tab Store

标签页状态管理。

### 导入

```typescript
import { useTabStore } from '@/store/modules/tab'
```

### 状态

| 属性 | 类型 | 说明 |
|------|------|------|
| `tabs` | `Tab[]` | 标签页列表 |
| `activeTab` | `string` | 当前激活的标签页 ID |

### 方法

```typescript
const tabStore = useTabStore()

// 添加标签页
tabStore.addTab(route)

// 关闭标签页
tabStore.closeTab(tabId)

// 关闭左侧标签页
tabStore.closeLeftTabs(tabId)

// 关闭右侧标签页
tabStore.closeRightTabs(tabId)

// 关闭其他标签页
tabStore.closeOtherTabs(tabId)

// 关闭所有标签页
tabStore.closeAllTabs()

// 设置激活标签页
tabStore.setActiveTab(tabId)

// 刷新标签页
tabStore.refreshTab(tabId)
```

## Route Store

路由和菜单状态管理。

### 导入

```typescript
import { useRouteStore } from '@/store/modules/route'
```

### 状态

| 属性 | 类型 | 说明 |
|------|------|------|
| `menus` | `Menu[]` | 菜单列表 |
| `routes` | `RouteRecordRaw[]` | 路由列表 |
| `isInitialized` | `boolean` | 是否已初始化 |

### 方法

```typescript
const routeStore = useRouteStore()

// 初始化路由
await routeStore.initRoutes()

// 重置路由
routeStore.resetRoutes()

// 获取菜单
routeStore.getMenus()
```

## 在 JSON Schema 中使用

全局状态会自动注入到 Schema：

```json
{
  "com": "NText",
  "children": "当前用户：{{ $user.nickname }}"
}
```

```json
{
  "com": "NButton",
  "if": "$permissions.includes('user:write')",
  "children": "编辑"
}
```

```json
{
  "com": "div",
  "style": {
    "background": "{{ $theme.darkMode ? '#1f1f1f' : '#ffffff' }}"
  }
}
```
