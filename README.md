# 🤖 AI Chatbot — ChatGPT Clone

A full-stack AI chatbot application built with React + Vite (frontend) and Spring Boot (backend), powered by Google Gemini API.

---

## ✨ Features

- 💬 **Multi-conversation chat** — Create, rename, and delete conversations like ChatGPT
- 🤖 **Google Gemini AI** — Powered by Gemini 1.5 Flash/Pro models
- 🔐 **JWT Authentication** — Secure signup/login with token-based auth
- 📝 **Markdown rendering** — Full markdown support with syntax-highlighted code blocks
- 📁 **File uploads** — Attach images, PDFs, and text files via drag & drop
- 🎤 **Voice input** — Browser speech recognition
- 🌙 **Dark/Light mode** — Persistent theme preference
- 📱 **Responsive design** — Works on desktop, tablet, and mobile
- 🗄️ **H2 Database** — Zero-config embedded database (compatible with PostgreSQL/MySQL)

---

## 🚀 Quick Start

### Prerequisites
- Java 17+
- Node.js 18+
- Maven 3.8+
- A Google Gemini API key (free at https://aistudio.google.com/app/apikey)

---

### Step 1 — Configure Gemini API Key

Edit `backend/src/main/resources/application.properties`:

```properties
gemini.api.key=YOUR_ACTUAL_GEMINI_API_KEY
```

Or set it as an environment variable:
```bash
export GEMINI_API_KEY=your_key_here
```

---

### Step 2 — Start the Backend

```bash
cd backend
mvn spring-boot:run
```

Backend starts on **http://localhost:8080**

> H2 Console available at: http://localhost:8080/h2-console  
> (JDBC URL: `jdbc:h2:file:./chatbot-db`, user: `sa`, no password)

---

### Step 3 — Start the Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend starts on **http://localhost:5173**

---

## 🗂️ Project Structure

```
chatbot/
├── backend/                  # Spring Boot application
│   ├── pom.xml
│   └── src/main/
│       ├── java/com/app/chatbot/
│       │   ├── config/       # Security & App config
│       │   ├── controller/   # REST endpoints
│       │   ├── service/      # Business logic + Gemini API
│       │   ├── entity/       # JPA entities
│       │   ├── repository/   # Data access layer
│       │   ├── dto/          # Request/Response objects
│       │   └── security/     # JWT utilities
│       └── resources/
│           └── application.properties
│
└── frontend/                 # React + Vite application
    ├── package.json
    ├── vite.config.js
    └── src/
        ├── components/       # UI components
        ├── context/          # Zustand stores
        ├── styles/           # CSS files
        └── utils/            # API helper
```

---

## 🔌 API Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/auth/signup` | Create account | ❌ |
| POST | `/api/auth/login` | Login | ❌ |
| POST | `/api/chat` | Send message | ✅ |
| GET | `/api/conversations` | List conversations | ✅ |
| GET | `/api/conversations/{id}` | Get conversation | ✅ |
| POST | `/api/conversations` | Create conversation | ✅ |
| PATCH | `/api/conversations/{id}` | Rename conversation | ✅ |
| DELETE | `/api/conversations/{id}` | Delete conversation | ✅ |
| GET | `/api/models` | List AI models | ✅ |

---

## 🏭 Production Deployment

### Switch to PostgreSQL

In `application.properties`, uncomment the PostgreSQL section:
```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/chatbot
spring.datasource.driver-class-name=org.postgresql.Driver
spring.datasource.username=postgres
spring.datasource.password=yourpassword
spring.jpa.database-platform=org.hibernate.dialect.PostgreSQLDialect
```

### Build for Production

```bash
# Build backend JAR
cd backend
mvn clean package -DskipTests

# Build frontend
cd frontend
npm run build
```

---

## 🛠️ Tech Stack

**Frontend:** React 18, Vite, Zustand, Axios, React Markdown, React Syntax Highlighter, React Icons  
**Backend:** Spring Boot 3, Spring Security, Spring Data JPA, JWT  
**Database:** H2 (dev) / PostgreSQL or MySQL (prod)  
**AI:** Google Gemini API (gemini-1.5-flash, gemini-1.5-pro)

---

## ⚙️ Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `GEMINI_API_KEY` | Google Gemini API key | Required |
| `JWT_SECRET` | JWT signing secret | Auto-configured |
| `SERVER_PORT` | Backend port | 8080 |

---

## 📝 Notes

- The only **required** configuration is the Gemini API key.
- Database is auto-created on first run — no setup needed.
- Voice input requires a browser that supports the Web Speech API (Chrome recommended).
- File uploads: images and text files are read and sent as context to the AI.
