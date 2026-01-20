# API 参考

本节提供 Trix Admin 的 API 参考文档。

## Store

状态管理相关 API：

- [App Store](/api/store#app-store) - 应用状态
- [Auth Store](/api/store#auth-store) - 认证状态
- [Theme Store](/api/store#theme-store) - 主题状态
- [Tab Store](/api/store#tab-store) - 标签页状态
- [Route Store](/api/store#route-store) - 路由状态

## Hooks

组合式函数：

- [useSchemaLoader](/api/hooks#useschemaloader) - Schema 加载
- [useBoolean](/api/hooks#useboolean) - 布尔值状态
- [useLoading](/api/hooks#useloading) - 加载状态

## 工具函数

- [storage](/api/utils#storage) - 存储工具
- [common](/api/utils#common) - 通用工具

## JSON Schema 内置对象

在 JSON Schema 中可用的内置对象：

### 全局状态

| 对象 | 说明 |
|------|------|
| `$app` | 应用状态 |
| `$theme` | 主题状态 |
| `$user` | 用户信息 |
| `$permissions` | 权限列表 |

### 内置方法

| 方法 | 说明 |
|------|------|
| `$t(key)` | 国际化翻译 |
| `$router.push(path)` | 路由跳转 |
| `$router.replace(path)` | 路由替换 |
| `$router.back()` | 返回上一页 |
| `$message.success(msg)` | 成功提示 |
| `$message.error(msg)` | 错误提示 |
| `$message.warning(msg)` | 警告提示 |
| `$message.info(msg)` | 信息提示 |
| `$dialog.warning(options)` | 警告对话框 |
| `$dialog.error(options)` | 错误对话框 |

### 事件参数

| 变量 | 说明 |
|------|------|
| `$args` | 事件回调参数数组 |
| `$event` | 原生事件对象 |
| `$response` | API 响应数据 |
| `$error` | 错误对象 |

### 循环变量

| 变量 | 说明 |
|------|------|
| `item` | 当前循环项 |
| `index` | 当前索引 |
| `row` | 表格行数据 |
