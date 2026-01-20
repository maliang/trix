# Conditional Rendering

Use the `if` property to control conditional rendering of components.

## Basic Usage

```json
{
  "data": { "show": true },
  "com": "NButton",
  "if": "show",
  "children": "Visible Button"
}
```

## Expressions

### Boolean Values

```json
{ "if": "visible" }
{ "if": "!hidden" }
```

### Comparison Operations

```json
{ "if": "count > 0" }
{ "if": "status === 'active'" }
{ "if": "age >= 18" }
{ "if": "type !== 'admin'" }
```

### Logical Operations

```json
{ "if": "isLogin && hasPermission" }
{ "if": "isAdmin || isSuperUser" }
{ "if": "!(disabled || loading)" }
```

### Inclusion Check

```json
{ "if": "$permissions.includes('user:write')" }
{ "if": "['active', 'pending'].includes(status)" }
{ "if": "list.length > 0" }
```

### Null Check

```json
{ "if": "username" }
{ "if": "list && list.length" }
{ "if": "user?.name" }
```

## Permission Control

### Single Permission

```json
{
  "com": "NButton",
  "if": "$permissions.includes('user:write')",
  "children": "Edit"
}
```


### Multiple Permissions (OR)

```json
{
  "com": "NButton",
  "if": "$permissions.includes('user:write') || $permissions.includes('user:admin')",
  "children": "Edit"
}
```

### Multiple Permissions (AND)

```json
{
  "com": "NButton",
  "if": "$permissions.includes('user:read') && $permissions.includes('user:write')",
  "children": "View and Edit"
}
```

## Global State Checks

### Mobile Adaptation

```json
{
  "com": "NDrawer",
  "if": "$app.isMobile",
  "children": "Mobile Drawer"
}
```

```json
{
  "com": "NModal",
  "if": "!$app.isMobile",
  "children": "Desktop Modal"
}
```

### Dark Mode

```json
{
  "com": "img",
  "if": "$theme.darkMode",
  "props": { "src": "/logo-dark.svg" }
}
```

```json
{
  "com": "img",
  "if": "!$theme.darkMode",
  "props": { "src": "/logo-light.svg" }
}
```

### User State

```json
{
  "com": "NButton",
  "if": "$user.role === 'admin'",
  "children": "Admin Action"
}
```

## Conditional Branches

### Using Multiple if

```json
{
  "com": "div",
  "children": [
    {
      "com": "NTag",
      "if": "status === 'success'",
      "props": { "type": "success" },
      "children": "Success"
    },
    {
      "com": "NTag",
      "if": "status === 'error'",
      "props": { "type": "error" },
      "children": "Failed"
    },
    {
      "com": "NTag",
      "if": "status === 'pending'",
      "props": { "type": "warning" },
      "children": "Processing"
    }
  ]
}
```

### Using Ternary Expressions

Use ternary expressions in props:

```json
{
  "com": "NTag",
  "props": {
    "type": "{{ status === 'success' ? 'success' : status === 'error' ? 'error' : 'default' }}"
  },
  "children": "{{ status === 'success' ? 'Success' : status === 'error' ? 'Failed' : 'Unknown' }}"
}
```

## Conditional Rendering in Tables

### Action Column

```json
{
  "com": "NDataTable",
  "props": {
    "columns": [
      { "title": "Name", "key": "name" },
      {
        "title": "Actions",
        "key": "actions",
        "render": {
          "com": "NSpace",
          "children": [
            {
              "com": "NButton",
              "if": "row.status === 'draft'",
              "props": { "size": "small" },
              "children": "Edit"
            },
            {
              "com": "NButton",
              "if": "row.status === 'draft'",
              "props": { "size": "small", "type": "primary" },
              "children": "Publish"
            },
            {
              "com": "NButton",
              "if": "row.status === 'published'",
              "props": { "size": "small", "type": "warning" },
              "children": "Unpublish"
            }
          ]
        }
      }
    ]
  }
}
```

### Status Tags

```json
{
  "render": {
    "com": "NTag",
    "props": {
      "type": "{{ row.status === 1 ? 'success' : 'error' }}"
    },
    "children": "{{ row.status === 1 ? 'Enabled' : 'Disabled' }}"
  }
}
```

## Empty State Handling

```json
{
  "com": "div",
  "children": [
    {
      "com": "NDataTable",
      "if": "list.length > 0",
      "props": { "data": "{{ list }}" }
    },
    {
      "com": "NEmpty",
      "if": "list.length === 0 && !loading",
      "props": { "description": "No data" }
    },
    {
      "com": "NSpin",
      "if": "loading",
      "props": { "show": true }
    }
  ]
}
```

## Loading State

```json
{
  "com": "div",
  "children": [
    {
      "com": "NSpin",
      "if": "loading",
      "props": { "size": "large" }
    },
    {
      "com": "NCard",
      "if": "!loading && !error",
      "children": "Content"
    },
    {
      "com": "NResult",
      "if": "!loading && error",
      "props": { "status": "error", "title": "Loading Failed" }
    }
  ]
}
```

## Notes

### 1. Avoid Complex Expressions

```json
// ❌ Not recommended
{ "if": "list.filter(i => i.status === 1).length > 0 && user.permissions.some(p => p.startsWith('admin'))" }

// ✅ Recommended: Use computed properties or methods
{
  "data": {
    "hasActiveItems": false,
    "isAdmin": false
  },
  "if": "hasActiveItems && isAdmin"
}
```

### 2. Performance Considerations

For frequently toggled content, consider using CSS to control visibility:

```json
{
  "com": "div",
  "style": {
    "display": "{{ show ? 'block' : 'none' }}"
  }
}
```

### 3. Combined with for

`if` and `for` can be used together, with `for` taking precedence:

```json
{
  "com": "NTag",
  "for": "item in list",
  "if": "item.visible",
  "children": "{{ item.name }}"
}
```
