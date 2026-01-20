# Theme Configuration

Theme configuration is defined in `src/theme/settings.ts`.

## Theme Settings

```typescript
export const themeSettings = {
  // Theme color
  themeColor: '#646cff',
  
  // Other theme colors
  otherColor: {
    info: '#2080f0',
    success: '#18a058',
    warning: '#f0a020',
    error: '#d03050'
  },
  
  // Dark mode
  isCustomizeDarkModeTransition: false,
  darkMode: false,
  
  // Layout mode: vertical | horizontal | vertical-mix | horizontal-mix
  layout: {
    mode: 'vertical',
    scrollMode: 'content'
  },
  
  // Header settings
  header: {
    height: 56,
    breadcrumb: {
      visible: true,
      showIcon: true
    }
  },
  
  // Tab settings
  tab: {
    visible: true,
    height: 44,
    mode: 'chrome'
  },
  
  // Sider settings
  sider: {
    width: 220,
    collapsedWidth: 64,
    mixWidth: 90,
    mixCollapsedWidth: 64,
    mixChildMenuWidth: 200
  },
  
  // Footer settings
  footer: {
    visible: true,
    fixed: false,
    height: 48
  }
}
```

## Runtime Theme Switching

```typescript
import { useThemeStore } from '@/store/modules/theme'

const themeStore = useThemeStore()

// Toggle dark mode
themeStore.toggleDarkMode()

// Set theme color
themeStore.setThemeColor('#1890ff')

// Change layout mode
themeStore.setLayoutMode('horizontal')
```

## CSS Variables

Theme colors are exposed as CSS variables:

```css
:root {
  --primary-color: #646cff;
  --info-color: #2080f0;
  --success-color: #18a058;
  --warning-color: #f0a020;
  --error-color: #d03050;
}
```

Use in components:

```css
.my-component {
  color: var(--primary-color);
}
```
