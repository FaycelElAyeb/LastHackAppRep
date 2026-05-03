export default function StatCard({ icon, label, value, hint }) {
  return (
    <div className="stat-card">
      <div className="stat-icon">{icon}</div>
      <div>
        <p className="stat-label">{label}</p>
        <h3>{value}</h3>
        <p className="stat-hint">{hint}</p>
      </div>
    </div>
  );
}
