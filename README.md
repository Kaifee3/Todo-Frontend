🚀 Task Manager Frontend
This is the frontend of the MERN stack Task Manager application built using React. It provides a modern, responsive user interface for users to register, log in, manage tasks, and for admins to manage users and view task history.

📁 Project Structure
  task-manager-frontend/
│
├── public/                  # Static files
├── src/
│   ├── components/          # Reusable components (TaskForm, Navbar, etc.)
│   ├── pages/               # Page components (Login, Register, Home, Profile, AdminPanel, etc.)
│   ├── css/                 # Custom CSS files
│   ├── App.js               # Main App component
│   ├── index.js             # Entry point
│   └── utils/               # Helper functions (e.g., API utils)
├── .env                     # Environment variables
├── package.json
└── README.md

🔧 Tech Stack
React (with Hooks and Router)
Axios for API requests
CSS (Custom, Responsive Design)
React Router DOM
Toastify or similar for notifications

🧩 Features
👤 User
User Registration & Login (JWT Auth)
View, Add, Edit, Delete Tasks
Confirm Tasks (moved to history)
View Task History
Edit Profile

🛠️ Admin
View All Users & Tasks
Edit/Delete Users
Edit/Delete Tasks
Switch views between Users and Tasks in Admin Panel

📦 Installation
   # Clone the repository
git clone https://github.com/your-username/task-manager-frontend.git
cd task-manager-frontend

# Install dependencies
npm install

# Create a .env file
touch .env

.env File Example:
    REACT_APP_API_URL=http://localhost:5000/api
🚀 Run the App
    npm start

📌 Folder Highlights
Folder/File	Purpose
pages/	Contains main screen pages like Login, Home, etc.
components/	Reusable components (forms, navbar)
css/	Custom CSS for each page
App.js	Routing setup

