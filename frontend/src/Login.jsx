import { useState } from 'react';
import { Lock } from 'lucide-react';

export default function Login({ onSuccess }) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = () => {
    if (password === 'admin123') {
      localStorage.setItem('auth', 'true');
      onSuccess();
    } else {
      setError('Incorrect password');
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <Lock size={32} />
          <h1>Secure Access</h1>
          <p>Student Risk Dashboard</p>
        </div>

        <input
          type="password"
          placeholder="Enter password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
        />

        <button onClick={handleLogin}>Login</button>

        {error && <p className="error-text">{error}</p>}
      </div>
    </div>
  );
}