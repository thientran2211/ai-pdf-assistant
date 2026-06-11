# Sử dụng Node.js 18 Alpine
FROM node:18-alpine

# Set working directory trong container
WORKDIR /app

# Copy package files trước để tận dụng Docker cache
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy toàn bộ source code
COPY . .

# Remove test files to avoid runtime errors
RUN find node_modules -name "test" -type d -exec rm -rf {} + 2>/dev/null || true

# Expose port 8000
EXPOSE 8000

# Start server
CMD ["node", "server.js"]