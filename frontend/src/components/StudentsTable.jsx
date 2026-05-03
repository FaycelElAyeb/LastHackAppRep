export default function StudentsTable({ students = [] }) {
  return (
    <section className="panel large-panel">
      <div className="panel-header">
        <h2>Students Overview</h2>
        <span className="badge">{students.length} records</span>
      </div>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Student</th>
              <th>Course</th>
              <th>Logins</th>
              <th>Assignments</th>
              <th>Quizzes</th>
              <th>Forum</th>
              <th>Attendance</th>
              <th>Study Hours</th>
              <th>Activities</th>
              <th>Risk</th>
              <th>Score</th>
            </tr>
          </thead>
          <tbody>
            {students.length === 0 ? (
              <tr>
                <td colSpan="11" className="empty-cell">No data yet.</td>
              </tr>
            ) : (
              students.map((student) => (
                <tr key={student.student_id}>
                  <td>
                    <strong>{student.full_name}</strong>
                    <div className="muted">{student.email}</div>
                  </td>
                  <td>{student.course_name}</td>
                  <td>{student.logins}</td>
                  <td>{student.assignments}%</td>
                  <td>{student.quizzes}%</td>
                  <td>{student.forum}</td>
                  <td>{student.attendance}%</td>
                  <td>{student.study_hours}</td>
                  <td>{student.activities_completed}</td>
                  <td><span className={`risk-pill ${student.risk_label.toLowerCase()}`}>{student.risk_label}</span></td>
                  <td>{student.risk_score}%</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
