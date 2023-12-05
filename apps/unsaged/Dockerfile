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
#COPY ./apps/unsaged/.env.local /unsaged/apps/unsaged/.env.local

# ---- Dependencies ----
FROM base AS dependencies

# Install the dependencies
RUN pnpm install --frozen-lockfile

# ---- Build ----
FROM dependencies AS build

# Change working directory to the app directory
WORKDIR /unsaged/apps/unsaged

# Build the app
RUN pnpm run build

# ---- Production ----
FROM base AS production
WORKDIR /unsaged

# Copy the built node modules and any other production packages from dependencies stage
COPY --from=dependencies /unsaged/node_modules ./node_modules

# Copy the built next files from the build stage
COPY --from=build /unsaged/apps/unsaged/.next ./apps/unsaged/.next
COPY --from=build /unsaged/apps/unsaged/public ./apps/unsaged/public
COPY --from=build /unsaged/apps/unsaged/next.config.js ./apps/unsaged/next.config.js
COPY --from=build /unsaged/apps/unsaged/next-i18next.config.js ./apps/unsaged/next-i18next.config.js
COPY --from=build /unsaged/apps/unsaged/package.json ./apps/unsaged/package.json

# Expose the port the app will run on
EXPOSE 3000

# Set the working directory to the built app and start it
WORKDIR /unsaged/apps/unsaged
CMD ["pnpm", "start"]
