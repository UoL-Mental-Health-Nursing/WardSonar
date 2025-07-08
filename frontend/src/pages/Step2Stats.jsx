import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DirectionMeter from '../components/DirectionMeter';

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

    fetch(`https://psychic-space-eureka-7v96gr99prj637gg-5000.app.github.dev/api/responses/${encodeURIComponent(savedWard)}`)

      .then((res) => res.json())
      .then((data) => {
        const now = new Date();
        const filtered = data.filter((entry) => {
          const time = new Date(entry.timestamp);
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
      });
  }, [filter, navigate]);

  const directionCounts = directionLabels.reduce((acc, label) => {
    acc[label] = 0;
    return acc;
  }, {});

  filteredData.forEach((item) => {
    if (directionCounts.hasOwnProperty(item.direction)) {
      directionCounts[item.direction]++;
    }
  });
  const totalResponses = filteredData.length;

  return (
    <div className="details-container">
      <h2>{ward} direction of change details</h2>

      <div className="filter-buttons">
        <button onClick={() => setFilter('today')}>Today</button>
        <button onClick={() => setFilter('week')}>This Week</button>
        <button onClick={() => setFilter('month')}>This Month</button>
        <button onClick={() => setFilter('all')}>All Time</button>
      </div>

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
