

# Employee Task Management System

> A modern, full-stack web application for managing employees, tasks, and internal communication. Built with **Node.js/Express** (backend) and **React + Vite** (frontend).

---

## Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [Project Structure](#project-structure)
- [Setup & Installation](#setup--installation)
- [Configuration](#configuration)
- [Usage Guide](#usage-guide)
- [Features & Screenshots](#features--screenshots)
- [API Reference](#api-reference)
- [Troubleshooting & FAQ](#troubleshooting--faq)
- [Contributing](#contributing)
- [Contact](#contact)
- [License](#license)

---

## Overview

Employee Task Management System is a robust platform for companies to manage employees, assign and track tasks, communicate internally, and automate notifications. The system supports role-based access (Owner, Employee), real-time chat, and modern UI/UX.

---

## Architecture


- **Frontend:** React (Vite), communicates with backend via REST API.
- **Backend:** Node.js, Express, Firebase Firestore, JWT authentication.
- **Realtime:** WebSocket/Socket.io for chat and notifications.
- **Deployment:** Can be deployed on any Node.js-compatible server.

---

## Project Structure

```text
backend/
  src/
    configs/         # Configuration files (email, firebase, jwt, vonage)
    middleware/      # Auth and other middleware
    module/          # Feature modules (auth, employee, owner, task, sms, messages, email)
    templates/       # Email templates
    server.js        # Main server entry point
frontend/
  src/
    API/             # API call logic
    components/      # Reusable UI components
    hooks/           # Custom React hooks
    pages/           # Main pages (Dashboard, Profile, Login, etc.)
    styles/          # CSS files
    main.jsx         # App entry point
  public/            # Static assets
  index.html         # Main HTML file
image/               # Screenshots for documentation
```

---

## Setup & Installation

### 1. Clone the repository

```sh
git clone https://github.com/0Tung123/employee-task-management.git
cd employee-task-management
```

### 2. Install dependencies

#### Backend

```sh
cd backend
npm install
```

#### Frontend

```sh
cd ../frontend
npm install
```

### 3. Configuration

#### Backend Environment Variables

Create a `.env` file in `backend/` (or fill in `backend/src/configs/`). Example:

```env
FIREBASE_API_KEY=your_firebase_key
FIREBASE_PROJECT_ID=your_project_id
JWT_SECRET=your_jwt_secret
EMAIL_USER=your_email@example.com
EMAIL_PASS=your_email_password
VONAGE_API_KEY=your_vonage_key
VONAGE_API_SECRET=your_vonage_secret
```

#### Frontend Environment Variables

Create a `.env` file in `frontend/`:

```env
VITE_API_BASE=http://localhost:5000
```

### 4. Start the servers

#### Backend

```sh
cd backend
npm run dev
```

#### Frontend

```sh
cd ../frontend
npm run dev
```

> The frontend runs at `http://localhost:5173` (default Vite port).
> The backend runs at `http://localhost:5000` (default).

---

## Usage Guide

### 1. Login & Authentication
- Employees login via email OTP; Owners via phone OTP.
- After login, JWT token is stored in localStorage for API authentication.

### 2. Dashboard
- Role-based dashboard: Owners see employee management, Employees see tasks.

### 3. Employee Management (Owner)
- Add, edit, delete, and view employees.
- Search, filter, and manage employee status.

### 4. Task Management
- Owners assign tasks to employees.
- Employees view, update, and complete tasks.

### 5. Messaging/Chat
- Real-time chat between employees and owners.
- Group and direct messages supported.

### 6. Profile
- Employees can view and update their profile (except email).

### 7. Notifications
- Real-time notifications for new tasks, messages, and system events.

---

## Features & Screenshots

All screenshots are stored in the `image/` folder. Please update these images as your UI evolves.

### Login & Authentication
![Login](image/login.png)
*Secure login for both employees and owners.*

### Dashboard (Role-based)
![Dashboard](image/dashboard.png)
*Personalized dashboard for each user role.*

### Employee Management (Owner)
![Employee Management](image/employee-management.png)
*Owners can view, add, edit, and remove employees.*

### Task Management
![Task Management](image/task-management.png)
*Assign, track, and update tasks for employees.*

### Messaging/Chat
![Chat](image/chat.png)
*Real-time chat for internal communication.*

### Profile Page
![Profile](image/profile.png)
*Employees can view and update their personal information.*

### Notifications
![Notification](image/notification.png)
*Instant notifications for important events.*

---

## API Reference

> All API endpoints are prefixed with `/api/`

### Authentication
- `POST /api/auth/LoginEmail` — Send OTP to employee email
- `POST /api/auth/ValidateAccessCode` — Validate OTP and login
- `POST /api/auth/CreateNewAccessCode` — Send OTP to owner phone

### Employee
- `GET /api/employee/profile` — Get employee profile (auth required)
- `POST /api/employee/profile` — Update employee profile
- `POST /api/employee/GetMySchedules` — Get employee schedules

### Owner
- `GET /api/owner/employees` — List all employees
- `POST /api/owner/employee` — Create new employee
- `PUT /api/owner/employee/:id` — Update employee
- `DELETE /api/owner/employee/:id` — Delete employee

### Tasks
- `GET /api/task/` — List tasks
- `POST /api/task/` — Create task
- ...

### Messaging
- `GET /api/messages/` — Get messages
- `POST /api/messages/` — Send message

---

## Troubleshooting & FAQ

**Q: The app cannot connect to the backend?**
A: Check the `VITE_API_BASE` environment variable and ensure the backend is running on the correct port.

**Q: Not receiving OTP?**
A: Check your email/Vonage configuration, spam folder, and backend logs.

**Q: Cannot log in?**
A: Make sure the account is created with the correct role and check Firestore data.

**Q: CORS error?**
A: Ensure the backend enables CORS for the frontend domain.

**Q: How to build for production?**
A: Run `npm run build` in the frontend, then deploy the `dist/` folder to a static server.

---

## Contributing

1. Fork this repository
2. Create a new branch (`git checkout -b feature/your-feature`)
3. Commit your changes (`git commit -am 'Add new feature'`)
4. Push to the branch (`git push origin feature/your-feature`)
5. Create a new Pull Request

---

## Contact

- Author: [0Tung123](https://github.com/0Tung123)
- Email: tunglk292003@gmail.com

---

## License

MIT
- For production, build the frontend with `npm run build` and serve the static files.
- Contributions and issues are welcome!

---

## License
MIT
