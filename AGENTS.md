# AGENTS.md

本文档为 AI 代理提供项目上下文和开发指南。

## 项目概述

Trix Admin 是一个基于 JSON Schema 驱动的后台管理系统，核心特点是通过 JSON 配置来渲染页面，减少重复的模板代码编写。

## 技术栈

- **框架**: Vue 3.5+ (Composition API, `<script setup>`)
- **构建工具**: Vite 7+
- **语言**: TypeScript 5+
- **UI 组件库**: NaiveUI 2.x
- **CSS**: UnoCSS (原子化 CSS)
- **状态管理**: Pinia 3.x
- **路由**: Vue Router 4.x
- **国际化**: Vue I18n 11.x

## 目录结构说明

```
src/
├── components/
│   ├── business/       # 业务组件（如 IconPicker）
│   ├── common/         # 通用组件（如 DarkModeContainer）
│   ├── custom/         # 自定义组件（如 ButtonIcon, CountTo）
│   └── json/           # JSON 渲染核心组件
├── layouts/            # 布局组件
│   └── modules/        # 布局子模块
│       ├── global-menu/    # 全局菜单
│       ├── global-header/  # 全局头部
│       ├── global-sider/   # 全局侧边栏
│       └── theme-drawer/   # 主题配置抽屉
├── store/modules/
│   ├── theme/          # 主题状态管理
│   ├── app/            # 应用状态
│   ├── route/          # 路由状态
│   └── tab/            # 标签页状态
├── locales/langs/      # 国际化文件
│   ├── zh-cn.ts        # 中文
│   └── en-us.ts        # 英文
└── typings/            # 类型定义
    └── app.d.ts        # 应用类型（含主题配置类型）
```

## 开发规范

### 代码风格

- 使用 `<script setup>` 语法
- 组件使用 `defineOptions({ name: 'ComponentName' })` 定义名称
- 使用 TypeScript 严格类型
- 注释使用中文

### 主题配置

主题配置定义在 `src/typings/app.d.ts` 的 `App.Theme.ThemeSetting` 接口中，默认值在 `src/store/modules/theme/shared.ts` 的 `themeSettings` 对象中。

添加新配置项时需要：
1. 在 `App.Theme.ThemeSetting` 中添加类型定义
2. 在 `themeSettings` 中添加默认值
3. 在 `src/locales/langs/` 中添加中英文翻译
4. 在相应的设置 UI 组件中添加控件

### CSS 变量

全局 CSS 变量通过 `src/store/modules/theme/index.ts` 中的 `setupThemeVarsToGlobal` 函数设置到 `:root`。

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
pnpm dev          # 启动开发服务器
pnpm build        # 构建生产版本
pnpm lint         # 代码检查
pnpm typecheck    # 类型检查
pnpm test         # 运行测试
```

## Mock 数据

Mock 数据位于 `public/mock/` 目录：
- `api/` - API 响应数据
- `schema/` - JSON Schema 页面配置

## 测试

测试文件位于 `test/` 目录，使用 Vitest 运行。

## 注意事项

1. 修改主题配置后需确保类型定义、默认值、国际化三处同步更新
2. 深拷贝对象使用 `JSON.parse(JSON.stringify(obj))`
3. CSS 变量更新需要手动调用更新函数或通过 watcher 监听
4. 组件样式使用 `<style scoped>`，全局样式放在 `src/styles/`
