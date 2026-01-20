# RichEditor

富文本编辑器组件，基于 WangEditor 实现。

## 基本用法

```json
{
  "com": "RichEditor",
  "model": "content"
}
```

## Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `value` / `v-model` | `string` | - | HTML 内容 |
| `height` | `string \| number` | `'400px'` | 编辑器高度 |
| `placeholder` | `string` | `'请输入内容...'` | 占位文本 |
| `readonly` | `boolean` | `false` | 是否只读 |
| `toolbarConfig` | `object` | - | 工具栏配置 |

## 示例

### 基本使用

```json
{
  "data": {
    "content": "<p>这是一段<strong>富文本</strong>内容。</p>"
  },
  "com": "RichEditor",
  "model": "content"
}
```

### 设置高度

```json
{
  "com": "RichEditor",
  "model": "content",
  "props": { "height": "500px" }
}
```

### 只读模式

```json
{
  "com": "RichEditor",
  "props": {
    "value": "{{ content }}",
    "readonly": true
  }
}
```

### 自定义工具栏

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
          "com": "RichEditor",
          "model": "form.content",
          "props": { "height": "400px" }
        }
      ]
    }
  ]
}
```

### 文章编辑页面

```json
{
  "data": {
    "article": {
      "title": "",
      "summary": "",
      "content": "",
      "status": 1
    },
    "submitting": false
  },
  "methods": {
    "handleSubmit": [
      { "set": "submitting", "value": true },
      {
        "fetch": "/api/article",
        "method": "POST",
        "body": "{{ article }}",
        "then": [
          { "call": "$message.success", "args": ["保存成功"] }
        ],
        "finally": [
          { "set": "submitting", "value": false }
        ]
      }
    ]
  },
  "com": "NCard",
  "props": { "title": "编辑文章" },
  "children": [
    {
      "com": "NForm",
      "props": { "model": "{{ article }}", "labelPlacement": "top" },
      "children": [
        {
          "com": "NFormItem",
          "props": { "label": "标题", "required": true },
          "children": [{ "com": "NInput", "model": "article.title", "props": { "placeholder": "请输入文章标题" } }]
        },
        {
          "com": "NFormItem",
          "props": { "label": "摘要" },
          "children": [{ "com": "NInput", "model": "article.summary", "props": { "type": "textarea", "rows": 3 } }]
        },
        {
          "com": "NFormItem",
          "props": { "label": "内容", "required": true },
          "children": [{ "com": "RichEditor", "model": "article.content", "props": { "height": "500px" } }]
        },
        {
          "com": "NFormItem",
          "children": [
            {
              "com": "NButton",
              "props": { "type": "primary", "loading": "{{ submitting }}" },
              "events": { "click": { "call": "handleSubmit" } },
              "children": "保存"
            }
          ]
        }
      ]
    }
  ]
}
```

## 功能特性

- 所见即所得编辑
- 图片上传
- 视频插入
- 表格编辑
- 代码块
- 字体样式
- 对齐方式
- 列表
- 链接
- 撤销/重做
