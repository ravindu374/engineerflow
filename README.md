# EngineerFlow

EngineerFlow is a modern full-stack project and task management platform designed with a scalable backend and a clean, responsive frontend.

It supports authentication, project tracking, task workflows, and activity monitoring with a production-ready architecture.

---

## 🚀 Tech Stack

### Backend

* FastAPI (asynchronous REST API)
* PostgreSQL (Neon) for core data
* MongoDB (Atlas) for activity logging
* SQLAlchemy (async ORM)

### Frontend

* Next.js (App Router)
* TypeScript
* Tailwind CSS

### Deployment

* Backend: Railway
* Frontend: Vercel

---

## ✨ Features

### 🔐 Authentication

* JWT-based login system
* Secure password hashing
* Token-based protected routes

### 📁 Project Management

* Create and manage projects
* View all user projects
* Dashboard-based navigation

### ✅ Task Management

* Create tasks within projects
* Update task status (TODO, IN_PROGRESS, DONE)
* Real-time UI updates

### 📊 Activity Logging

* MongoDB-based activity tracking
* Logs actions like project creation
* Timestamped records (UTC-based)

### 🎨 Modern UI

* Clean and responsive interface
* Login and registration pages
* Dashboard with project listing
* Task view with status controls

---

## 🌐 Live Demo

* Frontend: https://engineer-flow.vercel.app
* Backend API: https://engineerflow-production.up.railway.app/docs

---

## ⚙️ Environment Variables

### Backend (.env)

```env
DATABASE_URL=your_postgresql_url
MONGO_URL=your_mongodb_url
JWT_SECRET=your_secret_key
JWT_ALGORITHM=HS256
```

---

### Frontend (Vercel)

```env
NEXT_PUBLIC_API_URL=https://engineerflow-production.up.railway.app
```

---

## 🧪 Run Locally

### Backend

```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload
```

---

### Frontend

```bash
cd engineerflow-frontend
npm install
npm run dev
```

---

## 🧱 Project Structure

```
engineerflow/
├── backend/
│   ├── app/
│   ├── models/
│   ├── services/
│   ├── repositories/
│   └── api/
│
├── engineerflow-frontend/
│   ├── app/
│   ├── lib/
```

---

## 🧠 Architecture Overview

* FastAPI handles API requests and business logic
* PostgreSQL stores structured data (users, projects, tasks)
* MongoDB stores activity logs
* Next.js frontend communicates via REST API
* Deployed using Railway and Vercel

---

## 📌 Future Improvements

* Drag and drop task board (Kanban style)
* Role-based access control (Admin/User)
* Email notifications
* Analytics dashboard

---

## 👨‍💻 Author

Ravindu Lakshan
Electronic & Telecommunication Engineering Undergraduate

---
