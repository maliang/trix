# Login Page Example

A complete login page JSON Schema example.

## Features

The login page includes:
- Username and password login
- Remember me functionality
- Forgot password (reset password)
- Third-party login options
- Dynamic background effects

## Schema Structure

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
        { "required": true, "message": "Please enter username", "trigger": "blur" }
      ],
      "password": [
        { "required": true, "message": "Please enter password", "trigger": "blur" },
        { "min": 6, "message": "Password must be at least 6 characters", "trigger": "blur" }
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
                { "com": "NText", "props": { "depth": 3, "style": { "fontSize": "12px" } }, "children": "JSON-driven Admin System" }
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
                      "props": { "placeholder": "Username", "size": "large", "clearable": true },
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
                      "props": { "type": "password", "placeholder": "Password", "size": "large", "showPasswordOn": "click" },
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
                    { "com": "NCheckbox", "model:checked": "rememberMe", "children": "Remember me" },
                    {
                      "com": "NButton",
                      "props": { "text": true, "type": "primary" },
                      "events": { "click": { "set": "mode", "value": "reset" } },
                      "children": "Forgot password?"
                    }
                  ]
                },
                {
                  "com": "NButton",
                  "props": { "type": "primary", "block": true, "size": "large", "loading": "{{ loading }}" },
                  "events": {
                    "click": { "script": "await $methods.login(state.form.username, state.form.password);" }
                  },
                  "children": "Login"
                }
              ]
            },
            {
              "com": "NDivider",
              "props": { "style": { "margin": "24px 0" } },
              "children": [{ "com": "NText", "props": { "depth": 3 }, "children": "Other login methods" }]
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
                { "com": "NText", "props": { "strong": true, "style": { "fontSize": "18px", "marginLeft": "12px" } }, "children": "Reset Password" }
              ]
            },
            {
              "com": "NForm",
              "props": { "model": "{{ resetForm }}", "showLabel": false },
              "children": [
                {
                  "com": "NFormItem",
                  "children": [
                    { "com": "NInput", "model": "resetForm.phone", "props": { "placeholder": "Phone number", "size": "large", "maxlength": 11 } }
                  ]
                },
                {
                  "com": "NFormItem",
                  "children": [
                    {
                      "com": "NInputGroup",
                      "children": [
                        { "com": "NInput", "model": "resetForm.code", "props": { "placeholder": "Verification code", "size": "large", "maxlength": 6 } },
                        {
                          "com": "NButton",
                          "props": { "type": "primary", "size": "large", "disabled": "{{ countdown > 0 || !resetForm.phone }}" },
                          "events": {
                            "click": {
                              "script": "state.countdown = 60; const timer = setInterval(() => { state.countdown--; if (state.countdown <= 0) clearInterval(timer); }, 1000);"
                            }
                          },
                          "children": "{{ countdown > 0 ? countdown + 's' : 'Get Code' }}"
                        }
                      ]
                    }
                  ]
                },
                {
                  "com": "NFormItem",
                  "children": [
                    { "com": "NInput", "model": "resetForm.newPassword", "props": { "type": "password", "placeholder": "New password", "size": "large" } }
                  ]
                },
                {
                  "com": "NFormItem",
                  "children": [
                    { "com": "NInput", "model": "resetForm.confirmPassword", "props": { "type": "password", "placeholder": "Confirm password", "size": "large" } }
                  ]
                },
                {
                  "com": "NButton",
                  "props": { "type": "primary", "block": true, "size": "large" },
                  "events": {
                    "click": {
                      "if": "resetForm.newPassword !== resetForm.confirmPassword",
                      "then": { "call": "$message.error", "args": ["Passwords do not match"] },
                      "else": [
                        { "call": "$message.success", "args": ["Password reset successful"] },
                        { "set": "mode", "value": "login" }
                      ]
                    }
                  },
                  "children": "Reset Password"
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

## Key Points

### 1. Mode Switching

Use the `mode` variable to control login and reset password modes:

```json
{ "if": "mode === 'login'" }
{ "if": "mode === 'reset'" }
```

### 2. Form Validation

Using NaiveUI form validation:

```json
{
  "rules": {
    "username": [{ "required": true, "message": "Please enter username" }]
  }
}
```

### 3. Countdown Timer

Implement countdown using script:

```json
{
  "script": "state.countdown = 60; const timer = setInterval(() => { state.countdown--; if (state.countdown <= 0) clearInterval(timer); }, 1000);"
}
```

### 4. Login Call

Call global method for login:

```json
{
  "script": "await $methods.login(state.form.username, state.form.password);"
}
```
