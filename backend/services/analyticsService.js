const axios = require('axios');
const { buildAdvice, detectWeaknesses } = require('./alertService');

const ML_SERVICE_URL = process.env.ML_SERVICE_URL || 'http://127.0.0.1:8001';

function fallbackPrediction(student) {
  const loginScore = Math.min(student.logins / 120, 1) * 100;
  const forumScore = Math.min(student.forum / 25, 1) * 100;
  const studyScore = Math.min(student.study_hours / 18, 1) * 100;
  const activityScore = Math.min(student.activities_completed / 12, 1) * 100;

  const weighted =
    loginScore * 0.16 +
    student.assignments * 0.22 +
    student.quizzes * 0.24 +
    forumScore * 0.08 +
    student.attendance * 0.18 +
    studyScore * 0.06 +
    activityScore * 0.06;

  const riskScore = Math.round(100 - weighted);

  let label = 'Low';
  if (riskScore >= 70) label = 'High';
  else if (riskScore >= 45) label = 'Medium';

  return { risk_score: riskScore, risk_label: label, confidence: 0.72, source: 'fallback' };
}

async function predictWithMl(students) {
  try {
    const response = await axios.post(`${ML_SERVICE_URL}/predict`, { students }, { timeout: 15000 });
    return response.data.predictions;
  } catch (error) {
    console.warn('ML service unavailable, using fallback scoring.');
    return students.map(fallbackPrediction);
  }
}

async function analyzeStudents(rows) {
  const predictions = await predictWithMl(rows);

  return rows.map((student, index) => {
    const prediction = predictions[index] || fallbackPrediction(student);
    const weaknesses = detectWeaknesses(student);
    const advice = buildAdvice(weaknesses);
    return {
      ...student,
      ...prediction,
      weaknesses,
      advice
    };
  });
}

function buildDashboardPayload(students) {
  const totalStudents = students.length;
  const averageScore = totalStudents
    ? Math.round(students.reduce((sum, item) => sum + (100 - item.risk_score), 0) / totalStudents)
    : 0;
  const atRisk = students.filter((item) => item.risk_label !== 'Low').length;
  const highRiskCount = students.filter((item) => item.risk_label === 'High').length;
  const atRiskRate = totalStudents ? Math.round((atRisk / totalStudents) * 100) : 0;

  const riskDistribution = ['High', 'Medium', 'Low'].map((risk) => ({
    name: risk,
    value: students.filter((item) => item.risk_label === risk).length
  }));

  const weaknessMap = {};
  students.forEach((student) => {
    student.weaknesses.forEach((item) => {
      weaknessMap[item] = (weaknessMap[item] || 0) + 1;
    });
  });

  const weaknessFrequency = Object.entries(weaknessMap)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);

  const courses = [...new Set(students.map((item) => item.course_name))];
  const courseBreakdown = courses.map((course) => {
    const subset = students.filter((item) => item.course_name === course);
    return {
      course,
      High: subset.filter((item) => item.risk_label === 'High').length,
      Medium: subset.filter((item) => item.risk_label === 'Medium').length,
      Low: subset.filter((item) => item.risk_label === 'Low').length
    };
  });

  const scatterData = students.map((item) => ({
    student: item.full_name,
    attendance: item.attendance,
    quizzes: item.quizzes
  }));

  return {
    summary: {
      totalStudents,
      averageScore,
      atRiskRate,
      highRiskCount
    },
    students,
    chartData: {
      riskDistribution,
      weaknessFrequency,
      courseBreakdown,
      scatterData
    }
  };
}

module.exports = {
  analyzeStudents,
  buildDashboardPayload
};
