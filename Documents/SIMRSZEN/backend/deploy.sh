#!/bin/bash

# Deployment script for SIMRS ZEN backend
echo "Starting SIMRS ZEN backend deployment..."

# Navigate to backend directory
cd "$(dirname "$0")"

# Install dependencies
echo "Installing dependencies..."
npm install --production

# Build the application
echo "Building the application..."
npm run build

# Generate Prisma client for production
echo "Generating Prisma client..."
npx prisma generate

# Apply any pending migrations
echo "Applying database migrations..."
npx prisma migrate deploy

# Start the application
echo "Starting the application..."
pm2 start dist/app.js --name "simrszen-backend" --time

echo "Deployment completed successfully!"
echo "Application is running on PM2 with name 'simrszen-backend'"