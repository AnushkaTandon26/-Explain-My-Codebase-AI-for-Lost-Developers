# 🚀 Explain My Codebase — AI for Lost Developers

An AI-powered developer assistant that analyzes GitHub repositories and generates structured explanations to help developers quickly understand unfamiliar codebases.

This project is designed to reduce onboarding time and help developers navigate complex projects faster using AI.

---

##  Live Demo

Frontend (Vercel):
👉 https://explain-my-codebase-ai-for-lost-dev.vercel.app/

Backend (Render):
👉 https://explain-my-codebase-ai-for-lost.onrender.com/

---

##  Features

1.Paste any GitHub repository URL  
2.AI analyzes project structure automatically  
3.Detects framework and entry point  
4.Generates architecture overview  
5.Provides beginner-friendly explanation  
6.Suggests where to start reading the code  
7.Chat-style AI interface with typing animation  
8.Premium SaaS-style UI with glass effects  
9.Snowfall animated background  
10.Fully deployed frontend + backend

---

## How It Works

1. User enters a GitHub repository URL.
2. Frontend sends request to backend API.
3. Backend clones/analyzes repository structure.
4. AI processes codebase information.
5. Structured explanation is returned.
6. Frontend displays results in chat-style interface.

---

##  Tech Stack

### Frontend
- Next.js (App Router)
- React
- Tailwind CSS
- TypeScript
- Custom animations (CSS + React)

### Backend
- Node.js
- Express.js
- GitHub repository analysis
- AI integration

### Deployment
- Frontend: Vercel
- Backend: Render

---

## 📂 Project Structure

```

Explain-My-Codebase-AI-for-Lost-Developers
│
├── frontend/      → Next.js AI dashboard UI
├── backend/       → Node.js API + repo analyzer
└── README.md

```

---

## ⚙️ Installation (Local Setup)

### 1. Clone repository

```

git clone https://github.com/AnushkaTandon26/-Explain-My-Codebase-AI-for-Lost-Developers.git
```

---

### 2. Backend setup

```

cd backend
npm install
npm start

```

Backend runs on:

```

[http://localhost:5000]

```

---

### 3. Frontend setup

```

cd frontend
npm install
npm run dev

```

Frontend runs on:

```

[http://localhost:3000]

```

---

##  Environment Variables

If required, create `.env` files:

Example:

```

API_URL=[http://localhost:5000]

```

---

##  Deployment

### Backend
Deployed using Render.

### Frontend
Deployed using Vercel with root directory set to:

```

frontend

```

---

##  Future Improvements

- AI streaming responses
- User authentication
- History of analyzed repositories
- Code visualization graph
- Dark/light themes
- Multi-language support

---

##  Author

Anushka (Computer Science Student)

Passionate about building intelligent developer tools and solving real-world problems using AI.

---

## ⭐ Why This Project?

Understanding new codebases is one of the biggest challenges developers face. This tool helps:

- Students learning new projects
- Developers onboarding into teams
- Open-source contributors
- Hackathon participants

---


