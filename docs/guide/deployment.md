# 部署

本节介绍如何构建和部署 Trix Admin。

## 构建

### 生产环境构建

```bash
pnpm build
```

构建产物位于 `dist/` 目录。

### 测试环境构建

```bash
pnpm build:test
```

### 预览构建结果

```bash
pnpm preview
```

## 环境配置

### 生产环境变量

编辑 `.env.prod`：

```bash
VITE_APP_TITLE=Trix Admin
VITE_BASE_URL=/
VITE_HTTP_PROXY=N
VITE_SOURCE_MAP=N
```

### 子目录部署

如果部署在子目录，修改 `VITE_BASE_URL`：

```bash
# 部署在 /admin/ 目录
VITE_BASE_URL=/admin/
```

## Nginx 配置

### 基本配置

```nginx
server {
    listen 80;
    server_name example.com;
    root /var/www/trix;
    index index.html;

    # 处理 SPA 路由
    location / {
        try_files $uri $uri/ /index.html;
    }

    # 静态资源缓存
    location /assets {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # API 代理
    location /api {
        proxy_pass http://backend:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    # Gzip 压缩
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml;
}
```

### 子目录部署

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

### HTTPS 配置

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

# HTTP 重定向到 HTTPS
server {
    listen 80;
    server_name example.com;
    return 301 https://$server_name$request_uri;
}
```

## Docker 部署

### Dockerfile

```dockerfile
# 构建阶段
FROM node:20-alpine as builder

WORKDIR /app

# 安装 pnpm
RUN npm install -g pnpm

# 复制依赖文件
COPY package.json pnpm-lock.yaml ./

# 安装依赖
RUN pnpm install --frozen-lockfile

# 复制源码
COPY . .

# 构建
RUN pnpm build

# 运行阶段
FROM nginx:alpine

# 复制构建产物
COPY --from=builder /app/dist /usr/share/nginx/html

# 复制 Nginx 配置
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

### 构建和运行

```bash
# 构建镜像
docker build -t trix-admin .

# 运行容器
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

  # 后端服务（可选）
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

## 性能优化

### 1. 开启 Gzip

Nginx 配置中启用 Gzip 压缩。

### 2. 静态资源缓存

为静态资源设置长期缓存：

```nginx
location /assets {
    expires 1y;
    add_header Cache-Control "public, immutable";
}
```

### 3. CDN 加速

将静态资源部署到 CDN，修改 `VITE_BASE_URL`：

```bash
VITE_BASE_URL=https://cdn.example.com/trix/
```

### 4. 预加载

在 `index.html` 中添加预加载：

```html
<link rel="preload" href="/assets/main.js" as="script">
<link rel="preload" href="/assets/main.css" as="style">
```

## 常见问题

### 1. 刷新 404

确保 Nginx 配置了 `try_files`：

```nginx
location / {
    try_files $uri $uri/ /index.html;
}
```

### 2. 静态资源路径错误

检查 `VITE_BASE_URL` 配置是否正确。

### 3. API 跨域

配置 Nginx 代理或后端 CORS。
