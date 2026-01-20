# 方法定义

使用 `methods` 定义可复用的方法，在事件处理和生命周期中调用。

## 基本语法

```json
{
  "methods": {
    "methodName": [
      { "动作1": "参数" },
      { "动作2": "参数" }
    ]
  }
}
```

## 定义方法

### 简单方法

```json
{
  "methods": {
    "increment": [
      { "set": "count", "value": "{{ count + 1 }}" }
    ]
  }
}
```

### 多步骤方法

```json
{
  "methods": {
    "loadData": [
      { "set": "loading", "value": true },
      {
        "fetch": "/api/list",
        "then": [
          { "set": "list", "value": "{{ $response.data }}" },
          { "set": "total", "value": "{{ $response.total }}" }
        ],
        "catch": [
          { "call": "$message.error", "args": ["加载失败"] }
        ],
        "finally": [
          { "set": "loading", "value": false }
        ]
      }
    ]
  }
}
```

### 带条件的方法

```json
{
  "methods": {
    "submit": [
      {
        "if": "!form.username",
        "then": { "call": "$message.warning", "args": ["请输入用户名"] },
        "else": [
          { "set": "loading", "value": true },
          { "fetch": "/api/submit", "method": "POST", "body": "{{ form }}" }
        ]
      }
    ]
  }
}
```

## 调用方法

### 在事件中调用

```json
{
  "com": "NButton",
  "events": {
    "click": { "call": "loadData" }
  }
}
```

### 带参数调用

```json
{
  "methods": {
    "deleteItem": [
      {
        "fetch": "/api/item/{{ $args[0] }}",
        "method": "DELETE",
        "then": [
          { "call": "$message.success", "args": ["删除成功"] },
          { "call": "loadData" }
        ]
      }
    ]
  },
  "events": {
    "click": { "call": "deleteItem", "args": ["{{ row.id }}"] }
  }
}
```

### 在生命周期中调用

```json
{
  "onMounted": { "call": "loadData" }
}
```

### 方法间调用

```json
{
  "methods": {
    "refresh": [
      { "set": "pagination.page", "value": 1 },
      { "call": "loadData" }
    ],
    "loadData": [
      { "fetch": "/api/list?page={{ pagination.page }}" }
    ]
  }
}
```

## 常用方法模式

### 列表加载

```json
{
  "data": {
    "list": [],
    "loading": false,
    "pagination": {
      "page": 1,
      "pageSize": 10,
      "total": 0
    }
  },
  "methods": {
    "loadData": [
      { "set": "loading", "value": true },
      {
        "fetch": "/api/list?page={{ pagination.page }}&pageSize={{ pagination.pageSize }}",
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
    "handlePageChange": [
      { "set": "pagination.page", "value": "{{ $args[0] }}" },
      { "call": "loadData" }
    ],
    "handlePageSizeChange": [
      { "set": "pagination.pageSize", "value": "{{ $args[0] }}" },
      { "set": "pagination.page", "value": 1 },
      { "call": "loadData" }
    ]
  },
  "onMounted": { "call": "loadData" }
}
```

### 表单提交

```json
{
  "data": {
    "form": { "name": "", "email": "" },
    "loading": false,
    "rules": {
      "name": [{ "required": true, "message": "请输入名称" }],
      "email": [{ "required": true, "message": "请输入邮箱" }]
    }
  },
  "methods": {
    "handleSubmit": [
      { "set": "loading", "value": true },
      {
        "fetch": "/api/user",
        "method": "POST",
        "body": "{{ form }}",
        "then": [
          { "call": "$message.success", "args": ["保存成功"] },
          { "call": "resetForm" }
        ],
        "catch": [
          { "call": "$message.error", "args": ["保存失败：{{ $error.message }}"] }
        ],
        "finally": [
          { "set": "loading", "value": false }
        ]
      }
    ],
    "resetForm": [
      { "set": "form", "value": "{{ ({ name: '', email: '' }) }}" }
    ]
  }
}
```

### 删除确认

```json
{
  "methods": {
    "handleDelete": [
      {
        "fetch": "/api/item/{{ $args[0] }}",
        "method": "DELETE",
        "then": [
          { "call": "$message.success", "args": ["删除成功"] },
          { "call": "loadData" }
        ],
        "catch": [
          { "call": "$message.error", "args": ["删除失败"] }
        ]
      }
    ]
  },
  "com": "NPopconfirm",
  "props": {
    "onPositiveClick": { "call": "handleDelete", "args": ["{{ row.id }}"] }
  },
  "children": "确定要删除吗？"
}
```

### 搜索防抖

```json
{
  "data": {
    "searchText": "",
    "searchTimer": null
  },
  "methods": {
    "handleSearch": [
      { "script": "clearTimeout(state.searchTimer)" },
      {
        "script": "state.searchTimer = setTimeout(() => { $methods.doSearch(); }, 300)"
      }
    ],
    "doSearch": [
      { "set": "pagination.page", "value": 1 },
      { "call": "loadData" }
    ]
  }
}
```

### 弹窗操作

```json
{
  "data": {
    "modalVisible": false,
    "editingItem": null,
    "isEdit": false
  },
  "methods": {
    "openAddModal": [
      { "set": "isEdit", "value": false },
      { "set": "editingItem", "value": "{{ ({ name: '', status: 1 }) }}" },
      { "set": "modalVisible", "value": true }
    ],
    "openEditModal": [
      { "set": "isEdit", "value": true },
      { "set": "editingItem", "value": "{{ JSON.parse(JSON.stringify($args[0])) }}" },
      { "set": "modalVisible", "value": true }
    ],
    "closeModal": [
      { "set": "modalVisible", "value": false },
      { "set": "editingItem", "value": null }
    ],
    "handleSave": [
      {
        "if": "isEdit",
        "then": {
          "fetch": "/api/item/{{ editingItem.id }}",
          "method": "PUT",
          "body": "{{ editingItem }}"
        },
        "else": {
          "fetch": "/api/item",
          "method": "POST",
          "body": "{{ editingItem }}"
        }
      },
      { "call": "$message.success", "args": ["保存成功"] },
      { "call": "closeModal" },
      { "call": "loadData" }
    ]
  }
}
```

## 访问参数

### $args

方法调用时传入的参数数组：

```json
{
  "methods": {
    "setStatus": [
      { "set": "status", "value": "{{ $args[0] }}" }
    ]
  },
  "events": {
    "click": { "call": "setStatus", "args": ["active"] }
  }
}
```

### 多个参数

```json
{
  "methods": {
    "updateItem": [
      {
        "fetch": "/api/item/{{ $args[0] }}",
        "method": "PUT",
        "body": "{{ $args[1] }}"
      }
    ]
  },
  "events": {
    "click": { "call": "updateItem", "args": ["{{ row.id }}", "{{ form }}"] }
  }
}
```

## 异步方法

使用 `fetch` 的方法自动支持异步：

```json
{
  "methods": {
    "asyncMethod": [
      { "set": "loading", "value": true },
      {
        "fetch": "/api/data",
        "then": [
          { "set": "data", "value": "{{ $response }}" }
        ],
        "finally": [
          { "set": "loading", "value": false }
        ]
      }
    ]
  }
}
```

## 使用 script

复杂逻辑可以使用 `script`：

```json
{
  "methods": {
    "complexMethod": [
      {
        "script": "const result = state.list.filter(i => i.status === 1).map(i => i.id); state.selectedIds = result; if (result.length === 0) { window.$message?.warning('没有可选项'); }"
      }
    ]
  }
}
```
