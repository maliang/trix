# Loop Rendering

Use the `for` property to implement list loop rendering.

## Basic Syntax

```json
{
  "data": {
    "list": [
      { "id": 1, "name": "Apple" },
      { "id": 2, "name": "Banana" },
      { "id": 3, "name": "Orange" }
    ]
  },
  "com": "NTag",
  "for": "item in list",
  "key": "item.id",
  "children": "{{ item.name }}"
}
```

## for Syntax

### item in list

```json
{ "for": "item in list" }
```

Available variables:
- `item`: Current item
- `index`: Current index

### (item, index) in list

```json
{ "for": "(item, index) in list" }
```

### Custom Variable Names

```json
{ "for": "user in users" }
{ "for": "option in options" }
{ "for": "(row, rowIndex) in tableData" }
```

## key Property

Specify a unique key for loop items to improve rendering performance:

```json
{
  "for": "item in list",
  "key": "item.id"
}
```


Using index as key (not recommended):

```json
{
  "for": "item in list",
  "key": "index"
}
```

## Common Examples

### Tag List

```json
{
  "com": "NSpace",
  "children": [
    {
      "com": "NTag",
      "for": "tag in tags",
      "key": "tag.id",
      "props": { "type": "{{ tag.type }}" },
      "children": "{{ tag.name }}"
    }
  ]
}
```

### Option List

```json
{
  "com": "NSelect",
  "model": "selectedValue",
  "props": {
    "options": "{{ options.map(o => ({ label: o.name, value: o.id })) }}"
  }
}
```

### Menu List

```json
{
  "com": "NMenu",
  "props": {
    "options": "{{ menus }}"
  }
}
```

### Card List

```json
{
  "com": "NGrid",
  "props": { "cols": 3, "xGap": 16, "yGap": 16 },
  "children": [
    {
      "com": "NGridItem",
      "for": "item in list",
      "key": "item.id",
      "children": [
        {
          "com": "NCard",
          "props": { "title": "{{ item.title }}" },
          "children": "{{ item.description }}"
        }
      ]
    }
  ]
}
```

### Table Data

```json
{
  "com": "NDataTable",
  "props": {
    "data": "{{ list }}",
    "columns": [
      { "title": "ID", "key": "id" },
      { "title": "Name", "key": "name" },
      { "title": "Status", "key": "status" }
    ]
  }
}
```

### Timeline

```json
{
  "com": "NTimeline",
  "children": [
    {
      "com": "NTimelineItem",
      "for": "item in activities",
      "key": "item.id",
      "props": {
        "type": "{{ item.type }}",
        "title": "{{ item.title }}",
        "time": "{{ item.time }}"
      },
      "children": "{{ item.content }}"
    }
  ]
}
```

### Description List

```json
{
  "com": "NDescriptions",
  "children": [
    {
      "com": "NDescriptionsItem",
      "for": "field in fields",
      "key": "field.key",
      "props": { "label": "{{ field.label }}" },
      "children": "{{ data[field.key] }}"
    }
  ]
}
```

## Nested Loops

```json
{
  "data": {
    "categories": [
      {
        "id": 1,
        "name": "Fruits",
        "items": [
          { "id": 1, "name": "Apple" },
          { "id": 2, "name": "Banana" }
        ]
      },
      {
        "id": 2,
        "name": "Vegetables",
        "items": [
          { "id": 3, "name": "Cabbage" },
          { "id": 4, "name": "Carrot" }
        ]
      }
    ]
  },
  "com": "div",
  "children": [
    {
      "com": "NCard",
      "for": "category in categories",
      "key": "category.id",
      "props": { "title": "{{ category.name }}" },
      "children": [
        {
          "com": "NTag",
          "for": "item in category.items",
          "key": "item.id",
          "props": { "style": { "marginRight": "8px" } },
          "children": "{{ item.name }}"
        }
      ]
    }
  ]
}
```

## Combined with Conditional Rendering

### Filtered Display

```json
{
  "com": "NTag",
  "for": "item in list",
  "if": "item.visible",
  "key": "item.id",
  "children": "{{ item.name }}"
}
```

### Conditional Styles

```json
{
  "com": "NTag",
  "for": "item in list",
  "key": "item.id",
  "props": {
    "type": "{{ item.status === 'active' ? 'success' : 'default' }}"
  },
  "children": "{{ item.name }}"
}
```

## Index Usage

### Display Sequence Number

```json
{
  "com": "NList",
  "children": [
    {
      "com": "NListItem",
      "for": "(item, index) in list",
      "key": "item.id",
      "children": "{{ index + 1 }}. {{ item.name }}"
    }
  ]
}
```

### Odd/Even Row Styles

```json
{
  "com": "div",
  "for": "(item, index) in list",
  "key": "item.id",
  "style": {
    "background": "{{ index % 2 === 0 ? '#f5f5f5' : '#ffffff' }}"
  }
}
```

## Empty List Handling

```json
{
  "com": "div",
  "children": [
    {
      "com": "NSpace",
      "if": "list.length > 0",
      "children": [
        {
          "com": "NTag",
          "for": "item in list",
          "key": "item.id",
          "children": "{{ item.name }}"
        }
      ]
    },
    {
      "com": "NEmpty",
      "if": "list.length === 0",
      "props": { "description": "No data" }
    }
  ]
}
```

## Performance Optimization

### 1. Always Use key

```json
{
  "for": "item in list",
  "key": "item.id"  // ✅ Use unique identifier
}
```

### 2. Avoid Complex Calculations in Loops

```json
// ❌ Not recommended
{
  "for": "item in list.filter(i => i.status === 1).sort((a, b) => a.order - b.order)"
}

// ✅ Recommended: Pre-calculate
{
  "data": {
    "filteredList": []
  },
  "methods": {
    "computeList": [
      { "set": "filteredList", "value": "{{ list.filter(i => i.status === 1).sort((a, b) => a.order - b.order) }}" }
    ]
  },
  "for": "item in filteredList"
}
```

### 3. Use Virtual Scrolling for Large Lists

For large amounts of data, use NDataTable or NVirtualList:

```json
{
  "com": "NDataTable",
  "props": {
    "virtualScroll": true,
    "maxHeight": 400,
    "data": "{{ largeList }}"
  }
}
```
