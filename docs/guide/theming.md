# 主题配置

Trix Admin 提供丰富的主题配置选项，支持深色模式、多种布局模式、自定义主题色等。

## 主题配置项

主题配置定义在 `src/store/modules/theme/shared.ts`：

```typescript
export const themeSettings: App.Theme.ThemeSetting = {
  // 应用标题
  appTitle: 'Trix Admin',
  // 应用 Logo
  logo: '/favicon.svg',
  // 主题方案：light | dark | auto
  themeScheme: 'light',
  // 灰度模式
  grayscale: false,
  // 色弱模式
  colourWeakness: false,
  // 主题色
  themeColor: '#646cff',
  // 圆角大小
  themeRadius: 6,
  // 其他颜色
  otherColor: {
    info: '#2080f0',
    success: '#52c41a',
    warning: '#faad14',
    error: '#f5222d'
  },
  // 布局配置
  layout: {
    mode: 'vertical',
    scrollMode: 'content'
  },
  // 页面动画
  page: {
    animate: true,
    animateMode: 'fade-slide'
  },
  // 头部配置
  header: {
    height: 56,
    inverted: false,
    breadcrumb: { visible: true, showIcon: true },
    multilingual: { visible: true },
    globalSearch: { visible: true }
  },
  // 标签页配置
  tab: {
    visible: true,
    cache: true,
    height: 44,
    mode: 'chrome'
  },
  // 侧边栏配置
  sider: {
    inverted: false,
    width: 220,
    collapsedWidth: 64
  },
  // 底部配置
  footer: {
    visible: true,
    fixed: false,
    height: 48
  },
  // 水印配置
  watermark: {
    visible: false,
    text: 'Trix Admin'
  }
}
```

## 布局模式

支持 6 种布局模式：

| 模式 | 说明 |
|------|------|
| `vertical` | 左侧菜单模式 |
| `vertical-mix` | 左侧菜单混合模式 |
| `vertical-hybrid-header-first` | 左侧混合-顶部优先 |
| `horizontal` | 顶部菜单模式 |
| `top-hybrid-sidebar-first` | 顶部混合-侧边优先 |
| `top-hybrid-header-first` | 顶部混合-顶部优先 |

## 深色模式

### 切换深色模式

```typescript
import { useThemeStore } from '@/store/modules/theme'

const themeStore = useThemeStore()

// 切换深色模式
themeStore.toggleDarkMode()

// 设置主题方案
themeStore.setThemeScheme('dark')  // 'light' | 'dark' | 'auto'
```

### 在 JSON Schema 中使用

```json
{
  "com": "ThemeSchemaSwitch",
  "props": {
    "showTooltip": true
  }
}
```

## 主题色

### 修改主题色

```typescript
themeStore.setThemeColor('#1890ff')
```

### 颜色调色板

系统会根据主题色自动生成调色板：

- `primary-50` ~ `primary-950`：主色调色板
- `info-50` ~ `info-950`：信息色调色板
- `success-50` ~ `success-950`：成功色调色板
- `warning-50` ~ `warning-950`：警告色调色板
- `error-50` ~ `error-950`：错误色调色板

## CSS 变量

主题通过 CSS 变量实现，可在样式中直接使用：

```css
.my-component {
  /* 主题色 */
  color: rgb(var(--primary-color));
  background: rgb(var(--primary-100-color));
  
  /* 容器背景 */
  background: rgb(var(--container-color));
  
  /* 布局背景 */
  background: rgb(var(--layout-color));
  
  /* 阴影 */
  box-shadow: var(--header-box-shadow);
}
```

### 可用的 CSS 变量

```css
:root {
  /* 颜色 */
  --primary-color: 100 108 255;
  --primary-50-color: ...;
  --primary-100-color: ...;
  /* ... 50 到 950 */
  
  --info-color: ...;
  --success-color: ...;
  --warning-color: ...;
  --error-color: ...;
  
  /* 背景 */
  --container-color: 255 255 255;
  --layout-color: 247 250 252;
  --inverted-color: 0 20 40;
  --base-text-color: 31 31 31;
  
  /* 阴影 */
  --header-box-shadow: 0 1px 2px rgb(0, 21, 41, 0.08);
  --sider-box-shadow: 2px 0 8px 0 rgb(29, 35, 41, 0.05);
  --tab-box-shadow: 0 1px 2px rgb(0, 21, 41, 0.08);
}
```

## 主题配置抽屉

系统内置主题配置抽屉，可在界面右侧打开进行实时配置：

```json
{
  "com": "ThemeButton"
}
```

## 在 JSON Schema 中使用主题

通过注入的 `$theme` 对象访问主题状态：

```json
{
  "com": "NCard",
  "props": {
    "style": {
      "background": "{{ $theme.darkMode ? '#1f1f1f' : '#ffffff' }}"
    }
  }
}
```

条件渲染：

```json
{
  "com": "SvgIcon",
  "props": {
    "icon": "{{ $theme.darkMode ? 'mdi:weather-night' : 'mdi:weather-sunny' }}"
  }
}
```

## 持久化

主题配置会自动持久化到 localStorage，页面刷新后保持配置。

## 类型定义

主题相关类型定义在 `src/typings/app.d.ts`：

```typescript
declare namespace App.Theme {
  interface ThemeSetting {
    appTitle: string
    logo: string
    themeScheme: UnionKey.ThemeScheme
    themeColor: string
    // ...
  }
}
```

添加新配置项时需要：

1. 在 `App.Theme.ThemeSetting` 中添加类型定义
2. 在 `themeSettings` 中添加默认值
3. 在 `src/locales/langs/` 中添加中英文翻译
4. 在主题配置抽屉中添加控件
