# Data Binding

JSON Schema uses `{{ }}` syntax for data binding, supporting expression evaluation and global state access.

## Basic Syntax

### Simple Binding

```json
{
  "data": { "name": "John" },
  "com": "NText",
  "children": "{{ name }}"
}
```

### Property Binding

```json
{
  "data": { "disabled": true },
  "com": "NButton",
  "props": {
    "disabled": "{{ disabled }}"
  }
}
```

### Style Binding

```json
{
  "data": { "color": "red" },
  "com": "div",
  "style": {
    "color": "{{ color }}"
  }
}
```

## Expressions

### Arithmetic Operations

```json
{
  "data": { "count": 5 },
  "com": "NText",
  "children": "Total: {{ count * 2 }}"
}
```

### String Concatenation

```json
{
  "data": { "firstName": "John", "lastName": "Doe" },
  "com": "NText",
  "children": "{{ firstName + ' ' + lastName }}"
}
```

### Ternary Expressions

```json
{
  "data": { "score": 85 },
  "com": "NTag",
  "props": {
    "type": "{{ score >= 60 ? 'success' : 'error' }}"
  },
  "children": "{{ score >= 60 ? 'Pass' : 'Fail' }}"
}
```

### Logical Operations

```json
{
  "props": {
    "disabled": "{{ !username || !password }}",
    "show": "{{ isAdmin && hasPermission }}"
  }
}
```

### Comparison Operations

```json
{
  "if": "count > 0",
  "children": "{{ count === 1 ? '1 item' : count + ' items' }}"
}
```

## Objects and Arrays

### Accessing Object Properties

```json
{
  "data": {
    "user": { "name": "John", "age": 25 }
  },
  "com": "NText",
  "children": "{{ user.name }}, {{ user.age }} years old"
}
```

### Accessing Array Elements

```json
{
  "data": {
    "items": ["Apple", "Banana", "Orange"]
  },
  "com": "NText",
  "children": "First: {{ items[0] }}"
}
```

### Array Methods

```json
{
  "data": { "list": [1, 2, 3, 4, 5] },
  "com": "NText",
  "children": "Count: {{ list.length }}, Sum: {{ list.reduce((a, b) => a + b, 0) }}"
}
```

## Two-way Binding

### model Syntax

```json
{
  "data": { "form": { "username": "" } },
  "com": "NInput",
  "model": "form.username"
}
```

### Custom model Property

```json
{
  "com": "NSwitch",
  "model:value": "form.enabled"
}
```

```json
{
  "com": "NCheckbox",
  "model:checked": "form.agree"
}
```

```json
{
  "com": "NSelect",
  "model:value": "form.status",
  "props": {
    "options": [
      { "label": "Enabled", "value": 1 },
      { "label": "Disabled", "value": 0 }
    ]
  }
}
```

## Global State

DynamicPage injects global state that can be used directly:

### $app - Application State

```json
{
  "com": "NText",
  "children": "Current Language: {{ $app.locale }}"
}
```

```json
{
  "com": "div",
  "if": "$app.isMobile",
  "children": "Mobile Content"
}
```

### $theme - Theme State

```json
{
  "com": "SvgIcon",
  "props": {
    "icon": "{{ $theme.darkMode ? 'mdi:weather-night' : 'mdi:weather-sunny' }}"
  }
}
```

```json
{
  "style": {
    "color": "{{ $theme.themeColor }}"
  }
}
```

### $user - User Information

```json
{
  "com": "NText",
  "children": "Welcome, {{ $user.nickname }}"
}
```

```json
{
  "com": "NAvatar",
  "props": {
    "src": "{{ $user.avatar }}"
  }
}
```

### $permissions - Permission List

```json
{
  "com": "NButton",
  "if": "$permissions.includes('user:write')",
  "children": "Edit"
}
```

## Built-in Variables

### $response

Response data from API requests:

```json
{
  "fetch": "/api/user",
  "then": [
    { "set": "user", "value": "{{ $response }}" }
  ]
}
```

### $args

Event arguments:

```json
{
  "events": {
    "click": { "set": "selectedId", "value": "{{ $args[0] }}" }
  }
}
```

### $event

Native event object:

```json
{
  "events": {
    "input": { "set": "value", "value": "{{ $event.target.value }}" }
  }
}
```

### row / item / index

Variables in loop rendering:

```json
{
  "for": "item in list",
  "children": "{{ index + 1 }}. {{ item.name }}"
}
```

## Method Calls

### Built-in Methods

```json
{
  "children": "{{ JSON.stringify(form) }}"
}
```

```json
{
  "children": "{{ Math.round(score * 100) / 100 }}"
}
```

### Internationalization

```json
{
  "children": "{{ $t('common.submit') }}"
}
```

```json
{
  "children": "{{ $t('message.total', { count: list.length }) }}"
}
```

## Notes

### 1. Avoid Complex Expressions

```json
// ❌ Not recommended
{
  "children": "{{ list.filter(i => i.status === 1).map(i => i.name).join(', ') }}"
}

// ✅ Recommended: Handle in methods
{
  "methods": {
    "getActiveNames": "{{ list.filter(i => i.status === 1).map(i => i.name).join(', ') }}"
  },
  "children": "{{ getActiveNames() }}"
}
```

### 2. Null Value Handling

```json
{
  "children": "{{ user?.name || 'Unknown' }}"
}
```

### 3. Type Conversion

```json
{
  "props": {
    "value": "{{ Number(inputValue) }}",
    "label": "{{ String(count) }}"
  }
}
```
