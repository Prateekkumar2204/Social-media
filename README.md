<div align="center">

# 🎓 Campusly

### An AI-powered, college-exclusive communication platform that centralizes campus interaction through verified institutional access.

<img src="https://readme-typing-svg.demolab.com?font=Fira+Code&weight=600&size=22&duration=3000&pause=1000&color=00C4CC&center=true&vCenter=true&width=600&lines=OTP-Verified+College+Community;Real-Time+Chat+%26+Video+Calling;AI-Powered+Content+Moderation;Announcements+%2B+Posts+%2B+Groups" alt="Typing SVG" />

<p>
  <img src="https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black" />
  <img src="https://img.shields.io/badge/Node.js-Express-339933?style=for-the-badge&logo=node.js&logoColor=white" />
  <img src="https://img.shields.io/badge/MongoDB-Mongoose-47A248?style=for-the-badge&logo=mongodb&logoColor=white" />
  <img src="https://img.shields.io/badge/Socket.io-Real--Time-010101?style=for-the-badge&logo=socket.io&logoColor=white" />
</p>

<p>
  <img src="https://img.shields.io/github/last-commit/Prateekkumar2204/Social-media?style=flat-square" />
  <img src="https://img.shields.io/github/languages/top/Prateekkumar2204/Social-media?style=flat-square" />
  <img src="https://img.shields.io/github/stars/Prateekkumar2204/Social-media?style=flat-square" />
  <img src="https://img.shields.io/github/license/Prateekkumar2204/Social-media?style=flat-square" />
</p>

</div>

---

## 📌 Overview

**VibeLink** is an AI-powered, college-exclusive communication platform built for **MNNIT students**, designed to centralize campus interaction through **verified institutional access**.

Instead of scattering communication across WhatsApp groups, emails, and unrelated apps, VibeLink brings **chat, announcements, posts, video calling, and community interaction** into a single, secure, college-only platform — verified using college email IDs, with AI keeping the space safe and spam-free.

---

## 🧠 Problem It Solves

In most colleges, communication is scattered across WhatsApp groups, notices, emails, and different platforms — leading to:

- Missed announcements
- Too many unrelated/unverified groups
- No way to confirm members actually belong to the college
- Toxic or spam content going unmoderated
- No central place for posts, clubs, events, and real-time interaction

**VibeLink solves this with one verified, AI-moderated platform built specifically for the college ecosystem.**

---

## 🚀 Features

- 🔐 **OTP-Based Authentication** — Signup/login verified via **college email IDs only**, ensuring a trusted, student-only community
- 👤 **Student Profiles** — Each user has a profile linked to their verified college identity
- 📢 **Announcements & Posts** — Share updates, notices, and posts within the campus community
- 💬 **Real-Time Messaging** — 1:1 and group chat powered by **Socket.IO**
- 📞 **Video Calling** — Integrated real-time video calling via **ZegoCloud**
- 🤖 **AI-Powered Content Moderation** — LLM-based moderation (**Groq API / Llama 3.3**) automatically detects and hides toxic or inappropriate content
- 👥 **Friend Requests & Social Interactions** — Connect with peers across the campus
- 🔔 **Real-Time Notifications** — Stay updated instantly on activity that matters
- 📱 **Responsive UI** — Works smoothly across desktop and mobile

---

## 🛠️ Tech Stack

<div align="center">

### Frontend
<img src="https://skillicons.dev/icons?i=react,vite,javascript" alt="frontend stack" />

`React.js` • `Vite` • `React Bootstrap` • `Sass` • `React Router DOM` • `Axios` • `Socket.IO Client`

### Backend
<img src="https://skillicons.dev/icons?i=nodejs,express,mongodb" alt="backend stack" />

`Node.js` • `Express.js` • `MongoDB + Mongoose` • `Socket.IO` • `JWT Authentication` • `bcrypt.js` • `Nodemailer (OTP emails)` • `Multer + Cloudinary`

### AI / Real-Time Communication
![Groq](https://img.shields.io/badge/Groq_API-Llama_3.3-F55036?style=for-the-badge)
![Gemini](https://img.shields.io/badge/Google_Generative_AI-8E75B2?style=for-the-badge&logo=google-gemini&logoColor=white)
![ZegoCloud](https://img.shields.io/badge/ZegoCloud-Video_Calling-2F80ED?style=for-the-badge)

</div>

---

## 🏗️ System Design (High Level)

The application follows a modern full-stack architecture:

- **Frontend** handles UI, routing, state, and real-time client-side interactions
- **Backend** manages REST APIs, authentication, database operations, and business logic
- **MongoDB** stores user data, chats, posts, announcements, and friend/social graphs
- **Socket.IO** powers real-time messaging and live notifications
- **ZegoCloud** enables real-time, scalable video calling between users
- **Groq API (Llama 3.3)** performs real-time AI content moderation on posts and messages
- **Nodemailer** handles OTP delivery for college-email verification during signup

---

## ✨ Key Modules

### 1. Authentication Module
OTP-based signup/login restricted to verified college email IDs, backed by JWT-based session authentication.

### 2. User & Profile Module
Each student has a profile tied to their verified college identity.

### 3. Chat Module
Real-time 1:1 and group messaging powered by Socket.IO.

### 4. Video Call Module
Integrated video calling via ZegoCloud for seamless, browser-based calls.

### 5. Content Moderation Module
LLM-powered moderation (Groq / Llama 3.3) automatically scans posts and messages, detecting and hiding toxic content to keep the community safe.

### 6. Announcements & Posts Module
Students can share posts and important updates visible to the verified campus community.

### 7. Social Module
Friend requests, connections, and social interactions between verified students.

---

## 📂 Project Structure

```
Social-media/
├── backend/           # Node.js + Express API
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middlewares/
│   └── index.js
│
├── frontend/          # React + Vite client
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   └── ...
│   └── package.json
│
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- MongoDB (local or Atlas)
- Cloudinary account (media uploads)
- Groq API key (AI content moderation)
- ZegoCloud App ID & Server Secret (video calling)
- SMTP credentials (for OTP emails via Nodemailer)

### 1. Clone the repository
```bash
git clone https://github.com/Prateekkumar2204/Social-media.git
cd Social-media
```

### 2. Setup the backend
```bash
cd backend
npm install
```

Create a `.env` file inside `backend/`:
```env
PORT=8080
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_key
CLOUDINARY_API_SECRET=your_cloudinary_secret
GROQ_API_KEY=your_groq_api_key
GEMINI_API_KEY=your_gemini_api_key
SMTP_EMAIL=your_email
SMTP_PASSWORD=your_email_app_password
```

Run the backend:
```bash
npm run dev
```

### 3. Setup the frontend
```bash
cd ../frontend
npm install
```

Create a `.env` file inside `frontend/` with your ZegoCloud credentials:
```env
VITE_ZEGO_APP_ID=your_zego_app_id
VITE_ZEGO_SERVER_SECRET=your_zego_server_secret
```

Run the frontend:
```bash
npm run dev
```

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

1. Fork the repo
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is currently unlicensed. Feel free to open an issue if you'd like a license added.

---

<div align="center">

Built with ❤️ for the MNNIT campus community

</div>
