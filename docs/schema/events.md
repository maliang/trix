# 事件处理

JSON Schema 通过 `events` 配置事件处理，支持多种动作类型。

## 基本语法

```json
{
  "com": "NButton",
  "events": {
    "click": { "动作类型": "参数" }
  }
}
```

## 动作类型

### set - 设置数据

设置单个数据：

```json
{
  "events": {
    "click": { "set": "count", "value": "{{ count + 1 }}" }
  }
}
```

设置嵌套数据：

```json
{
  "events": {
    "click": { "set": "form.username", "value": "admin" }
  }
}
```

### call - 调用方法

调用自定义方法：

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

带参数调用：

```json
{
  "events": {
    "click": { "call": "deleteItem", "args": ["{{ row.id }}"] }
  }
}
```

调用全局方法：

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
    "click": { "call": "$message.success", "args": ["操作成功"] }
  }
}
```

### fetch - 发起请求

GET 请求：

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

POST 请求：

```json
{
  "events": {
    "click": {
      "fetch": "/api/user",
      "method": "POST",
      "body": "{{ form }}",
      "then": [
        { "call": "$message.success", "args": ["保存成功"] }
      ],
      "catch": [
        { "call": "$message.error", "args": ["保存失败"] }
      ]
    }
  }
}
```

### script - 执行脚本

```json
{
  "events": {
    "click": {
      "script": "console.log('clicked'); state.count++;"
    }
  }
}
```

访问状态和方法：

```json
{
  "events": {
    "click": {
      "script": "if (state.form.username) { await $methods.submit(); } else { window.$message?.warning('请输入用户名'); }"
    }
  }
}
```

### emit - 触发事件

```json
{
  "events": {
    "click": { "emit": "custom-event", "payload": "{{ selectedItem }}" }
  }
}
```

## 多个动作

使用数组执行多个动作：

```json
{
  "events": {
    "click": [
      { "set": "loading", "value": true },
      { "fetch": "/api/data" },
      { "set": "loading", "value": false },
      { "call": "$message.success", "args": ["加载完成"] }
    ]
  }
}
```

## 条件动作

### if-then-else

```json
{
  "events": {
    "click": {
      "if": "form.username && form.password",
      "then": { "call": "login" },
      "else": { "call": "$message.warning", "args": ["请填写完整信息"] }
    }
  }
}
```

嵌套条件：

```json
{
  "events": {
    "click": {
      "if": "!form.phone",
      "then": { "call": "$message.warning", "args": ["请输入手机号"] },
      "else": {
        "if": "!/^1[3-9]\\d{9}$/.test(form.phone)",
        "then": { "call": "$message.warning", "args": ["手机号格式不正确"] },
        "else": { "call": "sendCode" }
      }
    }
  }
}
```

## 常用事件

### 点击事件

```json
{
  "com": "NButton",
  "events": {
    "click": { "call": "handleClick" }
  }
}
```

### 输入事件

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

### 选择事件

```json
{
  "com": "NSelect",
  "events": {
    "update:value": { "set": "selectedValue", "value": "{{ $args[0] }}" }
  }
}
```

### 表单事件

```json
{
  "com": "NForm",
  "events": {
    "submit": { "call": "handleSubmit" }
  }
}
```

### 表格事件

```json
{
  "com": "NDataTable",
  "events": {
    "update:checked-row-keys": { "set": "selectedKeys", "value": "{{ $args[0] }}" },
    "update:page": { "call": "handlePageChange", "args": ["{{ $args[0] }}"] }
  }
}
```

## 事件参数

### $args

事件回调的参数数组：

```json
{
  "events": {
    "update:value": { "set": "value", "value": "{{ $args[0] }}" }
  }
}
```

### $event

原生 DOM 事件对象：

```json
{
  "events": {
    "click": { "script": "console.log($event.target)" }
  }
}
```

### row

表格行数据（在表格列渲染中）：

```json
{
  "events": {
    "click": { "call": "editRow", "args": ["{{ row }}"] }
  }
}
```

## 阻止默认行为

```json
{
  "events": {
    "click": {
      "script": "$event.preventDefault(); $event.stopPropagation();"
    }
  }
}
```

## 防抖和节流

使用 script 实现：

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

## 示例：完整表单

```json
{
  "data": {
    "form": { "username": "", "password": "" },
    "loading": false,
    "rules": {
      "username": [{ "required": true, "message": "请输入用户名" }],
      "password": [{ "required": true, "message": "请输入密码" }]
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
          { "call": "$message.success", "args": ["登录成功"] },
          { "call": "$router.push", "args": ["/home"] }
        ],
        "catch": [
          { "call": "$message.error", "args": ["登录失败"] }
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
      "props": { "path": "username", "label": "用户名" },
      "children": [{ "com": "NInput", "model": "form.username" }]
    },
    {
      "com": "NFormItem",
      "props": { "path": "password", "label": "密码" },
      "children": [{ "com": "NInput", "model": "form.password", "props": { "type": "password" } }]
    },
    {
      "com": "NButton",
      "props": { "type": "primary", "loading": "{{ loading }}" },
      "events": { "click": { "call": "handleSubmit" } },
      "children": "登录"
    }
  ]
}
```
