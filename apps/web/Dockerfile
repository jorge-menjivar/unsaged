# ---- Base Node ----
FROM node:19-alpine AS base
WORKDIR /unsaged

# Install pnpm
RUN npm install -g pnpm

# Copy the root `package.json`, `pnpm-lock.yaml` and `pnpm-workspace.yaml`
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

# Copy the entire apps and packages directories
COPY apps/ apps/
COPY packages/ packages/

# Copy the .env.local file from the host to the specified path in the Docker container
COPY ./apps/web/.env.local /unsaged/apps/web/.env.local

# ---- Dependencies ----
FROM base AS dependencies

# Install the dependencies
RUN pnpm install --frozen-lockfile

# ---- Build ----
FROM dependencies AS build

# Change working directory to the app directory
WORKDIR /unsaged/apps/web

# Build the app
RUN pnpm run build

# ---- Production ----
FROM base AS production
WORKDIR /unsaged

# Copy the built node modules and any other production packages from dependencies stage
COPY --from=dependencies /unsaged/node_modules ./node_modules

# Copy the built next files from the build stage
COPY --from=build /unsaged/apps/web/.next ./apps/web/.next
COPY --from=build /unsaged/apps/web/public ./apps/web/public
COPY --from=build /unsaged/apps/web/next.config.js ./apps/web/next.config.js
COPY --from=build /unsaged/apps/web/next-i18next.config.js ./apps/web/next-i18next.config.js
COPY --from=build /unsaged/apps/web/package.json ./apps/web/package.json

# Expose the port the app will run on
EXPOSE 3000

# Set the working directory to the built app and start it
WORKDIR /unsaged/apps/web
CMD ["pnpm", "start"]
