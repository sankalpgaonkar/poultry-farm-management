#!/bin/bash

# Navigate to the project root directory
cd "$(dirname "$0")"

echo "======================================"
echo "🐔 Starting Poultry Farm System..."
echo "======================================"

# 1. Start the Backend API and Frontend App together using concurrently
echo "-> Starting Full Stack Application (Backend & Frontend)..."
npm run dev
# Note: Since 'npm run dev' uses concurrently and stays in foreground, we don't need & or wait for individuals here.
# But for the script's exit logic, 'npm run dev' handles SIGINT itself.

echo "======================================"
echo "✅ Both servers are now running!"
echo "🌐 Open your browser at: http://localhost:5173"
echo "🛑 Press [CTRL+C] here to stop all servers."
echo "======================================"

# Handle shutdown smoothly
trap "kill $BACKEND_PID $FRONTEND_PID" SIGINT
wait $BACKEND_PID $FRONTEND_PID
