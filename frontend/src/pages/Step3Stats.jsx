import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, registerables, ArcElement } from 'chart.js';

ChartJS.register(...registerables, ArcElement);

export default function Step3Stats() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState('all');
  const [filteredData, setFilteredData] = useState([]);

  const factorLabels = ['ward environment', 'staff', 'other patients', 'personal feelings', 'other'];
  const factorColors = ['#442828', '#603C3C', '#7F5151', '#936969', '#C9C1C1'];

  useEffect(() => {
    const allData = JSON.parse(localStorage.getItem('responses') || '[]');
    const now = new Date();

    const filtered = allData.filter((entry) => {
      const time = new Date(entry.timestamp);

      if (filter === 'today') {
        return time.toDateString() === now.toDateString();
      }
      if (filter === 'week') {
        const oneWeekAgo = new Date(now);
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
        return time >= oneWeekAgo;
      }
      if (filter === 'month') {
        const oneMonthAgo = new Date(now);
        oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
        return time >= oneMonthAgo;
      }
      if (filter === 'year') {
        const oneYearAgo = new Date(now);
        oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
        return time >= oneYearAgo;
      }
      return true;
    });

    setFilteredData(filtered);
  }, [filter]);


  const factorCounts = (() => {
    const counts = {};
    factorLabels.forEach((label) => (counts[label] = 0));
    filteredData.forEach((item) => {
      item.factors?.forEach((factor) => {
        if (counts[factor] !== undefined) counts[factor]++;
      });
    });
    return counts;
  })();

  const totalResponses = filteredData.length;

  const comments = filteredData
  .map(item => item.comment)
  .filter(comment => comment && comment.trim() !== '');

  const toChartData = (labels, counts, colors) => ({
    labels,
    datasets: [
      {
        label: 'Responses',
        data: labels.map((label) => counts[label] || 0),
        backgroundColor: colors,
      },
    ],
  });

  return (
    <div className="details-container">
      <h2>Contributing Factors Details</h2>

      <div className="filter-buttons">
        <button onClick={() => setFilter('today')}>Today</button>
        <button onClick={() => setFilter('week')}>This Week</button>
        <button onClick={() => setFilter('month')}>This Month</button>
        <button onClick={() => setFilter('all')}>All Time</button>
      </div>

      <Pie
        data={toChartData(factorLabels, factorCounts, factorColors)}
        options={{
          cutout: '50%',
          responsive: true,
          plugins: { legend: { position: 'right' } },
        }}
      />
      <h2>Summary</h2>
      <div className="factors-breakdown">
        <p><strong>Total Responses:</strong> {totalResponses}</p>
        <ul>
          {factorLabels.map((label) => (
            <li key={label}>
              <strong>{label.charAt(0).toUpperCase() + label.slice(1)}:</strong> {factorCounts[label]}
            </li>
          ))}
        </ul>
      </div>
      <div className="comments-section">
        <h3>User Comments</h3>
        {comments.length === 0 ? (
          <p>No comments submitted for this period.</p>
        ) : (
          <ul>
            {comments.map((comment, index) => (
              <li key={index} className="comment-item">{comment}</li>
            ))}
          </ul>
        )}
      </div>
      <button onClick={() => navigate('/staff/dashboard')}>← Back to Dashboard</button>
    </div>
  );
}
