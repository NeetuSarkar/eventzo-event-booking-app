# Event Booking Application 🎟️

A full-stack event booking platform built using the MERN stack where users can discover events, book tickets online, and receive personalized event suggestions, while admins manage events through a secure dashboard.

---

## 🚀 Live Demo

- **Frontend:** https://eventzo-event-booking-app.vercel.app/
- **Backend API:** https://eventzo-event-booking-app.onrender.com

> **Demo Credentials**  
> User: neetu@gmail.com / Neetu@202  
> Admin: admin@test.com / password  

---

## 🧩 Features

### User Features
- JWT-based authentication and authorization
- Browse and view detailed event listings
- Book events using Razorpay (test mode)
- Receive email confirmation after successful booking
- View booking history and past activity

### Personalization & Tracking
- Tracks user activity such as viewed events
- Stores user interests to highlight featured events
- Rule-based personalization (non-AI)

### Admin Features
- Role-based admin access
- Create, update, and delete events
- View booking statistics and user engagement data

---

## 🛠️ Tech Stack

### Frontend
- React.js (Vite)
- JavaScript (ES6+)
- Tailwind CSS
- Axios

### Backend
- Node.js
- Express.js
- JWT Authentication
- REST APIs
- CORS configuration for secure cross-origin access

### Database
- MongoDB (MongoDB Atlas)

### Integrations
- Razorpay (Test Mode)
- Email Service (SMTP / Nodemailer)

### Deployment
- Frontend: Vercel
- Backend: Render

---

## 📂 Project Structure

eventzo-event-booking-app/
├── frontend/ # React (Vite) frontend
│ ├── src/
│ │ ├── api/ # Axios instance & API calls
│ │ ├── components/ # Reusable UI components
│ │ ├── pages/ # Application pages
│ │ ├── context/ # Auth & global state
│ │ └── main.jsx
│ ├── index.html
│ └── vite.config.js
│
├── backend/ # Express backend
│ ├── routes/ # API route definitions
│ ├── controllers/ # Business logic
│ ├── models/ # MongoDB schemas
│ ├── middleware/ # Auth & role middleware
│ ├── config/ # DB & service configs
│ └── server.js
│
├── README.md
└── package.json
