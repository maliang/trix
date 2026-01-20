# MarkdownEditor

Markdown 编辑器组件，基于 Vditor 实现。

## 基本用法

```json
{
  "com": "MarkdownEditor",
  "model": "content"
}
```

## Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `value` / `v-model` | `string` | - | Markdown 内容 |
| `height` | `string \| number` | `'400px'` | 编辑器高度 |
| `placeholder` | `string` | `'请输入内容...'` | 占位文本 |
| `mode` | `string` | `'ir'` | 编辑模式：`sv`（分屏）、`ir`（即时渲染）、`wysiwyg`（所见即所得） |
| `readonly` | `boolean` | `false` | 是否只读 |

## 示例

### 基本使用

```json
{
  "data": {
    "content": "# 标题\n\n这是一段 **Markdown** 内容。"
  },
  "com": "MarkdownEditor",
  "model": "content"
}
```

### 设置高度

```json
{
  "com": "MarkdownEditor",
  "model": "content",
  "props": { "height": "600px" }
}
```

### 分屏模式

```json
{
  "com": "MarkdownEditor",
  "model": "content",
  "props": { "mode": "sv" }
}
```

### 只读预览

```json
{
  "com": "MarkdownEditor",
  "props": {
    "value": "{{ content }}",
    "readonly": true
  }
}
```

### 在表单中使用

```json
{
  "com": "NForm",
  "props": { "model": "{{ form }}" },
  "children": [
    {
      "com": "NFormItem",
      "props": { "label": "标题" },
      "children": [{ "com": "NInput", "model": "form.title" }]
    },
    {
      "com": "NFormItem",
      "props": { "label": "内容" },
      "children": [
        {
          "com": "MarkdownEditor",
          "model": "form.content",
          "props": { "height": "400px" }
        }
      ]
    }
  ]
}
```

## 功能特性

- 实时预览
- 语法高亮
- 图片上传
- 表格编辑
- 代码块
- 数学公式
- 流程图
- 大纲导航
- 导出功能
