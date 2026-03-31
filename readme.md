# 🧠 Medical Report AI Analyzer

A full-stack web application that allows users to upload medical reports (PDF), extract text using OCR, and generate AI-powered summaries with detected medical conditions.

---

## 🚀 Features

- 🔐 User Authentication (JWT-based login & register)
- 📄 Upload Medical Reports (PDF)
- 🔍 OCR using Tesseract.js
- 🧠 AI-powered Report Analysis (via Groq / LLM)
- 📊 Extracted Summary + Detected Conditions
- 📂 Report History Dashboard
- ⚡ Modern React Frontend (Light Medical Theme)

---

## 🏗️ Tech Stack

### Frontend:
- React (Vite)
- Axios
- Modern CSS / Tailwind (optional)

### Backend:
- Node.js
- Express.js
- MongoDB (Mongoose)

### AI & Processing:
- Tesseract.js (OCR)
- Groq API (LLaMA model for analysis)

---

## 📁 Project Structure
project-root/
│
├── backend/
│ ├── controllers/
│ ├── routes/
│ ├── middleware/
│ ├── model/
│ ├── uploads/
│ ├── app.js
│ └── server.js
│
├── frontend/
│ ├── src/
│ │ ├── components/
│ │ ├── pages/
│ │ ├── api.js
│ │ └── App.jsx
│ └── index.html
│
└── README.md

## ⚙️ Setup Instructions

### 1️⃣ Clone Repository

```bash
git clone https://github.com/your-username/medical-report-ai.git
cd medical-report-ai

# Backend Setup
cd backend
npm install

Create .env file:

PORT=3000
MONGO_URI=your_mongodb_uri
ACCESS_TOKEN_SECRET=your_secret
GROQ_API_KEY=your_groq_key

Run backend:

npm run dev

## Frontend Setup
cd frontend
npm install
npm run dev

Frontend runs on:

http://localhost:5173



## 🔐 API Endpoints

Auth

POST /api/register
POST /api/login

Reports

POST /api/reports/upload
POST /api/reports/process
GET /api/reports


🔄 Workflow

User logs in
Uploads PDF report
PDF → Image → OCR (Tesseract)
Extracted text → AI model
AI returns:
Summary
Conditions detected
Results stored in DB
Displayed in dashboard


🧠 How OCR Works

PDF converted to image using pdf-poppler
Image processed using Tesseract.js
Extracted text passed to AI

⚠️ Limitations

OCR accuracy depends on image quality
Only first page processed (can be extended)
Requires valid API key for AI

💡 Future Improvements

Multi-page PDF support
Real-time progress UI
Upload via drag & drop
Export summary as PDF
Doctor recommendation system


👩‍💻 Author

Aditi Singh
BTech CSE | Full Stack Developer

🌟 Acknowledgements
Tesseract.js
Groq API
MongoDB
Express.js
React