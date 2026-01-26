# AGENTS.md

本文档为 AI 代理提供项目上下文和开发指南。

## 项目概述

Trix Admin 是一个基于 JSON Schema 驱动的后台管理系统，核心特点是通过 JSON 配置来渲染页面，减少重复的模板代码编写。使用 vschema-ui 作为 JSON 渲染引擎。

- 版本：1.0.3
- Monorepo 结构（pnpm workspace）

## 技术栈

- **框架**: Vue 3.5+ (Composition API, `<script setup>`)
- **构建工具**: Vite 7+
- **语言**: TypeScript 5+
- **UI 组件库**: NaiveUI 2.x
- **CSS**: UnoCSS (原子化 CSS)
- **状态管理**: Pinia 3.x
- **路由**: Vue Router 4.x
- **国际化**: Vue I18n 11.x
- **JSON 渲染**: vschema-ui 1.3.x

## 目录结构

```
trix/
├── packages/              # Monorepo 子包
│   ├── color/             # @trix/color - 颜色工具
│   ├── hooks/             # @trix/hooks - 通用 hooks
│   ├── materials/         # @trix/materials - 物料组件
│   ├── scripts/           # @trix/scripts - 构建脚本
│   ├── uno-preset/        # @trix/uno-preset - UnoCSS 预设
│   └── utils/             # @trix/utils - 工具函数
├── src/
│   ├── components/
│   │   ├── business/      # 业务组件（IconPicker, FlowEditor, MarkdownEditor, RichEditor）
│   │   ├── common/        # 通用组件（HeaderNotification, TableColumnSetting, FullScreen, LangSwitch 等）
│   │   ├── custom/        # 自定义组件（ButtonIcon, CountTo, VueECharts, BetterScroll 等）
│   │   └── json/          # JSON 渲染组件（SchemaEditor, ErrorBoundary, JsonDataTable, DynamicPage, HeaderRight）
│   ├── config/            # 配置文件
│   │   ├── json-renderer.ts  # vschema 配置
│   │   └── response.ts       # API 响应格式配置
│   ├── hooks/             # 项目 hooks
│   ├── layouts/           # 布局组件
│   │   └── modules/       # 布局子模块
│   ├── locales/langs/     # 国际化文件
│   ├── plugins/           # 插件配置
│   │   └── json-renderer.ts  # vschema 插件集成
│   ├── router/            # 路由配置
│   ├── service/           # API 服务
│   ├── store/modules/     # Pinia 状态模块
│   │   ├── app/           # 应用状态
│   │   ├── auth/          # 认证状态
│   │   ├── notification/  # 通知状态
│   │   ├── route/         # 路由状态
│   │   ├── tab/           # 标签页状态
│   │   └── theme/         # 主题状态
│   ├── styles/            # 样式文件
│   ├── typings/           # 类型定义
│   └── utils/             # 工具函数
├── test/                  # 测试文件
├── docs/                  # VitePress 文档
└── public/mock/           # Mock 数据
```

## JSON 渲染器配置

### 响应格式配置 (`src/config/response.ts`)

```typescript
export const responseConfig = {
  codeField: 'code',
  successCode: 0,
  dataField: 'data',
  messageField: 'msg',
  pagination: {
    totalField: 'total',
    pageField: 'page',
    pageSizeField: 'pageSize',
    listField: 'list'
  }
};
```

### vschema 配置 (`src/config/json-renderer.ts`)

```typescript
export const jsonRendererConfig = {
  baseURL: import.meta.env.VITE_SERVICE_BASE_URL,
  responseDataPath: 'data',
  responseFormat: {
    codeField: 'code',
    msgField: 'msg',
    dataField: 'data',
    successCode: 0
  },
  globalState: {
    injectUser: true,
    injectPermissions: true,
    injectTheme: true,
    injectRoute: true
  },
  timeout: 30000,
  withToken: true,
  tokenKey: 'token',
  tokenHeaderName: 'Authorization',
  tokenPrefix: 'Bearer '
};
```

### 已注册组件

vschema 插件自动注册以下组件：
- 所有 NaiveUI 组件（NButton, NDataTable, NForm 等）
- 自定义组件：SvgIcon, ButtonIcon, CountTo, VueECharts, BetterScroll 等
- 通用组件：HeaderNotification, TableColumnSetting, FullScreen, LangSwitch, ThemeSchemaSwitch 等
- 业务组件：IconPicker, FlowEditor, MarkdownEditor, RichEditor
- JSON 组件：SchemaEditor, ErrorBoundary, JsonDataTable, DynamicPage, HeaderRight

## 开发规范

### 代码风格

- 使用 `<script setup>` 语法
- 组件使用 `defineOptions({ name: 'ComponentName' })` 定义名称
- TypeScript 严格类型
- 注释使用中文

### 主题配置

主题配置定义在 `src/typings/app.d.ts` 的 `App.Theme.ThemeSetting` 接口中，默认值在 `src/store/modules/theme/shared.ts`。

添加新配置项需要：
1. 在 `App.Theme.ThemeSetting` 添加类型定义
2. 在 `themeSettings` 添加默认值
3. 在 `src/locales/langs/` 添加中英文翻译
4. 在设置 UI 组件中添加控件

### 布局模式

支持的布局模式：
- `vertical` - 左侧菜单模式
- `vertical-mix` - 左侧菜单混合模式
- `vertical-hybrid-header-first` - 左侧混合-顶部优先
- `horizontal` - 顶部菜单模式
- `top-hybrid-sidebar-first` - 顶部混合-侧边优先
- `top-hybrid-header-first` - 顶部混合-顶部优先

## 常用命令

```bash
pnpm dev          # 启动开发服务器（test 模式）
pnpm dev:prod     # 启动开发服务器（prod 模式）
pnpm build        # 构建生产版本
pnpm build:test   # 构建测试版本
pnpm lint         # 代码检查
pnpm typecheck    # 类型检查
pnpm test         # 运行测试
pnpm test:watch   # 监听模式测试
pnpm docs:dev     # 启动文档开发服务器
pnpm docs:build   # 构建文档
```

## Mock 数据

Mock 数据位于 `public/mock/` 目录：
- `api/` - API 响应数据
- `schema/` - JSON Schema 页面配置

## 测试

测试文件位于 `test/` 目录，使用 Vitest + fast-check 运行。

## 注意事项

1. 修改主题配置后需确保类型定义、默认值、国际化三处同步更新
2. 组件样式使用 `<style scoped>`，全局样式放在 `src/styles/`
3. API 返回格式统一为 `{ code, msg, data }`
4. 修改 `responseConfig` 时需同步更新 `jsonRendererConfig.responseFormat`

## 文档

项目文档位于 `docs/` 目录，使用 VitePress 构建：
- `docs/` - 中文文档（默认）
- `docs/en/` - 英文文档
