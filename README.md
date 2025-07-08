# 🏥 Smart HealthCare Portal

A full-stack web application to manage healthcare interactions. The platform enables patients to book appointments, consult doctors via video calls, receive AI-powered medical suggestions, chat in real-time, and manage health reports with OCR and AI summarization. Doctors can manage schedules, view patient history, and interact through chat or video.

---

## 🚀 Tech Stack

| Category       | Technologies Used                        |
| -------------- | ---------------------------------------- |
| Frontend       | React.js, Tailwind CSS, React Router DOM |
| Backend        | Node.js, Express.js, Mongoose            |
| Database       | MongoDB                                  |
| Authentication | JWT (JSON Web Tokens), bcryptjs          |
| Chat           | Socket.IO                                |
| File Uploads   | Multer, Cloudinary (or AWS S3)           |
| Video Calls    | WebRTC or Twilio                         |
| AI Chatbot     | OpenAI API                               |
| OCR            | Tesseract.js                             |
| Deployment     | Docker, Nginx, AWS/GCP/DigitalOcean      |

---

## 📁 Project Structure

smart-healthcare-portal/
├── client/ # React frontend
│ └── src/
│ ├── components/
│ ├── pages/
│ ├── services/
│ ├── contexts/
│ ├── hooks/
│ └── App.js
├── server/ # Express backend
│ ├── models/
│ ├── controllers/
│ ├── routes/
│ ├── middleware/
│ ├── utils/
│ └── server.js
├── .env
├── README.md
└── .gitignore

yaml
Copy
Edit

---

## ⚙️ Local Setup Instructions

### 🛠 Prerequisites

- Node.js (v16+)
- npm
- MongoDB (local or cloud via Atlas)
- Git

---

### 🔧 Backend Setup

```bash
cd server
npm install
Create a .env file inside server/ with the following content:

ini
Copy
Edit
PORT=5000
MONGO_URI=mongodb://localhost:27017/smart-health
JWT_SECRET=yourSecretKey
Run the development server:

bash
Copy
Edit
npx nodemon server.js
Test: http://localhost:5000/api/test → should return "API Working ✅"

🎨 Frontend Setup
bash
Copy
Edit
cd client
npm install
Start the frontend:

bash
Copy
Edit
npm start
Visit: http://localhost:3000

✅ Features (MVP)
👨‍⚕️ Patient
Register/Login

Book appointments (online/in-person)

Upload and view reports

Real-time chat with doctors

AI chatbot for basic guidance

Video consultations

🩺 Doctor
Register/Login

Manage availability

View patient history & reports

Chat & video consult

View AI-generated report summaries

🧠 AI & OCR
Chatbot using OpenAI API

OCR extraction with Tesseract.js

AI-based medical report summarization

🧑‍💼 Admin
Manage users and appointments

View analytics and feedback

🐳 Docker Setup (Coming Soon)
Will include:

Dockerfile for backend and frontend

docker-compose.yml for combined services (MongoDB, Node, React)

📦 Deployment Plan (Upcoming Phase)
Host backend on VPS (e.g., DigitalOcean or EC2)

Use Nginx reverse proxy

Enable HTTPS with SSL

Store files in Cloudinary or S3

Use PM2 or Docker for production stability

🧪 To Do (Phase-wise Roadmap)
✅ Phase 1: Setup & Planning

🔜 Phase 2: Authentication (JWT)

🔜 Phase 3: Appointment Booking

🔜 Phase 4: Chat System (Socket.IO)

🔜 Phase 5: AI Chatbot (OpenAI)

🔜 Phase 6: Video Consultations

🔜 Phase 7: OCR + Report Summarization

🔜 Phase 8: Deployment & Optimization

🤝 Contributors
Harshal Kolhe — Full Stack Developer

⭐️ Show Your Support
If you like this project, give it a ⭐ on GitHub. It helps a lot!
```
