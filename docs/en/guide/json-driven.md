# JSON Driven

The core feature of Trix Admin is driving page rendering through JSON Schema configuration. This section introduces the core concepts and working principles of JSON-driven development.

## How It Works

```
JSON Schema → VSchema Rendering Engine → Vue Components → Page
```

1. **JSON Schema**: JSON configuration files that describe page structure, data, and events
2. **VSchema Rendering Engine**: Parses JSON Schema and renders it as Vue components
3. **Vue Components**: NaiveUI components and custom components
4. **Page**: The final interface presented to users

## Core Components

### DynamicPage

`DynamicPage` is the core component of JSON-driven development, responsible for:

- Loading JSON Schema based on route configuration
- Injecting global state (user info, theme, permissions, etc.)
- Handling loading and error states
- Passing Schema to VSchema for rendering

```vue
<!-- Usage example -->
<DynamicPage :schema-source="/mock/schema/my-page.json" />
```

### VSchema

`VSchema` is the JSON Schema rendering engine, provided by `vschema-ui`:

```typescript
import { createVSchemaPlugin } from 'vschema-ui'

// Register components and configuration
const plugin = createVSchemaPlugin({
  baseURL: '/api',
  components: {
    ...naiveUIComponents,
    ...customComponents
  }
})

app.use(plugin)
```

## Route Configuration

Configure `schemaSource` in routes to specify the JSON Schema file path:

```typescript
{
  path: 'user',
  name: 'system-user',
  component: createDynamicPage('system-user'),
  meta: {
    title: 'User Management',
    icon: 'mdi:account-group',
    requiresAuth: true,
    layoutType: 'normal',
    useJsonRenderer: true,
    schemaSource: '/mock/schema/system/user-list.json'
  }
}
```

### Route Meta Configuration

| Property | Type | Description |
|----------|------|-------------|
| `title` | `string` | Page title |
| `icon` | `string` | Menu icon |
| `requiresAuth` | `boolean` | Whether login is required |
| `layoutType` | `'normal' \| 'blank'` | Layout type |
| `useJsonRenderer` | `boolean` | Whether to use JSON rendering |
| `schemaSource` | `string` | JSON Schema file path |
| `hideInMenu` | `boolean` | Whether to hide in menu |
| `order` | `number` | Menu order |

## Global State Injection

DynamicPage automatically injects global state into Schema's `data`:

```json
{
  "data": {
    "$app": {
      "locale": "zh-CN",
      "isMobile": false
    },
    "$theme": {
      "darkMode": false,
      "themeColor": "#646cff",
      "layoutMode": "vertical"
    },
    "$user": {
      "id": 1,
      "username": "admin",
      "nickname": "Administrator"
    },
    "$permissions": ["user:read", "user:write"]
  }
}
```

You can directly use these global states in Schema:

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

## JSON Schema Basic Structure

```json
{
  "data": {},           // Page data
  "methods": {},        // Method definitions
  "onMounted": {},      // Execute on mount
  "com": "NCard",       // Component name
  "props": {},          // Component props
  "children": [],       // Child components
  "events": {},         // Event handlers
  "if": "",             // Conditional rendering
  "for": ""             // Loop rendering
}
```

## Component Registration

Trix Admin pre-registers the following components:

### NaiveUI Components

All commonly used NaiveUI components are registered, such as:
- Basic: `NButton`, `NIcon`, `NText`
- Layout: `NSpace`, `NGrid`, `NFlex`, `NCard`
- Form: `NForm`, `NInput`, `NSelect`, `NDatePicker`
- Data: `NDataTable`, `NTree`, `NDescriptions`
- Feedback: `NModal`, `NDrawer`, `NMessage`

### Custom Components

- `SvgIcon`: SVG icon
- `ButtonIcon`: Icon button
- `VueECharts`: ECharts chart
- `IconPicker`: Icon picker
- `FlowEditor`: Flow editor
- `MarkdownEditor`: Markdown editor
- `RichEditor`: Rich text editor

### Layout Components

- `SystemLogo`: System logo
- `ThemeSchemaSwitch`: Theme switch
- `LangSwitch`: Language switch
- `FullScreen`: Fullscreen toggle
- `UserAvatar`: User avatar

## Development Mode

In development mode, you can use the `SchemaEditor` component to edit and preview JSON Schema in real-time:

```json
{
  "com": "SchemaEditor",
  "props": {
    "schema": "{{ currentSchema }}"
  }
}
```

## Best Practices

### 1. Split Schema Reasonably

For complex pages, it's recommended to split Schema into multiple files and reference them via `$ref`:

```json
{
  "com": "div",
  "children": [
    { "$ref": "/mock/schema/components/header.json" },
    { "$ref": "/mock/schema/components/content.json" }
  ]
}
```

### 2. Reuse Data and Methods

Extract common data and methods into shared Schema:

```json
{
  "data": {
    "pagination": {
      "page": 1,
      "pageSize": 10,
      "total": 0
    }
  },
  "methods": {
    "handlePageChange": [
      { "set": "pagination.page", "value": "{{ $args[0] }}" },
      { "call": "loadData" }
    ]
  }
}
```

### 3. Use Conditional Rendering for Permission Control

```json
{
  "com": "NButton",
  "if": "$permissions.includes('user:delete')",
  "props": { "type": "error" },
  "children": "Delete"
}
```

## Next Steps

- [JSON Schema Basics](/schema/) - Learn JSON Schema syntax in detail
- [Data Binding](/schema/data-binding) - Understand data binding mechanism
- [Event Handling](/schema/events) - Learn event handling methods
