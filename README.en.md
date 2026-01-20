# Trix Admin

English | [简体中文](./README.md)

Trix Admin is a modern admin system driven by JSON Schema, built with Vue3, Vite, TypeScript, NaiveUI, and UnoCSS.

## ✨ Features

- **JSON Driven** - Configure pages via JSON Schema without writing extensive template code
- **Vue 3** - Using Composition API and `<script setup>` syntax
- **TypeScript** - Full type support for better development experience
- **Vite** - Lightning fast dev server and build tool
- **NaiveUI** - High-quality Vue 3 component library
- **UnoCSS** - Atomic CSS engine with on-demand generation
- **Pinia** - Next-generation state management
- **Multiple Layouts** - Support for various layout modes
- **Theme Configuration** - Rich theme options with dark mode support
- **Internationalization** - Built-in Chinese and English support

## 📦 Installation

```bash
# Clone the repository
git clone <repository-url>

# Navigate to project directory
cd trix

# Install dependencies
pnpm install

# Start development server
pnpm dev
```

## 🛠️ Tech Stack

| Technology | Version | Description |
|------------|---------|-------------|
| Vue | 3.5.x | Progressive JavaScript Framework |
| Vite | 7.x | Next Generation Frontend Tooling |
| TypeScript | 5.x | JavaScript with Syntax for Types |
| NaiveUI | 2.x | Vue 3 Component Library |
| UnoCSS | 66.x | Atomic CSS Engine |
| Pinia | 3.x | Vue State Management |
| Vue Router | 4.x | Official Vue Router |
| Vue I18n | 11.x | Internationalization Solution |

## 📁 Project Structure

```
trix/
├── build/              # Build configuration
├── public/             # Static assets
│   └── mock/           # Mock data
├── src/
│   ├── assets/         # Asset files
│   ├── components/     # Components
│   │   ├── business/   # Business components
│   │   ├── common/     # Common components
│   │   ├── custom/     # Custom components
│   │   └── json/       # JSON renderer components
│   ├── config/         # Configuration files
│   ├── hooks/          # Composables
│   ├── layouts/        # Layout components
│   ├── locales/        # Internationalization
│   ├── plugins/        # Plugins
│   ├── router/         # Router configuration
│   ├── service/        # Service layer
│   ├── store/          # State management
│   ├── styles/         # Style files
│   ├── typings/        # Type definitions
│   ├── utils/          # Utility functions
│   └── views/          # Page views
├── test/               # Test files
└── packages/           # Monorepo packages
```

## 🚀 Commands

```bash
# Development
pnpm dev

# Build for production
pnpm build

# Build for testing
pnpm build:test

# Preview build
pnpm preview

# Lint code
pnpm lint

# Type check
pnpm typecheck

# Run tests
pnpm test
```

## 📄 License

[MIT](./LICENSE)
