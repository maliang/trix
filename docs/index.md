---
layout: home

hero:
  name: Trix Admin
  text: JSON 驱动的后台管理系统
  tagline: 基于 Vue 3 + TypeScript + NaiveUI，通过 JSON Schema 配置页面，告别重复模板代码
  image:
    src: /logo.svg
    alt: Trix Admin
  actions:
    - theme: brand
      text: 快速开始
      link: /guide/getting-started
    - theme: alt
      text: 在 GitHub 上查看
      link: https://github.com/maliang/trix

features:
  - icon: 📝
    title: JSON 驱动
    details: 通过 JSON Schema 配置页面，无需编写大量模板代码，快速构建后台管理界面
  - icon: ⚡️
    title: 极速开发
    details: 基于 Vite 7 构建，毫秒级热更新，TypeScript 完整类型支持
  - icon: 🎨
    title: 主题定制
    details: 丰富的主题配置选项，支持深色模式、多种布局模式、自定义主题色
  - icon: 🌍
    title: 国际化
    details: 内置中英文支持，轻松扩展多语言
  - icon: 🔐
    title: 权限控制
    details: 完善的权限管理系统，支持路由级和按钮级权限控制
  - icon: 📦
    title: 组件丰富
    details: 集成 NaiveUI 组件库，提供图标选择器、流程编辑器、富文本编辑器等业务组件
---

## 快速体验

```bash
# 克隆项目
git clone https://github.com/maliang/trix.git

# 进入项目目录
cd trix

# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev
```

## 技术栈

| 技术 | 版本 | 说明 |
|------|------|------|
| Vue | 3.5.x | 渐进式 JavaScript 框架 |
| Vite | 7.x | 下一代前端构建工具 |
| TypeScript | 5.x | JavaScript 的超集 |
| NaiveUI | 2.x | Vue 3 组件库 |
| UnoCSS | 66.x | 原子化 CSS 引擎 |
| Pinia | 3.x | Vue 状态管理 |
| vschema-ui | 1.x | JSON Schema 渲染引擎 |
