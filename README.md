# 🎯 HireTrack — Job Application Tracker

A full-stack MERN application to track placement and internship applications. Built for students navigating campus placements, with a clean dashboard, status tracking, and application analytics.

---

## 🚀 Features

- **Auth** — Register/Login with JWT-based authentication
- **Add Applications** — Company, role, status, date, location, salary, job link, notes
- **Status Tracking** — Applied → OA → Interview → Offer / Rejected
- **Dashboard Analytics** — Pie chart and bar chart breakdown of all applications
- **Filter & Search** — Filter by status, search by company or role
- **Edit & Delete** — Full CRUD on every application

---

## 🛠 Tech Stack

| Layer | Tech |
|---|---|
| Frontend | React 18, React Router v6, Recharts, Lucide Icons |
| Backend | Node.js, Express.js |
| Database | MongoDB with Mongoose ODM |
| Auth | JWT (JSON Web Tokens) + bcryptjs |
| Dev Tools | Vite, Nodemon |

---

## 📁 Project Structure

```
hiretrack/
├── client/                 # React frontend (Vite)
│   └── src/
│       ├── components/     # Navbar
│       ├── context/        # Auth context (global state)
│       └── pages/          # Login, Register, Dashboard, Jobs
└── server/                 # Express backend
    ├── models/             # Mongoose schemas (User, Job)
    ├── routes/             # REST API routes
    └── middleware/         # JWT auth middleware
```

---

## ⚙️ Setup & Run Locally

### Prerequisites
- Node.js v18+
- MongoDB (local or [MongoDB Atlas](https://www.mongodb.com/atlas))

### 1. Clone the repo
```bash
git clone https://github.com/YOUR_USERNAME/hiretrack.git
cd hiretrack
```

### 2. Setup Backend
```bash
cd server
npm install
cp .env.example .env        # add your MongoDB URI
npm run dev                 # runs on http://localhost:5000
```

### 3. Setup Frontend
```bash
cd client
npm install
npm run dev                 # runs on http://localhost:5173
```

### 4. Open in browser
```
http://localhost:5173
```

---

## 🔌 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| POST | /api/auth/register | Register new user |
| POST | /api/auth/login | Login & get token |
| GET | /api/jobs | Get all jobs (auth) |
| POST | /api/jobs | Add a new job (auth) |
| PUT | /api/jobs/:id | Update a job (auth) |
| DELETE | /api/jobs/:id | Delete a job (auth) |
| GET | /api/jobs/stats | Get dashboard stats (auth) |

---

## 📸 Screenshots

> Dashboard with analytics charts, Jobs table with filter/search, Add/Edit modal

---

## 🌱 Future Improvements

- Email reminders for follow-ups
- Export to CSV/Excel
- Interview notes with rich text editor
- Dark/Light theme toggle
- Mobile responsive design

---

## 👤 Author

**Pawandeep** — B.Tech 2026 | [GitHub](https://github.com/YOUR_USERNAME) | [LinkedIn](https://linkedin.com/in/YOUR_PROFILE)

---

## 📄 License

MIT
