import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './PatientStep1.css';

import better from '../assets/up-arrow.svg';
import same from '../assets/circle.svg';
import worse from '../assets/down-arrow.svg';

export default function PatientStep2() {
  const navigate = useNavigate();
  const [selectedDirection, setSelectedDirection] = useState(null);

  const directions = [
    { label: 'Getting Better', value: 'better', icon: better},
    { label: 'Same', value: 'same', icon: same},
    { label: 'Getting Worse', value: 'worse', icon: worse}
  ];

  const handleNext = () => {
    if (!selectedDirection) {
      alert('Please select an option to continue.');
      return;
    }
    localStorage.setItem('direction', selectedDirection);
    navigate('/patient/step3');
  };

  useEffect(() => {
    const saved = localStorage.getItem('direction');
    if (saved) setSelectedDirection(saved);
  }, []);

  return (
    <div className="step-container">
      <h2>Which direction is it going in?</h2>
      <div className="mood-button-container">
        {directions.map((dir) => (
          <button
            key={dir.value}
            className={`mood-button ${selectedDirection === dir.value ? 'selected' : ''}`}
            onClick={() => setSelectedDirection(dir.value)}
          >
            <img src={dir.icon} alt={dir.label} />
            <span>{dir.label}</span>
          </button>
        ))}
      </div>
      <button className="next-button" onClick={handleNext}>Next</button>
    </div>
  );
}
