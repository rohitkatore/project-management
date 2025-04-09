#!/usr/bin/env bash
# filepath: c:\Users\rohit\OneDrive\Desktop\Web Devlopment\Intership Projects\project-management\backend\render-build.sh
# Exit on error
set -o errexit

# Install dependencies including dev dependencies needed for build
npm install

# Generate Prisma client
echo "Attempting to generate Prisma client..."
npm run prisma:generate || npm exec -- prisma generate --schema=./db/prisma/schema.prisma

# Run TypeScript compiler with less strict settings
echo "Running TypeScript compiler..."
npx tsc --skipLibCheck --noImplicitAny false

# Make the output directory executable
chmod -R 755 ./dist