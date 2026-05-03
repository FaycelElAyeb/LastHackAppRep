import { useState } from 'react';
import Login from './Login';
import Dashboard from './Dashboard';

export default function App() {
  const [isAuth, setIsAuth] = useState(
    localStorage.getItem('auth') === 'true'
  );

  const handleLogin = () => {
    localStorage.setItem('auth', 'true');
    setIsAuth(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('auth');
    setIsAuth(false);
  };

  // 🔐 Show login if not authenticated
  if (!isAuth) {
    return <Login onSuccess={handleLogin} />;
  }

  // 🚀 Show dashboard if logged in
  return <Dashboard onLogout={handleLogout} />;
}