#!/bin/bash

# Navigate to the project root directory
cd "$(dirname "$0")"

echo "======================================"
echo "🐔 Starting Poultry Farm System..."
echo "======================================"

# Start both backend and frontend using the root dev script
npm run dev
