import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DirectionMeter from '../components/DirectionMeter.jsx';
import './WardDashboard.css';

const DIRECTION_MAP = {
  1: 'better',
  0: 'same',
  '-1': 'worse',
};

export default function Step2Stats() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState('all');
  const [filteredData, setFilteredData] = useState([]);
  const [ward, setWard] = useState('');

  const directionLabels = ['better', 'same', 'worse'];

  useEffect(() => {
    const savedWard = localStorage.getItem('ward');
    if (!savedWard) {
      alert('No ward info found. Please log in again.');
      navigate('/staff/login');
      return;
    }
    setWard(savedWard);

    fetch(`https://n8cir.onrender.com/api/responses/${encodeURIComponent(savedWard)}`)
      .then((res) => res.json())
      .then((data) => {
        const now = new Date();
        const filtered = data.filter((entry) => {
          const time = new Date(entry.created_at); 
          if (filter === 'today') {
            return time.toDateString() === now.toDateString();
          } else if (filter === 'week') {
            const oneWeekAgo = new Date();
            oneWeekAgo.setDate(now.getDate() - 7);
            return time >= oneWeekAgo;
          } else if (filter === 'month') {
            const oneMonthAgo = new Date();
            oneMonthAgo.setMonth(now.getMonth() - 1);
            return time >= oneMonthAgo;
          }
          return true;
        });

        setFilteredData(filtered);
      })
      .catch((err) => {
        console.error('Failed to fetch direction data:', err);
        alert('Could not load data for your ward');
      });
  }, [filter, navigate]);

  const directionCounts = (() => {
    const counts = {};
    directionLabels.forEach((label) => (counts[label] = 0));
    
 
    filteredData.forEach((item) => {

      const directionString = DIRECTION_MAP[item.direction];
      if (directionString) {
        counts[directionString]++;
      }
    });
    return counts;
  })();

  const totalResponses = filteredData.length;

  return (
    <div className="details-container">
      <h2>{ward} Direction of Change Details</h2> {/* Updated title for clarity */}

      <div className="filter-buttons">
        <button onClick={() => setFilter('today')}>Today</button>
        <button onClick={() => setFilter('week')}>This Week</button>
        <button onClick={() => setFilter('month')}>This Month</button>
        <button onClick={() => setFilter('all')}>All Time</button>
      </div>

      {/* DirectionMeter already expects 'better', 'same', 'worse' which directionCounts now provides */}
      <DirectionMeter counts={directionCounts} />

      <h2>Summary</h2>
      <div className="direction-breakdown">
        <p><strong>Total Responses:</strong> {totalResponses}</p>
        <ul>
          {directionLabels.map((label) => (
            <li key={label}>
              <strong>{label.charAt(0).toUpperCase() + label.slice(1)}:</strong> {directionCounts[label]}
            </li>
          ))}
        </ul>
      </div>

      <button onClick={() => navigate('/staff/dashboard')}>← Back to Dashboard</button>
    </div>
  );
}
