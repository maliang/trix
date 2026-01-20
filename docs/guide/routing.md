# 路由系统

Trix Admin 基于 Vue Router 4 构建路由系统，支持静态路由和动态路由两种模式。

## 路由类型

### 静态路由

在 `src/router/routes/index.ts` 中定义，应用启动时即注册：

```typescript
export const staticRoutes: RouteRecordRaw[] = [
  // 静态路由配置
]
```

### 内置路由

系统内置的页面路由，如登录、403、404、500 等：

```typescript
export const builtinRoutes: RouteRecordRaw[] = [
  {
    path: '/login',
    component: LayoutWrapper,
    children: [
      {
        path: '',
        name: 'login',
        component: LoginPage,
        meta: {
          title: '登录',
          requiresAuth: false,
          layoutType: 'blank'
        }
      }
    ]
  }
]
```

### 动态路由

业务页面路由，使用 JSON Schema 渲染：

```typescript
export const dynamicRoutes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'root',
    component: LayoutWrapper,
    redirect: '/home',
    children: [
      {
        path: 'home',
        name: 'home',
        component: createDynamicPage('home'),
        meta: {
          title: '首页',
          icon: 'mdi:home',
          schemaSource: '/mock/schema/dashboard.json'
        }
      }
    ]
  }
]
```

## 路由 Meta 配置

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `title` | `string` | - | 页面标题，显示在标签页和面包屑 |
| `icon` | `string` | - | 菜单图标，支持 Iconify 图标 |
| `requiresAuth` | `boolean` | `true` | 是否需要登录 |
| `layoutType` | `'normal' \| 'blank'` | `'normal'` | 布局类型 |
| `useJsonRenderer` | `boolean` | `false` | 是否使用 JSON 渲染 |
| `schemaSource` | `string` | - | JSON Schema 文件路径 |
| `hideInMenu` | `boolean` | `false` | 是否在菜单中隐藏 |
| `order` | `number` | `0` | 菜单排序，数字越小越靠前 |
| `isDefaultAfterLogin` | `boolean` | `false` | 是否为登录后默认页面 |
| `i18nKey` | `string` | - | 国际化 key |
| `permissions` | `string[]` | - | 所需权限 |

## 创建动态页面

使用 `createDynamicPage` 函数创建具有唯一名称的动态页面组件：

```typescript
import { defineComponent, h } from 'vue'
import DynamicPageComponent from '@/components/json/DynamicPage.vue'

function createDynamicPage(name: string) {
  return defineComponent({
    name,  // 用于 KeepAlive 缓存识别
    render() {
      return h(DynamicPageComponent)
    }
  })
}
```

## 嵌套路由

支持多级嵌套路由：

```typescript
{
  path: 'system',
  name: 'system',
  redirect: '/system/user',
  meta: {
    title: '系统管理',
    icon: 'mdi:cog',
    order: 100
  },
  children: [
    {
      path: 'user',
      name: 'system-user',
      component: createDynamicPage('system-user'),
      meta: {
        title: '用户管理',
        icon: 'mdi:account-group',
        schemaSource: '/mock/schema/system/user-list.json'
      }
    },
    {
      path: 'role',
      name: 'system-role',
      component: createDynamicPage('system-role'),
      meta: {
        title: '角色管理',
        icon: 'mdi:account-key',
        schemaSource: '/mock/schema/system/role-list.json'
      }
    }
  ]
}
```

## 路由守卫

路由守卫在 `src/router/guard.ts` 中配置：

```typescript
router.beforeEach(async (to, from, next) => {
  // 开始进度条
  NProgress.start()
  
  // 检查是否需要登录
  if (to.meta.requiresAuth) {
    const token = getToken()
    if (!token) {
      next({ path: '/login', query: { redirect: to.fullPath } })
      return
    }
  }
  
  // 检查权限
  if (to.meta.permissions) {
    const hasPermission = checkPermission(to.meta.permissions)
    if (!hasPermission) {
      next('/403')
      return
    }
  }
  
  next()
})

router.afterEach(() => {
  // 结束进度条
  NProgress.done()
})
```

## 动态菜单

菜单数据可以从后端 API 获取：

```typescript
// .env 配置
VITE_MENU_ROUTE_URL=/mock/api/menus.json
```

菜单数据格式：

```json
[
  {
    "path": "/home",
    "name": "home",
    "meta": {
      "title": "首页",
      "icon": "mdi:home",
      "order": 1
    }
  },
  {
    "path": "/system",
    "name": "system",
    "meta": {
      "title": "系统管理",
      "icon": "mdi:cog"
    },
    "children": [
      {
        "path": "/system/user",
        "name": "system-user",
        "meta": {
          "title": "用户管理",
          "schemaSource": "/mock/schema/system/user-list.json"
        }
      }
    ]
  }
]
```

## 编程式导航

在 JSON Schema 中使用路由导航：

```json
{
  "com": "NButton",
  "events": {
    "click": { "call": "$router.push", "args": ["/system/user"] }
  },
  "children": "跳转到用户管理"
}
```

带参数的导航：

```json
{
  "events": {
    "click": {
      "call": "$router.push",
      "args": [{ "path": "/user/detail", "query": { "id": "{{ row.id }}" } }]
    }
  }
}
```

## 404 兜底路由

404 路由需要在动态路由加载完成后添加：

```typescript
export const notFoundRoute: RouteRecordRaw = {
  path: '/:pathMatch(.*)*',
  name: 'not-found-catch',
  redirect: '/404'
}

// 在动态路由加载完成后添加
router.addRoute(notFoundRoute)
```
