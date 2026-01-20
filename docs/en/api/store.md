# Store API

Trix Admin uses Pinia for state management, providing the following Store modules.

## App Store

Application-level state management.

### Import

```typescript
import { useAppStore } from '@/store/modules/app'
```

### State

| Property | Type | Description |
|----------|------|-------------|
| `locale` | `'zh-CN' \| 'en-US'` | Current language |
| `isMobile` | `boolean` | Whether mobile device |

### Methods

```typescript
const appStore = useAppStore()

// Set language
appStore.setLocale('en-US')

// Toggle language
appStore.toggleLocale()
```

## Auth Store

User authentication state management.

### Import

```typescript
import { useAuthStore } from '@/store/modules/auth'
```

### State

| Property | Type | Description |
|----------|------|-------------|
| `userInfo` | `object \| null` | User information |
| `permissions` | `string[]` | Permission list |
| `token` | `string` | Access token |

### Methods

```typescript
const authStore = useAuthStore()

// Login
await authStore.login(username, password)

// Logout
await authStore.logout()

// Get user info
await authStore.getUserInfo()

// Check permission
authStore.hasPermission('user:write')

// Check any permission (OR)
authStore.hasAnyPermission(['user:write', 'user:admin'])

// Check all permissions (AND)
authStore.hasAllPermissions(['user:read', 'user:write'])
```

## Theme Store

Theme configuration state management.

### Import

```typescript
import { useThemeStore } from '@/store/modules/theme'
```

### State

| Property | Type | Description |
|----------|------|-------------|
| `darkMode` | `boolean` | Whether dark mode |
| `themeColor` | `string` | Theme color |
| `themeScheme` | `'light' \| 'dark' \| 'auto'` | Theme scheme |
| `layout` | `object` | Layout configuration |


### Methods

```typescript
const themeStore = useThemeStore()

// Toggle dark mode
themeStore.toggleDarkMode()

// Set theme scheme
themeStore.setThemeScheme('dark')

// Set theme color
themeStore.setThemeColor('#1890ff')

// Set layout mode
themeStore.setLayoutMode('horizontal')

// Update settings
themeStore.updateSettings({
  header: { breadcrumb: { visible: false } }
})

// Reset settings
themeStore.resetSettings()
```

## Tab Store

Tab state management.

### Import

```typescript
import { useTabStore } from '@/store/modules/tab'
```

### State

| Property | Type | Description |
|----------|------|-------------|
| `tabs` | `Tab[]` | Tab list |
| `activeTab` | `string` | Active tab ID |

### Methods

```typescript
const tabStore = useTabStore()

// Add tab
tabStore.addTab(route)

// Close tab
tabStore.closeTab(tabId)

// Close left tabs
tabStore.closeLeftTabs(tabId)

// Close right tabs
tabStore.closeRightTabs(tabId)

// Close other tabs
tabStore.closeOtherTabs(tabId)

// Close all tabs
tabStore.closeAllTabs()

// Set active tab
tabStore.setActiveTab(tabId)

// Refresh tab
tabStore.refreshTab(tabId)
```

## Route Store

Route and menu state management.

### Import

```typescript
import { useRouteStore } from '@/store/modules/route'
```

### State

| Property | Type | Description |
|----------|------|-------------|
| `menus` | `Menu[]` | Menu list |
| `routes` | `RouteRecordRaw[]` | Route list |
| `isInitialized` | `boolean` | Whether initialized |

### Methods

```typescript
const routeStore = useRouteStore()

// Initialize routes
await routeStore.initRoutes()

// Reset routes
routeStore.resetRoutes()

// Get menus
routeStore.getMenus()
```

## Using in JSON Schema

Global state is automatically injected into Schema:

```json
{
  "com": "NText",
  "children": "Current user: {{ $user.nickname }}"
}
```

```json
{
  "com": "NButton",
  "if": "$permissions.includes('user:write')",
  "children": "Edit"
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
