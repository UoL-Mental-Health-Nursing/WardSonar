import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import './PatientStep1.css'

import veryCalm from '../assets/veryCalm.svg';
import calm from '../assets/calm.svg';
import neutral from '../assets/neutral.svg';
import stormy from '../assets/stormy.svg';
import veryStormy from '../assets/veryStormy.svg';

export default function PatientStep1() {
  const navigate = useNavigate();
  const [selectedMood, setSelectedMood] = useState(null);

  const moods = [
    { label: 'Very Calm', value: 'very calm', icon: veryCalm },
    { label: 'Calm', value: 'calm', icon: calm },
    { label: 'Neutral', value: 'neutral', icon: neutral },
    { label: 'Stormy', value: 'stormy', icon: stormy },
    { label: 'Very Stormy', value: 'very stormy', icon: veryStormy }
  ];

  const handleNext = () => {
    if (!selectedMood) {
      alert('Please select a mood to continue.');
      return;
    }
    localStorage.setItem('mood', selectedMood);
    console.log('Saved mood:', localStorage.getItem('mood'));

    navigate('/patient/step2');
  };

  return (
    <div className="step-container">
      <h2>How does the ward atmosphere feel right now?</h2>
      <div className="mood-button-container">
        {moods.map((mood) => (
          <button
            key={mood.value}
            className={`mood-button ${selectedMood === mood.value ? 'selected' : ''}`}
            onClick={() => setSelectedMood(mood.value)}
          >
            <img src={mood.icon} alt={mood.label} />
            <span>{mood.label}</span>
          </button>
        ))}
      </div>

      <button className="next-button" onClick={handleNext}>
        Next
      </button>
    </div>
  );
}
