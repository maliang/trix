# Environment Variables

Environment variables are configured in `.env` files.

## Configuration Files

| File | Description |
|------|-------------|
| `.env` | Base configuration for all environments |
| `.env.test` | Test environment configuration |
| `.env.prod` | Production environment configuration |

## Available Variables

```bash
# Application title
VITE_APP_TITLE=Trix Admin

# API base URL
VITE_SERVICE_BASE_URL=/api

# Route mode: hash | history
VITE_ROUTE_MODE=hash

# Route home path
VITE_ROUTE_HOME=/home

# Icon prefix
VITE_ICON_PREFIX=icon

# Local icon prefix
VITE_ICON_LOCAL_PREFIX=local-icon
```

## Usage

Access environment variables in code:

```typescript
// Get API base URL
const baseURL = import.meta.env.VITE_SERVICE_BASE_URL

// Check development mode
if (import.meta.env.DEV) {
  console.log('Development mode')
}

// Check production mode
if (import.meta.env.PROD) {
  console.log('Production mode')
}
```

## Custom Variables

Add custom variables with `VITE_` prefix:

```bash
# .env
VITE_CUSTOM_VAR=value
```

Add type declaration in `src/typings/env.d.ts`:

```typescript
interface ImportMetaEnv {
  readonly VITE_CUSTOM_VAR: string
}
```
