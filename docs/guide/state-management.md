# 状态管理

Trix Admin 使用 Pinia 3.x 进行状态管理，按功能模块划分 Store。

## Store 模块

```
store/
├── modules/
│   ├── app/            # 应用状态
│   ├── auth/           # 认证状态
│   ├── notification/   # 通知状态
│   ├── route/          # 路由状态
│   ├── tab/            # 标签页状态
│   └── theme/          # 主题状态
├── plugins/            # Pinia 插件
└── index.ts            # Store 入口
```

## App Store

管理应用级别的状态：

```typescript
import { useAppStore } from '@/store/modules/app'

const appStore = useAppStore()

// 当前语言
appStore.locale  // 'zh-CN' | 'en-US'

// 是否移动端
appStore.isMobile

// 切换语言
appStore.setLocale('en-US')
```

## Auth Store

管理用户认证状态：

```typescript
import { useAuthStore } from '@/store/modules/auth'

const authStore = useAuthStore()

// 用户信息
authStore.userInfo

// 权限列表
authStore.permissions

// 登录
await authStore.login(username, password)

// 登出
await authStore.logout()

// 检查权限
authStore.hasPermission('user:write')
```

## Theme Store

管理主题配置：

```typescript
import { useThemeStore } from '@/store/modules/theme'

const themeStore = useThemeStore()

// 深色模式
themeStore.darkMode

// 主题色
themeStore.themeColor

// 布局模式
themeStore.layout.mode

// 切换深色模式
themeStore.toggleDarkMode()

// 设置主题色
themeStore.setThemeColor('#1890ff')
```

## Tab Store

管理标签页状态：

```typescript
import { useTabStore } from '@/store/modules/tab'

const tabStore = useTabStore()

// 标签页列表
tabStore.tabs

// 当前标签页
tabStore.activeTab

// 添加标签页
tabStore.addTab(route)

// 关闭标签页
tabStore.closeTab(tabId)

// 关闭其他标签页
tabStore.closeOtherTabs(tabId)

// 关闭所有标签页
tabStore.closeAllTabs()
```

## Route Store

管理路由和菜单状态：

```typescript
import { useRouteStore } from '@/store/modules/route'

const routeStore = useRouteStore()

// 菜单列表
routeStore.menus

// 初始化路由
await routeStore.initRoutes()

// 重置路由
routeStore.resetRoutes()
```

## 在 JSON Schema 中使用

全局状态会自动注入到 Schema 的 data 中：

```json
{
  "data": {
    "localData": "页面数据"
  },
  "com": "div",
  "children": [
    {
      "com": "NText",
      "children": "当前用户：{{ $user.nickname }}"
    },
    {
      "com": "NText",
      "children": "当前语言：{{ $app.locale }}"
    },
    {
      "com": "NButton",
      "if": "$permissions.includes('user:write')",
      "children": "编辑"
    }
  ]
}
```

### 注入的全局状态

| 变量 | 说明 |
|------|------|
| `$app` | 应用状态（locale、isMobile） |
| `$theme` | 主题状态（darkMode、themeColor、layoutMode） |
| `$user` | 用户信息 |
| `$permissions` | 权限列表 |

## 创建自定义 Store

```typescript
// src/store/modules/custom/index.ts
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useCustomStore = defineStore('custom', () => {
  // 状态
  const count = ref(0)
  
  // 计算属性
  const doubleCount = computed(() => count.value * 2)
  
  // 方法
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

## 持久化

使用 Pinia 插件实现状态持久化：

```typescript
// src/store/plugins/index.ts
import { createPersistedState } from 'pinia-plugin-persistedstate'

export const piniaPlugins = [
  createPersistedState({
    storage: localStorage
  })
]
```

在 Store 中启用持久化：

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
