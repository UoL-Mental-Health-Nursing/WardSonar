import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function ManagerLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = () => {
    fetch('https://your-backend-url/api/manager-login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          localStorage.setItem('loggedIn', 'true');
          localStorage.setItem('role', 'manager');
          navigate('/manager/dashboard');
        } else {
          alert(data.error || 'Invalid login');
        }
      });
  };

  return (
    <div className="login-container">
      <h2>Manager Login</h2>
      <input
        type="text"
        placeholder="Manager Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        type="password"
        placeholder="Manager Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleLogin}>Login</button>
    </div>
  );
}
