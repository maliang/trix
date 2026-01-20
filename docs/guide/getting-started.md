# 快速开始

本节将帮助你快速搭建 Trix Admin 开发环境。

## 环境要求

- **Node.js** >= 20.19.0
- **pnpm** >= 10.5.0

::: tip 推荐使用 pnpm
Trix Admin 使用 pnpm 作为包管理器，如果你还没有安装 pnpm，可以通过以下命令安装：

```bash
npm install -g pnpm
```
:::

## 安装

### 1. 克隆项目

```bash
git clone https://github.com/maliang/trix.git
cd trix
```

### 2. 安装依赖

```bash
pnpm install
```

### 3. 启动开发服务器

```bash
pnpm dev
```

启动成功后，访问 `http://localhost:5173` 即可看到登录页面。

默认账号密码：
- 用户名：`admin`
- 密码：`123456`

## 项目命令

```bash
# 开发模式
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

## 目录结构概览

```
trix/
├── build/              # 构建配置
├── public/             # 静态资源
│   └── mock/           # Mock 数据
│       ├── api/        # API 响应数据
│       └── schema/     # JSON Schema 页面配置
├── src/
│   ├── components/     # 组件
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
└── packages/           # Monorepo 子包
```

## 创建第一个页面

### 1. 创建 JSON Schema 文件

在 `public/mock/schema/` 目录下创建 `my-page.json`：

```json
{
  "data": {
    "message": "Hello, Trix Admin!"
  },
  "com": "NCard",
  "props": {
    "title": "我的第一个页面"
  },
  "children": [
    {
      "com": "NText",
      "children": "{{ message }}"
    }
  ]
}
```

### 2. 添加路由配置

在 `src/router/routes/index.ts` 中添加路由：

```typescript
{
  path: 'my-page',
  name: 'my-page',
  component: createDynamicPage('my-page'),
  meta: {
    title: '我的页面',
    icon: 'mdi:file-document',
    requiresAuth: true,
    layoutType: 'normal',
    useJsonRenderer: true,
    schemaSource: '/mock/schema/my-page.json'
  }
}
```

### 3. 访问页面

重启开发服务器后，在菜单中即可看到新添加的页面。

## 下一步

- [项目结构](/guide/project-structure) - 深入了解项目目录结构
- [JSON 驱动](/guide/json-driven) - 了解 JSON Schema 驱动的核心概念
- [JSON Schema 基础](/schema/) - 学习 JSON Schema 配置语法
