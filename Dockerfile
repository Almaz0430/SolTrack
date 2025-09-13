# Use an official Node.js runtime as a parent image
FROM node:20-slim

# Set the working directory in the container
WORKDIR /app

# Install pnpm
RUN npm install -g pnpm

# Copy the root package.json and pnpm-lock.yaml
COPY package.json pnpm-lock.yaml ./

# Copy pnpm-workspace.yaml
COPY pnpm-workspace.yaml ./

# Install all dependencies
RUN pnpm install

# Copy the rest of the monorepo source code
COPY . .

# Set the build environment to production
ENV NODE_ENV=production

# Generate Prisma Client
RUN pnpm --filter web prisma generate

# Build the Next.js application
RUN pnpm --filter web build

# Expose the port the app runs on
EXPOSE 3000

# Define the command to run the app
CMD ["pnpm", "--filter", "web", "start"]
