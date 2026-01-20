# Theme Configuration

Trix Admin provides rich theme configuration options, supporting dark mode, multiple layout modes, custom theme colors, and more.

## Theme Configuration Options

Theme configuration is defined in `src/store/modules/theme/shared.ts`:

```typescript
export const themeSettings: App.Theme.ThemeSetting = {
  // App title
  appTitle: 'Trix Admin',
  // App logo
  logo: '/favicon.svg',
  // Theme scheme: light | dark | auto
  themeScheme: 'light',
  // Grayscale mode
  grayscale: false,
  // Color weakness mode
  colourWeakness: false,
  // Theme color
  themeColor: '#646cff',
  // Border radius
  themeRadius: 6,
  // Other colors
  otherColor: {
    info: '#2080f0',
    success: '#52c41a',
    warning: '#faad14',
    error: '#f5222d'
  },
  // Layout configuration
  layout: {
    mode: 'vertical',
    scrollMode: 'content'
  },
  // Page animation
  page: {
    animate: true,
    animateMode: 'fade-slide'
  },
  // Header configuration
  header: {
    height: 56,
    inverted: false,
    breadcrumb: { visible: true, showIcon: true },
    multilingual: { visible: true },
    globalSearch: { visible: true }
  },
  // Tab configuration
  tab: {
    visible: true,
    cache: true,
    height: 44,
    mode: 'chrome'
  },
  // Sidebar configuration
  sider: {
    inverted: false,
    width: 220,
    collapsedWidth: 64
  },
  // Footer configuration
  footer: {
    visible: true,
    fixed: false,
    height: 48
  },
  // Watermark configuration
  watermark: {
    visible: false,
    text: 'Trix Admin'
  }
}
```

## Layout Modes

Supports 6 layout modes:

| Mode | Description |
|------|-------------|
| `vertical` | Left sidebar menu mode |
| `vertical-mix` | Left sidebar mixed menu mode |
| `vertical-hybrid-header-first` | Left mixed - header first |
| `horizontal` | Top menu mode |
| `top-hybrid-sidebar-first` | Top mixed - sidebar first |
| `top-hybrid-header-first` | Top mixed - header first |

## Dark Mode

### Toggle Dark Mode

```typescript
import { useThemeStore } from '@/store/modules/theme'

const themeStore = useThemeStore()

// Toggle dark mode
themeStore.toggleDarkMode()

// Set theme scheme
themeStore.setThemeScheme('dark')  // 'light' | 'dark' | 'auto'
```

### Using in JSON Schema

```json
{
  "com": "ThemeSchemaSwitch",
  "props": {
    "showTooltip": true
  }
}
```

## Theme Color

### Change Theme Color

```typescript
themeStore.setThemeColor('#1890ff')
```

### Color Palette

The system automatically generates a color palette based on the theme color:

- `primary-50` ~ `primary-950`: Primary color palette
- `info-50` ~ `info-950`: Info color palette
- `success-50` ~ `success-950`: Success color palette
- `warning-50` ~ `warning-950`: Warning color palette
- `error-50` ~ `error-950`: Error color palette

## CSS Variables

Themes are implemented through CSS variables, which can be used directly in styles:

```css
.my-component {
  /* Theme color */
  color: rgb(var(--primary-color));
  background: rgb(var(--primary-100-color));
  
  /* Container background */
  background: rgb(var(--container-color));
  
  /* Layout background */
  background: rgb(var(--layout-color));
  
  /* Shadow */
  box-shadow: var(--header-box-shadow);
}
```

### Available CSS Variables

```css
:root {
  /* Colors */
  --primary-color: 100 108 255;
  --primary-50-color: ...;
  --primary-100-color: ...;
  /* ... 50 to 950 */
  
  --info-color: ...;
  --success-color: ...;
  --warning-color: ...;
  --error-color: ...;
  
  /* Backgrounds */
  --container-color: 255 255 255;
  --layout-color: 247 250 252;
  --inverted-color: 0 20 40;
  --base-text-color: 31 31 31;
  
  /* Shadows */
  --header-box-shadow: 0 1px 2px rgb(0, 21, 41, 0.08);
  --sider-box-shadow: 2px 0 8px 0 rgb(29, 35, 41, 0.05);
  --tab-box-shadow: 0 1px 2px rgb(0, 21, 41, 0.08);
}
```

## Theme Configuration Drawer

The system has a built-in theme configuration drawer that can be opened on the right side of the interface for real-time configuration:

```json
{
  "com": "ThemeButton"
}
```

## Using Theme in JSON Schema

Access theme state through the injected `$theme` object:

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

Conditional rendering:

```json
{
  "com": "SvgIcon",
  "props": {
    "icon": "{{ $theme.darkMode ? 'mdi:weather-night' : 'mdi:weather-sunny' }}"
  }
}
```

## Persistence

Theme configuration is automatically persisted to localStorage and maintained after page refresh.

## Type Definitions

Theme-related type definitions are in `src/typings/app.d.ts`:

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

When adding new configuration options, you need to:

1. Add type definition in `App.Theme.ThemeSetting`
2. Add default value in `themeSettings`
3. Add Chinese and English translations in `src/locales/langs/`
4. Add controls in the theme configuration drawer
