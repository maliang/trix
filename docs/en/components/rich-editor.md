# RichEditor

Rich text editor component based on WangEditor.

## Basic Usage

```json
{
  "com": "RichEditor",
  "model": "content"
}
```

## Props

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `value` / `v-model` | `string` | - | HTML content |
| `height` | `string \| number` | `'400px'` | Editor height |
| `placeholder` | `string` | `'Enter content...'` | Placeholder text |
| `readonly` | `boolean` | `false` | Whether readonly |
| `toolbarConfig` | `object` | - | Toolbar configuration |

## Examples

### Basic Usage

```json
{
  "data": {
    "content": "<p>This is <strong>rich text</strong> content.</p>"
  },
  "com": "RichEditor",
  "model": "content"
}
```

### Set Height

```json
{
  "com": "RichEditor",
  "model": "content",
  "props": { "height": "500px" }
}
```

### Readonly Mode

```json
{
  "com": "RichEditor",
  "props": {
    "value": "{{ content }}",
    "readonly": true
  }
}
```

### Custom Toolbar

```json
{
  "com": "RichEditor",
  "model": "content",
  "props": {
    "toolbarConfig": {
      "excludeKeys": ["uploadVideo", "insertTable"]
    }
  }
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
      "props": { "label": "Title" },
      "children": [{ "com": "NInput", "model": "form.title" }]
    },
    {
      "com": "NFormItem",
      "props": { "label": "Content" },
      "children": [
        {
          "com": "RichEditor",
          "model": "form.content",
          "props": { "height": "400px" }
        }
      ]
    }
  ]
}
```

## Features

- WYSIWYG editing
- Image upload
- Video insertion
- Table editing
- Code blocks
- Font styles
- Alignment
- Lists
- Links
- Undo/Redo
