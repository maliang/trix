# CRUD 列表示例

完整的增删改查列表页面 JSON Schema 示例。

## 效果

CRUD 列表包含：
- 搜索筛选
- 数据表格
- 分页
- 新增/编辑弹窗
- 删除确认

## Schema 结构

```json
{
  "data": {
    "list": [],
    "loading": false,
    "searchForm": {
      "keyword": "",
      "status": null
    },
    "pagination": {
      "page": 1,
      "pageSize": 10,
      "total": 0
    },
    "modalVisible": false,
    "modalTitle": "新增用户",
    "isEdit": false,
    "editingItem": null,
    "form": {
      "name": "",
      "email": "",
      "phone": "",
      "status": 1
    },
    "submitting": false,
    "selectedKeys": []
  },
  "methods": {
    "loadData": [
      { "set": "loading", "value": true },
      {
        "fetch": "/api/users?page={{ pagination.page }}&pageSize={{ pagination.pageSize }}&keyword={{ searchForm.keyword }}&status={{ searchForm.status }}",
        "then": [
          { "set": "list", "value": "{{ $response.list }}" },
          { "set": "pagination.total", "value": "{{ $response.total }}" }
        ],
        "catch": [
          { "call": "$message.error", "args": ["加载失败"] }
        ],
        "finally": [
          { "set": "loading", "value": false }
        ]
      }
    ],
    "handleSearch": [
      { "set": "pagination.page", "value": 1 },
      { "call": "loadData" }
    ],
    "handleReset": [
      { "set": "searchForm", "value": "{{ ({ keyword: '', status: null }) }}" },
      { "set": "pagination.page", "value": 1 },
      { "call": "loadData" }
    ],
    "handlePageChange": [
      { "set": "pagination.page", "value": "{{ $args[0] }}" },
      { "call": "loadData" }
    ],
    "handlePageSizeChange": [
      { "set": "pagination.pageSize", "value": "{{ $args[0] }}" },
      { "set": "pagination.page", "value": 1 },
      { "call": "loadData" }
    ],
    "openAddModal": [
      { "set": "isEdit", "value": false },
      { "set": "modalTitle", "value": "新增用户" },
      { "set": "form", "value": "{{ ({ name: '', email: '', phone: '', status: 1 }) }}" },
      { "set": "modalVisible", "value": true }
    ],
    "openEditModal": [
      { "set": "isEdit", "value": true },
      { "set": "modalTitle", "value": "编辑用户" },
      { "set": "editingItem", "value": "{{ $args[0] }}" },
      { "set": "form", "value": "{{ JSON.parse(JSON.stringify($args[0])) }}" },
      { "set": "modalVisible", "value": true }
    ],
    "closeModal": [
      { "set": "modalVisible", "value": false },
      { "set": "editingItem", "value": null }
    ],
    "handleSubmit": [
      { "set": "submitting", "value": true },
      {
        "if": "isEdit",
        "then": {
          "fetch": "/api/users/{{ editingItem.id }}",
          "method": "PUT",
          "body": "{{ form }}"
        },
        "else": {
          "fetch": "/api/users",
          "method": "POST",
          "body": "{{ form }}"
        }
      },
      { "call": "$message.success", "args": ["{{ isEdit ? '更新成功' : '创建成功' }}"] },
      { "call": "closeModal" },
      { "call": "loadData" },
      { "set": "submitting", "value": false }
    ],
    "handleDelete": [
      {
        "fetch": "/api/users/{{ $args[0] }}",
        "method": "DELETE",
        "then": [
          { "call": "$message.success", "args": ["删除成功"] },
          { "call": "loadData" }
        ],
        "catch": [
          { "call": "$message.error", "args": ["删除失败"] }
        ]
      }
    ],
    "handleBatchDelete": [
      {
        "if": "selectedKeys.length === 0",
        "then": { "call": "$message.warning", "args": ["请选择要删除的数据"] },
        "else": {
          "fetch": "/api/users/batch",
          "method": "DELETE",
          "body": "{{ { ids: selectedKeys } }}",
          "then": [
            { "call": "$message.success", "args": ["批量删除成功"] },
            { "set": "selectedKeys", "value": [] },
            { "call": "loadData" }
          ]
        }
      }
    ]
  },
  "onMounted": { "call": "loadData" },
  "com": "NSpace",
  "props": { "vertical": true, "size": "large" },
  "children": [
    {
      "com": "NCard",
      "children": [
        {
          "com": "NForm",
          "props": { "inline": true, "labelPlacement": "left" },
          "children": [
            {
              "com": "NFormItem",
              "props": { "label": "关键词" },
              "children": [
                { "com": "NInput", "model": "searchForm.keyword", "props": { "placeholder": "请输入关键词", "clearable": true } }
              ]
            },
            {
              "com": "NFormItem",
              "props": { "label": "状态" },
              "children": [
                {
                  "com": "NSelect",
                  "model": "searchForm.status",
                  "props": {
                    "placeholder": "请选择状态",
                    "clearable": true,
                    "style": { "width": "150px" },
                    "options": [
                      { "label": "启用", "value": 1 },
                      { "label": "禁用", "value": 0 }
                    ]
                  }
                }
              ]
            },
            {
              "com": "NFormItem",
              "children": [
                {
                  "com": "NSpace",
                  "children": [
                    { "com": "NButton", "props": { "type": "primary" }, "events": { "click": { "call": "handleSearch" } }, "children": "搜索" },
                    { "com": "NButton", "events": { "click": { "call": "handleReset" } }, "children": "重置" }
                  ]
                }
              ]
            }
          ]
        }
      ]
    },
    {
      "com": "NCard",
      "children": [
        {
          "com": "NFlex",
          "props": { "justify": "space-between", "style": { "marginBottom": "16px" } },
          "children": [
            {
              "com": "NSpace",
              "children": [
                {
                  "com": "NButton",
                  "if": "$permissions.includes('user:write')",
                  "props": { "type": "primary" },
                  "events": { "click": { "call": "openAddModal" } },
                  "children": [
                    { "com": "SvgIcon", "props": { "icon": "carbon:add", "style": { "marginRight": "4px" } } },
                    "新增"
                  ]
                },
                {
                  "com": "NButton",
                  "if": "$permissions.includes('user:delete')",
                  "props": { "type": "error", "disabled": "{{ selectedKeys.length === 0 }}" },
                  "events": { "click": { "call": "handleBatchDelete" } },
                  "children": "批量删除"
                }
              ]
            },
            {
              "com": "NSpace",
              "children": [
                { "com": "NButton", "events": { "click": { "call": "loadData" } }, "children": [{ "com": "SvgIcon", "props": { "icon": "carbon:refresh" } }] }
              ]
            }
          ]
        },
        {
          "com": "NDataTable",
          "props": {
            "data": "{{ list }}",
            "loading": "{{ loading }}",
            "rowKey": "{{ row => row.id }}",
            "checkedRowKeys": "{{ selectedKeys }}",
            "columns": [
              { "type": "selection" },
              { "title": "ID", "key": "id", "width": 80 },
              { "title": "姓名", "key": "name" },
              { "title": "邮箱", "key": "email" },
              { "title": "手机", "key": "phone" },
              {
                "title": "状态",
                "key": "status",
                "render": {
                  "com": "NTag",
                  "props": { "type": "{{ row.status === 1 ? 'success' : 'error' }}" },
                  "children": "{{ row.status === 1 ? '启用' : '禁用' }}"
                }
              },
              { "title": "创建时间", "key": "createdAt" },
              {
                "title": "操作",
                "key": "actions",
                "width": 150,
                "render": {
                  "com": "NSpace",
                  "children": [
                    {
                      "com": "NButton",
                      "if": "$permissions.includes('user:write')",
                      "props": { "size": "small", "text": true, "type": "primary" },
                      "events": { "click": { "call": "openEditModal", "args": ["{{ row }}"] } },
                      "children": "编辑"
                    },
                    {
                      "com": "NPopconfirm",
                      "if": "$permissions.includes('user:delete')",
                      "props": { "onPositiveClick": { "call": "handleDelete", "args": ["{{ row.id }}"] } },
                      "slots": {
                        "trigger": [
                          { "com": "NButton", "props": { "size": "small", "text": true, "type": "error" }, "children": "删除" }
                        ]
                      },
                      "children": "确定要删除吗？"
                    }
                  ]
                }
              }
            ]
          },
          "events": {
            "update:checked-row-keys": { "set": "selectedKeys", "value": "{{ $args[0] }}" }
          }
        },
        {
          "com": "NFlex",
          "props": { "justify": "end", "style": { "marginTop": "16px" } },
          "children": [
            {
              "com": "NPagination",
              "props": {
                "page": "{{ pagination.page }}",
                "pageSize": "{{ pagination.pageSize }}",
                "itemCount": "{{ pagination.total }}",
                "showSizePicker": true,
                "pageSizes": [10, 20, 50, 100]
              },
              "events": {
                "update:page": { "call": "handlePageChange", "args": ["{{ $args[0] }}"] },
                "update:page-size": { "call": "handlePageSizeChange", "args": ["{{ $args[0] }}"] }
              }
            }
          ]
        }
      ]
    },
    {
      "com": "NModal",
      "model:show": "modalVisible",
      "props": { "preset": "card", "title": "{{ modalTitle }}", "style": { "width": "500px" } },
      "children": [
        {
          "com": "NForm",
          "props": { "model": "{{ form }}", "labelPlacement": "left", "labelWidth": 80 },
          "children": [
            {
              "com": "NFormItem",
              "props": { "label": "姓名", "required": true },
              "children": [{ "com": "NInput", "model": "form.name", "props": { "placeholder": "请输入姓名" } }]
            },
            {
              "com": "NFormItem",
              "props": { "label": "邮箱", "required": true },
              "children": [{ "com": "NInput", "model": "form.email", "props": { "placeholder": "请输入邮箱" } }]
            },
            {
              "com": "NFormItem",
              "props": { "label": "手机" },
              "children": [{ "com": "NInput", "model": "form.phone", "props": { "placeholder": "请输入手机号" } }]
            },
            {
              "com": "NFormItem",
              "props": { "label": "状态" },
              "children": [
                {
                  "com": "NRadioGroup",
                  "model": "form.status",
                  "children": [
                    { "com": "NRadio", "props": { "value": 1 }, "children": "启用" },
                    { "com": "NRadio", "props": { "value": 0 }, "children": "禁用" }
                  ]
                }
              ]
            }
          ]
        },
        {
          "com": "NFlex",
          "props": { "justify": "end", "style": { "marginTop": "24px" } },
          "children": [
            { "com": "NButton", "events": { "click": { "call": "closeModal" } }, "children": "取消" },
            {
              "com": "NButton",
              "props": { "type": "primary", "loading": "{{ submitting }}" },
              "events": { "click": { "call": "handleSubmit" } },
              "children": "确定"
            }
          ]
        }
      ]
    }
  ]
}
```

## 关键点

### 1. 搜索和分页

搜索时重置页码：

```json
{
  "methods": {
    "handleSearch": [
      { "set": "pagination.page", "value": 1 },
      { "call": "loadData" }
    ]
  }
}
```

### 2. 表格选择

使用 `checkedRowKeys` 实现多选：

```json
{
  "props": {
    "checkedRowKeys": "{{ selectedKeys }}"
  },
  "events": {
    "update:checked-row-keys": { "set": "selectedKeys", "value": "{{ $args[0] }}" }
  }
}
```

### 3. 新增/编辑复用

通过 `isEdit` 区分新增和编辑：

```json
{
  "if": "isEdit",
  "then": { "fetch": "/api/users/{{ editingItem.id }}", "method": "PUT" },
  "else": { "fetch": "/api/users", "method": "POST" }
}
```

### 4. 权限控制

使用 `if` 控制按钮显示：

```json
{
  "com": "NButton",
  "if": "$permissions.includes('user:write')",
  "children": "编辑"
}
```
