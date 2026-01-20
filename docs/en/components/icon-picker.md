# IconPicker

Icon picker component supporting search and selection of Iconify icons.

## Basic Usage

```json
{
  "com": "IconPicker",
  "model": "form.icon"
}
```

## Props

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `value` / `v-model` | `string` | - | Selected icon name |
| `placeholder` | `string` | `'Select icon'` | Placeholder text |
| `disabled` | `boolean` | `false` | Whether disabled |
| `clearable` | `boolean` | `true` | Whether clearable |

## Examples

### Basic Usage

```json
{
  "data": {
    "selectedIcon": ""
  },
  "com": "NFormItem",
  "props": { "label": "Icon" },
  "children": [
    {
      "com": "IconPicker",
      "model": "selectedIcon"
    }
  ]
}
```

### Display Selected Icon

```json
{
  "com": "NFlex",
  "props": { "align": "center" },
  "children": [
    { "com": "IconPicker", "model": "form.icon" },
    {
      "com": "SvgIcon",
      "if": "form.icon",
      "props": { "icon": "{{ form.icon }}", "size": 24, "style": { "marginLeft": "8px" } }
    }
  ]
}
```

### In Form

```json
{
  "com": "NForm",
  "props": { "model": "{{ form }}" },
  "children": [
    {
      "com": "NFormItem",
      "props": { "label": "Menu Name" },
      "children": [{ "com": "NInput", "model": "form.name" }]
    },
    {
      "com": "NFormItem",
      "props": { "label": "Menu Icon" },
      "children": [{ "com": "IconPicker", "model": "form.icon" }]
    }
  ]
}
```

## Features

- Icon search support
- Multiple icon sets (Carbon, Material Design, etc.)
- Pagination browsing
- Clear selection
- Keyboard navigation
