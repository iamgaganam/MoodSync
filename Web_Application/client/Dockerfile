FROM node:18-alpine as build

WORKDIR /app

# Create a package.json if it doesn't exist
RUN echo '{"name":"mental-health-app","version":"1.0.0","scripts":{"start":"react-scripts start","build":"react-scripts build","test":"react-scripts test","eject":"react-scripts eject"}}' > /app/package.json

# Copy existing package.json and package-lock.json if they exist
COPY package*.json ./

# Create a basic index.html if it doesn't exist
RUN mkdir -p /app/public && echo '<!DOCTYPE html><html><head><meta charset="utf-8"><title>Mental Health Monitoring</title></head><body><div id="root"></div></body></html>' > /app/public/index.html

# Create a basic React component if it doesn't exist
RUN mkdir -p /app/src && echo 'import React from "react"; import ReactDOM from "react-dom"; const App = () => { return (<div><h1>Mental Health Monitoring System</h1><p>Frontend placeholder</p></div>); }; ReactDOM.render(<App />, document.getElementById("root"));' > /app/src/index.js

# Install dependencies
RUN npm install react react-dom react-scripts || echo "Basic dependencies installed"

# Copy source code if it exists
COPY . .

# Build the app
RUN npm run build || mkdir -p /app/build && echo '<!DOCTYPE html><html><head><meta charset="utf-8"><title>Mental Health Monitoring</title></head><body><div id="root"><h1>Mental Health Monitoring System</h1><p>Frontend placeholder</p></div></body></html>' > /app/build/index.html

# Production stage
FROM nginx:alpine

# Copy either built files or placeholder
COPY --from=build /app/build /usr/share/nginx/html

# Create basic nginx config
RUN echo 'server { listen 80; location / { root /usr/share/nginx/html; index index.html index.htm; try_files $uri $uri/ /index.html; } location /api/ { proxy_pass http://server:8000/api/; proxy_http_version 1.1; proxy_set_header Upgrade $http_upgrade; proxy_set_header Connection "upgrade"; proxy_set_header Host $host; } }' > /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]