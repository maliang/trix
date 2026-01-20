# JSON Schema Overview

Trix Admin uses VSchema to render UI from JSON Schema, enabling declarative page development.

## Core Concepts

JSON Schema defines:
- **Components** - What to render (`com`)
- **Props** - Component properties (`props`)
- **Data** - Reactive state (`data`)
- **Events** - User interactions (`events`)
- **Logic** - Computed values, methods, conditions

## Basic Example

```json
{
  "data": { "message": "Hello World" },
  "com": "NCard",
  "props": { "title": "Welcome" },
  "children": [
    { "com": "NText", "children": "{{ message }}" }
  ]
}
```

## Schema Structure

| Property | Type | Description |
|----------|------|-------------|
| `com` | `string` | Component name |
| `props` | `object` | Component props |
| `children` | `array\|string` | Child nodes or text |
| `data` | `object` | Reactive data |
| `computed` | `object` | Computed properties |
| `methods` | `object` | Method definitions |
| `events` | `object` | Event handlers |
| `if` | `string` | Conditional rendering |
| `for` | `string` | Loop rendering |
| `model` | `string` | Two-way binding |

## Available Components

- All NaiveUI components (`NButton`, `NInput`, `NDataTable`, etc.)
- Custom components (`SvgIcon`, `VueECharts`, `IconPicker`, etc.)
- HTML elements (`div`, `span`, `p`, etc.)

## Learn More

- [Basic Structure](/en/schema/basic-structure) - Schema fundamentals
- [Data Binding](/en/schema/data-binding) - Reactive data
- [Events](/en/schema/events) - Event handling
- [API Requests](/en/schema/api-request) - Fetch data
