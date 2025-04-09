#!/usr/bin/env bash
# filepath: c:\Users\rohit\OneDrive\Desktop\Web Devlopment\Intership Projects\project-management\backend\render-build.sh
# Exit on error
set -o errexit

# Install dependencies including dev dependencies needed for build
npm install

# Generate Prisma client
npx prisma generate --schema=./db/prisma/schema.prisma

# Run TypeScript compiler
npm run build