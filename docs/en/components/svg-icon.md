# SvgIcon

SVG icon component supporting Iconify icons and local SVG icons.

## Basic Usage

```json
{
  "com": "SvgIcon",
  "props": {
    "icon": "carbon:home"
  }
}
```

## Props

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `icon` | `string` | - | Icon name, supports Iconify icon sets |
| `localIcon` | `string` | - | Local SVG icon name |
| `size` | `number \| string` | `1em` | Icon size |
| `color` | `string` | `currentColor` | Icon color |

## Iconify Icons

Use Iconify icon sets with format `collection:icon-name`:

```json
// Carbon icons
{ "com": "SvgIcon", "props": { "icon": "carbon:home" } }
{ "com": "SvgIcon", "props": { "icon": "carbon:user" } }
{ "com": "SvgIcon", "props": { "icon": "carbon:settings" } }

// Material Design Icons
{ "com": "SvgIcon", "props": { "icon": "mdi:home" } }
{ "com": "SvgIcon", "props": { "icon": "mdi:account" } }

// Ant Design Icons
{ "com": "SvgIcon", "props": { "icon": "ant-design:home-outlined" } }
```

## Local Icons

Use `localIcon` property to reference local SVG icons:

```json
{
  "com": "SvgIcon",
  "props": {
    "localIcon": "logo"
  }
}
```

Local icon files are placed in `src/assets/svg-icon/` directory.

## Setting Size

```json
// Using number (pixels)
{ "com": "SvgIcon", "props": { "icon": "carbon:home", "size": 24 } }

// Using string
{ "com": "SvgIcon", "props": { "icon": "carbon:home", "size": "2em" } }
{ "com": "SvgIcon", "props": { "icon": "carbon:home", "size": "32px" } }
```

## Setting Color

```json
{ "com": "SvgIcon", "props": { "icon": "carbon:home", "color": "#1890ff" } }
{ "com": "SvgIcon", "props": { "icon": "carbon:home", "color": "red" } }
```

Dynamic color:

```json
{
  "com": "SvgIcon",
  "props": {
    "icon": "carbon:checkmark",
    "color": "{{ status === 'success' ? 'green' : 'gray' }}"
  }
}
```


## Using CSS Classes

```json
{
  "com": "SvgIcon",
  "props": {
    "icon": "carbon:home",
    "class": "text-primary text-2xl"
  }
}
```

## In Buttons

```json
{
  "com": "NButton",
  "children": [
    { "com": "SvgIcon", "props": { "icon": "carbon:add", "style": { "marginRight": "4px" } } },
    "Add"
  ]
}
```

## In Input Fields

```json
{
  "com": "NInput",
  "model": "searchText",
  "slots": {
    "prefix": [
      { "com": "SvgIcon", "props": { "icon": "carbon:search" } }
    ]
  }
}
```

## Common Icons

### Action Icons

```json
{ "icon": "carbon:add" }           // Add
{ "icon": "carbon:edit" }          // Edit
{ "icon": "carbon:trash-can" }     // Delete
{ "icon": "carbon:save" }          // Save
{ "icon": "carbon:close" }         // Close
{ "icon": "carbon:checkmark" }     // Confirm
{ "icon": "carbon:search" }        // Search
{ "icon": "carbon:refresh" }       // Refresh
```

### Navigation Icons

```json
{ "icon": "carbon:home" }          // Home
{ "icon": "carbon:menu" }          // Menu
{ "icon": "carbon:settings" }      // Settings
{ "icon": "carbon:user" }          // User
{ "icon": "carbon:notification" }  // Notification
```

### Status Icons

```json
{ "icon": "carbon:checkmark-filled" }  // Success
{ "icon": "carbon:close-filled" }      // Error
{ "icon": "carbon:warning-filled" }    // Warning
{ "icon": "carbon:information-filled" } // Info
```

## Icon Search

Search for more icons at [Iconify](https://icon-sets.iconify.design/).
