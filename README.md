# TaskFlow — Task Management Platform

A full-stack web application that helps individuals and teams manage their daily tasks, track progress, and collaborate efficiently — all from any device without needing a separate app.

---

## 🚀 Live Demo

> Coming soon / [Add your link here]

---

## 📸 Preview

> Add a screenshot of the dashboard here

---

## ✨ Features

- 🔐 **Authentication** — Register, login, and activate your account via email
- ⏰ **Auto Cleanup** — Unverified accounts are automatically deleted after 24 hours
- ✅ **Task Management** — Create, update, and delete tasks with full control
- 👥 **Task Assignment** — Assign tasks to team members by email
- 🔒 **Permissions** — Only the task creator can edit or delete their tasks
- 📊 **Dashboard Stats** — Live overview of tasks by status
- 🔎 **Filter & Pagination** — Filter by status (To Do / Doing / Done) with pagination
- 🌙 **Dark / Light Mode** — Smooth theme toggle
- 📱 **Responsive Design** — Works on all screen sizes

---

## 🛠️ Tech Stack

### Backend
| Technology | Purpose |
|---|---|
| Node.js + Express.js | Server & REST API |
| MongoDB + Mongoose | Database |
| JWT | Authentication |
| Nodemailer | Email activation & password reset |
| node-cron | Auto-delete unverified accounts |
| bcryptjs | Password hashing |

### Frontend
| Technology | Purpose |
|---|---|
| HTML5 + CSS3 | Structure & styling |
| Bootstrap 5 | UI components & responsive grid |
| Vanilla JavaScript | Client-side logic |

---

## 📁 Project Structure

```
taskflow/
├── DB/
│   ├── connection.js
│   └── models/
│       ├── user.model.js
│       └── token.model.js
├── src/
│   ├── modules/
│   │   ├── user/
│   │   │   ├── user.router.js
│   │   │   └── user.controller.js
│   │   └── task/
│   │       ├── task.router.js
│   │       └── task.controller.js
│   ├── middleware/
│   │   └── auth.middleware.js
│   ├── utils/
│   │   ├── sendEmails.js
│   │   └── cleanup.cron.js
│   └── views/
│       └── activation-success.html
├── frontend/
│   ├── index.html
│   ├── api.service.js
│   ├── helpers.js
│   ├── user.controller.js
│   ├── task.controller.js
│   └── app.js
├── .env.example
├── .gitignore
├── package.json
└── index.js
```

---

## ⚙️ Getting Started

### 1. Clone the repo
```bash
git clone https://github.com/HassanABahaa/taskflow.git
cd taskflow
```

### 2. Install dependencies
```bash
npm install
```

### 3. Set up environment variables
```bash
cp .env.example .env
```

Fill in your `.env`:
```env
PORT=3000
MONGO_URI=your_mongodb_connection_string
SECRET_KEY=your_jwt_secret
SALT_ROUND=10
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_app_password
```

### 4. Run the app
```bash
# Development
npm run dev

# Production
npm start
```

---

## 🔑 API Endpoints

### Auth
| Method | Endpoint | Description |
|---|---|---|
| POST | `/user/signup` | Register new user |
| POST | `/user/login` | Login |
| POST | `/user/logout` | Logout |
| GET | `/user/activate/:token` | Activate account |
| PATCH | `/user/forgetcode` | Send reset code |
| PATCH | `/user/resetpassword` | Reset password |
| PATCH | `/user/changePassword` | Change password |
| PATCH | `/user/update` | Update profile |
| DELETE | `/user/delete` | Delete account |

### Tasks
| Method | Endpoint | Description |
|---|---|---|
| POST | `/task/addtask` | Create task |
| PATCH | `/task/update` | Update task |
| DELETE | `/task/delete` | Delete task |
| GET | `/task/tasks` | Get all tasks (paginated) |
| GET | `/task/tasksoneuser` | Get my tasks |
| GET | `/task/tasksnotnone` | Get overdue tasks |

---

## 🌍 Environment Variables

| Variable | Description |
|---|---|
| `PORT` | Server port |
| `MONGO_URI` | MongoDB connection string |
| `SECRET_KEY` | JWT secret key |
| `SALT_ROUND` | bcrypt salt rounds |
| `EMAIL_USER` | Email address for Nodemailer |
| `EMAIL_PASS` | Email app password |

---

## 🤝 Author

**Hassan Ahmed Bahaa**
- LinkedIn: [hassan-bahaa](https://www.linkedin.com/in/hassan-bahaa-1604981b8)
- GitHub: [@HassanABahaa](https://github.com/HassanABahaa)

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
