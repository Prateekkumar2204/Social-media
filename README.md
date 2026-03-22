# CampusConnect 🎓

A college-specific all-in-one platform built to simplify student life by bringing communication, collaboration, and campus activities into one place.

## 📌 Overview

CampusConnect is a smart college community platform designed for students, clubs, and faculty.  
It helps users stay connected through chat, announcements, event updates, study resources, and real-time interactions.

Instead of using multiple apps for messaging, notices, clubs, and academic updates, this app provides everything in one unified platform made specifically for a college environment.

---

## 🚀 Features

- 🔐 User Authentication (Login / Signup)
- 👤 Student-specific profiles
- 💬 Real-time chat system
- 📞 Video call room sharing
- 🏫 College-specific communities / groups
- 📢 Announcements and important notices
- 📅 Event and club updates
- 📚 Resource sharing for students
- 🔔 Real-time notifications
- 🧑‍🤝‍🧑 Better communication between students and campus communities
- 📱 Responsive UI for desktop and mobile

---

## 🧠 Problem It Solves

In most colleges, communication is scattered across WhatsApp groups, notices, emails, and different platforms.

This creates problems like:

- Missed announcements
- Too many unrelated groups
- Hard to connect with the right students
- No central place for clubs, events, and updates
- Poor collaboration for academic and non-academic activities

**CampusConnect solves this by creating one dedicated platform for the college ecosystem.**

---

## 🛠️ Tech Stack

### Frontend
- React.js
- Tailwind CSS
- Axios
- React Router DOM

### Backend
- Node.js
- Express.js

### Database
- MongoDB

### Real-Time / Communication
- Socket.IO
- WebSockets

### Other Tools
- JWT Authentication
- Cloudinary (if used for media uploads)
- Vercel / Netlify (Frontend Deployment)
- Render / Railway / VPS (Backend Deployment)

---

## 🏗️ System Design (High Level)

The application follows a modern full-stack architecture:

- **Frontend** handles UI, routing, state, and user interactions
- **Backend** manages APIs, authentication, database operations, and business logic
- **MongoDB** stores user data, chats, announcements, and app content
- **Socket.IO** enables real-time chat and live communication features
- **Video Call Room System** allows users to share room links and join calls instantly

---

## ✨ Key Modules

### 1. Authentication Module
Secure login/signup using JWT-based authentication.

### 2. User & Profile Module
Each student can have a profile linked to their college identity.

### 3. Chat Module
Real-time one-to-one or group communication using Socket.IO.

### 4. Video Call Module
Users can create/share meeting room codes and directly join video calls.

### 5. Announcement Module
Important notices, updates, and college-related information can be shared in one place.

### 6. Community / Club Module
Helps clubs and student groups interact with members more efficiently.

---

## 📷 Screenshots

> Add your screenshots here after uploading images to GitHub or using image links.

```md
## 📷 Screenshots

### Home Page
![Home Page](./screenshots/home.png)

### Chat Interface
![Chat](./screenshots/chat.png)

### Video Call Popup
![Video Call](./screenshots/video-call.png)
