# 生命周期

JSON Schema 支持 Vue 组件的生命周期钩子。

## 可用钩子

| 钩子 | 说明 |
|------|------|
| `onMounted` | 组件挂载完成后执行 |
| `onUnmounted` | 组件卸载前执行 |

## onMounted

组件挂载完成后执行，常用于初始化数据加载。

### 调用方法

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

### 执行多个动作

```json
{
  "onMounted": [
    { "call": "loadUserInfo" },
    { "call": "loadMenus" },
    { "call": "loadNotifications" }
  ]
}
```

### 直接执行动作

```json
{
  "onMounted": { "set": "initialized", "value": true }
}
```

### 条件执行

```json
{
  "onMounted": {
    "if": "$user.id",
    "then": { "call": "loadUserData" },
    "else": { "call": "$router.push", "args": ["/login"] }
  }
}
```

### 执行脚本

```json
{
  "onMounted": {
    "script": "console.log('页面已加载'); state.startTime = Date.now();"
  }
}
```

## onUnmounted

组件卸载前执行，常用于清理定时器、取消订阅等。

### 清理定时器

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

### 保存状态

```json
{
  "onUnmounted": {
    "script": "localStorage.setItem('formDraft', JSON.stringify(state.form));"
  }
}
```

## 常用模式

### 页面初始化

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

### 带参数的页面

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

### 轮询数据

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

### 恢复草稿

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

### 监听窗口事件

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

## 执行顺序

1. `data` 初始化
2. 组件渲染
3. `onMounted` 执行
4. 用户交互...
5. `onUnmounted` 执行（页面离开时）

## 注意事项

### 1. 避免阻塞渲染

```json
// ❌ 不推荐：同步加载大量数据
{
  "onMounted": {
    "script": "const data = await fetch('/api/huge-data').then(r => r.json()); state.list = data;"
  }
}

// ✅ 推荐：显示加载状态
{
  "onMounted": [
    { "set": "loading", "value": true },
    { "fetch": "/api/huge-data", "then": [{ "set": "list", "value": "{{ $response }}" }] },
    { "set": "loading", "value": false }
  ]
}
```

### 2. 清理副作用

```json
// ✅ 确保清理定时器和事件监听
{
  "onUnmounted": [
    { "call": "clearTimers" },
    { "call": "removeEventListeners" }
  ]
}
```

### 3. 错误处理

```json
{
  "onMounted": {
    "fetch": "/api/data",
    "catch": [
      { "set": "error", "value": "{{ $error.message }}" },
      { "call": "$message.error", "args": ["初始化失败"] }
    ]
  }
}
```
