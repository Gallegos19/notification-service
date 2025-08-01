# Build stage
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY tsconfig.json ./

# Install all dependencies (including dev dependencies for build)
RUN npm ci && npm cache clean --force

# Copy source code
COPY src/ ./src/
COPY prisma/ ./prisma/
COPY scripts/ ./scripts/

# Generate Prisma client
RUN npx prisma generate

# Build the application
RUN npm run build

# Production stage
FROM node:18-alpine AS production

WORKDIR /app

# Install dumb-init and OpenSSL for Prisma
RUN apk add --no-cache dumb-init openssl

# Create non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S xumaa -u 1001

# Copy package files and install only production dependencies
COPY package*.json ./
RUN npm ci --only=production && npm cache clean --force

# Copy prisma schema and generate client for Alpine Linux
COPY --from=builder /app/prisma ./prisma
RUN npx prisma generate

# Copy built application and generated Prisma client
COPY --from=builder --chown=xumaa:nodejs /app/dist ./dist
COPY --from=builder --chown=xumaa:nodejs /app/node_modules/.prisma ./node_modules/.prisma

# Switch to non-root user
USER xumaa

# Expose port
EXPOSE 3005

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3005/health', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) })"

# Start the application
ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "dist/main.js"]