import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './PatientStep1.css';

import staff from '../assets/care-staff-area.svg';
import people from '../assets/people.svg';
import feeling from '../assets/brain-cognitive-solid.svg';
import ward from '../assets/hospital.svg';
import other from '../assets/other.svg';

export default function PatientStep3() {
  const navigate = useNavigate();

  const options = [
    { label: 'The ward environment', value: 'ward', icon: ward },
    { label: 'The staff', value: 'staff', icon: staff },
    { label: 'The other patients', value: 'patients', icon: people },
    { label: 'How I’m feeling', value: 'feeling', icon: feeling },
    { label: 'Other', value: 'other', icon: other }
  ];

  const [selectedOptions, setSelectedOptions] = useState([]);
  const [comment, setComment] = useState('');

  const toggleOption = (value) => {
    setSelectedOptions((prev) =>
      prev.includes(value)
        ? prev.filter((v) => v !== value)
        : [...prev, value]
    );
  };

  const handleSubmit = () => {
    if (selectedOptions.length === 0) {
      alert('Please select at least one factor.');
      return;
    }

    // Store responses locally for now
    const submission = {
      atmosphere: localStorage.getItem('atmosphere'),
      direction: localStorage.getItem('direction'),
      factors: selectedOptions,
      comment: comment.trim(),
    };

    console.log('Final Submission:', submission);
    localStorage.setItem('wardsonar_submission', JSON.stringify(submission));

    // Reset storage and redirect
    localStorage.removeItem('atmosphere');
    localStorage.removeItem('direction');
    navigate('/');
  };

  return (
    <div className="step-container">
      <h2>What is contributing to that feeling?</h2>

      <div className="mood-button-container">
        {options.map((opt) => (
          <button
            key={opt.value}
            className={`mood-button ${selectedOptions.includes(opt.value) ? 'selected' : ''}`}
            onClick={() => toggleOption(opt.value)}
          >
            <img src={opt.icon} alt={opt.label} />
            <span>{opt.label}</span>
          </button>
        ))}
      </div>

      <textarea
        className="comment-box"
        placeholder="Add more details here (optional)"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
      />

      <div style={{ marginTop: '1rem' }}>
        <button className="next-button" onClick={handleSubmit}>
          Submit
        </button>
      </div>
    </div>
  );
}
