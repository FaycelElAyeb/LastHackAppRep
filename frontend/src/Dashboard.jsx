import { useMemo, useState } from 'react';
import axios from 'axios';
import { BellRing, GraduationCap, Mail, RefreshCcw, ShieldAlert, Users } from 'lucide-react';
import UploadPanel from './components/UploadPanel';
import StatCard from './components/StatCard';
import StudentsTable from './components/StudentsTable';
import ChartsPanel from './components/ChartsPanel';
import HighRiskPanel from './components/HighRiskPanel';
import NotificationPreview from './components/NotificationPreview';
import logo from './assets/logo.png';
import { LogOut } from 'lucide-react';

{/*const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';*/}
const API_URL = '/api';

const emptyState = {
    summary: {
        totalStudents: 0,
        averageScore: 0,
        atRiskRate: 0,
        highRiskCount: 0,
        averageAttendance: 0,
        averageAssignments: 0
    },
    students: [],
    chartData: {
        riskDistribution: [],
        weaknessFrequency: [],
        courseBreakdown: [],
        scatterData: []
    },
    previews: []
};

export default function Dashboard({ onLogout }) {

    const [data, setData] = useState(emptyState);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('Upload an Excel file to start analysis.');
    const [error, setError] = useState('');
    const [sending, setSending] = useState(false);

    const highRiskStudents = useMemo(() => {
        return (data.students || []).filter(
            (student) => student.risk_label === 'High'
        );
    }, [data.students]);

    // ================= HANDLERS =================

    const handleUpload = async (file) => {
        setLoading(true);
        setError('');
        setMessage('Uploading file and running analytics...');

        try {
            const formData = new FormData();
            formData.append('file', file);

            const response = await axios.post(`${API_URL}/upload`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            setData({ ...response.data, previews: [] });
            setMessage('Analysis completed successfully.');
        } catch (err) {
            setError(err.response?.data?.message || 'Upload failed.');
            setMessage('');
        } finally {
            setLoading(false);
        }
    };

    const handleGeneratePreviews = async () => {
        setSending(true);
        setError('');

        try {
            const response = await axios.post(`${API_URL}/alerts/preview`, {
                students: highRiskStudents
            });

            setData((prev) => ({
                ...prev,
                previews: response.data.previews
            }));

            setMessage('Notification previews generated.');
        } catch (err) {
            setError(err.response?.data?.message || 'Could not generate previews.');
        } finally {
            setSending(false);
        }
    };

    const handleSendEmails = async () => {
        setSending(true);
        setError('');

        try {
            const response = await axios.post(`${API_URL}/alerts/send-email`, {
                students: highRiskStudents
            });

            setMessage(response.data.success ? '✅ Emails sent successfully' : '❌ Failed to send emails');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to send emails.');
        } finally {
            setSending(false);
        }
    };

    // ================= UI =================

    return (
        <div className="app-shell">

            <header className="hero-card">
                <div className="hero-left">
                    <div className="hero-brand">
                        <img src={logo} alt="Qassim University logo" className="hero-logo" />
                        <div>
                            <p className="eyebrow">AI Student Success Monitoring</p>
                            <h1>Student Risk Prediction Dashboard</h1>
                            <p className="subtext">
                                Analyse data, Predict at-risk students, Visualize weaknesses, and Trigger intervention emails.
                            </p>
                        </div>
                    </div>
                </div>

                {/* 🔥 UPDATED BUTTON LAYOUT */}
                <div className="hero-actions">

                    <div className="hero-buttons">
                        <button
                            className="ghost-btn"
                            onClick={handleGeneratePreviews}
                            disabled={!highRiskStudents.length || sending}
                        >
                            <BellRing size={18} />
                            Generate Alerts
                        </button>

                        <button
                            className="primary-btn"
                            onClick={handleSendEmails}
                            disabled={!highRiskStudents.length || sending}
                        >
                            <Mail size={18} />
                            Send Emails
                        </button>
                    </div>

                    {/* 🔴 LOGOUT CENTERED */}
                    <button className="primary-btn logout-center" onClick={onLogout}>
                        <LogOut size={18} />
                        Logout
                    </button>

                </div>
            </header>

            <UploadPanel
                onUpload={handleUpload}
                loading={loading}
                message={message}
                error={error}
            />

            <section className="stats-grid">
                <StatCard icon={<Users />} label="Total Students" value={data.summary.totalStudents} />
                <StatCard icon={<GraduationCap />} label="Average Score" value={`${data.summary.averageScore}%`} />
                <StatCard icon={<ShieldAlert />} label="At-Risk Rate" value={`${data.summary.atRiskRate}%`} />
                <StatCard icon={<BellRing />} label="High Risk" value={data.summary.highRiskCount} />
            </section>

            <section className="content-grid">
                <HighRiskPanel
                    students={highRiskStudents}
                    onRefresh={handleGeneratePreviews}
                    loading={sending}
                />
                <StudentsTable students={data.students} />
            </section>

            <ChartsPanel chartData={data.chartData} />

            <section className="action-panel">
                <div className="panel-header">
                    <h2>Intervention Workflow</h2>
                    <button
                        className="secondary-btn"
                        onClick={handleGeneratePreviews}
                        disabled={!highRiskStudents.length || sending}
                    >
                        <RefreshCcw size={16} />
                        Refresh Previews
                    </button>
                </div>

                <NotificationPreview previews={data.previews} />
            </section>

        </div>
    );
}