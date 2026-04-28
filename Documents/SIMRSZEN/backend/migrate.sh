#!/bin/bash

# Migration script for SIMRS ZEN backend

echo "Starting SIMRS ZEN database migration..."

# Navigate to the backend directory
cd "$(dirname "$0")"

# Generate Prisma client
echo "Generating Prisma client..."
npx prisma generate

# Run pending migrations
echo "Running database migrations..."
npx prisma migrate dev

# Seed the database if needed
echo "Checking if seeding is needed..."
if [ -f "prisma/seed.ts" ]; then
    echo "Seeding database..."
    npx prisma db seed
else
    echo "No seed file found, skipping seeding."
fi

echo "Database migration completed!"