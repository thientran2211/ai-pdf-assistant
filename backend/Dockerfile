FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

# Install production dependencies
RUN npm ci --only=production

# Remove test files from pdf-parse to prevent ENOENT error
RUN rm -rf node_modules/pdf-parse/test || true

# Copy source code
COPY . .

EXPOSE 8000

CMD ["node", "server.js"]