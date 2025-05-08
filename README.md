# 📝 TaskHub - Task Management System

A feature-rich Task Management System built for small teams to efficiently manage, assign, and track tasks.

## 🚀 Live Demo

[🔗 Deployed App Link](https://task-hubs.netlify.app/)  
[📁 Public GitHub Repository](https://github.com/Ganapathinakkina/task-hub)

----------------------------------------------------------------------------

## 📌 Features

### ✅ User Authentication
- Secure registration and login.
- Passwords hashed using `bcrypt`.
- Token-based session management with `JWT`.

### ✅ Task Management
- Create, Read, Update, Delete (CRUD) tasks.
- Task fields: `title`, `description`, `due date`, `priority`, `status`.

### ✅ Team Collaboration
- Assign tasks to other registered users such as Employees by Managers.
- View tasks assigned by or to the user and filteraions and more.

### ✅ Dashboard
- View:
  - Tasks assigned **to** the user.
  - Tasks **created** by the user.
  - **Overdue** tasks (based on due date).

### ✅ Search and Filter
- Search tasks by title or description.
- Filter tasks by:
  - Status (e.g., pending, in progress, completed)
  - Priority (e.g., low, medium, high)
  - Due Date (e.g., today, this week, overdue)

### ✅ Role-Based Access Control (RBAC)
- Supports Three Roles: `Admin`, `Manager`, `Employee`
- Only Admins/Managers can create and assign tasks.

Role	Capabilities
Admin	Full control: Manage users, assign roles, and oversee all tasks and teams.
        email: admin@example.com
        password: Admin@123
Manager	Assign and update tasks, view team progress, and manage employees.
        email: manager@mail.com
        password: password
Employee	View and update assigned tasks, mark tasks as completed.
        email: employee3@mail.com
        password: password

#Note: Users can register themselves as Managers or Employee, but admin regsitration is not allowed as of per the present system design.

---

## ❌ Features Not Yet Implemented

- [ ] Real-time Notifications with WebSockets
- [ ] Recurring Tasks (daily/weekly/monthly)
- [ ] Offline Support (PWA)
- [ ] Unit and Integration Tests

---

## ⚙️ Tech Stack

| Layer      | Technology            |
|------------|------------------------|
| Frontend   | Next.js, Tailwind CSS  |
| Backend    | Node.js, Express.js    |
| Database   | MongoDB (Mongoose)     |
| Auth       | JWT, Bcrypt            |
| State Mgmt | Redux       |
| Deployment | Netlify (Frontend), Render (Backend) |

---

## 🧠 Project Structure

### Frontend (Next.js)

taskhub-frontend/
├── public/                 # Static assets
├── src/
│   ├── app/
│   │   ├── auth/           # Login/Register pages
│   │   ├── dashboard/      # Dashboard views (My Tasks, Assigned, Overdue)
│   │   ├── lib/            # API fetchers (axios), token utilities
│   │   ├── logs/           # (Optional) User action logs
│   │   ├── redux/          # Redux store and slices
│   │   ├── tasks/          # Task views & pages
│   │   └── users/          # User profile or list views
│   ├── components/
│   │   └── common/         # Reusable components (e.g., Header, Modal)
│   ├── globals.css         # Global styles (Tailwind)
│   ├── layout.js           # Shared layout for all routes
│   └── page.js             # App entry route
├── .gitignore
├── jsconfig.json
├── next.config.mjs         # Next.js configuration
├── package.json
├── package-lock.json
├── postcss.config.mjs
├── README.md
└── LICENSE



### Backend (Express.js)

taskhub-backend/
├── config/         # Database and environment config
├── constants/      # Role-based constants and enums
├── controllers/    # Business logic for tasks, users, auth
├── middlewares/    # Auth, role checks, validation for payloads, and error handling
├── models/         # Mongoose schemas for User, Task
├── routes/         # API routes (auth, users, tasks)
├── utils/          # Utility functions (e.g., date, response formatters)
├── validators/     # Input validation logic (Joi or custom)
├── app.js          # Express app instance with middleware setup
├── server.js       # Entry point - connects DB and starts server
├── .env            # Environment variables
├── .gitignore
├── package.json
└── package-lock.json




---

## 🧪 Setup Instructions

### 🖥️ Local Development

1. **Clone the repository**

git clone https://github.com/your-username/taskhub.git
cd taskhub

2. **Frontend Setup**
cd taskhub-frontend
npm install
npm run dev

3. **Backend Setup**
cd taskhub-backend
npm install
npm run dev


4. **Environment Variables**
Create .env files in backend:

PORT=5000
MONGO_URI=mongodb://localhost:27017/taskhub
JWT_SECRET=your_jwt_secret


**Approach & Design Decisions**

    Modular Design: Both frontend and backend follow modular structures for scalability and clarity.

    Security: Passwords hashed, JWT used for secure auth. Protected routes based on roles.

    Frontend Routing: Next.js pages dynamically rendered. Auth and dashboard routes are protected.

    State Management: Used Redux to manage authentication and task data.

    RBAC: Applied middleware checks based on user roles to restrict sensitive operations.

    Responsiveness: Tailwind CSS used to ensure full responsiveness across devices.


**Assumptions & Trade-offs**

    Only Admins/Managers can create or assign tasks.

    Notifications and tests are pending to prioritize functionality and deployment.

    MongoDB was chosen over PostgreSQL for its flexibility with nested task structures.

**Improvements Planned**

    Add WebSocket-based real-time task notifications.

    Enable task recurrence (daily/weekly/monthly).

    Add test coverage using Jest.

    Implement offline-first support using service workers (PWA).

**AI Usage Disclosure**

AI tools like ChatGPT were used for:

    Drafting boilerplate code.

    Debugging routing/state management issues.

    Generating reusable components and backend route templates.


All code was tested, reviewed, and customized for this project.

**License** 
This project is licensed under the Apache License.