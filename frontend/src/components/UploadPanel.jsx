import { FileSpreadsheet, UploadCloud } from 'lucide-react';

export default function UploadPanel({ onUpload, loading, message, error }) {
  const handleChange = (event) => {
    const file = event.target.files?.[0];
    if (file) onUpload(file);
  };

  return (
    <section className="upload-card">
      <div>
       {/*} <p className="eyebrow">Excel Upload</p>*/}
        <h2>Import student performance data</h2>
        {/*<p className="subtext">
          Required columns: student_id, full_name, email, phone_number, course_name, logins, assignments, quizzes, forum, attendance, study_hours, activities_completed
        </p>*/}
      </div>
      <label className="upload-box">
        <input type="file" accept=".xlsx,.xls" onChange={handleChange} disabled={loading} hidden />
        <div className="upload-inner">
          <FileSpreadsheet size={34} />
          <span>{loading ? 'Processing...' : 'Choose Excel file'}</span>
          {/*<small>Drag-and-drop can be added later; this version focuses on correct upload + analytics.</small>*/}  
        </div>
      </label>
      {message && <p className="success-text"><UploadCloud size={16} /> {message}</p>}
      {error && <p className="error-text">{error}</p>}
    </section>
  );
}
