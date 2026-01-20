# MarkdownEditor

Markdown editor component based on Vditor.

## Basic Usage

```json
{
  "com": "MarkdownEditor",
  "model": "content"
}
```

## Props

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `value` / `v-model` | `string` | - | Markdown content |
| `height` | `string \| number` | `'400px'` | Editor height |
| `placeholder` | `string` | `'Enter content...'` | Placeholder text |
| `mode` | `string` | `'ir'` | Edit mode: `sv` (split), `ir` (instant render), `wysiwyg` |
| `readonly` | `boolean` | `false` | Whether readonly |

## Examples

### Basic Usage

```json
{
  "data": {
    "content": "# Title\n\nThis is **Markdown** content."
  },
  "com": "MarkdownEditor",
  "model": "content"
}
```

### Set Height

```json
{
  "com": "MarkdownEditor",
  "model": "content",
  "props": { "height": "600px" }
}
```

### Split Mode

```json
{
  "com": "MarkdownEditor",
  "model": "content",
  "props": { "mode": "sv" }
}
```

### Readonly Preview

```json
{
  "com": "MarkdownEditor",
  "props": {
    "value": "{{ content }}",
    "readonly": true
  }
}
```

## Features

- Live preview
- Syntax highlighting
- Image upload
- Table editing
- Code blocks
- Math formulas
- Flowcharts
- Outline navigation
- Export functionality
