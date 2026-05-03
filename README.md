# Student Risk Prediction Dashboard (Fullstack + ML)

A complete fullstack project for uploading an Excel file, analyzing student performance, predicting at-risk students using a Python FastAPI ML service, and sending alerts with targeted advice.

## Stack
- Frontend: React + Vite + Recharts
- Backend: Node.js + Express + Multer + XLSX + Nodemailer
- ML Service: Python FastAPI + scikit-learn
- Data source: Excel upload (`.xlsx`)

## Excel columns
Required columns:
- `student_id`
- `full_name`
- `email`
- `phone_number`
- `course_name`
- `logins`
- `assignments`
- `quizzes`
- `forum`
- `attendance`
- `study_hours`
- `activities_completed`

## Local run

### 1) ML service
```bash
cd ml-service
python -m venv .venv
# Windows
.venv\Scripts\activate
# Linux/macOS
source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8001
```

### 2) Backend
```bash
cd backend
npm install
npm run dev
```

### 3) Frontend
```bash
cd frontend
npm install
npm run dev
```

## Environment files

### backend/.env
```env
PORT=4000
ML_SERVICE_URL=http://127.0.0.1:8001
SMTP_HOST=
SMTP_PORT=587
SMTP_USER=
SMTP_PASS=
MAIL_FROM=
```

### frontend/.env
```env
VITE_API_URL=http://localhost:4000/api
```

## API summary
- `POST /api/upload` Upload Excel and run analytics
- `POST /api/alerts/preview` Build email/SMS previews
- `POST /api/alerts/send-email` Send actual emails
- `GET /api/health` Backend health
- `GET /health` ML service health

## Deployment idea on AWS
- EC2 for frontend build + backend + ML service
- Nginx reverse proxy
- Node backend on 4000
- FastAPI ML service on 8001
