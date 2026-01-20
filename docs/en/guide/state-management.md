# State Management

Trix Admin uses Pinia 3.x for state management, with stores divided by functional modules.

## Store Modules

```
store/
├── modules/
│   ├── app/            # App state
│   ├── auth/           # Auth state
│   ├── notification/   # Notification state
│   ├── route/          # Route state
│   ├── tab/            # Tab state
│   └── theme/          # Theme state
├── plugins/            # Pinia plugins
└── index.ts            # Store entry
```

## App Store

Manages application-level state:

```typescript
import { useAppStore } from '@/store/modules/app'

const appStore = useAppStore()

// Current language
appStore.locale  // 'zh-CN' | 'en-US'

// Is mobile device
appStore.isMobile

// Switch language
appStore.setLocale('en-US')
```

## Auth Store

Manages user authentication state:

```typescript
import { useAuthStore } from '@/store/modules/auth'

const authStore = useAuthStore()

// User info
authStore.userInfo

// Permission list
authStore.permissions

// Login
await authStore.login(username, password)

// Logout
await authStore.logout()

// Check permission
authStore.hasPermission('user:write')
```

## Theme Store

Manages theme configuration:

```typescript
import { useThemeStore } from '@/store/modules/theme'

const themeStore = useThemeStore()

// Dark mode
themeStore.darkMode

// Theme color
themeStore.themeColor

// Layout mode
themeStore.layout.mode

// Toggle dark mode
themeStore.toggleDarkMode()

// Set theme color
themeStore.setThemeColor('#1890ff')
```

## Tab Store

Manages tab state:

```typescript
import { useTabStore } from '@/store/modules/tab'

const tabStore = useTabStore()

// Tab list
tabStore.tabs

// Active tab
tabStore.activeTab

// Add tab
tabStore.addTab(route)

// Close tab
tabStore.closeTab(tabId)

// Close other tabs
tabStore.closeOtherTabs(tabId)

// Close all tabs
tabStore.closeAllTabs()
```

## Route Store

Manages route and menu state:

```typescript
import { useRouteStore } from '@/store/modules/route'

const routeStore = useRouteStore()

// Menu list
routeStore.menus

// Initialize routes
await routeStore.initRoutes()

// Reset routes
routeStore.resetRoutes()
```

## Using in JSON Schema

Global state is automatically injected into Schema's data:

```json
{
  "data": {
    "localData": "Page data"
  },
  "com": "div",
  "children": [
    {
      "com": "NText",
      "children": "Current user: {{ $user.nickname }}"
    },
    {
      "com": "NText",
      "children": "Current language: {{ $app.locale }}"
    },
    {
      "com": "NButton",
      "if": "$permissions.includes('user:write')",
      "children": "Edit"
    }
  ]
}
```

### Injected Global State

| Variable | Description |
|----------|-------------|
| `$app` | App state (locale, isMobile) |
| `$theme` | Theme state (darkMode, themeColor, layoutMode) |
| `$user` | User info |
| `$permissions` | Permission list |

## Creating Custom Store

```typescript
// src/store/modules/custom/index.ts
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useCustomStore = defineStore('custom', () => {
  // State
  const count = ref(0)
  
  // Computed
  const doubleCount = computed(() => count.value * 2)
  
  // Methods
  function increment() {
    count.value++
  }
  
  return {
    count,
    doubleCount,
    increment
  }
})
```

## Persistence

Use Pinia plugin to implement state persistence:

```typescript
// src/store/plugins/index.ts
import { createPersistedState } from 'pinia-plugin-persistedstate'

export const piniaPlugins = [
  createPersistedState({
    storage: localStorage
  })
]
```

Enable persistence in Store:

```typescript
export const useThemeStore = defineStore('theme', () => {
  // ...
}, {
  persist: {
    key: 'theme-settings',
    paths: ['themeColor', 'darkMode', 'layout']
  }
})
```
