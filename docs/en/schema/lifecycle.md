# Lifecycle

JSON Schema supports Vue component lifecycle hooks.

## Available Hooks

| Hook | Description |
|------|-------------|
| `onMounted` | Executed after the component is mounted |
| `onUnmounted` | Executed before the component is unmounted |

## onMounted

Executed after the component is mounted, commonly used for initial data loading.

### Calling Methods

```json
{
  "methods": {
    "loadData": [
      { "fetch": "/api/list", "then": [{ "set": "list", "value": "{{ $response }}" }] }
    ]
  },
  "onMounted": { "call": "loadData" }
}
```

### Executing Multiple Actions

```json
{
  "onMounted": [
    { "call": "loadUserInfo" },
    { "call": "loadMenus" },
    { "call": "loadNotifications" }
  ]
}
```

### Direct Action Execution

```json
{
  "onMounted": { "set": "initialized", "value": true }
}
```


### Conditional Execution

```json
{
  "onMounted": {
    "if": "$user.id",
    "then": { "call": "loadUserData" },
    "else": { "call": "$router.push", "args": ["/login"] }
  }
}
```

### Execute Script

```json
{
  "onMounted": {
    "script": "console.log('Page loaded'); state.startTime = Date.now();"
  }
}
```

## onUnmounted

Executed before the component is unmounted, commonly used for cleaning up timers, unsubscribing, etc.

### Clear Timers

```json
{
  "data": {
    "timer": null
  },
  "methods": {
    "startTimer": [
      {
        "script": "state.timer = setInterval(() => { state.count++; }, 1000);"
      }
    ],
    "stopTimer": [
      {
        "script": "if (state.timer) { clearInterval(state.timer); state.timer = null; }"
      }
    ]
  },
  "onMounted": { "call": "startTimer" },
  "onUnmounted": { "call": "stopTimer" }
}
```

### Save State

```json
{
  "onUnmounted": {
    "script": "localStorage.setItem('formDraft', JSON.stringify(state.form));"
  }
}
```

## Common Patterns

### Page Initialization

```json
{
  "data": {
    "loading": true,
    "list": [],
    "error": null
  },
  "methods": {
    "init": [
      { "set": "loading", "value": true },
      { "set": "error", "value": null },
      {
        "fetch": "/api/data",
        "then": [
          { "set": "list", "value": "{{ $response }}" }
        ],
        "catch": [
          { "set": "error", "value": "{{ $error.message }}" }
        ],
        "finally": [
          { "set": "loading", "value": false }
        ]
      }
    ]
  },
  "onMounted": { "call": "init" }
}
```

### Page with Parameters

```json
{
  "data": {
    "id": null,
    "detail": null
  },
  "methods": {
    "loadDetail": [
      {
        "script": "state.id = new URLSearchParams(window.location.search).get('id');"
      },
      {
        "if": "id",
        "then": {
          "fetch": "/api/item/{{ id }}",
          "then": [{ "set": "detail", "value": "{{ $response }}" }]
        }
      }
    ]
  },
  "onMounted": { "call": "loadDetail" }
}
```

### Data Polling

```json
{
  "data": {
    "pollingTimer": null,
    "data": null
  },
  "methods": {
    "fetchData": [
      {
        "fetch": "/api/realtime-data",
        "then": [{ "set": "data", "value": "{{ $response }}" }]
      }
    ],
    "startPolling": [
      { "call": "fetchData" },
      {
        "script": "state.pollingTimer = setInterval(() => { $methods.fetchData(); }, 5000);"
      }
    ],
    "stopPolling": [
      {
        "script": "if (state.pollingTimer) { clearInterval(state.pollingTimer); }"
      }
    ]
  },
  "onMounted": { "call": "startPolling" },
  "onUnmounted": { "call": "stopPolling" }
}
```

### Restore Draft

```json
{
  "data": {
    "form": { "title": "", "content": "" }
  },
  "methods": {
    "loadDraft": [
      {
        "script": "const draft = localStorage.getItem('articleDraft'); if (draft) { try { state.form = JSON.parse(draft); } catch(e) {} }"
      }
    ],
    "saveDraft": [
      {
        "script": "localStorage.setItem('articleDraft', JSON.stringify(state.form));"
      }
    ],
    "clearDraft": [
      {
        "script": "localStorage.removeItem('articleDraft');"
      }
    ]
  },
  "onMounted": { "call": "loadDraft" },
  "onUnmounted": { "call": "saveDraft" }
}
```

### Listen to Window Events

```json
{
  "data": {
    "windowWidth": 0
  },
  "methods": {
    "handleResize": [
      { "script": "state.windowWidth = window.innerWidth;" }
    ],
    "addResizeListener": [
      { "call": "handleResize" },
      { "script": "window.addEventListener('resize', () => { state.windowWidth = window.innerWidth; });" }
    ],
    "removeResizeListener": [
      { "script": "window.removeEventListener('resize', () => {});" }
    ]
  },
  "onMounted": { "call": "addResizeListener" },
  "onUnmounted": { "call": "removeResizeListener" }
}
```

## Execution Order

1. `data` initialization
2. Component rendering
3. `onMounted` execution
4. User interactions...
5. `onUnmounted` execution (when leaving the page)

## Notes

### 1. Avoid Blocking Rendering

```json
// ❌ Not recommended: Synchronously loading large data
{
  "onMounted": {
    "script": "const data = await fetch('/api/huge-data').then(r => r.json()); state.list = data;"
  }
}

// ✅ Recommended: Show loading state
{
  "onMounted": [
    { "set": "loading", "value": true },
    { "fetch": "/api/huge-data", "then": [{ "set": "list", "value": "{{ $response }}" }] },
    { "set": "loading", "value": false }
  ]
}
```

### 2. Clean Up Side Effects

```json
// ✅ Ensure timers and event listeners are cleaned up
{
  "onUnmounted": [
    { "call": "clearTimers" },
    { "call": "removeEventListeners" }
  ]
}
```

### 3. Error Handling

```json
{
  "onMounted": {
    "fetch": "/api/data",
    "catch": [
      { "set": "error", "value": "{{ $error.message }}" },
      { "call": "$message.error", "args": ["Initialization failed"] }
    ]
  }
}
```
