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

  // Count factors - note each item may have multiple factors
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

      <div className="factors-breakdown">
        <h3>Summary</h3>
        <p><strong>Total Responses:</strong> {totalResponses}</p>
        <ul>
          {factorLabels.map((label) => (
            <li key={label}>
              <strong>{label.charAt(0).toUpperCase() + label.slice(1)}:</strong> {factorCounts[label]}
            </li>
          ))}
        </ul>
      </div>

      <button onClick={() => navigate('/staff/dashboard')}>← Back to Dashboard</button>
    </div>
  );
}
