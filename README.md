# AI-Powered Technical Interview Simulator

A full-stack mock coding interview platform that generates role-specific 
coding questions in real time and evaluates submitted solutions using 
an LLM (Groq).

## Features
- Dynamic question generation tailored to role and company
- Live code editor supporting JavaScript, Python, Java, and C++
- AI-based code evaluation with correctness, time/space complexity, and feedback
- Graceful fallback to a static question bank if the AI backend is unavailable
- Progress tracking across a 5-question interview session

## Tech Stack
**Frontend:** React 19, Vite, React Router, Tailwind CSS  
**Backend:** Node.js, Express  
**AI:** Groq API (Llama 3.3 70B)

## Getting Started

### Prerequisites
- Node.js installed
- A Groq API key ([console.groq.com](https://console.groq.com))

### Setup
```bash
# Clone the repo
git clone https://github.com/priyankakaryampudi/Ai-powered-technical-interview-simulator.git
cd Ai-powered-technical-interview-simulator

# Backend
cd server
npm install
# create a .env file with: GROQ_API_KEY=your_key_here
node index.js

# Frontend (in a new terminal)
cd client
npm install
npm run dev
```

## Known Limitations / Roadmap
- No persistent storage of past interview sessions
- No user authentication yet (Auth page is UI-only)
- Code evaluation is LLM-based, not sandboxed execution — no actual test-case runner
- Planned: session history, user accounts, and real code execution via a sandboxed runner

## Notable Technical Detail
The AI integration originally failed silently due to an incorrect API endpoint 
and request schema mismatch (using a legacy completions-style payload against 
Groq's chat completions API). Debugging this involved tracing through defensive 
fallback logic already built into the frontend to isolate the root cause in the 
backend request layer.
