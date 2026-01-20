# Layout Modes

Trix Admin supports multiple layout modes to meet different interface requirements.

## Layout Types

### layoutType

The `layoutType` in route meta determines the layout used by the page:

| Value | Description |
|-------|-------------|
| `normal` | Standard layout, includes sidebar, header, tabs |
| `blank` | Blank layout, no sidebar or header |

```typescript
{
  path: '/login',
  meta: {
    layoutType: 'blank'  // Login page uses blank layout
  }
}
```

## Layout Modes

### layout.mode

The `layout.mode` in theme configuration determines the menu position in standard layout:

| Mode | Description | Use Case |
|------|-------------|----------|
| `vertical` | Left sidebar menu | Many menu items |
| `vertical-mix` | Left mixed menu | First-level on left, second-level on right |
| `vertical-hybrid-header-first` | Left mixed - header first | First-level on top, second-level on left |
| `horizontal` | Top menu | Few menu items |
| `top-hybrid-sidebar-first` | Top mixed - sidebar first | First-level on left, second-level on top |
| `top-hybrid-header-first` | Top mixed - header first | Both levels on top |

### vertical - Left Sidebar Menu

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

### horizontal - Top Menu

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

### vertical-mix - Left Mixed

```
┌─────────────────────────────────────┐
│              Header                 │
├────┬───────┬────────────────────────┤
│    │       │         Tabs           │
│ 1  │   2   ├────────────────────────┤
│ st │  nd   │                        │
│    │       │        Content         │
│    │       │                        │
└────┴───────┴────────────────────────┘
```

## Layout Configuration

### Header Configuration

```typescript
header: {
  height: 56,           // Header height
  inverted: false,      // Inverted colors
  breadcrumb: {
    visible: true,      // Show breadcrumb
    showIcon: true      // Show icon
  },
  multilingual: {
    visible: true       // Show language switch
  },
  globalSearch: {
    visible: true       // Show global search
  }
}
```

### Sidebar Configuration

```typescript
sider: {
  inverted: false,          // Inverted colors
  width: 220,               // Expanded width
  collapsedWidth: 64,       // Collapsed width
  mixWidth: 90,             // Mixed mode first-level menu width
  mixCollapsedWidth: 64,    // Mixed mode collapsed width
  mixChildMenuWidth: 200,   // Mixed mode child menu width
  mixChildMenuBgColor: '#ffffff',  // Child menu background color
  autoSelectFirstMenu: false       // Auto select first menu
}
```

### Tab Configuration

```typescript
tab: {
  visible: true,            // Show tabs
  cache: true,              // Enable cache
  height: 44,               // Tab height
  mode: 'chrome',           // Tab style: chrome | button
  closeTabByMiddleClick: false  // Close with middle click
}
```

### Footer Configuration

```typescript
footer: {
  visible: true,    // Show footer
  fixed: false,     // Fixed footer
  height: 48,       // Footer height
  right: true       // Content align right
}
```

## Scroll Mode

### scrollMode

| Value | Description |
|-------|-------------|
| `content` | Content area scrolls |
| `wrapper` | Entire page scrolls |

```typescript
layout: {
  mode: 'vertical',
  scrollMode: 'content'
}
```

## Fixed Header and Tabs

```typescript
fixedHeaderAndTab: true  // Fix header and tabs
```

## Layout Components

### LayoutWrapper

Layout entry component, selects layout based on `layoutType`:

```vue
<!-- src/layouts/index.vue -->
<template>
  <component :is="layoutComponent">
    <router-view />
  </component>
</template>
```

### BaseLayout

Standard layout component, includes:

- GlobalHeader - Global header
- GlobalSider - Global sidebar
- GlobalMenu - Global menu
- GlobalTab - Global tabs
- RouteView - Route view

### BlankLayout

Blank layout, contains only route view.

## Switching Layout in JSON Schema

```json
{
  "com": "NSelect",
  "model": "$theme.layout.mode",
  "props": {
    "options": [
      { "label": "Left Menu", "value": "vertical" },
      { "label": "Top Menu", "value": "horizontal" },
      { "label": "Left Mixed", "value": "vertical-mix" }
    ]
  }
}
```

## Responsive Layout

The system automatically adjusts layout based on screen width:

- Mobile (< 768px): Auto collapse sidebar
- Tablet (768px - 1024px): Optional collapse
- Desktop (> 1024px): Full layout

```json
{
  "com": "div",
  "if": "$app.isMobile",
  "children": "Mobile content"
}
```
