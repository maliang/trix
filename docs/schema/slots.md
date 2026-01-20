# 插槽

使用 `slots` 属性定义组件的具名插槽内容。

## 基本语法

```json
{
  "com": "NCard",
  "slots": {
    "header": [
      { "com": "NText", "children": "自定义头部" }
    ],
    "footer": [
      { "com": "NButton", "children": "确定" }
    ]
  },
  "children": "卡片内容"
}
```

## 常用组件插槽

### NCard

```json
{
  "com": "NCard",
  "slots": {
    "header": [
      {
        "com": "NFlex",
        "props": { "justify": "space-between", "align": "center" },
        "children": [
          { "com": "NText", "props": { "strong": true }, "children": "标题" },
          { "com": "NButton", "props": { "size": "small" }, "children": "操作" }
        ]
      }
    ],
    "header-extra": [
      { "com": "NButton", "props": { "text": true }, "children": "更多" }
    ],
    "footer": [
      {
        "com": "NSpace",
        "children": [
          { "com": "NButton", "children": "取消" },
          { "com": "NButton", "props": { "type": "primary" }, "children": "确定" }
        ]
      }
    ],
    "action": [
      { "com": "NButton", "props": { "text": true }, "children": "详情" }
    ]
  },
  "children": "卡片内容"
}
```

### NInput

```json
{
  "com": "NInput",
  "model": "form.username",
  "props": { "placeholder": "请输入用户名" },
  "slots": {
    "prefix": [
      {
        "com": "NIcon",
        "children": [
          { "com": "SvgIcon", "props": { "icon": "carbon:user" } }
        ]
      }
    ],
    "suffix": [
      {
        "com": "NIcon",
        "props": { "style": { "cursor": "pointer" } },
        "events": { "click": { "set": "form.username", "value": "" } },
        "children": [
          { "com": "SvgIcon", "props": { "icon": "carbon:close" } }
        ]
      }
    ]
  }
}
```

### NSelect

```json
{
  "com": "NSelect",
  "model": "selectedValue",
  "props": {
    "options": "{{ options }}"
  },
  "slots": {
    "empty": [
      { "com": "NEmpty", "props": { "description": "暂无选项" } }
    ],
    "action": [
      {
        "com": "NButton",
        "props": { "text": true, "block": true },
        "events": { "click": { "call": "addOption" } },
        "children": "+ 添加选项"
      }
    ]
  }
}
```

### NModal

```json
{
  "com": "NModal",
  "model:show": "modalVisible",
  "props": { "preset": "card", "title": "弹窗标题" },
  "slots": {
    "header": [
      {
        "com": "NFlex",
        "props": { "align": "center" },
        "children": [
          { "com": "SvgIcon", "props": { "icon": "carbon:edit", "style": { "marginRight": "8px" } } },
          { "com": "NText", "children": "编辑信息" }
        ]
      }
    ],
    "footer": [
      {
        "com": "NSpace",
        "props": { "justify": "end" },
        "children": [
          {
            "com": "NButton",
            "events": { "click": { "set": "modalVisible", "value": false } },
            "children": "取消"
          },
          {
            "com": "NButton",
            "props": { "type": "primary", "loading": "{{ loading }}" },
            "events": { "click": { "call": "handleSave" } },
            "children": "保存"
          }
        ]
      }
    ]
  },
  "children": "弹窗内容"
}
```

### NDrawer

```json
{
  "com": "NDrawer",
  "model:show": "drawerVisible",
  "props": { "width": 500 },
  "children": [
    {
      "com": "NDrawerContent",
      "props": { "title": "抽屉标题" },
      "slots": {
        "footer": [
          {
            "com": "NSpace",
            "children": [
              { "com": "NButton", "children": "取消" },
              { "com": "NButton", "props": { "type": "primary" }, "children": "确定" }
            ]
          }
        ]
      },
      "children": "抽屉内容"
    }
  ]
}
```

### NPopconfirm

```json
{
  "com": "NPopconfirm",
  "props": {
    "onPositiveClick": { "call": "handleDelete", "args": ["{{ row.id }}"] }
  },
  "slots": {
    "trigger": [
      {
        "com": "NButton",
        "props": { "type": "error", "size": "small" },
        "children": "删除"
      }
    ]
  },
  "children": "确定要删除这条记录吗？"
}
```

### NTooltip

```json
{
  "com": "NTooltip",
  "slots": {
    "trigger": [
      {
        "com": "NButton",
        "props": { "circle": true },
        "children": [
          { "com": "SvgIcon", "props": { "icon": "carbon:help" } }
        ]
      }
    ]
  },
  "children": "这是提示信息"
}
```

### NDropdown

```json
{
  "com": "NDropdown",
  "props": {
    "options": [
      { "label": "编辑", "key": "edit" },
      { "label": "删除", "key": "delete" }
    ],
    "onSelect": { "call": "handleAction", "args": ["{{ $args[0] }}"] }
  },
  "slots": {
    "default": [
      {
        "com": "NButton",
        "children": "更多操作"
      }
    ]
  }
}
```

### NDataTable

表格列的自定义渲染：

```json
{
  "com": "NDataTable",
  "props": {
    "data": "{{ list }}",
    "columns": [
      { "title": "名称", "key": "name" },
      {
        "title": "状态",
        "key": "status",
        "render": {
          "com": "NTag",
          "props": {
            "type": "{{ row.status === 1 ? 'success' : 'error' }}"
          },
          "children": "{{ row.status === 1 ? '启用' : '禁用' }}"
        }
      },
      {
        "title": "操作",
        "key": "actions",
        "render": {
          "com": "NSpace",
          "children": [
            {
              "com": "NButton",
              "props": { "size": "small" },
              "events": { "click": { "call": "editRow", "args": ["{{ row }}"] } },
              "children": "编辑"
            },
            {
              "com": "NPopconfirm",
              "props": {
                "onPositiveClick": { "call": "deleteRow", "args": ["{{ row.id }}"] }
              },
              "slots": {
                "trigger": [
                  {
                    "com": "NButton",
                    "props": { "size": "small", "type": "error" },
                    "children": "删除"
                  }
                ]
              },
              "children": "确定删除？"
            }
          ]
        }
      }
    ]
  }
}
```

### NStatistic

```json
{
  "com": "NStatistic",
  "props": { "label": "总用户数", "value": "{{ stats.totalUsers }}" },
  "slots": {
    "prefix": [
      {
        "com": "SvgIcon",
        "props": { "icon": "carbon:user-multiple", "class": "text-primary text-xl mr-2" }
      }
    ],
    "suffix": [
      { "com": "NText", "props": { "depth": 3 }, "children": "人" }
    ]
  }
}
```

## 动态插槽内容

```json
{
  "com": "NCard",
  "slots": {
    "header": [
      {
        "com": "NText",
        "children": "{{ cardTitle }}"
      }
    ]
  }
}
```

## 条件插槽

```json
{
  "com": "NCard",
  "slots": {
    "header": [
      {
        "com": "NText",
        "if": "showTitle",
        "children": "标题"
      }
    ]
  }
}
```
