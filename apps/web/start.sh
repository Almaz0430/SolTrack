#!/bin/bash

echo "Starting migration process..."
pnpm --filter web prisma migrate deploy

if [ $? -eq 0 ]; then
    echo "Migrations applied successfully!"
else
    echo "Migration failed, but continuing with app start..."
fi

echo "Starting Next.js application..."
pnpm --filter web start
