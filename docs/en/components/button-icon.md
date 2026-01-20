# ButtonIcon

Icon button component for buttons that display only an icon.

## Basic Usage

```json
{
  "com": "ButtonIcon",
  "props": {
    "icon": "carbon:settings"
  }
}
```

## Props

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `icon` | `string` | - | Iconify icon name |
| `localIcon` | `string` | - | Local SVG icon name |
| `tooltipContent` | `string` | - | Tooltip text |
| `tooltipPlacement` | `string` | `'bottom'` | Tooltip position |

## Examples

### Basic Icon Button

```json
{
  "com": "ButtonIcon",
  "props": { "icon": "carbon:settings" },
  "events": { "click": { "call": "openSettings" } }
}
```

### Icon Button with Tooltip

```json
{
  "com": "ButtonIcon",
  "props": {
    "icon": "carbon:refresh",
    "tooltipContent": "Refresh data"
  },
  "events": { "click": { "call": "refresh" } }
}
```

### Button Group

```json
{
  "com": "NSpace",
  "children": [
    {
      "com": "ButtonIcon",
      "props": { "icon": "carbon:edit", "tooltipContent": "Edit" },
      "events": { "click": { "call": "edit" } }
    },
    {
      "com": "ButtonIcon",
      "props": { "icon": "carbon:trash-can", "tooltipContent": "Delete" },
      "events": { "click": { "call": "delete" } }
    },
    {
      "com": "ButtonIcon",
      "props": { "icon": "carbon:download", "tooltipContent": "Download" },
      "events": { "click": { "call": "download" } }
    }
  ]
}
```

### In Table Action Column

```json
{
  "title": "Actions",
  "key": "actions",
  "render": {
    "com": "NSpace",
    "children": [
      {
        "com": "ButtonIcon",
        "props": { "icon": "carbon:view", "tooltipContent": "View" },
        "events": { "click": { "call": "viewDetail", "args": ["{{ row }}"] } }
      },
      {
        "com": "ButtonIcon",
        "props": { "icon": "carbon:edit", "tooltipContent": "Edit" },
        "events": { "click": { "call": "editRow", "args": ["{{ row }}"] } }
      }
    ]
  }
}
```
