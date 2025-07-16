import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './WardLogin.css';
import ManagerHome from './ManagerHome.jsx';

export default function ManagerLogin() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();

    const response = await fetch('https://n8cir.onrender.com/api/manager-login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });

    if (response.ok) {
      localStorage.setItem('managerLoggedIn', 'true');
      navigate('/manager/dashboard');
    } else {
      const data = await response.json();
      setError(data.error || 'Login failed');
    }
  };

  return (
    <div className="manager-login-container">
      <h2>Manager Login</h2>
      <form onSubmit={handleLogin}>
        <input
          type="text"
          placeholder="Manager Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Manager Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Login</button>
        {error && <p className="error">{error}</p>}
      </form>
    </div>
  );
}
