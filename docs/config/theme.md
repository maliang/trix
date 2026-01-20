# 主题配置

主题配置定义在 `src/store/modules/theme/shared.ts` 中。

## 完整配置

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
  
  // 是否使用推荐颜色
  recommendColor: false,
  
  // 主题色
  themeColor: '#646cff',
  
  // 圆角大小（像素）
  themeRadius: 6,
  
  // 其他颜色
  otherColor: {
    info: '#2080f0',
    success: '#52c41a',
    warning: '#faad14',
    error: '#f5222d'
  },
  
  // info 颜色是否跟随主色
  isInfoFollowPrimary: true,
  
  // 布局配置
  layout: {
    mode: 'vertical',        // 布局模式
    scrollMode: 'content'    // 滚动模式
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
    breadcrumb: {
      visible: true,
      showIcon: true
    },
    multilingual: {
      visible: true
    },
    globalSearch: {
      visible: true
    }
  },
  
  // 标签页配置
  tab: {
    visible: true,
    cache: true,
    height: 44,
    mode: 'chrome',
    closeTabByMiddleClick: false
  },
  
  // 固定头部和标签页
  fixedHeaderAndTab: true,
  
  // 侧边栏配置
  sider: {
    inverted: false,
    width: 220,
    collapsedWidth: 64,
    mixWidth: 90,
    mixCollapsedWidth: 64,
    mixChildMenuWidth: 200,
    mixChildMenuBgColor: '#ffffff',
    autoSelectFirstMenu: false
  },
  
  // 底部配置
  footer: {
    visible: true,
    fixed: false,
    height: 48,
    right: true
  },
  
  // 水印配置
  watermark: {
    visible: false,
    text: 'Trix Admin',
    enableUserName: false,
    enableTime: false,
    timeFormat: 'YYYY-MM-DD HH:mm'
  },
  
  // 主题 Token
  tokens: {
    light: {
      colors: {
        container: 'rgb(255, 255, 255)',
        layout: 'rgb(247, 250, 252)',
        inverted: 'rgb(0, 20, 40)',
        'base-text': 'rgb(31, 31, 31)'
      },
      boxShadow: {
        header: '0 1px 2px rgb(0, 21, 41, 0.08)',
        sider: '2px 0 8px 0 rgb(29, 35, 41, 0.05)',
        tab: '0 1px 2px rgb(0, 21, 41, 0.08)'
      }
    },
    dark: {
      colors: {
        container: 'rgb(28, 28, 28)',
        layout: 'rgb(18, 18, 18)',
        'base-text': 'rgb(224, 224, 224)'
      }
    }
  }
}
```

## 配置说明

### 主题方案

| 值 | 说明 |
|------|------|
| `light` | 亮色模式 |
| `dark` | 暗色模式 |
| `auto` | 跟随系统 |

### 布局模式

| 值 | 说明 |
|------|------|
| `vertical` | 左侧菜单 |
| `vertical-mix` | 左侧混合菜单 |
| `vertical-hybrid-header-first` | 左侧混合-顶部优先 |
| `horizontal` | 顶部菜单 |
| `top-hybrid-sidebar-first` | 顶部混合-侧边优先 |
| `top-hybrid-header-first` | 顶部混合-顶部优先 |

### 滚动模式

| 值 | 说明 |
|------|------|
| `content` | 内容区域滚动 |
| `wrapper` | 整体滚动 |

### 页面动画

| 值 | 说明 |
|------|------|
| `fade` | 淡入淡出 |
| `fade-slide` | 淡入滑动 |
| `fade-bottom` | 从下淡入 |
| `fade-scale` | 缩放淡入 |
| `zoom-fade` | 缩放淡出 |
| `zoom-out` | 缩小淡出 |

### 标签页模式

| 值 | 说明 |
|------|------|
| `chrome` | Chrome 风格 |
| `button` | 按钮风格 |

## 运行时修改

```typescript
import { useThemeStore } from '@/store/modules/theme'

const themeStore = useThemeStore()

// 修改主题色
themeStore.setThemeColor('#1890ff')

// 切换深色模式
themeStore.toggleDarkMode()

// 修改布局模式
themeStore.setLayoutMode('horizontal')

// 修改其他配置
themeStore.updateSettings({
  header: {
    breadcrumb: { visible: false }
  }
})
```

## 从后端获取配置

配置 `VITE_THEME_CONFIG_API` 环境变量后，系统会从后端获取主题配置：

```bash
VITE_THEME_CONFIG_API=/api/system/theme-config
```

后端返回格式：

```json
{
  "code": 0,
  "data": {
    "themeColor": "#1890ff",
    "layout": {
      "mode": "horizontal"
    }
  }
}
```

## 添加新配置项

1. 在 `src/typings/app.d.ts` 中添加类型定义
2. 在 `themeSettings` 中添加默认值
3. 在 `src/locales/langs/` 中添加国际化文本
4. 在主题配置抽屉中添加控件
