# Use an official Node.js runtime as a parent image
FROM node:20-slim

# Set the working directory in the container
WORKDIR /app

# Install OpenSSL, a dependency for Prisma
RUN apt-get update -y && apt-get install -y openssl

# Install pnpm
RUN npm install -g pnpm

# Copy all the source files
COPY . .

# Install all dependencies from all workspaces
# We need dev dependencies like `prisma` for the build step
RUN pnpm install

# Generate Prisma Client
RUN pnpm --filter web prisma generate

# Build the Next.js application
RUN pnpm --filter web build

# Expose the port the app runs on
EXPOSE 3000

# Set the environment to production for the runtime
ENV NODE_ENV=production

# Define the command to run the app
# Run migrations and then start the application
CMD ["sh", "-c", "pnpm --filter web prisma migrate deploy && pnpm --filter web start"]
