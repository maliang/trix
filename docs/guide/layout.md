# 布局模式

Trix Admin 支持多种布局模式，满足不同的界面需求。

## 布局类型

### layoutType

路由 meta 中的 `layoutType` 决定页面使用的布局：

| 值 | 说明 |
|------|------|
| `normal` | 标准布局，包含侧边栏、头部、标签页 |
| `blank` | 空白布局，无侧边栏和头部 |

```typescript
{
  path: '/login',
  meta: {
    layoutType: 'blank'  // 登录页使用空白布局
  }
}
```

## 布局模式

### layout.mode

主题配置中的 `layout.mode` 决定标准布局的菜单位置：

| 模式 | 说明 | 适用场景 |
|------|------|----------|
| `vertical` | 左侧菜单 | 菜单项较多 |
| `vertical-mix` | 左侧混合菜单 | 一级菜单在左侧，二级在右侧 |
| `vertical-hybrid-header-first` | 左侧混合-顶部优先 | 一级在顶部，二级在左侧 |
| `horizontal` | 顶部菜单 | 菜单项较少 |
| `top-hybrid-sidebar-first` | 顶部混合-侧边优先 | 一级在左侧，二级在顶部 |
| `top-hybrid-header-first` | 顶部混合-顶部优先 | 一级二级都在顶部 |

### vertical - 左侧菜单

```
┌─────────────────────────────────────┐
│              Header                 │
├────────┬────────────────────────────┤
│        │           Tabs             │
│  Menu  ├────────────────────────────┤
│        │                            │
│        │          Content           │
│        │                            │
└────────┴────────────────────────────┘
```

### horizontal - 顶部菜单

```
┌─────────────────────────────────────┐
│         Header + Menu               │
├─────────────────────────────────────┤
│              Tabs                   │
├─────────────────────────────────────┤
│                                     │
│             Content                 │
│                                     │
└─────────────────────────────────────┘
```

### vertical-mix - 左侧混合

```
┌─────────────────────────────────────┐
│              Header                 │
├────┬───────┬────────────────────────┤
│    │       │         Tabs           │
│ 1  │   2   ├────────────────────────┤
│ 级 │   级  │                        │
│    │       │        Content         │
│    │       │                        │
└────┴───────┴────────────────────────┘
```

## 布局配置

### 头部配置

```typescript
header: {
  height: 56,           // 头部高度
  inverted: false,      // 是否反色
  breadcrumb: {
    visible: true,      // 显示面包屑
    showIcon: true      // 显示图标
  },
  multilingual: {
    visible: true       // 显示语言切换
  },
  globalSearch: {
    visible: true       // 显示全局搜索
  }
}
```

### 侧边栏配置

```typescript
sider: {
  inverted: false,          // 是否反色
  width: 220,               // 展开宽度
  collapsedWidth: 64,       // 折叠宽度
  mixWidth: 90,             // 混合模式一级菜单宽度
  mixCollapsedWidth: 64,    // 混合模式折叠宽度
  mixChildMenuWidth: 200,   // 混合模式子菜单宽度
  mixChildMenuBgColor: '#ffffff',  // 子菜单背景色
  autoSelectFirstMenu: false       // 自动选择第一个菜单
}
```

### 标签页配置

```typescript
tab: {
  visible: true,            // 显示标签页
  cache: true,              // 启用缓存
  height: 44,               // 标签页高度
  mode: 'chrome',           // 标签页样式：chrome | button
  closeTabByMiddleClick: false  // 鼠标中键关闭
}
```

### 底部配置

```typescript
footer: {
  visible: true,    // 显示底部
  fixed: false,     // 固定底部
  height: 48,       // 底部高度
  right: true       // 内容靠右
}
```

## 滚动模式

### scrollMode

| 值 | 说明 |
|------|------|
| `content` | 内容区域滚动 |
| `wrapper` | 整体滚动 |

```typescript
layout: {
  mode: 'vertical',
  scrollMode: 'content'
}
```

## 固定头部和标签页

```typescript
fixedHeaderAndTab: true  // 固定头部和标签页
```

## 布局组件

### LayoutWrapper

布局入口组件，根据 `layoutType` 选择布局：

```vue
<!-- src/layouts/index.vue -->
<template>
  <component :is="layoutComponent">
    <router-view />
  </component>
</template>
```

### BaseLayout

标准布局组件，包含：

- GlobalHeader - 全局头部
- GlobalSider - 全局侧边栏
- GlobalMenu - 全局菜单
- GlobalTab - 全局标签页
- RouteView - 路由视图

### BlankLayout

空白布局，仅包含路由视图。

## 在 JSON Schema 中切换布局

```json
{
  "com": "NSelect",
  "model": "$theme.layout.mode",
  "props": {
    "options": [
      { "label": "左侧菜单", "value": "vertical" },
      { "label": "顶部菜单", "value": "horizontal" },
      { "label": "左侧混合", "value": "vertical-mix" }
    ]
  }
}
```

## 响应式布局

系统会根据屏幕宽度自动调整布局：

- 移动端（< 768px）：自动折叠侧边栏
- 平板（768px - 1024px）：可选折叠
- 桌面（> 1024px）：完整布局

```json
{
  "com": "div",
  "if": "$app.isMobile",
  "children": "移动端内容"
}
```
