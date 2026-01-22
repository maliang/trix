# Method Definition

Use `methods` to define reusable methods that can be called in event handlers and lifecycle hooks.

## Basic Syntax

```json
{
  "methods": {
    "methodName": [
      { "action1": "parameters" },
      { "action2": "parameters" }
    ]
  }
}
```

## Defining Methods

### Simple Method

```json
{
  "methods": {
    "increment": [
      { "set": "count", "value": "{{ count + 1 }}" }
    ]
  }
}
```

### Multi-step Method

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
          { "call": "$message.error", "args": ["Loading failed"] }
        ],
        "finally": [
          { "set": "loading", "value": false }
        ]
      }
    ]
  }
}
```


### Method with Conditions

```json
{
  "methods": {
    "submit": [
      {
        "if": "!form.username",
        "then": { "call": "$message.warning", "args": ["Please enter username"] },
        "else": [
          { "set": "loading", "value": true },
          { "fetch": "/api/submit", "method": "POST", "body": "{{ form }}" }
        ]
      }
    ]
  }
}
```

## Calling Methods

### In Events

```json
{
  "com": "NButton",
  "events": {
    "click": { "call": "loadData" }
  }
}
```

### With Arguments

```json
{
  "methods": {
    "deleteItem": [
      {
        "fetch": "/api/item/{{ $args[0] }}",
        "method": "DELETE",
        "then": [
          { "call": "$message.success", "args": ["Deleted successfully"] },
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

### In Lifecycle

```json
{
  "onMounted": { "call": "loadData" }
}
```

### Method Chaining

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

## Common Method Patterns

### List Loading

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
          { "call": "$message.error", "args": ["Loading failed"] }
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

### Form Submission

```json
{
  "data": {
    "form": { "name": "", "email": "" },
    "loading": false,
    "rules": {
      "name": [{ "required": true, "message": "Please enter name" }],
      "email": [{ "required": true, "message": "Please enter email" }]
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
          { "call": "$message.success", "args": ["Saved successfully"] },
          { "call": "resetForm" }
        ],
        "catch": [
          { "call": "$message.error", "args": ["Save failed: {{ $error.message }}"] }
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

### Delete Confirmation

```json
{
  "methods": {
    "handleDelete": [
      {
        "fetch": "/api/item/{{ $args[0] }}",
        "method": "DELETE",
        "then": [
          { "call": "$message.success", "args": ["Deleted successfully"] },
          { "call": "loadData" }
        ],
        "catch": [
          { "call": "$message.error", "args": ["Delete failed"] }
        ]
      }
    ]
  },
  "com": "NPopconfirm",
  "props": {
    "onPositiveClick": { "call": "handleDelete", "args": ["{{ row.id }}"] }
  },
  "children": "Are you sure you want to delete?"
}
```

### Search Debounce

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

### Modal Operations

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
      { "call": "$message.success", "args": ["Saved successfully"] },
      { "call": "closeModal" },
      { "call": "loadData" }
    ]
  }
}
```

## Accessing Arguments

### $args

Array of arguments passed when calling the method:

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

### Multiple Arguments

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

## Async Methods

Methods using `fetch` automatically support async:

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

## Using script

Complex logic can use `script`:

```json
{
  "methods": {
    "complexMethod": [
      {
        "script": "const result = state.list.filter(i => i.status === 1).map(i => i.id); state.selectedIds = result; if (result.length === 0) { window.$message?.warning('No available options'); }"
      }
    ]
  }
}
```

## Built-in Methods

Trix Admin provides a set of built-in methods that can be called in Schema via `$methods`.

### $nav - Navigation Methods

Page navigation operations:

```json
// Navigate to specified path
{ "call": "$methods.$nav.push", "args": ["/user/profile"] }

// Navigate with parameters
{ "call": "$methods.$nav.push", "args": [{ "path": "/user", "query": { "id": "{{ userId }}" } }] }

// Replace current page (no history)
{ "call": "$methods.$nav.replace", "args": ["/login"] }

// Go back
{ "call": "$methods.$nav.back" }

// Go back multiple steps
{ "call": "$methods.$nav.back", "args": [2] }

// Go forward
{ "call": "$methods.$nav.forward" }
```

### $tab - Tab Methods

Multi-tab management:

```json
// Close current tab
{ "call": "$methods.$tab.close" }

// Close specified tab
{ "call": "$methods.$tab.close", "args": ["/user/list"] }

// Close current tab and navigate to home
{ "call": "$methods.$tab.closeAndGo", "args": ["/home"] }

// Close other tabs
{ "call": "$methods.$tab.closeOthers" }

// Close tabs on the left
{ "call": "$methods.$tab.closeLeft" }

// Close tabs on the right
{ "call": "$methods.$tab.closeRight" }

// Open new tab and navigate
{ "call": "$methods.$tab.open", "args": ["/user/detail/{{ id }}"] }

// Open new tab with custom title
{ "call": "$methods.$tab.open", "args": ["/user/detail/{{ id }}", "User Detail"] }

// Open iframe tab
{ "call": "$methods.$tab.openIframe", "args": ["https://example.com", "External Page"] }

// Refresh current tab
{ "call": "$methods.$tab.refresh" }

// Pin tab
{ "call": "$methods.$tab.fix" }

// Unpin tab
{ "call": "$methods.$tab.unfix" }
```

### $window - Window Methods

Browser window operations:

```json
// Open URL in new window
{ "call": "$methods.$window.open", "args": ["https://example.com"] }

// Specify window name
{ "call": "$methods.$window.open", "args": ["https://example.com", "_blank"] }

// Close current window
{ "call": "$methods.$window.close" }

// Print current page
{ "call": "$methods.$window.print" }
```

### Practical Examples

#### Close Tab After Form Submit

```json
{
  "methods": {
    "handleSubmit": [
      { "set": "loading", "value": true },
      {
        "fetch": "/api/user",
        "method": "POST",
        "body": "{{ form }}",
        "then": [
          { "call": "$message.success", "args": ["Saved successfully"] },
          { "call": "$methods.$tab.closeAndGo", "args": ["/user/list"] }
        ],
        "catch": [
          { "call": "$message.error", "args": ["Save failed"] }
        ],
        "finally": [
          { "set": "loading", "value": false }
        ]
      }
    ]
  }
}
```

#### Quick Action Buttons

```json
{
  "com": "NSpace",
  "children": [
    {
      "com": "NButton",
      "props": { "type": "primary" },
      "events": {
        "click": { "call": "$methods.$nav.push", "args": ["/system/user"] }
      },
      "children": "User Management"
    },
    {
      "com": "NButton",
      "events": {
        "click": { "call": "$methods.$window.open", "args": ["https://docs.example.com"] }
      },
      "children": "View Documentation"
    }
  ]
}
```
