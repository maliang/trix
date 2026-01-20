# NaiveUI Components

Trix Admin pre-registers all commonly used NaiveUI components.

## Basic Components

### NButton

```json
{
  "com": "NButton",
  "props": {
    "type": "primary",
    "size": "medium",
    "disabled": false,
    "loading": false,
    "ghost": false,
    "dashed": false,
    "circle": false,
    "round": false
  },
  "children": "Button"
}
```

### NButtonGroup

```json
{
  "com": "NButtonGroup",
  "children": [
    { "com": "NButton", "children": "Button 1" },
    { "com": "NButton", "children": "Button 2" }
  ]
}
```

### NIcon

```json
{
  "com": "NIcon",
  "props": { "size": 24, "color": "#333" },
  "children": [
    { "com": "SvgIcon", "props": { "icon": "carbon:home" } }
  ]
}
```

### NText

```json
{
  "com": "NText",
  "props": { "type": "success", "strong": true, "depth": 1 },
  "children": "Text content"
}
```

### NTag

```json
{
  "com": "NTag",
  "props": { "type": "success", "closable": true, "round": true },
  "children": "Tag"
}
```


## Layout Components

### NSpace

```json
{
  "com": "NSpace",
  "props": { "vertical": false, "size": "medium", "wrap": true },
  "children": []
}
```

### NFlex

```json
{
  "com": "NFlex",
  "props": { "justify": "space-between", "align": "center", "vertical": false },
  "children": []
}
```

### NGrid

```json
{
  "com": "NGrid",
  "props": { "cols": 3, "xGap": 16, "yGap": 16, "responsive": "screen" },
  "children": [
    { "com": "NGridItem", "children": "Content 1" },
    { "com": "NGridItem", "children": "Content 2" }
  ]
}
```

### NCard

```json
{
  "com": "NCard",
  "props": { "title": "Card Title", "bordered": true, "hoverable": false },
  "children": "Card content"
}
```

## Form Components

### NForm

```json
{
  "com": "NForm",
  "props": {
    "model": "{{ form }}",
    "rules": "{{ rules }}",
    "labelPlacement": "left",
    "labelWidth": 80
  },
  "children": []
}
```

### NInput

```json
{
  "com": "NInput",
  "model": "form.username",
  "props": {
    "placeholder": "Please enter",
    "clearable": true,
    "type": "text",
    "maxlength": 100,
    "showCount": true
  }
}
```

### NSelect

```json
{
  "com": "NSelect",
  "model": "form.status",
  "props": {
    "options": [
      { "label": "Enabled", "value": 1 },
      { "label": "Disabled", "value": 0 }
    ],
    "placeholder": "Please select",
    "clearable": true,
    "filterable": true
  }
}
```

## Data Display

### NDataTable

```json
{
  "com": "NDataTable",
  "props": {
    "data": "{{ list }}",
    "columns": [
      { "title": "ID", "key": "id" },
      { "title": "Name", "key": "name" },
      { "title": "Status", "key": "status" }
    ],
    "loading": "{{ loading }}",
    "pagination": "{{ pagination }}",
    "rowKey": "{{ row => row.id }}"
  }
}
```

## Feedback Components

### NModal

```json
{
  "com": "NModal",
  "model:show": "modalVisible",
  "props": { "preset": "card", "title": "Modal Title", "style": { "width": "600px" } },
  "children": "Modal content"
}
```

### NPopconfirm

```json
{
  "com": "NPopconfirm",
  "props": {
    "onPositiveClick": { "call": "handleDelete" }
  },
  "slots": {
    "trigger": [{ "com": "NButton", "children": "Delete" }]
  },
  "children": "Are you sure?"
}
```

## More Components

For the complete component list, refer to [NaiveUI Documentation](https://www.naiveui.com/).
