# 项目结构

本节详细介绍 Trix Admin 的项目目录结构。

## 根目录

```
trix/
├── build/              # 构建配置
├── docs/               # 文档（VitePress）
├── packages/           # Monorepo 子包
├── public/             # 静态资源
├── src/                # 源代码
├── test/               # 测试文件
├── .env                # 环境变量（开发）
├── .env.prod           # 环境变量（生产）
├── .env.test           # 环境变量（测试）
├── index.html          # HTML 入口
├── package.json        # 项目配置
├── tsconfig.json       # TypeScript 配置
├── uno.config.ts       # UnoCSS 配置
└── vite.config.ts      # Vite 配置
```

## src 目录

```
src/
├── assets/             # 资源文件
│   └── svg-icon/       # SVG 图标
├── components/         # 组件
│   ├── advanced/       # 高级组件
│   ├── business/       # 业务组件
│   ├── common/         # 通用组件
│   ├── custom/         # 自定义组件
│   └── json/           # JSON 渲染组件
├── config/             # 配置文件
├── hooks/              # 组合式函数
├── layouts/            # 布局组件
├── locales/            # 国际化
├── plugins/            # 插件
├── router/             # 路由配置
├── service/            # 服务层
├── store/              # 状态管理
├── styles/             # 样式文件
├── typings/            # 类型定义
├── utils/              # 工具函数
├── views/              # 页面视图
├── App.vue             # 根组件
└── main.ts             # 入口文件
```

## 核心目录说明

### components - 组件

```
components/
├── advanced/           # 高级组件
│   ├── TableHeaderOperation.vue    # 表格头部操作
│   └── TableColumnSetting.vue      # 表格列设置
├── business/           # 业务组件
│   ├── icon-picker/    # 图标选择器
│   ├── flow-editor/    # 流程编辑器
│   ├── markdown-editor/# Markdown 编辑器
│   └── rich-editor/    # 富文本编辑器
├── common/             # 通用组件
│   ├── DarkModeContainer.vue       # 深色模式容器
│   ├── FullScreen.vue              # 全屏切换
│   ├── LangSwitch.vue              # 语言切换
│   ├── SystemLogo.vue              # 系统 Logo
│   └── ThemeSchemaSwitch.vue       # 主题切换
├── custom/             # 自定义组件
│   ├── svg-icon.vue    # SVG 图标
│   ├── button-icon.vue # 图标按钮
│   ├── count-to.vue    # 数字动画
│   └── vue-echarts.vue # ECharts 图表
└── json/               # JSON 渲染组件
    ├── DynamicPage.vue # 动态页面
    ├── ErrorBoundary.vue # 错误边界
    ├── JsonDataTable.vue # JSON 数据表格
    └── SchemaEditor.vue  # Schema 编辑器
```

### store - 状态管理

```
store/
├── modules/
│   ├── app/            # 应用状态（语言、移动端检测等）
│   ├── auth/           # 认证状态（用户信息、权限）
│   ├── notification/   # 通知状态
│   ├── route/          # 路由状态（菜单、权限路由）
│   ├── tab/            # 标签页状态
│   └── theme/          # 主题状态（颜色、布局、深色模式）
├── plugins/            # Pinia 插件
└── index.ts            # Store 入口
```

### layouts - 布局

```
layouts/
├── base-layout/        # 基础布局（带侧边栏、头部）
├── blank-layout/       # 空白布局（登录页等）
├── modules/            # 布局模块
│   ├── global-header/  # 全局头部
│   ├── global-menu/    # 全局菜单
│   ├── global-search/  # 全局搜索
│   ├── global-sider/   # 全局侧边栏
│   ├── global-tab/     # 全局标签页
│   └── theme-drawer/   # 主题配置抽屉
├── index.vue           # 布局入口
└── route-view.vue      # 路由视图
```

### public/mock - Mock 数据

```
public/mock/
├── api/                # API 响应数据
│   ├── dashboard-stats.json        # 仪表盘统计
│   ├── menus.json                  # 菜单数据
│   └── system/                     # 系统管理 API
└── schema/             # JSON Schema 页面配置
    ├── login.json      # 登录页
    ├── dashboard.json  # 仪表盘
    ├── 403.json        # 403 页面
    ├── 404.json        # 404 页面
    └── system/         # 系统管理页面
        ├── user-list.json          # 用户列表
        ├── role-list.json          # 角色列表
        └── menu-list.json          # 菜单列表
```

## packages - Monorepo 子包

```
packages/
├── @trix/color/        # 颜色工具库
├── @trix/hooks/        # 通用 Hooks
├── @trix/materials/    # 物料库
├── @trix/scripts/      # 构建脚本
├── @trix/uno-preset/   # UnoCSS 预设
└── @trix/utils/        # 工具函数库
```

## 配置文件说明

| 文件 | 说明 |
|------|------|
| `vite.config.ts` | Vite 构建配置 |
| `tsconfig.json` | TypeScript 配置 |
| `uno.config.ts` | UnoCSS 原子化 CSS 配置 |
| `eslint.config.js` | ESLint 代码检查配置 |
| `.env` | 开发环境变量 |
| `.env.prod` | 生产环境变量 |
| `.env.test` | 测试环境变量 |
