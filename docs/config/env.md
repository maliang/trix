# 环境变量

Trix Admin 使用 Vite 的环境变量机制，支持多环境配置。

## 环境文件

| 文件 | 说明 | 加载时机 |
|------|------|----------|
| `.env` | 所有环境通用 | 始终加载 |
| `.env.local` | 本地覆盖（不提交） | 始终加载 |
| `.env.test` | 测试环境 | `--mode test` |
| `.env.prod` | 生产环境 | `--mode prod` |

## 可用变量

### 应用配置

```bash
# 应用标题（显示在浏览器标签页）
VITE_APP_TITLE=Trix Admin

# 应用基础 URL
# 如果部署在子目录，需要以 "/" 结尾，如 "/admin/"
VITE_BASE_URL=/
```

### API 配置

```bash
# 主题配置 API 地址（为空则使用默认配置）
VITE_THEME_CONFIG_API=/mock/api/system/theme-config.json

# 登录页 Schema 地址
VITE_LOGIN_SCHEMA_URL=/mock/schema/login.json

# Header 右侧 Schema 地址（为空则不显示）
VITE_HEADER_RIGHT_SCHEMA_URL=/mock/schema/layout/header-right.json

# 菜单路由 API 地址（为空则使用静态路由配置）
VITE_MENU_ROUTE_URL=/mock/api/menus.json
```

### 图标配置

```bash
# 图标名称前缀
VITE_ICON_PREFIX=icon

# 本地 SVG 图标组件前缀
# 格式：{VITE_ICON_PREFIX}-{local icon name}
VITE_ICON_LOCAL_PREFIX=icon-local
```

### 开发配置

```bash
# 开发模式是否启用 HTTP 代理
VITE_HTTP_PROXY=Y

# 是否生成 sourcemap
VITE_SOURCE_MAP=N

# 是否在终端显示代理 URL 日志
VITE_PROXY_LOG=Y
```

## 在代码中使用

### TypeScript 中

```typescript
// 获取环境变量
const title = import.meta.env.VITE_APP_TITLE
const baseUrl = import.meta.env.VITE_BASE_URL

// 判断环境
if (import.meta.env.DEV) {
  console.log('开发环境')
}

if (import.meta.env.PROD) {
  console.log('生产环境')
}
```

### 类型定义

环境变量类型定义在 `src/typings/env.d.ts`：

```typescript
interface ImportMetaEnv {
  readonly VITE_APP_TITLE: string
  readonly VITE_BASE_URL: string
  readonly VITE_MENU_ROUTE_URL: string
  // ...
}
```

## 不同环境配置

### 开发环境 (.env)

```bash
VITE_APP_TITLE=Trix Admin (Dev)
VITE_BASE_URL=/
VITE_HTTP_PROXY=Y
VITE_SOURCE_MAP=Y
```

### 测试环境 (.env.test)

```bash
VITE_APP_TITLE=Trix Admin (Test)
VITE_BASE_URL=/
VITE_HTTP_PROXY=N
VITE_SOURCE_MAP=Y
```

### 生产环境 (.env.prod)

```bash
VITE_APP_TITLE=Trix Admin
VITE_BASE_URL=/
VITE_HTTP_PROXY=N
VITE_SOURCE_MAP=N
```

## 构建命令

```bash
# 开发模式（使用 .env）
pnpm dev

# 测试环境构建（使用 .env.test）
pnpm build:test

# 生产环境构建（使用 .env.prod）
pnpm build
```

## 注意事项

### 1. 变量命名

只有以 `VITE_` 开头的变量才会暴露给客户端代码：

```bash
# ✅ 可以在代码中访问
VITE_APP_TITLE=Trix Admin

# ❌ 不会暴露给客户端
SECRET_KEY=xxx
```

### 2. 敏感信息

不要在环境变量中存储敏感信息，因为它们会被打包到客户端代码中。

### 3. 本地覆盖

使用 `.env.local` 覆盖本地配置，该文件不会被提交到版本控制：

```bash
# .env.local
VITE_APP_TITLE=My Local Title
```

### 4. 类型安全

添加新环境变量时，记得更新 `src/typings/env.d.ts` 中的类型定义。
