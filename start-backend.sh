#!/bin/bash
# start-backend.sh — Start the Spring Boot backend

echo "🚀 Starting AI Chatbot Backend..."
echo ""

# Check for API key
if [ -z "$GEMINI_API_KEY" ] && ! grep -q "YOUR_ACTUAL_GEMINI_API_KEY\|YOUR_GEMINI_API_KEY_HERE" backend/src/main/resources/application.properties 2>/dev/null; then
    echo "⚠️  Remember to set your Gemini API key!"
    echo "   Edit: backend/src/main/resources/application.properties"
    echo "   Or:   export GEMINI_API_KEY=your_key"
    echo ""
fi

cd backend
mvn spring-boot:run
