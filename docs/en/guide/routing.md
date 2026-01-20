# Routing System

Trix Admin builds its routing system based on Vue Router 4, supporting both static and dynamic routing modes.

## Route Types

### Static Routes

Defined in `src/router/routes/index.ts`, registered when the application starts:

```typescript
export const staticRoutes: RouteRecordRaw[] = [
  // Static route configuration
]
```

### Built-in Routes

System built-in page routes, such as login, 403, 404, 500, etc.:

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
          title: 'Login',
          requiresAuth: false,
          layoutType: 'blank'
        }
      }
    ]
  }
]
```

### Dynamic Routes

Business page routes, rendered using JSON Schema:

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
          title: 'Home',
          icon: 'mdi:home',
          schemaSource: '/mock/schema/dashboard.json'
        }
      }
    ]
  }
]
```

## Route Meta Configuration

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `title` | `string` | - | Page title, displayed in tabs and breadcrumbs |
| `icon` | `string` | - | Menu icon, supports Iconify icons |
| `requiresAuth` | `boolean` | `true` | Whether login is required |
| `layoutType` | `'normal' \| 'blank'` | `'normal'` | Layout type |
| `useJsonRenderer` | `boolean` | `false` | Whether to use JSON rendering |
| `schemaSource` | `string` | - | JSON Schema file path |
| `hideInMenu` | `boolean` | `false` | Whether to hide in menu |
| `order` | `number` | `0` | Menu order, smaller numbers appear first |
| `isDefaultAfterLogin` | `boolean` | `false` | Whether it's the default page after login |
| `i18nKey` | `string` | - | Internationalization key |
| `permissions` | `string[]` | - | Required permissions |

## Creating Dynamic Pages

Use the `createDynamicPage` function to create dynamic page components with unique names:

```typescript
import { defineComponent, h } from 'vue'
import DynamicPageComponent from '@/components/json/DynamicPage.vue'

function createDynamicPage(name: string) {
  return defineComponent({
    name,  // Used for KeepAlive cache identification
    render() {
      return h(DynamicPageComponent)
    }
  })
}
```

## Nested Routes

Supports multi-level nested routes:

```typescript
{
  path: 'system',
  name: 'system',
  redirect: '/system/user',
  meta: {
    title: 'System Management',
    icon: 'mdi:cog',
    order: 100
  },
  children: [
    {
      path: 'user',
      name: 'system-user',
      component: createDynamicPage('system-user'),
      meta: {
        title: 'User Management',
        icon: 'mdi:account-group',
        schemaSource: '/mock/schema/system/user-list.json'
      }
    },
    {
      path: 'role',
      name: 'system-role',
      component: createDynamicPage('system-role'),
      meta: {
        title: 'Role Management',
        icon: 'mdi:account-key',
        schemaSource: '/mock/schema/system/role-list.json'
      }
    }
  ]
}
```

## Route Guards

Route guards are configured in `src/router/guard.ts`:

```typescript
router.beforeEach(async (to, from, next) => {
  // Start progress bar
  NProgress.start()
  
  // Check if login is required
  if (to.meta.requiresAuth) {
    const token = getToken()
    if (!token) {
      next({ path: '/login', query: { redirect: to.fullPath } })
      return
    }
  }
  
  // Check permissions
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
  // End progress bar
  NProgress.done()
})
```

## Dynamic Menus

Menu data can be fetched from backend API:

```typescript
// .env configuration
VITE_MENU_ROUTE_URL=/mock/api/menus.json
```

Menu data format:

```json
[
  {
    "path": "/home",
    "name": "home",
    "meta": {
      "title": "Home",
      "icon": "mdi:home",
      "order": 1
    }
  },
  {
    "path": "/system",
    "name": "system",
    "meta": {
      "title": "System Management",
      "icon": "mdi:cog"
    },
    "children": [
      {
        "path": "/system/user",
        "name": "system-user",
        "meta": {
          "title": "User Management",
          "schemaSource": "/mock/schema/system/user-list.json"
        }
      }
    ]
  }
]
```

## Programmatic Navigation

Use route navigation in JSON Schema:

```json
{
  "com": "NButton",
  "events": {
    "click": { "call": "$router.push", "args": ["/system/user"] }
  },
  "children": "Go to User Management"
}
```

Navigation with parameters:

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

## 404 Fallback Route

The 404 route needs to be added after dynamic routes are loaded:

```typescript
export const notFoundRoute: RouteRecordRaw = {
  path: '/:pathMatch(.*)*',
  name: 'not-found-catch',
  redirect: '/404'
}

// Add after dynamic routes are loaded
router.addRoute(notFoundRoute)
```
