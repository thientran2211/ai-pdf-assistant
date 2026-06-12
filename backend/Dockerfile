FROM node:20-alpine

# Install required libraries for native modules
RUN apk add --no-cache libc6-compat

WORKDIR /app

# Copy package files first (for better caching)
COPY package*.json ./

# Install production dependencies
RUN npm ci --only=production

# Copy source code
COPY . .

# Create uploads directory
RUN mkdir -p uploads/documents

EXPOSE 8000

CMD ["node", "server.js"]