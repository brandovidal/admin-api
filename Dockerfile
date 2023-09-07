# Development stage
FROM node:18-alpine as development
WORKDIR /app
COPY package*.json ./
RUN npm install -g pnpm
COPY tsconfig.json ./
COPY pnpm-lock.yaml ./
COPY prisma/schema.prisma  ./
COPY tsoa.json  ./
COPY .env  ./
RUN pnpm install
COPY ./src ./src
RUN ls
CMD [ "pnpm", "run", "start" ]

# Builder stage
FROM development as builder
WORKDIR /app
# Build the app with devDependencies still installed from "development" stage
RUN pnpm run build
# Clear dependencies and reinstall for production (no devDependencies)
# RUN rm -rf node_modules
# RUN pnpm install

# Production stage
FROM alpine:latest as production
RUN apk --no-cache add nodejs ca-certificates
WORKDIR /root/
COPY --from=builder /app ./
CMD [ "node", "build/index" ]