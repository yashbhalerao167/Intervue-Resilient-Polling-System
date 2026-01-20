
# Resilient Live Polling System

A **production-grade, real-time polling system** built as part of the **Intervue.io – SDE Intern Assignment**.  
The system is designed with **resilience, correctness, and clean architecture** as first-class goals.

This is **not** a basic polling app — the backend acts as the **single source of truth**, ensuring correct behavior across refreshes, late joins, and concurrent interactions.

---

## 🔗 Live Deployment

### Frontend (Netlify)
👉 https://intervue-resilient-polling-system.netlify.app/

> Users should access the application **only via the frontend link**.

### Backend (Render)
👉 https://intervue-resilient-polling-system.onrender.com/health

> The backend exposes APIs and Socket.IO endpoints (not a UI).

---

## 🎯 Problem Statement

Build a **Resilient Live Polling System** with two personas:

- **Teacher (Admin)**
- **Student (User)**

The system must handle:
- Real-time polling
- State recovery on refresh
- Late joins with synchronized timers
- Race conditions and vote integrity
- Persistent poll history

---

## 🧠 Core Design Philosophy

### 1. Backend as the Source of Truth
- Timers are **never calculated on the client**
- Poll state, timing, and votes are persisted in the database
- Clients only render what the server sends

### 2. Resilience by Design
- Refreshing the page does **not** reset polls
- Late-joining students receive the correct remaining time
- Temporary disconnects do not corrupt state

### 3. Clean Architecture
- **No business logic inside Socket.IO listeners**
- Clear separation:
  - Controllers / Socket Handlers
  - Services (business logic)
  - Database models

---

## 🛠 Tech Stack

### Frontend
- React.js (Vite)
- TypeScript
- Custom Hooks (`useSocket`, `usePollState`)
- Socket.IO Client

### Backend
- Node.js
- Express.js
- Socket.IO
- TypeScript

### Database
- MongoDB Atlas (persistent storage)

### Hosting
- Frontend: Netlify
- Backend: Render

---

## 👥 Personas & Features

### 👨‍🏫 Teacher (Admin)

- Create a poll with:
  - Question
  - Multiple options
  - Configurable timer (up to 60 seconds)
  - Correct answer selection
- View **live voting results** in real-time
- See **final results** after poll ends
- View **poll history** (persisted in DB)
- Remove (kick) a student from the session
- Participate in live chat

---

### 🎓 Student (User)

- Enter name on first visit (unique per tab/session)
- Receive poll instantly when created
- Timer stays synchronized with server
- Vote once per poll (enforced server-side)
- View live results after voting
- Participate in live chat

---

## ⏱ Timer Synchronization (Key Requirement)

Example:
- Poll duration: **60 seconds**
- Student joins after **30 seconds**
- Student sees **30 seconds remaining**, not 60

**How it works:**
- Poll `startTime` and `endTime` are stored in DB
- On socket connection, server calculates:
  `remainingTime = endTime - currentTime`
- Client only renders the remaining time

---

## 🔒 Data Integrity & Race Conditions

- One vote per student per poll (enforced on backend)
- Client-side manipulation does not affect results
- Server validates all vote submissions
- Results are always calculated server-side

---

## 🧩 Bonus Features Implemented

✅ Real-time chat between students and teacher  
✅ Participant list with live updates  
✅ Teacher can remove disruptive students  
✅ Poll history fetched from database (not local storage)

---

## 📁 Project Structure (High Level)

### Backend
```
backend/
 ├── src/
 │   ├── controllers/
 │   ├── services/
 │   ├── models/
 │   ├── socket.ts
 │   ├── app.ts
 │   └── server.ts
 ├── dist/
 ├── package.json
 └── tsconfig.json
```

### Frontend
```
frontend/
 ├── src/
 │   ├── components/
 │   ├── hooks/
 │   ├── App.tsx
 │   └── main.tsx
 ├── package.json
 └── vite.config.ts
```

---

## 🚀 Running the Project Locally

### Prerequisites
- Node.js (v18+ recommended)
- MongoDB Atlas connection string
- Git

---

### 1️⃣ Clone the Repository
```bash
git clone <REPOSITORY_URL>
cd Intervue-Resilient-Polling-System
```

---

### 2️⃣ Backend Setup

```bash
cd backend
npm install
```

Create `.env` file:
```env
PORT=4000
MONGO_URL=<your_mongodb_connection_string>
CLIENT_URL=http://localhost:5173
```

Run backend:
```bash
npm run dev
```

Backend runs at:
```
http://localhost:4000
```

---

### 3️⃣ Frontend Setup

```bash
cd frontend
npm install
```

Create `.env` file:
```env
VITE_API_URL=http://localhost:4000
VITE_SOCKET_URL=http://localhost:4000
```

Run frontend:
```bash
npm run dev
```

Frontend runs at:
```
http://localhost:5173
```

---

## 🌐 Running in Production

### Frontend (Netlify)
- Build command: `npm run build`
- Publish directory: `dist`
- Environment variables:
```
VITE_API_URL=https://intervue-resilient-polling-system.onrender.com
VITE_SOCKET_URL=https://intervue-resilient-polling-system.onrender.com
```

### Backend (Render)
- Build command: `npm install && npm run build`
- Start command: `npm start`
- Environment variables:
```
MONGO_URL=<MongoDB Atlas URL>
CLIENT_URL=https://intervue-resilient-polling-system.netlify.app
```

---

## ✅ Assignment Requirement Mapping

| Requirement | Status |
|-----------|--------|
| Real-time polling | ✅ |
| State recovery | ✅ |
| Late join timer sync | ✅ |
| DB persistence | ✅ |
| Separation of concerns | ✅ |
| Poll history | ✅ |
| Bonus features | ✅ |

---

## 📌 Future Improvements

- Authentication (JWT / OAuth)
- Redis for socket state caching
- Horizontal scaling with Redis adapter
- Role-based access control
- Analytics dashboard

---

## 👤 Author

**Yash Bhalerao**  
SDE Intern Candidate – Intervue.io  

---

## 📜 License

This project was built as part of a hiring assignment and is intended for evaluation purposes.
