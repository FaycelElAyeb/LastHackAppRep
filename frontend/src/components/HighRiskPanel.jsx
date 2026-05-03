export default function HighRiskPanel({ students = [], onRefresh, loading }) {
  return (
    <section className="panel side-panel">
      <div className="panel-header">
        <h2>Priority Follow-Ups</h2>
        <button className="text-btn" onClick={onRefresh} disabled={!students.length || loading}>Generate</button>
      </div>
      <div className="list-stack">
        {students.length === 0 ? (
          <div className="empty-card">No high-risk students detected yet.</div>
        ) : (
          students.slice(0, 8).map((student) => (
            <div className="student-alert-card" key={student.student_id}>
              <div className="alert-head">
                <div>
                  <h3>{student.full_name}</h3>
                  <p>{student.email}</p>
                </div>
                <span className="risk-pill high">High</span>
              </div>
              <p><strong>Main weaknesses:</strong> {student.weaknesses.join(', ') || 'No major weaknesses detected'}</p>
              <p><strong>Advice:</strong> {student.advice.join(' ')}</p>
            </div>
          ))
        )}
      </div>
    </section>
  );
}
