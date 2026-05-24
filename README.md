# 🎯 HireTrack — Job Application Tracker

A modern, full-stack MERN application designed to track placement and internship applications. Built for students navigating campus placement seasons, HireTrack features a premium warm-dark dashboard, interactive status analytics, and real-time application tracking.

### 🌐 Live Demo → [hiretrack-70sl.onrender.com](https://hiretrack-70sl.onrender.com)

---

## 🚀 Key Features

- **Premium UI/UX Design** — Elegant warm-dark aesthetic (`#0e0d0b`), clean typography using the *Figtree* font, and developer-centric *Space Mono* elements.
- **Daily Motivational Quotes** — Built-in thought-of-the-day carousel showcasing programming wisdom and career advice to keep students motivated.
- **Dashboard Analytics** — High-fidelity interactive statistics with glow effects, custom-styled linear gradient bar charts (built with Recharts), and real-time distribution summaries.
- **Micro-Animations & Interactions** — Hover states, card transitions, and status-colored border lighting to elevate the user experience.
- **Application Status Pipeline** — Complete lifecycle tracking from `Applied` ➔ `OA (Online Assessment)` ➔ `Interview` ➔ `Offer` or `Rejected`.
- **JWT-Based Authentication** — Secure login and registration with token persistence (stored in LocalStorage) to eliminate visual flicker and maintain state across refreshes.
- **Full CRUD Management** — Search, filter, edit, and delete job applications with robust validation and real-time dashboard sync.

---

## 🛠 Tech Stack

| Layer | Technologies Used |
| :--- | :--- |
| **Frontend** | React 18, React Router v6, Recharts, Lucide Icons, GSAP |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB with Mongoose ODM |
| **Auth** | JSON Web Tokens (JWT) + bcryptjs |
| **Dev Tools** | Vite, Nodemon |

---

## 📁 Project Structure

```
hiretrack/
├── client/                 # React frontend (Vite)
│   └── src/
│       ├── components/     # UI components (Navbar, etc.)
│       ├── context/        # Auth context (global state manager)
│       └── pages/          # Login, Register, Dashboard, Jobs
└── server/                 # Express backend
    ├── models/             # Mongoose schemas (User, Job)
    ├── routes/             # REST API routes (handles route-ordering checks)
    └── middleware/         # JWT auth middleware
```

---

## ⚙️ Setup & Run Locally

### Prerequisites
- Node.js v18+
- MongoDB (local or [MongoDB Atlas](https://www.mongodb.com/atlas))

### 1. Clone the repository
```bash
git clone https://github.com/BE77ION/HireTrack.git
cd hiretrack
```

### 2. Setup Backend
1. Navigate to the server folder:
   ```bash
   cd server
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file from the example:
   ```bash
   cp .env.example .env
   ```
   Add your MongoDB connection string and JWT secret:
   ```env
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_secret_key
   PORT=5000
   ```
4. Start the backend server in development mode:
   ```bash
   npm run dev                 # Runs on http://localhost:5000
   ```

### 3. Setup Frontend
1. Navigate to the client folder:
   ```bash
   cd ../client
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Vite dev server:
   ```bash
   npm run dev                 # Runs on http://localhost:5173
   ```

### 4. Open in Browser
Visit `http://localhost:5173` to experience HireTrack!

---

## 🔌 API Endpoints

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| **POST** | `/api/auth/register` | Register a new user account |
| **POST** | `/api/auth/login` | Log in and retrieve JWT token |
| **GET** | `/api/jobs` | Retrieve all job applications for the logged-in user |
| **POST** | `/api/jobs` | Create a new job application |
| **PUT** | `/api/jobs/:id` | Update an existing job application |
| **DELETE** | `/api/jobs/:id` | Remove a job application |
| **GET** | `/api/jobs/stats` | Retrieve aggregated status stats for the dashboard |

---

## 📸 Screenshots

> *Dashboard analytics showing application status counts, glowing linear gradient charts, recent jobs preview list, and the add/edit modal form.*

### 🔗 Try it live at [https://hiretrack-70sl.onrender.com](https://hiretrack-70sl.onrender.com)

> **Note:** Hosted on Render's free tier — the first load may take ~30 seconds if the service has been idle.

---

## 🌱 Future Enhancements

- [ ] Automated email reminders for upcoming interviews and OA deadlines.
- [ ] Direct export of placement analytics to CSV/Excel reports.
- [ ] Rich-text editor support for logging comprehensive interview notes.
- [ ] Toggleable warm-coffee light mode to accompany the premium dark mode.
- [ ] Native integration of placement preparation resources and checklists.

---

## 👤 Author

**Pawandeep** — B.Tech 2026 | [GitHub](https://github.com/BE77ION) | [LinkedIn](https://linkedin.com/in/Pawan2003)

---

## 📄 License

This project is licensed under the MIT License. See [LICENSE](LICENSE) for details.
