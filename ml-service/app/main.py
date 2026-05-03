from fastapi import FastAPI
from pydantic import BaseModel, EmailStr
from typing import List
from .model import predict_students

app = FastAPI(title="Student Risk ML Service")

class StudentRecord(BaseModel):
    student_id: str
    full_name: str
    email: str
    phone_number: str
    course_name: str
    logins: float
    assignments: float
    quizzes: float
    forum: float
    attendance: float
    study_hours: float
    activities_completed: float

class PredictRequest(BaseModel):
    students: List[StudentRecord]

@app.get("/health")
def health():
    return {"status": "ok", "service": "ml-service"}

@app.post("/predict")
def predict(request: PredictRequest):
    predictions = predict_students([student.model_dump() for student in request.students])
    return {"predictions": predictions}
