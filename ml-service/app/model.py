import numpy as np
from sklearn.ensemble import RandomForestClassifier

FEATURES = [
    "logins",
    "assignments",
    "quizzes",
    "forum",
    "attendance",
    "study_hours",
    "activities_completed",
]

def _build_training_data():
    rng = np.random.default_rng(42)
    rows = []
    labels = []

    for _ in range(900):
        logins = int(rng.integers(5, 180))
        assignments = float(rng.integers(20, 101))
        quizzes = float(rng.integers(20, 101))
        forum = int(rng.integers(0, 35))
        attendance = float(rng.integers(40, 101))
        study_hours = float(rng.integers(1, 26))
        activities_completed = int(rng.integers(0, 16))

        score = (
            min(logins / 120, 1.0) * 0.15
            + (assignments / 100) * 0.23
            + (quizzes / 100) * 0.25
            + min(forum / 25, 1.0) * 0.08
            + (attendance / 100) * 0.18
            + min(study_hours / 18, 1.0) * 0.06
            + min(activities_completed / 12, 1.0) * 0.05
        )

        risk = 1.0 - score
        if risk >= 0.68:
            label = "High"
        elif risk >= 0.42:
            label = "Medium"
        else:
            label = "Low"

        rows.append([logins, assignments, quizzes, forum, attendance, study_hours, activities_completed])
        labels.append(label)

    return np.array(rows, dtype=float), np.array(labels)

X_TRAIN, Y_TRAIN = _build_training_data()
MODEL = RandomForestClassifier(
    n_estimators=250,
    max_depth=8,
    min_samples_split=5,
    random_state=42
)
MODEL.fit(X_TRAIN, Y_TRAIN)

def predict_students(students):
    X = np.array([[float(student.get(feature, 0)) for feature in FEATURES] for student in students], dtype=float)
    labels = MODEL.predict(X)
    probabilities = MODEL.predict_proba(X)
    class_index = {label: idx for idx, label in enumerate(MODEL.classes_)}

    results = []
    for i, label in enumerate(labels):
      confidence = float(probabilities[i, class_index[label]])
      risk_score = {
        "High": int(round(confidence * 100)),
        "Medium": int(round(55 + confidence * 25)),
        "Low": int(round(10 + (1 - confidence) * 25)),
      }[label]
      results.append({
          "risk_label": str(label),
          "risk_score": max(1, min(99, risk_score)),
          "confidence": round(confidence, 4),
          "source": "random_forest_fastapi"
      })
    return results
