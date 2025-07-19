import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './PatientWardEntry.css'

export default function PatientWardEntry() {
  const [wards, setWards] = useState([]);
  const [wardId, setWardId] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetch('https://n8cir.onrender.com/api/wards')
      .then((res) => res.json())
      .then(setWards)
      .catch(() => setError('Failed to load wards'));
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!wardId) {
      setError('Please select a ward.');
      return;
    }

    localStorage.setItem('ward', wardId);
    navigate('/patient/step1');
  };

  return (
    <div className="container">
      <h2>Select Your Ward</h2>
      <form onSubmit={handleSubmit}>

        <select value={wardId} onChange={(e) => setWardId(e.target.value)}>
          <option value="">-- Select Ward --</option>
          {wards.map((w) => (
            <option key={w.id} value={w.id}>{w.name}</option>
          ))}
        </select>

        {error && <p className="error">{error}</p>}
        <button type="submit">Continue</button>
      </form>
    </div>
  );
}
