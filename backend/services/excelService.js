const XLSX = require('xlsx');

const REQUIRED_COLUMNS = [
  'student_id',
  'full_name',
  'email',
  'phone_number',
  'course_name',
  'logins',
  'assignments',
  'quizzes',
  'forum',
  'attendance',
  'study_hours',
  'activities_completed'
];

function normalizeHeaders(row) {
  const normalized = {};
  for (const [key, value] of Object.entries(row)) {
    normalized[String(key).trim().toLowerCase().replace(/\s+/g, '_')] = value;
  }
  return normalized;
}

function parseExcelFile(filePath) {
  const workbook = XLSX.readFile(filePath);
  const firstSheet = workbook.SheetNames[0];
  const rows = XLSX.utils.sheet_to_json(workbook.Sheets[firstSheet], { defval: '' }).map(normalizeHeaders);

  if (!rows.length) {
    throw new Error('Excel file is empty.');
  }

  const missing = REQUIRED_COLUMNS.filter((column) => !(column in rows[0]));
  if (missing.length) {
    throw new Error(`Missing required columns: ${missing.join(', ')}`);
  }

  return rows.map((row, index) => ({
    student_id: String(row.student_id || '').trim(),
    full_name: String(row.full_name || '').trim(),
    email: String(row.email || '').trim(),
    phone_number: String(row.phone_number || '').trim(),
    course_name: String(row.course_name || '').trim(),
    logins: Number(row.logins || 0),
    assignments: Number(row.assignments || 0),
    quizzes: Number(row.quizzes || 0),
    forum: Number(row.forum || 0),
    attendance: Number(row.attendance || 0),
    study_hours: Number(row.study_hours || 0),
    activities_completed: Number(row.activities_completed || 0),
    row_number: index + 2
  }));
}

module.exports = { parseExcelFile, REQUIRED_COLUMNS };
