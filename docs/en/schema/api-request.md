# API Requests

JSON Schema supports declarative API requests using `fetch` action, `initApi`, and `uiApi`.

## Fetch Action

Basic API request:

```json
{
  "fetch": "/api/users",
  "then": [
    { "set": "users", "value": "{{ $response }}" }
  ],
  "catch": [
    { "call": "$message.error", "args": ["{{ $error.message }}"] }
  ]
}
```

### Request Options

```json
{
  "fetch": "/api/user",
  "method": "POST",
  "headers": {
    "X-Custom-Header": "value"
  },
  "body": "{{ form }}",
  "then": [...],
  "catch": [...],
  "finally": [...]
}
```

| Option | Type | Description |
|--------|------|-------------|
| `fetch` | `string` | Request URL |
| `method` | `string` | HTTP method (GET, POST, PUT, DELETE) |
| `headers` | `object` | Request headers |
| `body` | `any` | Request body |
| `then` | `Action[]` | Success callbacks |
| `catch` | `Action[]` | Error callbacks |
| `finally` | `Action[]` | Always executed callbacks |

## Business Status Code Handling

VSchema automatically validates business status codes based on `responseFormat` configuration:

```typescript
// Configuration in json-renderer.ts
responseFormat: {
  codeField: 'code',
  msgField: 'msg',
  dataField: 'data',
  successCode: 0
}
```

When API returns:
```json
{ "code": 500, "msg": "Server error", "data": null }
```

- `catch` callback is automatically triggered
- `$error.message` = "Server error"
- `$response` contains the full response

### Success Response

```json
{ "code": 0, "msg": "Success", "data": { "id": 1, "name": "John" } }
```

- `then` callback is triggered
- `$response` = `{ "id": 1, "name": "John" }` (extracted from `dataField`)

## initApi

Load data on component mount:

```json
{
  "data": { "user": null, "loading": true },
  "initApi": "/api/user/profile",
  "com": "NCard",
  "children": [
    { "com": "NSpin", "if": "loading" },
    { "com": "NText", "if": "!loading", "children": "{{ user.name }}" }
  ]
}
```

### initApi with Options

```json
{
  "initApi": {
    "url": "/api/user/{{ userId }}",
    "method": "GET",
    "then": [
      { "set": "loading", "value": false }
    ]
  }
}
```

## uiApi

Load UI schema dynamically:

```json
{
  "uiApi": "/api/page/dashboard",
  "com": "div",
  "children": "Loading..."
}
```

The response should return a valid JSON Schema that replaces `children`.

## Complete Example

```json
{
  "data": {
    "users": [],
    "loading": false,
    "error": null,
    "form": { "name": "", "email": "" }
  },
  "methods": {
    "loadUsers": [
      { "set": "loading", "value": true },
      { "set": "error", "value": null },
      {
        "fetch": "/api/users",
        "then": [
          { "set": "users", "value": "{{ $response }}" }
        ],
        "catch": [
          { "set": "error", "value": "{{ $error.message }}" }
        ],
        "finally": [
          { "set": "loading", "value": false }
        ]
      }
    ],
    "createUser": [
      {
        "fetch": "/api/users",
        "method": "POST",
        "body": "{{ form }}",
        "then": [
          { "call": "$message.success", "args": ["User created"] },
          { "call": "loadUsers" }
        ],
        "catch": [
          { "call": "$message.error", "args": ["{{ $error.message }}"] }
        ]
      }
    ]
  },
  "onMounted": { "call": "loadUsers" },
  "com": "NCard",
  "props": { "title": "User Management" },
  "children": [
    {
      "com": "NSpace",
      "props": { "vertical": true },
      "children": [
        {
          "com": "NForm",
          "children": [
            {
              "com": "NFormItem",
              "props": { "label": "Name" },
              "children": [
                { "com": "NInput", "model": "form.name" }
              ]
            },
            {
              "com": "NFormItem",
              "props": { "label": "Email" },
              "children": [
                { "com": "NInput", "model": "form.email" }
              ]
            },
            {
              "com": "NButton",
              "props": { "type": "primary" },
              "events": { "click": { "call": "createUser" } },
              "children": "Create"
            }
          ]
        },
        {
          "com": "NDataTable",
          "props": {
            "loading": "{{ loading }}",
            "data": "{{ users }}",
            "columns": [
              { "title": "Name", "key": "name" },
              { "title": "Email", "key": "email" }
            ]
          }
        }
      ]
    }
  ]
}
```

## Error Handling Best Practices

1. Always handle errors with `catch`
2. Show loading state during requests
3. Display user-friendly error messages
4. Use `finally` to reset loading state

```json
{
  "methods": {
    "safeRequest": [
      { "set": "loading", "value": true },
      {
        "fetch": "/api/data",
        "then": [
          { "set": "data", "value": "{{ $response }}" }
        ],
        "catch": [
          {
            "if": "$error.code === 401",
            "then": { "call": "$router.push", "args": ["/login"] },
            "else": { "call": "$message.error", "args": ["{{ $error.message }}"] }
          }
        ],
        "finally": [
          { "set": "loading", "value": false }
        ]
      }
    ]
  }
}
```
