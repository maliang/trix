# Quick Start

## Prerequisites

- Node.js >= 18
- pnpm >= 8

## Installation

```bash
# Clone the project
git clone https://github.com/your-repo/trix.git

# Enter project directory
cd trix

# Install dependencies
pnpm install

# Start development server
pnpm dev
```

## Project Scripts

```bash
# Development
pnpm dev

# Build for production
pnpm build

# Build for test environment
pnpm build:test

# Preview production build
pnpm preview

# Type check
pnpm typecheck

# Lint code
pnpm lint

# Fix lint errors
pnpm lint:fix
```

## Directory Structure

```
trix/
├── src/
│   ├── assets/          # Static assets
│   ├── components/      # Components
│   ├── config/          # Configuration
│   ├── hooks/           # Composables
│   ├── layouts/         # Layout components
│   ├── locales/         # i18n files
│   ├── plugins/         # Plugins
│   ├── router/          # Routing
│   ├── service/         # API services
│   ├── store/           # State management
│   ├── styles/          # Global styles
│   ├── theme/           # Theme configuration
│   ├── typings/         # TypeScript types
│   ├── utils/           # Utilities
│   └── views/           # Page views
├── public/              # Public assets
├── docs/                # Documentation
└── package.json
```

## First JSON Page

Create a simple page using JSON Schema:

```vue
<template>
  <VSchema :schema="schema" />
</template>

<script setup lang="ts">
const schema = {
  data: { count: 0 },
  com: 'NCard',
  props: { title: 'Counter' },
  children: [
    {
      com: 'NSpace',
      children: [
        { com: 'NText', children: 'Count: {{ count }}' },
        {
          com: 'NButton',
          props: { type: 'primary' },
          events: {
            click: { set: 'count', value: '{{ count + 1 }}' }
          },
          children: 'Increment'
        }
      ]
    }
  ]
}
</script>
```

## Next Steps

- [JSON Driven Development](/en/guide/json-driven) - Learn JSON Schema basics
- [Routing](/en/guide/routing) - Configure routes
- [Permission Control](/en/guide/permission) - Set up permissions
