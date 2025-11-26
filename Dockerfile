# 1. Install dependencies
FROM node:18-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm install

# 2. Build Next.js (standalone mode)
FROM node:18-alpine AS builder
WORKDIR /app
COPY . .
COPY --from=deps /app/node_modules ./node_modules
RUN npm run build

# 3. Production runner
FROM node:18-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

# Copy standalone server + static files
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

EXPOSE 8080
ENV PORT=8080

CMD ["node", "server.js"]
