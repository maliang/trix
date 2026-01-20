# Event Handling

JSON Schema configures event handling through `events`, supporting multiple action types.

## Basic Syntax

```json
{
  "com": "NButton",
  "events": {
    "click": { "actionType": "parameters" }
  }
}
```

## Action Types

### set - Set Data

Set a single value:

```json
{
  "events": {
    "click": { "set": "count", "value": "{{ count + 1 }}" }
  }
}
```

Set nested data:

```json
{
  "events": {
    "click": { "set": "form.username", "value": "admin" }
  }
}
```

### call - Call Method

Call a custom method:

```json
{
  "methods": {
    "handleSubmit": [
      { "set": "loading", "value": true },
      { "fetch": "/api/submit" }
    ]
  },
  "events": {
    "click": { "call": "handleSubmit" }
  }
}
```

Call with arguments:

```json
{
  "events": {
    "click": { "call": "deleteItem", "args": ["{{ row.id }}"] }
  }
}
```

Call global methods:

```json
{
  "events": {
    "click": { "call": "$router.push", "args": ["/home"] }
  }
}
```

```json
{
  "events": {
    "click": { "call": "$message.success", "args": ["Operation successful"] }
  }
}
```

### fetch - Make Request

GET request:

```json
{
  "events": {
    "click": {
      "fetch": "/api/users",
      "then": [
        { "set": "list", "value": "{{ $response }}" }
      ]
    }
  }
}
```

POST request:

```json
{
  "events": {
    "click": {
      "fetch": "/api/user",
      "method": "POST",
      "body": "{{ form }}",
      "then": [
        { "call": "$message.success", "args": ["Saved successfully"] }
      ],
      "catch": [
        { "call": "$message.error", "args": ["Save failed"] }
      ]
    }
  }
}
```

### script - Execute Script

```json
{
  "events": {
    "click": {
      "script": "console.log('clicked'); state.count++;"
    }
  }
}
```

Access state and methods:

```json
{
  "events": {
    "click": {
      "script": "if (state.form.username) { await $methods.submit(); } else { window.$message?.warning('Please enter username'); }"
    }
  }
}
```

### emit - Emit Event

```json
{
  "events": {
    "click": { "emit": "custom-event", "payload": "{{ selectedItem }}" }
  }
}
```

## Multiple Actions

Use an array to execute multiple actions:

```json
{
  "events": {
    "click": [
      { "set": "loading", "value": true },
      { "fetch": "/api/data" },
      { "set": "loading", "value": false },
      { "call": "$message.success", "args": ["Loading complete"] }
    ]
  }
}
```

## Conditional Actions

### if-then-else

```json
{
  "events": {
    "click": {
      "if": "form.username && form.password",
      "then": { "call": "login" },
      "else": { "call": "$message.warning", "args": ["Please fill in all fields"] }
    }
  }
}
```

Nested conditions:

```json
{
  "events": {
    "click": {
      "if": "!form.phone",
      "then": { "call": "$message.warning", "args": ["Please enter phone number"] },
      "else": {
        "if": "!/^1[3-9]\\d{9}$/.test(form.phone)",
        "then": { "call": "$message.warning", "args": ["Invalid phone number format"] },
        "else": { "call": "sendCode" }
      }
    }
  }
}
```

## Common Events

### Click Event

```json
{
  "com": "NButton",
  "events": {
    "click": { "call": "handleClick" }
  }
}
```

### Input Events

```json
{
  "com": "NInput",
  "events": {
    "input": { "set": "searchText", "value": "{{ $args[0] }}" },
    "blur": { "call": "validate" },
    "focus": { "set": "focused", "value": true }
  }
}
```

### Select Event

```json
{
  "com": "NSelect",
  "events": {
    "update:value": { "set": "selectedValue", "value": "{{ $args[0] }}" }
  }
}
```

### Form Event

```json
{
  "com": "NForm",
  "events": {
    "submit": { "call": "handleSubmit" }
  }
}
```

### Table Events

```json
{
  "com": "NDataTable",
  "events": {
    "update:checked-row-keys": { "set": "selectedKeys", "value": "{{ $args[0] }}" },
    "update:page": { "call": "handlePageChange", "args": ["{{ $args[0] }}"] }
  }
}
```

## Event Parameters

### $args

Array of event callback arguments:

```json
{
  "events": {
    "update:value": { "set": "value", "value": "{{ $args[0] }}" }
  }
}
```

### $event

Native DOM event object:

```json
{
  "events": {
    "click": { "script": "console.log($event.target)" }
  }
}
```

### row

Table row data (in table column rendering):

```json
{
  "events": {
    "click": { "call": "editRow", "args": ["{{ row }}"] }
  }
}
```

## Prevent Default Behavior

```json
{
  "events": {
    "click": {
      "script": "$event.preventDefault(); $event.stopPropagation();"
    }
  }
}
```

## Debounce and Throttle

Implement using script:

```json
{
  "data": {
    "searchTimer": null
  },
  "events": {
    "input": {
      "script": "clearTimeout(state.searchTimer); state.searchTimer = setTimeout(() => { $methods.search(); }, 300);"
    }
  }
}
```

## Example: Complete Form

```json
{
  "data": {
    "form": { "username": "", "password": "" },
    "loading": false,
    "rules": {
      "username": [{ "required": true, "message": "Please enter username" }],
      "password": [{ "required": true, "message": "Please enter password" }]
    }
  },
  "methods": {
    "handleSubmit": [
      { "set": "loading", "value": true },
      {
        "fetch": "/api/login",
        "method": "POST",
        "body": "{{ form }}",
        "then": [
          { "call": "$message.success", "args": ["Login successful"] },
          { "call": "$router.push", "args": ["/home"] }
        ],
        "catch": [
          { "call": "$message.error", "args": ["Login failed"] }
        ],
        "finally": [
          { "set": "loading", "value": false }
        ]
      }
    ]
  },
  "com": "NForm",
  "props": { "model": "{{ form }}", "rules": "{{ rules }}" },
  "children": [
    {
      "com": "NFormItem",
      "props": { "path": "username", "label": "Username" },
      "children": [{ "com": "NInput", "model": "form.username" }]
    },
    {
      "com": "NFormItem",
      "props": { "path": "password", "label": "Password" },
      "children": [{ "com": "NInput", "model": "form.password", "props": { "type": "password" } }]
    },
    {
      "com": "NButton",
      "props": { "type": "primary", "loading": "{{ loading }}" },
      "events": { "click": { "call": "handleSubmit" } },
      "children": "Login"
    }
  ]
}
```
