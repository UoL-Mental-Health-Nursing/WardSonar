import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DirectionMeter from '../components/DirectionMeter';

export default function Step2Stats() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState('all');
  const [filteredData, setFilteredData] = useState([]);

  const directionLabels = ['better', 'same', 'worse'];

  useEffect(() => {
    const allData = JSON.parse(localStorage.getItem('responses') || '[]');
    const now = new Date();

    const filtered = allData.filter((entry) => {
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
  }, [filter]);

  const directionCounts = (() => {
    const counts = {};
    directionLabels.forEach((label) => (counts[label] = 0));
    filteredData.forEach((item) => {
      counts[item.direction]++;
    });
    return counts;
  })();

  const totalResponses = filteredData.length;

  return (
    <div className="details-container">
      <h2>Direction of Change Details</h2>

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
