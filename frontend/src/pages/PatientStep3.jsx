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
    { label: 'The ward environment', value: 'ward environment', icon: ward },
    { label: 'The staff', value: 'staff', icon: staff },
    { label: 'The other patients', value: 'other patients', icon: people },
    { label: 'How I’m feeling', value: 'personal feelings', icon: feeling },
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
    const mapDirection = {
      worse: -1,
      neutral: 0,
      better: 1,
    };
    const submission = {
      ward: localStorage.getItem('ward'),
      mood: localStorage.getItem('mood'),
      direction: mapDirection[localStorage.getItem('direction')] ?? 0,
      factors: selectedOptions,
      comment: comment.trim(),
      timestamp: new Date().toISOString(),
    };
    //debugging purpose 

    console.log("Submitting this payload:", submission);

    fetch('https://n8cir.onrender.com/api/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(submission),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log('Submitted successfully:', data);
        localStorage.removeItem('mood');
        localStorage.removeItem('direction');
        navigate('/');
      })
      .catch((err) => {
        console.error('Submission failed:', err.message);
        alert('There was a problem submitting your feedback:' + err.message);
      });
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

      <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
        <label htmlFor="additional-comments" className="comment-label">
          Optional comments:
        </label>  <br />
        <textarea
          id="additional-comments"
          name="additionalComments"
          className="comment-box"
          placeholder="Add more details here (If you want)"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />

          <button type="submit" className="next-button">
            Submit
          </button>
      </form>
    </div>
  );
}
