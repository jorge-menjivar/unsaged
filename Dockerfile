# ---- Base Node ----
FROM node:19-alpine AS base
RUN apk update && apk upgrade && apk add python3 build-base
WORKDIR /app

# ---- Dependencies ----
FROM base AS build-dependencies
COPY package*.json ./
RUN npm ci

# ---- Modules ----
FROM base AS modules
COPY package*.json ./
RUN npm i --production

# ---- Build ----
FROM build-dependencies AS build
COPY . .
RUN npm run build

# ---- Production ----
FROM node:19-alpine AS production
RUN apk update \
    && apk upgrade --no-cache \
    && apk add --no-cache curl
WORKDIR /app
COPY --from=modules /app/node_modules ./node_modules
COPY --from=build /app/.next ./.next
COPY --from=build /app/public ./public
COPY --from=build /app/package*.json ./
COPY --from=build /app/next.config.js ./next.config.js
COPY --from=build /app/next-i18next.config.js ./next-i18next.config.js
EXPOSE 3000
CMD ["npm", "start"]
