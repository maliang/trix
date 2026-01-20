# CRUD List Example

A complete CRUD (Create, Read, Update, Delete) list page JSON Schema example.

## Features

The CRUD list includes:
- Search and filtering
- Data table
- Pagination
- Add/Edit modal
- Delete confirmation

## Schema Structure

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
    "modalTitle": "Add User",
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
          { "call": "$message.error", "args": ["Failed to load data"] }
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
    "openAddModal": [
      { "set": "isEdit", "value": false },
      { "set": "modalTitle", "value": "Add User" },
      { "set": "form", "value": "{{ ({ name: '', email: '', phone: '', status: 1 }) }}" },
      { "set": "modalVisible", "value": true }
    ],
    "openEditModal": [
      { "set": "isEdit", "value": true },
      { "set": "modalTitle", "value": "Edit User" },
      { "set": "editingItem", "value": "{{ $args[0] }}" },
      { "set": "form", "value": "{{ JSON.parse(JSON.stringify($args[0])) }}" },
      { "set": "modalVisible", "value": true }
    ],
    "handleSubmit": [
      { "set": "submitting", "value": true },
      {
        "if": "isEdit",
        "then": { "fetch": "/api/users/{{ editingItem.id }}", "method": "PUT", "body": "{{ form }}" },
        "else": { "fetch": "/api/users", "method": "POST", "body": "{{ form }}" }
      },
      { "call": "$message.success", "args": ["{{ isEdit ? 'Updated' : 'Created' }} successfully"] },
      { "call": "closeModal" },
      { "call": "loadData" },
      { "set": "submitting", "value": false }
    ],
    "handleDelete": [
      {
        "fetch": "/api/users/{{ $args[0] }}",
        "method": "DELETE",
        "then": [
          { "call": "$message.success", "args": ["Deleted successfully"] },
          { "call": "loadData" }
        ]
      }
    ]
  },
  "onMounted": { "call": "loadData" }
}
```


## UI Structure

The page consists of:
- Search card with keyword input and status select
- Data table with selection, columns, and action buttons
- Pagination component
- Modal for add/edit form

## Key Points

### 1. Search and Pagination

Reset page number when searching:

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

### 2. Table Selection

Use `checkedRowKeys` for multi-selection:

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

### 3. Add/Edit Reuse

Distinguish between add and edit using `isEdit`:

```json
{
  "if": "isEdit",
  "then": { "fetch": "/api/users/{{ editingItem.id }}", "method": "PUT" },
  "else": { "fetch": "/api/users", "method": "POST" }
}
```

### 4. Permission Control

Use `if` to control button visibility:

```json
{
  "com": "NButton",
  "if": "$permissions.includes('user:write')",
  "children": "Edit"
}
```

### 5. Delete Confirmation

Use NPopconfirm for delete confirmation:

```json
{
  "com": "NPopconfirm",
  "props": { "onPositiveClick": { "call": "handleDelete", "args": ["{{ row.id }}"] } },
  "slots": {
    "trigger": [{ "com": "NButton", "props": { "text": true, "type": "error" }, "children": "Delete" }]
  },
  "children": "Are you sure you want to delete?"
}
```

### 6. Batch Operations

Handle batch delete with selected items:

```json
{
  "methods": {
    "handleBatchDelete": [
      {
        "if": "selectedKeys.length === 0",
        "then": { "call": "$message.warning", "args": ["Please select items to delete"] },
        "else": {
          "fetch": "/api/users/batch",
          "method": "DELETE",
          "body": "{{ { ids: selectedKeys } }}"
        }
      }
    ]
  }
}
```
