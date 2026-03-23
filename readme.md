🏥 AI-Based Medical Report Summarizer & Patient Health Management System

An AI-powered full-stack web application that allows users to upload medical reports (PDF), extract text using OCR, and generate simplified summaries along with detected medical conditions.


🚀 Features

* 🔐 User Authentication (JWT-based login/signup)
* 📄 Upload Medical Reports (PDF)
* 🧠 AI-powered Report Summarization
* 🔍 OCR-based Text Extraction (for scanned PDFs)
* 📊 Detect Abnormal Conditions (e.g., low hemoglobin)
* 📁 User Dashboard (view all reports)
* ⏳ Real-time Report Processing Status


🛠️ Tech Stack

- Backend

* Node.js
* Express.js
* MongoDB (Mongoose)
* JWT Authentication
* bcrypt (password hashing)

-AI & OCR

* Groq API (LLaMA models)
* Tesseract.js (OCR)
* pdf-poppler (PDF → Image conversion)

- Tools

* Postman (API Testing)
* dotenv (environment variables)


 📂 Project Structure
```
src/
 ├── controllers/
 │    ├── user.controller.js
 │    ├── report.controller.js
 │
 ├── models/
 │    ├── user.model.js
 │    ├── report.model.js
 │
 ├── routes/
 │    ├── user.routes.js
 │    ├── report.routes.js
 │
 ├── middlewares/
 │    ├── auth.middleware.js
 │
 ├── uploads/        # stored PDFs & images
 ├── app.js
 ├── index.js
```

⚙️ Setup Instructions

1️⃣ Clone the repository

```
git clone https://github.com/your-username/medical-report-ai.git
cd medical-report-ai
```


2️⃣ Install dependencies

```
npm install
```

---

3️⃣ Setup Environment Variables

Create a `.env` file:

```
PORT=5000
MONGO_URI=your_mongodb_connection
ACCESS_TOKEN_SECRET=your_secret_key
GROQ_API_KEY=your_groq_api_key
CORS_ORIGIN=*
```

4️⃣ Install Poppler (for OCR)

* Download Poppler for Windows
* Extract to: `C:\poppler`
* Add to PATH:
  `C:\poppler\Library\bin`

Test:

```
pdftoppm -v
```


5️⃣ Run the server

```
npm run dev
```
🧪 API Endpoints

🔐 Auth

* `POST /api/register` → Register user
* `POST /api/login` → Login user


📄 Reports

* `POST /api/reports/upload` → Upload report
* `POST /api/reports/process` → Process report (OCR + AI)
* `GET /api/reports` → Get user reports


🔄 Working Flow

```
User Uploads PDF
        ↓
PDF → Image (Poppler)
        ↓
OCR (Tesseract)
        ↓
Extracted Text
        ↓
AI Processing (Groq)
        ↓
Summary + Conditions
        ↓
Stored in MongoDB
```


🧠 Example Output

```json
{
  "summary": "Patient has low hemoglobin indicating possible anemia.",
  "conditions": ["Low Hemoglobin", "Anemia"]
}
```


⚠️ Challenges Faced

* Handling PDF parsing vs OCR for scanned files
* Fixing ESM vs CommonJS issues (`pdf-parse`)
* Preventing AI hallucination by ensuring real data extraction
* Managing async processing pipeline


🚀 Future Improvements

* 📊 Health analytics dashboard
* 🥗 Diet & lifestyle recommendations
* 📱 Mobile app integration
* 🔔 Alert system for abnormal reports
* ☁️ Cloud storage (AWS S3)



👩‍💻 Author

**Aditi Singh**
B.Tech CSE Student


⭐ Contribution

Feel free to fork this repo and improve the project!



💡 Inspiration

Built to simplify complex medical reports and make healthcare insights accessible using AI.

