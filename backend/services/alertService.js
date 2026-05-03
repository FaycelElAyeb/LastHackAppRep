function detectWeaknesses(student) {
  const weaknesses = [];
  if (student.logins < 40) weaknesses.push('Low logins');
  if (student.assignments < 60) weaknesses.push('Low assignments');
  if (student.quizzes < 60) weaknesses.push('Low quiz performance');
  if (student.forum < 8) weaknesses.push('Low forum participation');
  if (student.attendance < 75) weaknesses.push('Low attendance');
  if (student.study_hours < 6) weaknesses.push('Low study hours');
  if (student.activities_completed < 5) weaknesses.push('Low activity completion');
  return weaknesses;
}

function buildAdvice(weaknesses) {
  const advice = [];
  if (weaknesses.includes('Low logins')) advice.push('Increase LMS access and log in consistently throughout the week.');
  if (weaknesses.includes('Low assignments')) advice.push('Prioritize assignment completion and submit all pending work early.');
  if (weaknesses.includes('Low quiz performance')) advice.push('Review lecture material and complete additional quiz practice.');
  if (weaknesses.includes('Low forum participation')) advice.push('Participate in discussion forums and ask at least one academic question weekly.');
  if (weaknesses.includes('Low attendance')) advice.push('Attend classes regularly and contact the instructor if attendance barriers exist.');
  if (weaknesses.includes('Low study hours')) advice.push('Create a fixed study schedule with at least 1 to 2 focused hours per day.');
  if (weaknesses.includes('Low activity completion')) advice.push('Complete more course activities because practical engagement improves course performance.');
  if (!advice.length) advice.push('Maintain current performance and continue tracking progress.');
  return advice;
}

function createNotificationPreviews(students = []) {
  return students.map((student) => {
    const weaknesses = student.weaknesses || detectWeaknesses(student);
    const advice = student.advice || buildAdvice(weaknesses);
    const subject = `Support Plan for ${student.course_name}`;
    const emailBody = `Dear ${student.full_name},\n\nOur system identified that you may need additional support in ${student.course_name}.\n\nDetected weaknesses: ${weaknesses.join(', ') || 'No major weaknesses listed'}\n\nRecommended actions:\n- ${advice.join('\n- ')}\n\nPlease contact your instructor if you need extra help.\n\nBest regards,\nStudent Success Support`;
    const smsBody = `${student.full_name}, support alert for ${student.course_name}: focus on ${weaknesses.slice(0, 2).join(' and ') || 'consistent progress'}.`;
    return {
      student_id: student.student_id,
      full_name: student.full_name,
      email: student.email,
      phone_number: student.phone_number,
      subject,
      emailBody,
      smsBody
    };
  });
}

module.exports = {
  detectWeaknesses,
  buildAdvice,
  createNotificationPreviews
};
