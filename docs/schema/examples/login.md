# 登录页面示例

完整的登录页面 JSON Schema 示例。

## 效果

登录页面包含：
- 用户名密码登录
- 记住我功能
- 忘记密码（重置密码）
- 第三方登录入口
- 动态背景效果

## Schema 结构

```json
{
  "data": {
    "mode": "login",
    "form": {
      "username": "admin",
      "password": "123456"
    },
    "resetForm": {
      "phone": "",
      "code": "",
      "newPassword": "",
      "confirmPassword": ""
    },
    "loading": false,
    "rememberMe": false,
    "countdown": 0,
    "rules": {
      "username": [
        { "required": true, "message": "请输入用户名", "trigger": "blur" }
      ],
      "password": [
        { "required": true, "message": "请输入密码", "trigger": "blur" },
        { "min": 6, "message": "密码长度不能少于6位", "trigger": "blur" }
      ]
    }
  },
  "com": "div",
  "props": {
    "style": {
      "minHeight": "100vh",
      "display": "flex",
      "justifyContent": "center",
      "alignItems": "center",
      "background": "#f8f9fc"
    }
  },
  "children": [
    {
      "com": "NCard",
      "props": {
        "bordered": false,
        "style": {
          "width": "400px",
          "borderRadius": "20px",
          "boxShadow": "0 25px 50px -12px rgba(0, 0, 0, 0.25)"
        }
      },
      "children": [
        {
          "com": "NFlex",
          "props": { "align": "center", "justify": "center", "style": { "marginBottom": "32px" } },
          "children": [
            { "com": "SystemLogo", "props": { "style": { "width": "48px", "height": "48px" } } },
            {
              "com": "NFlex",
              "props": { "vertical": true },
              "children": [
                { "com": "NText", "props": { "strong": true, "style": { "fontSize": "24px" } }, "children": "Trix Admin" },
                { "com": "NText", "props": { "depth": 3, "style": { "fontSize": "12px" } }, "children": "JSON 驱动的后台管理系统" }
              ]
            }
          ]
        },
        {
          "com": "div",
          "if": "mode === 'login'",
          "children": [
            {
              "com": "NForm",
              "props": { "model": "{{ form }}", "rules": "{{ rules }}", "showLabel": false },
              "children": [
                {
                  "com": "NFormItem",
                  "props": { "path": "username" },
                  "children": [
                    {
                      "com": "NInput",
                      "model": "form.username",
                      "props": { "placeholder": "用户名", "size": "large", "clearable": true },
                      "slots": {
                        "prefix": [
                          { "com": "SvgIcon", "props": { "icon": "carbon:user", "style": { "color": "#999" } } }
                        ]
                      }
                    }
                  ]
                },
                {
                  "com": "NFormItem",
                  "props": { "path": "password" },
                  "children": [
                    {
                      "com": "NInput",
                      "model": "form.password",
                      "props": { "type": "password", "placeholder": "密码", "size": "large", "showPasswordOn": "click" },
                      "slots": {
                        "prefix": [
                          { "com": "SvgIcon", "props": { "icon": "carbon:password", "style": { "color": "#999" } } }
                        ]
                      }
                    }
                  ]
                },
                {
                  "com": "NFlex",
                  "props": { "justify": "space-between", "style": { "marginBottom": "24px" } },
                  "children": [
                    { "com": "NCheckbox", "model:checked": "rememberMe", "children": "记住我" },
                    {
                      "com": "NButton",
                      "props": { "text": true, "type": "primary" },
                      "events": { "click": { "set": "mode", "value": "reset" } },
                      "children": "忘记密码？"
                    }
                  ]
                },
                {
                  "com": "NButton",
                  "props": { "type": "primary", "block": true, "size": "large", "loading": "{{ loading }}" },
                  "events": {
                    "click": { "script": "await $methods.login(state.form.username, state.form.password);" }
                  },
                  "children": "登 录"
                }
              ]
            },
            {
              "com": "NDivider",
              "props": { "style": { "margin": "24px 0" } },
              "children": [{ "com": "NText", "props": { "depth": 3 }, "children": "其他登录方式" }]
            },
            {
              "com": "NFlex",
              "props": { "justify": "center", "style": { "gap": "24px" } },
              "children": [
                {
                  "com": "NButton",
                  "props": { "circle": true, "quaternary": true },
                  "children": [{ "com": "SvgIcon", "props": { "icon": "carbon:logo-github", "style": { "fontSize": "20px" } } }]
                },
                {
                  "com": "NButton",
                  "props": { "circle": true, "quaternary": true },
                  "children": [{ "com": "SvgIcon", "props": { "icon": "carbon:logo-wechat", "style": { "fontSize": "20px", "color": "#07c160" } } }]
                }
              ]
            }
          ]
        },
        {
          "com": "div",
          "if": "mode === 'reset'",
          "children": [
            {
              "com": "NFlex",
              "props": { "align": "center", "style": { "marginBottom": "24px" } },
              "children": [
                {
                  "com": "NButton",
                  "props": { "text": true },
                  "events": { "click": { "set": "mode", "value": "login" } },
                  "children": [{ "com": "SvgIcon", "props": { "icon": "carbon:arrow-left" } }]
                },
                { "com": "NText", "props": { "strong": true, "style": { "fontSize": "18px", "marginLeft": "12px" } }, "children": "重置密码" }
              ]
            },
            {
              "com": "NForm",
              "props": { "model": "{{ resetForm }}", "showLabel": false },
              "children": [
                {
                  "com": "NFormItem",
                  "children": [
                    { "com": "NInput", "model": "resetForm.phone", "props": { "placeholder": "手机号", "size": "large", "maxlength": 11 } }
                  ]
                },
                {
                  "com": "NFormItem",
                  "children": [
                    {
                      "com": "NInputGroup",
                      "children": [
                        { "com": "NInput", "model": "resetForm.code", "props": { "placeholder": "验证码", "size": "large", "maxlength": 6 } },
                        {
                          "com": "NButton",
                          "props": { "type": "primary", "size": "large", "disabled": "{{ countdown > 0 || !resetForm.phone }}" },
                          "events": {
                            "click": {
                              "script": "state.countdown = 60; const timer = setInterval(() => { state.countdown--; if (state.countdown <= 0) clearInterval(timer); }, 1000);"
                            }
                          },
                          "children": "{{ countdown > 0 ? countdown + 's' : '获取验证码' }}"
                        }
                      ]
                    }
                  ]
                },
                {
                  "com": "NFormItem",
                  "children": [
                    { "com": "NInput", "model": "resetForm.newPassword", "props": { "type": "password", "placeholder": "新密码", "size": "large" } }
                  ]
                },
                {
                  "com": "NFormItem",
                  "children": [
                    { "com": "NInput", "model": "resetForm.confirmPassword", "props": { "type": "password", "placeholder": "确认密码", "size": "large" } }
                  ]
                },
                {
                  "com": "NButton",
                  "props": { "type": "primary", "block": true, "size": "large" },
                  "events": {
                    "click": {
                      "if": "resetForm.newPassword !== resetForm.confirmPassword",
                      "then": { "call": "$message.error", "args": ["两次密码不一致"] },
                      "else": [
                        { "call": "$message.success", "args": ["密码重置成功"] },
                        { "set": "mode", "value": "login" }
                      ]
                    }
                  },
                  "children": "重置密码"
                }
              ]
            }
          ]
        }
      ]
    }
  ]
}
```

## 关键点

### 1. 模式切换

使用 `mode` 变量控制登录和重置密码两种模式：

```json
{ "if": "mode === 'login'" }
{ "if": "mode === 'reset'" }
```

### 2. 表单验证

使用 NaiveUI 的表单验证：

```json
{
  "rules": {
    "username": [{ "required": true, "message": "请输入用户名" }]
  }
}
```

### 3. 验证码倒计时

使用 script 实现倒计时：

```json
{
  "script": "state.countdown = 60; const timer = setInterval(() => { state.countdown--; if (state.countdown <= 0) clearInterval(timer); }, 1000);"
}
```

### 4. 登录调用

调用全局方法进行登录：

```json
{
  "script": "await $methods.login(state.form.username, state.form.password);"
}
```
