# 简介

Trix Admin 是一个基于 JSON Schema 驱动的现代化后台管理系统，采用 Vue 3、Vite、TypeScript、NaiveUI 和 UnoCSS 构建。

## 什么是 JSON 驱动？

传统的后台管理系统开发中，每个页面都需要编写大量的模板代码、样式代码和逻辑代码。Trix Admin 采用 JSON Schema 驱动的方式，通过配置 JSON 文件来描述页面结构、数据绑定、事件处理等，大幅减少重复代码的编写。

```json
{
  "com": "NCard",
  "props": { "title": "用户信息" },
  "children": [
    {
      "com": "NForm",
      "props": { "model": "{{ form }}" },
      "children": [
        {
          "com": "NFormItem",
          "props": { "label": "用户名" },
          "children": [
            { "com": "NInput", "model": "form.username" }
          ]
        }
      ]
    }
  ]
}
```

## 核心特性

### 🚀 开发效率

- **JSON 配置页面**：通过 JSON Schema 描述页面，无需编写 Vue 模板
- **热更新**：修改 JSON 配置后页面实时更新
- **类型安全**：完整的 TypeScript 类型支持

### 🎨 界面美观

- **NaiveUI 组件库**：高质量的 Vue 3 组件
- **UnoCSS**：原子化 CSS，按需生成样式
- **多种布局模式**：支持左侧菜单、顶部菜单、混合布局等

### 🔧 功能完善

- **权限管理**：路由级和按钮级权限控制
- **主题配置**：深色模式、主题色、圆角等可配置
- **国际化**：内置中英文，可扩展多语言

## 适用场景

- 企业后台管理系统
- 内部运营平台
- 数据管理平台
- 需要快速迭代的管理系统

## 与传统开发对比

| 特性 | 传统开发 | Trix Admin |
|------|----------|------------|
| 页面开发 | 编写 Vue 模板 | 配置 JSON Schema |
| 代码量 | 较多 | 大幅减少 |
| 学习成本 | 需要掌握 Vue | 了解 JSON Schema 规范 |
| 灵活性 | 高 | 中等（可扩展） |
| 维护成本 | 较高 | 较低 |

## 下一步

- [快速开始](/guide/getting-started) - 5 分钟上手 Trix Admin
- [项目结构](/guide/project-structure) - 了解项目目录结构
- [JSON Schema](/schema/) - 学习 JSON Schema 配置语法
