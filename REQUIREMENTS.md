# Smart-Stock AI: Installation & Requirements

To set up this project on a new machine, follow this guide. This project is a Full-Stack application (Node.js/Express backend + Vite/React frontend).

## 📋 Software Requirements
* **Node.js**: v18.0.0 or higher
* **npm**: v9.0.0 or higher
* **MongoDB**: A free MongoDB Atlas Cluster (recommended) or a local MongoDB instance.
* **Gemini API Key**: A valid API key from [Google AI Studio](https://aistudio.google.com/).

---

## 🛠️ Backend Dependencies (Node.js)
Navigate to the `backend/` folder and run `npm install`. The following core libraries will be installed:

| Library | Purpose |
| :--- | :--- |
| `express` | Web framework for API routing |
| `mongoose` | MongoDB object modeling (Database connection) |
| `@google/generative-ai` | Gemini 2.5 Flash SDK for AI Forecasting |
| `jsonwebtoken` (jwt) | Secure user authentication |
| `bcryptjs` | Password hashing and security |
| `cors` | Cross-Origin Resource Sharing |
| `dotenv` | Environment variable management |
| `morgan` | HTTP request logger |
| `nodemon` | Development server auto-restart |

---

## 🎨 Frontend Dependencies (React/Vite)
Navigate to the `frontend/` folder and run `npm install`. Key libraries include:

| Library | Purpose |
| :--- | :--- |
| `react` / `react-dom` | Core UI library |
| `axios` | For making API calls to the backend |
| `lucide-react` | Brutalist icon set |
| `recharts` | Real-time inventory charting |
| `react-router-dom` | Page navigation and routing |
| `tailwindcss` | Utility-first styling (v4) |
| `jspdf` / `jspdf-autotable` | PDF report generation |

---

## 🔐 Environment Setup (.env)
You **MUST** create a `.env` file in the `backend/` directory with these variables:

```env
PORT=5000
JWT_SECRET=your_random_secret_string
MONGODB_URI=your_mongodb_atlas_connection_string
GEMINI_API_KEY=your_google_ai_studio_key
FRONTEND_URL=http://localhost:5173
```

---

## 🚀 One-Command Install
Send these commands to your friend to get started quickly:

1. **Install All:**
   ```bash
   cd backend && npm install && cd ../frontend && npm install
   ```

2. **Seed the Database (First time only):**
   ```bash
   cd backend && node seed.js
   ```

3. **Start Development:**
   * Backend: `cd backend && npm run dev`
   * Frontend: `cd frontend && npm run dev`
