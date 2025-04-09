#!/usr/bin/env bash
# Exit on error
set -o errexit

npm install
mkdir -p dist
chmod +x ./node_modules/.bin/esbuild
npm run build
