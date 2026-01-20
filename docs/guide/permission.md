# 权限控制

Trix Admin 提供完善的权限管理系统，支持路由级和按钮级权限控制。

## 权限类型

### 路由权限

控制用户能否访问某个页面：

```typescript
{
  path: 'user',
  name: 'system-user',
  meta: {
    title: '用户管理',
    requiresAuth: true,           // 需要登录
    permissions: ['user:read']    // 需要的权限
  }
}
```

### 按钮权限

控制用户能否看到或操作某个按钮：

```json
{
  "com": "NButton",
  "if": "$permissions.includes('user:write')",
  "props": { "type": "primary" },
  "children": "编辑"
}
```

## 权限数据

### 获取权限

登录后从后端获取用户权限：

```typescript
// src/store/modules/auth/index.ts
const authStore = defineStore('auth', () => {
  const permissions = ref<string[]>([])
  
  async function login(username: string, password: string) {
    const res = await loginApi({ username, password })
    
    // 保存 token
    setToken(res.token)
    
    // 获取用户信息和权限
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

### 权限格式

推荐使用 `资源:操作` 格式：

```typescript
const permissions = [
  'user:read',      // 查看用户
  'user:write',     // 编辑用户
  'user:delete',    // 删除用户
  'role:read',      // 查看角色
  'role:write',     // 编辑角色
  'menu:read',      // 查看菜单
  'menu:write'      // 编辑菜单
]
```

## 路由守卫

在路由守卫中检查权限：

```typescript
// src/router/guard.ts
router.beforeEach(async (to, from, next) => {
  // 不需要登录的页面
  if (!to.meta.requiresAuth) {
    next()
    return
  }
  
  // 检查登录状态
  const token = getToken()
  if (!token) {
    next({ path: '/login', query: { redirect: to.fullPath } })
    return
  }
  
  // 检查权限
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

## 在 JSON Schema 中使用

### 条件渲染

```json
{
  "com": "NSpace",
  "children": [
    {
      "com": "NButton",
      "if": "$permissions.includes('user:write')",
      "props": { "type": "primary" },
      "children": "新增"
    },
    {
      "com": "NButton",
      "if": "$permissions.includes('user:write')",
      "children": "编辑"
    },
    {
      "com": "NButton",
      "if": "$permissions.includes('user:delete')",
      "props": { "type": "error" },
      "children": "删除"
    }
  ]
}
```

### 表格操作列

```json
{
  "com": "NDataTable",
  "props": {
    "columns": [
      { "title": "用户名", "key": "username" },
      { "title": "邮箱", "key": "email" },
      {
        "title": "操作",
        "key": "actions",
        "render": {
          "com": "NSpace",
          "children": [
            {
              "com": "NButton",
              "if": "$permissions.includes('user:write')",
              "props": { "size": "small" },
              "children": "编辑"
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
                    "children": "删除"
                  }
                ]
              },
              "children": "确定要删除吗？"
            }
          ]
        }
      }
    ]
  }
}
```

### 多权限判断

```json
{
  "com": "NButton",
  "if": "$permissions.includes('user:write') || $permissions.includes('user:admin')",
  "children": "编辑"
}
```

```json
{
  "com": "NButton",
  "if": "$permissions.includes('user:write') && $permissions.includes('user:delete')",
  "children": "批量操作"
}
```

## 权限指令

在 Vue 组件中使用权限指令：

```vue
<template>
  <NButton v-permission="'user:write'">编辑</NButton>
  <NButton v-permission="['user:write', 'user:admin']">管理</NButton>
</template>
```

## 权限工具函数

```typescript
// src/utils/permission.ts
import { useAuthStore } from '@/store/modules/auth'

/**
 * 检查是否有权限
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
 * 检查是否有所有权限
 */
export function hasAllPermissions(permissions: string[]): boolean {
  const authStore = useAuthStore()
  return permissions.every(p => authStore.permissions.includes(p))
}
```

## 动态菜单权限

根据权限过滤菜单：

```typescript
function filterMenusByPermission(menus: Menu[], permissions: string[]): Menu[] {
  return menus.filter(menu => {
    // 检查菜单权限
    if (menu.meta?.permissions) {
      const hasPermission = menu.meta.permissions.some(p => 
        permissions.includes(p)
      )
      if (!hasPermission) return false
    }
    
    // 递归过滤子菜单
    if (menu.children?.length) {
      menu.children = filterMenusByPermission(menu.children, permissions)
    }
    
    return true
  })
}
```

## 最佳实践

### 1. 权限命名规范

```
模块:操作
user:read     - 查看用户
user:write    - 编辑用户
user:delete   - 删除用户
user:export   - 导出用户
user:import   - 导入用户
```

### 2. 权限粒度

- 页面级：控制能否访问页面
- 功能级：控制能否使用某个功能
- 数据级：控制能否查看某些数据

### 3. 前后端配合

前端权限控制只是 UI 层面的隐藏，后端必须同时进行权限校验。
