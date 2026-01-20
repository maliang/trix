# ButtonIcon

图标按钮组件，用于只显示图标的按钮。

## 基本用法

```json
{
  "com": "ButtonIcon",
  "props": {
    "icon": "carbon:settings"
  }
}
```

## Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `icon` | `string` | - | Iconify 图标名称 |
| `localIcon` | `string` | - | 本地 SVG 图标名称 |
| `tooltipContent` | `string` | - | 提示文本 |
| `tooltipPlacement` | `string` | `'bottom'` | 提示位置 |

## 示例

### 基本图标按钮

```json
{
  "com": "ButtonIcon",
  "props": { "icon": "carbon:settings" },
  "events": { "click": { "call": "openSettings" } }
}
```

### 带提示的图标按钮

```json
{
  "com": "ButtonIcon",
  "props": {
    "icon": "carbon:refresh",
    "tooltipContent": "刷新数据"
  },
  "events": { "click": { "call": "refresh" } }
}
```

### 按钮组

```json
{
  "com": "NSpace",
  "children": [
    {
      "com": "ButtonIcon",
      "props": { "icon": "carbon:edit", "tooltipContent": "编辑" },
      "events": { "click": { "call": "edit" } }
    },
    {
      "com": "ButtonIcon",
      "props": { "icon": "carbon:trash-can", "tooltipContent": "删除" },
      "events": { "click": { "call": "delete" } }
    },
    {
      "com": "ButtonIcon",
      "props": { "icon": "carbon:download", "tooltipContent": "下载" },
      "events": { "click": { "call": "download" } }
    }
  ]
}
```

### 在表格操作列中使用

```json
{
  "title": "操作",
  "key": "actions",
  "render": {
    "com": "NSpace",
    "children": [
      {
        "com": "ButtonIcon",
        "props": { "icon": "carbon:view", "tooltipContent": "查看" },
        "events": { "click": { "call": "viewDetail", "args": ["{{ row }}"] } }
      },
      {
        "com": "ButtonIcon",
        "props": { "icon": "carbon:edit", "tooltipContent": "编辑" },
        "events": { "click": { "call": "editRow", "args": ["{{ row }}"] } }
      }
    ]
  }
}
```
