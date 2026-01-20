# Components Overview

Trix Admin provides a rich set of components for JSON Schema development.

## Component Categories

### NaiveUI Components

All NaiveUI components are registered and available in JSON Schema:

- Form: `NInput`, `NSelect`, `NDatePicker`, `NCheckbox`, etc.
- Data Display: `NDataTable`, `NTree`, `NDescriptions`, etc.
- Feedback: `NModal`, `NDrawer`, `NMessage`, etc.
- Navigation: `NMenu`, `NTabs`, `NBreadcrumb`, etc.
- Layout: `NCard`, `NGrid`, `NSpace`, `NFlex`, etc.

[View all NaiveUI components →](/en/components/naive-ui)

### Custom Components

Business-specific components:

| Component | Description |
|-----------|-------------|
| `SvgIcon` | SVG icon component |
| `ButtonIcon` | Icon button |
| `VueECharts` | ECharts wrapper |
| `IconPicker` | Icon selector |
| `FlowEditor` | Flow chart editor |
| `MarkdownEditor` | Markdown editor |
| `RichEditor` | Rich text editor |

### Layout Components

System layout components:

| Component | Description |
|-----------|-------------|
| `SystemLogo` | System logo |
| `ThemeSchemaSwitch` | Theme mode switch |
| `LangSwitch` | Language switch |
| `FullScreen` | Fullscreen toggle |

## Using Components

### In JSON Schema

```json
{
  "com": "NButton",
  "props": {
    "type": "primary",
    "size": "medium"
  },
  "children": "Click Me"
}
```

### With Events

```json
{
  "com": "NButton",
  "props": { "type": "primary" },
  "events": {
    "click": { "call": "handleClick" }
  },
  "children": "Submit"
}
```

### With Slots

```json
{
  "com": "NCard",
  "slots": {
    "header": [
      { "com": "NText", "children": "Card Title" }
    ],
    "default": [
      { "com": "NText", "children": "Card Content" }
    ]
  }
}
```

## Registering Custom Components

Add custom components in `src/plugins/json-renderer.ts`:

```typescript
import MyComponent from '@/components/custom/MyComponent.vue'

export const customComponents = {
  // ... existing components
  MyComponent
}
```

Then use in JSON Schema:

```json
{
  "com": "MyComponent",
  "props": { "title": "Hello" }
}
```
