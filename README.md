# 🧠 Smart-Stock AI

[![Brutalist UI](https://img.shields.io/badge/UI-Brutalist-black?style=for-the-badge)](https://github.com)
[![AI Powered](https://img.shields.io/badge/AI-Gemini_2.5_Flash-emerald?style=for-the-badge)](https://ai.google.dev/)
[![Stack](https://img.shields.io/badge/Stack-MERN-blue?style=for-the-badge)](https://mongodb.com)

**Smart-Stock AI** is a high-performance, B2B SaaS platform designed for predictive inventory management. By combining a stark **Brutalist Aesthetic** with **Gemini 2.5 Flash AI**, it transforms raw inventory data into actionable procurement intelligence.

---

## ⚡ Key Features

*   **Neural Demand Forecasting:** Real-time SKU health analysis powered by Gemini 2.5 Flash.
*   **Brutalist UX/UI:** A high-contrast Black/White/Emerald interface designed for maximum information density and zero distraction.
*   **Role-Based Access Control (RBAC):** Secure environments for Admins, Managers, and Staff.
*   **Live Persistence:** Fully integrated with MongoDB Atlas for reliable, global data storage.
*   **One-Click Procurement:** Automated Purchase Order (P.O.) execution based on AI reorder suggestions.
*   **Instant Analytics:** Real-time calculation of Run Rates, Stockout Dates, and Inventory Velocity.
*   **Export Intelligence:** Generate professional CSV and PDF reports for supply chain audits.

---

## 🛠️ Tech Stack

### Frontend
*   **React 18** (Vite-powered)
*   **Tailwind CSS v4** (Brutalist styling)
*   **Lucide React** (Iconography)
*   **Recharts** (Predictive graphing)
*   **Context API** (Global State Management)

### Backend
*   **Node.js & Express**
*   **MongoDB Atlas** (Database)
*   **Mongoose** (ODM)
*   **Google Generative AI SDK** (Gemini 2.5 Flash)
*   **JWT & BcryptJS** (Security)

---

## 🚀 Quick Start

### Prerequisites
*   Node.js v18+
*   MongoDB Atlas Account
*   Google AI Studio API Key

### Installation

1.  **Clone the Repository:**
    ```bash
    git clone https://github.com/yourusername/smart-stock-ai.git
    cd smart-stock-ai
    ```

2.  **Install Dependencies:**
    ```bash
    # Install backend and frontend libraries
    cd backend && npm install
    cd ../frontend && npm install
    ```

3.  **Configure Environment:**
    Create a `.env` file in the `backend/` directory:
    ```env
    PORT=5000
    MONGODB_URI=your_mongodb_uri
    GEMINI_API_KEY=your_api_key
    JWT_SECRET=your_secret_key
    FRONTEND_URL=http://localhost:5173
    ```

4.  **Seed Initial Data:**
    ```bash
    cd backend
    node seed.js
    ```

5.  **Launch:**
    ```bash
    # In one terminal (Backend)
    cd backend && npm run dev

    # In another terminal (Frontend)
    cd frontend && npm run dev
    ```

---

## 📐 Architecture

Smart-Stock AI follows a decoupled architecture:
1.  **Core Logic:** Synchronous backend calculations for immediate stock updates.
2.  **AI Layer:** Asynchronous Gemini 2.5 Flash service for long-term forecasting and creative insights.
3.  **Persistence Layer:** MongoDB Atlas manages permanent storage for items, users, and system logs.

---

## 🔒 Security
*   **Password Hashing:** Argon2/Bcrypt implementation for user credentials.
*   **JWT Protection:** Stateless authentication across all private routes.
*   **Environment Isolation:** All sensitive API keys and database URIs are managed via `.env`.

---

## 🎨 Visual Philosophy
The UI follows **Neobrutalism**:
*   **Hard Shadows:** 4px to 8px offsets for depth.
*   **Emerald Accents:** `#10b981` used exclusively for focus and success states.
*   **Stark Borders:** Bold `border-black` for all containers.
*   **Typography:** Heavy tracking and uppercase headers for an industrial feel.

---

## 📜 License
Distributed under the MIT License. See `LICENSE` for more information.

---

## 🙌 Credits
Built with passion by [Your Name] using the Google Gemini Ecosystem.
