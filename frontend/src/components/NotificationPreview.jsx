export default function NotificationPreview({ previews = [] }) {
  return (
    <div className="preview-grid">
      {previews.length === 0 ? (
        <div className="empty-card">Generate alert previews to see personalized email and SMS drafts.</div>
      ) : (
        previews.map((item) => (
          <div className="preview-card" key={item.student_id}>
            <h3>{item.full_name}</h3>
            <p className="muted">{item.email}</p>
            <div className="preview-block">
              <h4>Email Subject</h4>
              <p>{item.subject}</p>
            </div>
            <div className="preview-block">
              <h4>Email Body</h4>
              <p>{item.emailBody}</p>
            </div>
            <div className="preview-block">
              <h4>SMS Preview</h4>
              <p>{item.smsBody}</p>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
