import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './PatientWardEntry.css'

export default function PatientWardEntry() {
  const [wards, setWards] = useState([]);
  const [ward, setWard] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetch('https://psychic-space-eureka-7v96gr99prj637gg-5000.app.github.dev/api/wards')
      .then((res) => res.json())
      .then(setWards)
      .catch(() => setError('Failed to load wards'));
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!ward) {
      setError('Please select a ward.');
      return;
    }

    localStorage.setItem('ward', ward);
    navigate('/patient/step1');
  };

  return (
    <div className="container">
      <h2>Select Your Ward</h2>
      <form onSubmit={handleSubmit}>
        <select value={ward} onChange={(e) => setWard(e.target.value)}>
          <option value="">-- Select Ward --</option>
          {wards.map((w) => (
            <option key={w} value={w}>{w}</option>
          ))}
        </select>
        {error && <p className="error">{error}</p>}
        <button type="submit">Continue</button>
      </form>
    </div>
  );
}
