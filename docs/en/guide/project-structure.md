# Project Structure

This section provides a detailed introduction to the directory structure of Trix Admin.

## Root Directory

```
trix/
├── build/              # Build configuration
├── docs/               # Documentation (VitePress)
├── packages/           # Monorepo sub-packages
├── public/             # Static assets
├── src/                # Source code
├── test/               # Test files
├── .env                # Environment variables (development)
├── .env.prod           # Environment variables (production)
├── .env.test           # Environment variables (testing)
├── index.html          # HTML entry
├── package.json        # Project configuration
├── tsconfig.json       # TypeScript configuration
├── uno.config.ts       # UnoCSS configuration
└── vite.config.ts      # Vite configuration
```

## src Directory

```
src/
├── assets/             # Asset files
│   └── svg-icon/       # SVG icons
├── components/         # Components
│   ├── advanced/       # Advanced components
│   ├── business/       # Business components
│   ├── common/         # Common components
│   ├── custom/         # Custom components
│   └── json/           # JSON rendering components
├── config/             # Configuration files
├── hooks/              # Composables
├── layouts/            # Layout components
├── locales/            # Internationalization
├── plugins/            # Plugins
├── router/             # Router configuration
├── service/            # Service layer
├── store/              # State management
├── styles/             # Style files
├── typings/            # Type definitions
├── utils/              # Utility functions
├── views/              # Page views
├── App.vue             # Root component
└── main.ts             # Entry file
```

## Core Directory Description

### components - Components

```
components/
├── advanced/           # Advanced components
│   ├── TableHeaderOperation.vue    # Table header operations
│   └── TableColumnSetting.vue      # Table column settings
├── business/           # Business components
│   ├── icon-picker/    # Icon picker
│   ├── flow-editor/    # Flow editor
│   ├── markdown-editor/# Markdown editor
│   └── rich-editor/    # Rich text editor
├── common/             # Common components
│   ├── DarkModeContainer.vue       # Dark mode container
│   ├── FullScreen.vue              # Fullscreen toggle
│   ├── LangSwitch.vue              # Language switch
│   ├── SystemLogo.vue              # System logo
│   └── ThemeSchemaSwitch.vue       # Theme switch
├── custom/             # Custom components
│   ├── svg-icon.vue    # SVG icon
│   ├── button-icon.vue # Icon button
│   ├── count-to.vue    # Number animation
│   └── vue-echarts.vue # ECharts chart
└── json/               # JSON rendering components
    ├── DynamicPage.vue # Dynamic page
    ├── ErrorBoundary.vue # Error boundary
    ├── JsonDataTable.vue # JSON data table
    └── SchemaEditor.vue  # Schema editor
```

### store - State Management

```
store/
├── modules/
│   ├── app/            # App state (language, mobile detection, etc.)
│   ├── auth/           # Auth state (user info, permissions)
│   ├── notification/   # Notification state
│   ├── route/          # Route state (menus, permission routes)
│   ├── tab/            # Tab state
│   └── theme/          # Theme state (colors, layout, dark mode)
├── plugins/            # Pinia plugins
└── index.ts            # Store entry
```

### layouts - Layouts

```
layouts/
├── base-layout/        # Base layout (with sidebar, header)
├── blank-layout/       # Blank layout (login page, etc.)
├── modules/            # Layout modules
│   ├── global-header/  # Global header
│   ├── global-menu/    # Global menu
│   ├── global-search/  # Global search
│   ├── global-sider/   # Global sidebar
│   ├── global-tab/     # Global tabs
│   └── theme-drawer/   # Theme configuration drawer
├── index.vue           # Layout entry
└── route-view.vue      # Route view
```

### public/mock - Mock Data

```
public/mock/
├── api/                # API response data
│   ├── dashboard-stats.json        # Dashboard statistics
│   ├── menus.json                  # Menu data
│   └── system/                     # System management API
└── schema/             # JSON Schema page configuration
    ├── login.json      # Login page
    ├── dashboard.json  # Dashboard
    ├── 403.json        # 403 page
    ├── 404.json        # 404 page
    └── system/         # System management pages
        ├── user-list.json          # User list
        ├── role-list.json          # Role list
        └── menu-list.json          # Menu list
```

## packages - Monorepo Sub-packages

```
packages/
├── @trix/color/        # Color utility library
├── @trix/hooks/        # Common hooks
├── @trix/materials/    # Materials library
├── @trix/scripts/      # Build scripts
├── @trix/uno-preset/   # UnoCSS preset
└── @trix/utils/        # Utility functions library
```

## Configuration Files Description

| File | Description |
|------|-------------|
| `vite.config.ts` | Vite build configuration |
| `tsconfig.json` | TypeScript configuration |
| `uno.config.ts` | UnoCSS atomic CSS configuration |
| `eslint.config.js` | ESLint code checking configuration |
| `.env` | Development environment variables |
| `.env.prod` | Production environment variables |
| `.env.test` | Testing environment variables |
