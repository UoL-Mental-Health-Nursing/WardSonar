import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import profile from '../assets/profile.svg';
import './WardLogin.css';

export default function StaffLogin() {
  const [wards, setWards] = useState([]);
  const [ward, setWard] = useState('');
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetch('https://n8cir.onrender.com/api/wards')
      .then((res) => res.json())
      .then(setWards)
      .catch(() => setError('Failed to load wards.'));
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();

    const res = await fetch('https://n8cir.onrender.com/api/staff-login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ward, pin }),
    });

    const data = await res.json();
    if (data.success) {
      localStorage.setItem('loggedIn', 'true');
      localStorage.setItem('ward', ward);
      navigate('/staff/dashboard');
    } else {
      setError(data.error || 'Login failed');
    }
  };

  return (
    <div className="login-container">
      <img src={profile} className="logo" alt="profile" />
      <h2>Ward Login</h2>
      <form onSubmit={handleLogin} className="login-form">
        <label>Select Ward</label>
          <select value={ward} onChange={(e) => setWard(e.target.value)} required>
            <option value="">-- Select Ward --</option>
            {wards.map((w) => (
              <option key={w} value={w}>{w}</option>
            ))}
          </select>

        <label>
          PIN
          <input
            type="password"
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            required
          />
        </label>

        {error && <p className="error">{error}</p>}
        <button type="submit">Login</button>
      </form>
    </div>
  );
}
