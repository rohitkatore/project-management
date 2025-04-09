#!/usr/bin/env bash
# filepath: c:\Users\rohit\OneDrive\Desktop\Web Devlopment\Intership Projects\project-management\backend\render-build.sh
# Exit on error
set -o errexit

# Install dependencies including dev dependencies needed for build
npm install

# Make prisma executable
chmod +x ./node_modules/.bin/prisma

# Try different methods to generate Prisma client
echo "Attempting to generate Prisma client..."
./node_modules/.bin/prisma generate --schema=./db/prisma/schema.prisma || \
NODE_OPTIONS="--no-warnings" npx prisma generate --schema=./db/prisma/schema.prisma || \
npm exec -- prisma generate --schema=./db/prisma/schema.prisma

# Run TypeScript compiler
npm run build