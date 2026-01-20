# Deployment

This section describes how to build and deploy Trix Admin.

## Build

### Production Build

```bash
pnpm build
```

Build output is located in the `dist/` directory.

### Test Environment Build

```bash
pnpm build:test
```

### Preview Build Result

```bash
pnpm preview
```

## Environment Configuration

### Production Environment Variables

Edit `.env.prod`:

```bash
VITE_APP_TITLE=Trix Admin
VITE_BASE_URL=/
VITE_HTTP_PROXY=N
VITE_SOURCE_MAP=N
```

### Subdirectory Deployment

If deploying in a subdirectory, modify `VITE_BASE_URL`:

```bash
# Deploy in /admin/ directory
VITE_BASE_URL=/admin/
```

## Nginx Configuration

### Basic Configuration

```nginx
server {
    listen 80;
    server_name example.com;
    root /var/www/trix;
    index index.html;

    # Handle SPA routing
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Static asset caching
    location /assets {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # API proxy
    location /api {
        proxy_pass http://backend:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    # Gzip compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml;
}
```

### Subdirectory Deployment

```nginx
server {
    listen 80;
    server_name example.com;

    location /admin {
        alias /var/www/trix;
        index index.html;
        try_files $uri $uri/ /admin/index.html;
    }
}
```

### HTTPS Configuration

```nginx
server {
    listen 443 ssl http2;
    server_name example.com;

    ssl_certificate /etc/nginx/ssl/cert.pem;
    ssl_certificate_key /etc/nginx/ssl/key.pem;

    root /var/www/trix;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}

# HTTP redirect to HTTPS
server {
    listen 80;
    server_name example.com;
    return 301 https://$server_name$request_uri;
}
```

## Docker Deployment

### Dockerfile

```dockerfile
# Build stage
FROM node:20-alpine as builder

WORKDIR /app

# Install pnpm
RUN npm install -g pnpm

# Copy dependency files
COPY package.json pnpm-lock.yaml ./

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy source code
COPY . .

# Build
RUN pnpm build

# Runtime stage
FROM nginx:alpine

# Copy build output
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

### nginx.conf

```nginx
server {
    listen 80;
    server_name localhost;
    root /usr/share/nginx/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /assets {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    gzip on;
    gzip_types text/plain text/css application/json application/javascript;
}
```

### Build and Run

```bash
# Build image
docker build -t trix-admin .

# Run container
docker run -d -p 80:80 --name trix trix-admin
```

### Docker Compose

```yaml
version: '3.8'

services:
  trix-admin:
    build: .
    ports:
      - "80:80"
    restart: unless-stopped

  # Backend service (optional)
  backend:
    image: your-backend-image
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=postgres://...
```

## CI/CD

### GitHub Actions

```yaml
# .github/workflows/deploy.yml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'

      - name: Setup pnpm
        uses: pnpm/action-setup@v2
        with:
          version: 10

      - name: Install dependencies
        run: pnpm install --frozen-lockfile

      - name: Build
        run: pnpm build

      - name: Deploy to server
        uses: appleboy/scp-action@master
        with:
          host: ${{ secrets.HOST }}
          username: ${{ secrets.USERNAME }}
          key: ${{ secrets.SSH_KEY }}
          source: "dist/*"
          target: "/var/www/trix"
          strip_components: 1
```

## Performance Optimization

### 1. Enable Gzip

Enable Gzip compression in Nginx configuration.

### 2. Static Asset Caching

Set long-term caching for static assets:

```nginx
location /assets {
    expires 1y;
    add_header Cache-Control "public, immutable";
}
```

### 3. CDN Acceleration

Deploy static assets to CDN, modify `VITE_BASE_URL`:

```bash
VITE_BASE_URL=https://cdn.example.com/trix/
```

### 4. Preloading

Add preloading in `index.html`:

```html
<link rel="preload" href="/assets/main.js" as="script">
<link rel="preload" href="/assets/main.css" as="style">
```

## Common Issues

### 1. 404 on Refresh

Ensure Nginx is configured with `try_files`:

```nginx
location / {
    try_files $uri $uri/ /index.html;
}
```

### 2. Static Asset Path Errors

Check if `VITE_BASE_URL` is configured correctly.

### 3. API CORS Issues

Configure Nginx proxy or backend CORS.
