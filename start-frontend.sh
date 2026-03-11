#!/bin/bash
# start-frontend.sh — Install deps and start the React frontend

echo "🎨 Starting AI Chatbot Frontend..."
echo ""

cd frontend

if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
    echo ""
fi

echo "✅ Starting development server on http://localhost:5173"
npm run dev
