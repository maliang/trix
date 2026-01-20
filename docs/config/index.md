# 配置概述

Trix Admin 提供多种配置方式，满足不同场景的需求。

## 配置文件

| 文件 | 说明 |
|------|------|
| `.env` | 开发环境变量 |
| `.env.test` | 测试环境变量 |
| `.env.prod` | 生产环境变量 |
| `src/config/json-renderer.ts` | JSON 渲染器配置 |
| `src/config/response.ts` | 响应配置 |
| `src/store/modules/theme/shared.ts` | 主题默认配置 |

## 环境变量

通过 `.env` 文件配置环境变量：

```bash
# 应用标题
VITE_APP_TITLE=Trix Admin

# 基础 URL
VITE_BASE_URL=/

# 菜单路由 API
VITE_MENU_ROUTE_URL=/mock/api/menus.json

# 主题配置 API
VITE_THEME_CONFIG_API=/mock/api/system/theme-config.json
```

详见 [环境变量](/config/env)。

## 主题配置

在 `src/store/modules/theme/shared.ts` 中配置默认主题：

```typescript
export const themeSettings = {
  themeColor: '#646cff',
  themeScheme: 'light',
  layout: {
    mode: 'vertical'
  }
  // ...
}
```

详见 [主题配置](/config/theme)。

## 请求配置

在 `src/config/response.ts` 中配置响应处理：

```typescript
export const responseConfig = {
  codeField: 'code',
  dataField: 'data',
  messageField: 'message',
  successCode: 0
}
```

详见 [请求配置](/config/request)。

## JSON 渲染器配置

在 `src/config/json-renderer.ts` 中配置 JSON 渲染器：

```typescript
export const jsonRendererConfig = {
  baseURL: '',
  responseDataPath: 'data',
  timeout: 30000,
  withToken: true
}
```

详见 [JSON 渲染器配置](/config/json-renderer)。

## 运行时配置

部分配置可以在运行时通过 Store 修改：

```typescript
// 修改主题
themeStore.setThemeColor('#1890ff')

// 修改语言
appStore.setLocale('en-US')
```
