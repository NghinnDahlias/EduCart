# ---------- builder stage ----------
FROM node:20-bookworm-slim AS builder

# bcrypt needs build tools to compile its native binding when no
# pre-built binary matches the target platform.
RUN apt-get update \
 && apt-get install -y --no-install-recommends python3 make g++ \
 && rm -rf /var/lib/apt/lists/*

WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci --omit=dev

# ---------- runtime stage ----------
FROM node:20-bookworm-slim

WORKDIR /app
ENV NODE_ENV=production

COPY --from=builder /app/node_modules ./node_modules
COPY package.json ./
COPY src ./src
COPY sql ./sql

# Static product image uploads persist in this volume.
RUN mkdir -p /app/uploads/products

EXPOSE 5000
CMD ["node", "src/server.js"]
