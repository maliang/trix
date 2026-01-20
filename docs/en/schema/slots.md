# Slots

Use the `slots` property to define named slot content for components.

## Basic Syntax

```json
{
  "com": "NCard",
  "slots": {
    "header": [
      { "com": "NText", "children": "Custom Header" }
    ],
    "footer": [
      { "com": "NButton", "children": "OK" }
    ]
  },
  "children": "Card Content"
}
```

## Common Component Slots

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
          { "com": "NText", "props": { "strong": true }, "children": "Title" },
          { "com": "NButton", "props": { "size": "small" }, "children": "Action" }
        ]
      }
    ],
    "header-extra": [
      { "com": "NButton", "props": { "text": true }, "children": "More" }
    ],
    "footer": [
      {
        "com": "NSpace",
        "children": [
          { "com": "NButton", "children": "Cancel" },
          { "com": "NButton", "props": { "type": "primary" }, "children": "OK" }
        ]
      }
    ]
  },
  "children": "Card Content"
}
```


### NInput

```json
{
  "com": "NInput",
  "model": "form.username",
  "props": { "placeholder": "Please enter username" },
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
      { "com": "NEmpty", "props": { "description": "No options available" } }
    ],
    "action": [
      {
        "com": "NButton",
        "props": { "text": true, "block": true },
        "events": { "click": { "call": "addOption" } },
        "children": "+ Add Option"
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
  "props": { "preset": "card", "title": "Modal Title" },
  "slots": {
    "header": [
      {
        "com": "NFlex",
        "props": { "align": "center" },
        "children": [
          { "com": "SvgIcon", "props": { "icon": "carbon:edit", "style": { "marginRight": "8px" } } },
          { "com": "NText", "children": "Edit Information" }
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
            "children": "Cancel"
          },
          {
            "com": "NButton",
            "props": { "type": "primary", "loading": "{{ loading }}" },
            "events": { "click": { "call": "handleSave" } },
            "children": "Save"
          }
        ]
      }
    ]
  },
  "children": "Modal Content"
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
      "props": { "title": "Drawer Title" },
      "slots": {
        "footer": [
          {
            "com": "NSpace",
            "children": [
              { "com": "NButton", "children": "Cancel" },
              { "com": "NButton", "props": { "type": "primary" }, "children": "OK" }
            ]
          }
        ]
      },
      "children": "Drawer Content"
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
        "children": "Delete"
      }
    ]
  },
  "children": "Are you sure you want to delete this record?"
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
  "children": "This is a tooltip message"
}
```

### NDropdown

```json
{
  "com": "NDropdown",
  "props": {
    "options": [
      { "label": "Edit", "key": "edit" },
      { "label": "Delete", "key": "delete" }
    ],
    "onSelect": { "call": "handleAction", "args": ["{{ $args[0] }}"] }
  },
  "slots": {
    "default": [
      {
        "com": "NButton",
        "children": "More Actions"
      }
    ]
  }
}
```


### NDataTable

Custom rendering for table columns:

```json
{
  "com": "NDataTable",
  "props": {
    "data": "{{ list }}",
    "columns": [
      { "title": "Name", "key": "name" },
      {
        "title": "Status",
        "key": "status",
        "render": {
          "com": "NTag",
          "props": {
            "type": "{{ row.status === 1 ? 'success' : 'error' }}"
          },
          "children": "{{ row.status === 1 ? 'Enabled' : 'Disabled' }}"
        }
      },
      {
        "title": "Actions",
        "key": "actions",
        "render": {
          "com": "NSpace",
          "children": [
            {
              "com": "NButton",
              "props": { "size": "small" },
              "events": { "click": { "call": "editRow", "args": ["{{ row }}"] } },
              "children": "Edit"
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
                    "children": "Delete"
                  }
                ]
              },
              "children": "Confirm delete?"
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
  "props": { "label": "Total Users", "value": "{{ stats.totalUsers }}" },
  "slots": {
    "prefix": [
      {
        "com": "SvgIcon",
        "props": { "icon": "carbon:user-multiple", "class": "text-primary text-xl mr-2" }
      }
    ],
    "suffix": [
      { "com": "NText", "props": { "depth": 3 }, "children": "users" }
    ]
  }
}
```

## Dynamic Slot Content

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

## Conditional Slots

```json
{
  "com": "NCard",
  "slots": {
    "header": [
      {
        "com": "NText",
        "if": "showTitle",
        "children": "Title"
      }
    ]
  }
}
```
