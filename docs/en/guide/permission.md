# Permission Control

Trix Admin provides a comprehensive permission management system, supporting both route-level and button-level permission control.

## Permission Types

### Route Permissions

Control whether a user can access a specific page:

```typescript
{
  path: 'user',
  name: 'system-user',
  meta: {
    title: 'User Management',
    requiresAuth: true,           // Requires login
    permissions: ['user:read']    // Required permissions
  }
}
```

### Button Permissions

Control whether a user can see or operate a specific button:

```json
{
  "com": "NButton",
  "if": "$permissions.includes('user:write')",
  "props": { "type": "primary" },
  "children": "Edit"
}
```

## Permission Data

### Fetching Permissions

Fetch user permissions from backend after login:

```typescript
// src/store/modules/auth/index.ts
const authStore = defineStore('auth', () => {
  const permissions = ref<string[]>([])
  
  async function login(username: string, password: string) {
    const res = await loginApi({ username, password })
    
    // Save token
    setToken(res.token)
    
    // Get user info and permissions
    await getUserInfo()
  }
  
  async function getUserInfo() {
    const res = await getUserInfoApi()
    userInfo.value = res.user
    permissions.value = res.permissions
  }
  
  return { permissions, login, getUserInfo }
})
```

### Permission Format

Recommended format: `resource:action`:

```typescript
const permissions = [
  'user:read',      // View users
  'user:write',     // Edit users
  'user:delete',    // Delete users
  'role:read',      // View roles
  'role:write',     // Edit roles
  'menu:read',      // View menus
  'menu:write'      // Edit menus
]
```

## Route Guards

Check permissions in route guards:

```typescript
// src/router/guard.ts
router.beforeEach(async (to, from, next) => {
  // Pages that don't require login
  if (!to.meta.requiresAuth) {
    next()
    return
  }
  
  // Check login status
  const token = getToken()
  if (!token) {
    next({ path: '/login', query: { redirect: to.fullPath } })
    return
  }
  
  // Check permissions
  const authStore = useAuthStore()
  const requiredPermissions = to.meta.permissions as string[] | undefined
  
  if (requiredPermissions?.length) {
    const hasPermission = requiredPermissions.some(p => 
      authStore.permissions.includes(p)
    )
    
    if (!hasPermission) {
      next('/403')
      return
    }
  }
  
  next()
})
```

## Using in JSON Schema

### Conditional Rendering

```json
{
  "com": "NSpace",
  "children": [
    {
      "com": "NButton",
      "if": "$permissions.includes('user:write')",
      "props": { "type": "primary" },
      "children": "Add"
    },
    {
      "com": "NButton",
      "if": "$permissions.includes('user:write')",
      "children": "Edit"
    },
    {
      "com": "NButton",
      "if": "$permissions.includes('user:delete')",
      "props": { "type": "error" },
      "children": "Delete"
    }
  ]
}
```

### Table Action Column

```json
{
  "com": "NDataTable",
  "props": {
    "columns": [
      { "title": "Username", "key": "username" },
      { "title": "Email", "key": "email" },
      {
        "title": "Actions",
        "key": "actions",
        "render": {
          "com": "NSpace",
          "children": [
            {
              "com": "NButton",
              "if": "$permissions.includes('user:write')",
              "props": { "size": "small" },
              "children": "Edit"
            },
            {
              "com": "NPopconfirm",
              "if": "$permissions.includes('user:delete')",
              "props": {
                "onPositiveClick": { "call": "deleteUser", "args": ["{{ row.id }}"] }
              },
              "slots": {
                "trigger": [
                  {
                    "com": "NButton",
                    "props": { "size": "small", "type": "error" },
                    "children": "Delete"
                  }
                ]
              },
              "children": "Are you sure you want to delete?"
            }
          ]
        }
      }
    ]
  }
}
```

### Multiple Permission Checks

```json
{
  "com": "NButton",
  "if": "$permissions.includes('user:write') || $permissions.includes('user:admin')",
  "children": "Edit"
}
```

```json
{
  "com": "NButton",
  "if": "$permissions.includes('user:write') && $permissions.includes('user:delete')",
  "children": "Batch Operations"
}
```

## Permission Directive

Use permission directive in Vue components:

```vue
<template>
  <NButton v-permission="'user:write'">Edit</NButton>
  <NButton v-permission="['user:write', 'user:admin']">Manage</NButton>
</template>
```

## Permission Utility Functions

```typescript
// src/utils/permission.ts
import { useAuthStore } from '@/store/modules/auth'

/**
 * Check if has permission
 */
export function hasPermission(permission: string | string[]): boolean {
  const authStore = useAuthStore()
  const permissions = authStore.permissions
  
  if (Array.isArray(permission)) {
    return permission.some(p => permissions.includes(p))
  }
  
  return permissions.includes(permission)
}

/**
 * Check if has all permissions
 */
export function hasAllPermissions(permissions: string[]): boolean {
  const authStore = useAuthStore()
  return permissions.every(p => authStore.permissions.includes(p))
}
```

## Dynamic Menu Permissions

Filter menus based on permissions:

```typescript
function filterMenusByPermission(menus: Menu[], permissions: string[]): Menu[] {
  return menus.filter(menu => {
    // Check menu permissions
    if (menu.meta?.permissions) {
      const hasPermission = menu.meta.permissions.some(p => 
        permissions.includes(p)
      )
      if (!hasPermission) return false
    }
    
    // Recursively filter child menus
    if (menu.children?.length) {
      menu.children = filterMenusByPermission(menu.children, permissions)
    }
    
    return true
  })
}
```

## Best Practices

### 1. Permission Naming Convention

```
module:action
user:read     - View users
user:write    - Edit users
user:delete   - Delete users
user:export   - Export users
user:import   - Import users
```

### 2. Permission Granularity

- Page level: Control access to pages
- Feature level: Control access to specific features
- Data level: Control access to certain data

### 3. Frontend-Backend Coordination

Frontend permission control is only UI-level hiding; the backend must also perform permission validation.
