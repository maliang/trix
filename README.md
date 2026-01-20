# Trix Admin

[English](./README.en.md) | 简体中文

Trix Admin 是一个基于 JSON Schema 驱动的现代化后台管理系统，采用 Vue3、Vite、TypeScript、NaiveUI 和 UnoCSS 构建。

## ✨ 特性

- **JSON 驱动** - 通过 JSON Schema 配置页面，无需编写大量模板代码
- **Vue 3** - 使用 Composition API 和 `<script setup>` 语法
- **TypeScript** - 完整的类型支持，提升开发体验
- **Vite** - 极速的开发服务器和构建工具
- **NaiveUI** - 高质量的 Vue 3 组件库
- **UnoCSS** - 原子化 CSS 引擎，按需生成样式
- **Pinia** - 新一代状态管理方案
- **多布局模式** - 支持多种布局模式切换
- **主题配置** - 丰富的主题配置选项，支持深色模式
- **国际化** - 内置中英文支持

## 📦 安装

```bash
# 克隆项目
git clone <repository-url>

# 进入项目目录
cd trix

# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev
```

## 🛠️ 技术栈

| 技术 | 版本 | 说明 |
|------|------|------|
| Vue | 3.5.x | 渐进式 JavaScript 框架 |
| Vite | 7.x | 下一代前端构建工具 |
| TypeScript | 5.x | JavaScript 的超集 |
| NaiveUI | 2.x | Vue 3 组件库 |
| UnoCSS | 66.x | 原子化 CSS 引擎 |
| Pinia | 3.x | Vue 状态管理 |
| Vue Router | 4.x | Vue 官方路由 |
| Vue I18n | 11.x | 国际化方案 |

## 📁 项目结构

```
trix/
├── build/              # 构建配置
├── public/             # 静态资源
│   └── mock/           # Mock 数据
├── src/
│   ├── assets/         # 资源文件
│   ├── components/     # 组件
│   │   ├── business/   # 业务组件
│   │   ├── common/     # 通用组件
│   │   ├── custom/     # 自定义组件
│   │   └── json/       # JSON 渲染组件
│   ├── config/         # 配置文件
│   ├── hooks/          # 组合式函数
│   ├── layouts/        # 布局组件
│   ├── locales/        # 国际化
│   ├── plugins/        # 插件
│   ├── router/         # 路由配置
│   ├── service/        # 服务层
│   ├── store/          # 状态管理
│   ├── styles/         # 样式文件
│   ├── typings/        # 类型定义
│   ├── utils/          # 工具函数
│   └── views/          # 页面视图
├── test/               # 测试文件
└── packages/           # Monorepo 子包
```

## 🚀 命令

```bash
# 开发
pnpm dev

# 构建生产版本
pnpm build

# 构建测试版本
pnpm build:test

# 预览构建结果
pnpm preview

# 代码检查
pnpm lint

# 类型检查
pnpm typecheck

# 运行测试
pnpm test
```

## 📄 许可证

[MIT](./LICENSE)
