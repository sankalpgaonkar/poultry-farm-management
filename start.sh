#!/bin/bash

# Navigate to the project root directory
cd "$(dirname "$0")"

echo "======================================"
echo "🐔 Starting Poultry Farm System..."
echo "======================================"

# 1. Start the Backend API in the background
echo "-> Starting Backend API on port 5000..."
cd backend
node server.js &
BACKEND_PID=$!
cd ..

# 2. Start the Frontend React App in the background
echo "-> Starting Frontend Web App on port 5173..."
cd frontend
npm run dev &
FRONTEND_PID=$!
cd ..

echo "======================================"
echo "✅ Both servers are now running!"
echo "🌐 Open your browser at: http://localhost:5173"
echo "🛑 Press [CTRL+C] here to stop all servers."
echo "======================================"

# Handle shutdown smoothly
trap "kill $BACKEND_PID $FRONTEND_PID" SIGINT
wait $BACKEND_PID $FRONTEND_PID
