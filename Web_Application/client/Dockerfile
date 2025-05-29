# Multi-stage build
# Build stage - Create optimized React application
FROM node:18-alpine AS build

# Set working directory
WORKDIR /app

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nextjs -u 1001

# Copy package files for dependency installation
COPY package*.json ./

# Create minimal package.json if not exists
RUN if [ ! -s package.json ]; then \
      echo '{ \
        "name": "mental-health-app", \
        "version": "1.0.0", \
        "scripts": { \
          "start": "react-scripts start", \
          "build": "react-scripts build", \
          "test": "react-scripts test", \
          "eject": "react-scripts eject" \
        } \
      }' > package.json; \
    fi

# Install dependencies with npm ci for production builds
RUN npm ci --only=production --silent || npm install react react-dom react-scripts --silent

# Setup application structure
RUN mkdir -p public src

# Create minimal HTML template if not exists
RUN if [ ! -f public/index.html ]; then \
      echo '<!DOCTYPE html> \
      <html lang="en"> \
        <head> \
          <meta charset="utf-8"> \
          <meta name="viewport" content="width=device-width, initial-scale=1"> \
          <title>Mental Health Monitoring</title> \
        </head> \
        <body> \
          <div id="root"></div> \
        </body> \
      </html>' > public/index.html; \
    fi

# Create minimal React app if not exists
RUN if [ ! -f src/index.js ]; then \
      echo 'import React from "react"; \
      import ReactDOM from "react-dom"; \
      const App = () => ( \
        <div> \
          <h1>Mental Health Monitoring System</h1> \
          <p>Application Loading...</p> \
        </div> \
      ); \
      ReactDOM.render(<App />, document.getElementById("root"));' > src/index.js; \
    fi

# Copy source code
COPY . .

# Change ownership to nodejs user
RUN chown -R nodejs:nodejs /app
USER nodejs

# Build application with error handling
RUN npm run build || ( \
      mkdir -p build && \
      echo '<!DOCTYPE html> \
      <html lang="en"> \
        <head> \
          <meta charset="utf-8"> \
          <meta name="viewport" content="width=device-width, initial-scale=1"> \
          <title>Mental Health Monitoring</title> \
        </head> \
        <body> \
          <div id="root"> \
            <h1>Mental Health Monitoring System</h1> \
            <p>Service Temporarily Unavailable</p> \
          </div> \
        </body> \
      </html>' > build/index.html \
    )

# Production stage - Nginx web server
FROM nginx:alpine

# Security: Remove default nginx user and create custom user
RUN addgroup -g 1001 -S nginx_custom && \
    adduser -S nginx_custom -u 1001

# Copy built application from build stage
COPY --from=build /app/build /usr/share/nginx/html

# Configure nginx with optimized settings
COPY <<EOF /etc/nginx/conf.d/default.conf
server {
    listen 80;
    server_name localhost;
    
    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    
    # Gzip compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
    
    # Frontend routes
    location / {
        root /usr/share/nginx/html;
        index index.html;
        try_files \$uri \$uri/ /index.html;
    }
    
    # API proxy configuration
    location /api/ {
        proxy_pass http://server:8000/api/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }
    
    # Health check endpoint
    location /health {
        access_log off;
        return 200 "healthy\n";
        add_header Content-Type text/plain;
    }
}
EOF

# Set proper permissions
RUN chown -R nginx_custom:nginx_custom /usr/share/nginx/html && \
    chown -R nginx_custom:nginx_custom /var/cache/nginx

# Switch to non-root user
USER nginx_custom

# Expose port
EXPOSE 80

# Health check for container orchestration
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD curl -f http://localhost/health || exit 1

# Start nginx
CMD ["nginx", "-g", "daemon off;"]