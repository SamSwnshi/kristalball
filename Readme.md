# 🧿 samswnshi-kristalball

A full-stack web application that provides an equipment management and tracking system — including assignments, balances, purchases, and transfers — with authentication and dashboard insights. Built using **Node.js (Express)** for the backend and **React (Vite)** for the frontend.

---

## 📑 Table of Contents

1. [Project Overview](#project-overview)  
2. [Tech Stack](#tech-stack)  
3. [Project Structure](#project-structure)  
4. [Installation](#installation)  
5. [Backend Configuration](#backend-configuration)  
6. [Frontend Configuration](#frontend-configuration)  
7. [Usage](#usage)  
8. [Features](#features)  
9. [API Overview](#api-overview)  
10. [Contributing](#contributing)  
11. [License](#license)

---

## 🧠 Project Overview

**samswnshi-kristalball** is a management platform designed to handle assignments, purchases, transfers, balances, and related data within an organization.  

It offers:
- Secure authentication and authorization  
- Dashboard analytics  
- CRUD operations for equipment and associated entities  
- A modern, responsive frontend built with React  

---

## ⚙️ Tech Stack

**Frontend:**
- React (Vite)
- Redux Toolkit (State Management)
- Axios (API Calls)
- CSS Modules / Tailwind (if used)

**Backend:**
- Node.js + Express
- MongoDB (via Mongoose)
- JWT Authentication
- Middleware-based API security

**Deployment:**
- Vercel (Frontend)
- Render  (Backend)

---

## 🗂️ Project Structure

```
samswnshi-kristalball/
├── backend/                  # Express backend
│   ├── controllers/          # API logic and business rules
│   ├── db/                   # Database configuration
│   ├── lib/                  # Utility libraries
│   ├── middleware/           # Authentication and other middlewares
│   ├── models/               # Mongoose schemas
│   ├── routes/               # Express route handlers
│   ├── src/                  # Server entry point
│   ├── index.js              # Main backend entry
│   └── package.json          # Backend dependencies
│
└── frontend/                 # React frontend
    ├── src/
    │   ├── components/       # UI components
    │   ├── contexts/         # Context providers (e.g., Auth)
    │   ├── store/            # Redux store and slices
    │   ├── service/          # API service helpers
    │   ├── App.jsx           # Root app
    │   └── main.jsx          # Entry point
    ├── vite.config.js        # Vite configuration
    ├── package.json          # Frontend dependencies
    └── vercel.json           # Deployment config
```

---

## 🛠️ Installation

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/samswnshi-kristalball.git
cd samswnshi-kristalball
```

### 2. Install dependencies

#### Backend
```bash
cd backend
npm install
```

#### Frontend
```bash
cd ../frontend
npm install
```

---

## ⚙️ Backend Configuration

1. Create a `.env` file inside the `backend/` directory.

```env
PORT=5000
MONGO_URI=mongodb+srv://your_connection_string
JWT_SECRET=your_secret_key
```

2. Run the backend server:
```bash
npm start
```
or (if using nodemon)
```bash
npm run dev
```

---

## 💻 Frontend Configuration

1. Configure API endpoint in `frontend/src/service/api.js`:
```js
export const API_BASE_URL = "http://localhost:5000/api";
```

2. Start the React app:
```bash
npm run dev
```

3. The app will be available at:  
👉 `http://localhost:5173`

---

## 🚀 Usage

1. Register or log in as a user.  
2. Access the dashboard to view summary analytics.  
3. Manage:
   - Assignments  
   - Equipment  
   - Purchases  
   - Transfers  
   - Balances  
4. View logs and statistics through the dashboard.

---

## ✨ Features

- 🔐 **User Authentication** (JWT-based)
- 📊 **Dashboard Insights**
- 💼 **Equipment & Assignment Management**
- 💰 **Balance & Expenditure Tracking**
- 🔄 **Transfer Records**
- 📦 **Purchase Tracking**
- 🧩 **Role-based Access Control**

---

## 📡 API Overview

Each route is modularized under `/routes` in the backend.

| Endpoint | Method | Description |
|-----------|---------|-------------|
| `/api/auth/register` | POST | Register new users |
| `/api/auth/login` | POST | Authenticate user |
| `/api/dashboard` | GET | Fetch dashboard metrics |
| `/api/assignments` | CRUD | Manage assignments |
| `/api/purchase` | CRUD | Manage purchases |
| `/api/transfer` | CRUD | Manage transfers |
| `/api/balance` | GET | Retrieve balance details |

---

## 🧑‍💻 Contributing

Contributions are welcome!  
1. Fork the repo  
2. Create your feature branch (`git checkout -b feature/your-feature`)  
3. Commit your changes (`git commit -m 'Add feature'`)  
4. Push to the branch (`git push origin feature/your-feature`)  
5. Create a Pull Request  

---

## 📜 License

This project is licensed under the **MIT License**.  
See the [LICENSE](LICENSE) file for details.
