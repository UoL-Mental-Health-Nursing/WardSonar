import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, registerables } from 'chart.js';
import './WardDashboard.css';

ChartJS.register(...registerables);

export default function MoodDetails() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState('all'); // 'today' | 'week' | 'month' | 'all'
  const [filteredData, setFilteredData] = useState([]);

  const moodLabels = ['very-calm', 'calm', 'neutral', 'stormy', 'very-stormy'];
  const moodColors = ['#26c6da', '#00acc1', '#0097a7', '#1976d2', '#283593'];

  
  useEffect(() => {
    fetch('https://psychic-space-eureka-7v96gr99prj637gg-5000.app.github.dev/api/responses')
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
          return true; // 'all'
        });

        setFilteredData(filtered);
      })
      .catch((err) => {
        console.error('Failed to fetch mood data:', err);
      });
  }, [filter]);


  const moodCounts = (() => {
    const counts = {};
    moodLabels.forEach((label) => (counts[label] = 0));
    filteredData.forEach((item) => {
      counts[item.mood]++;
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
      <h2>Mood Response Details</h2>

      <div className="filter-buttons">
        <button onClick={() => setFilter('today')}>Today</button>
        <button onClick={() => setFilter('week')}>This Week</button>
        <button onClick={() => setFilter('month')}>This Month</button>
        <button onClick={() => setFilter('all')}>All Time</button>
      </div>

      <div className="chart-wrapper">
        <Bar
          data={toChartData(moodLabels, moodCounts, moodColors)}
          options={{ responsive: true, plugins: { legend: { display: false } } }}
        />
      </div>

        <h2>Summary</h2>
        <div className="mood-breakdown">
          <p><strong>Total Responses:</strong> {totalResponses}</p>
          <ul>
            {moodLabels.map((label) => (
              <li key={label}>
                <strong>{label.replace('-', ' ')}:</strong> {moodCounts[label]}
              </li>
            ))}
          </ul>
        </div>

      <button onClick={() => navigate('/staff/dashboard')}>← Back to Dashboard</button>
    </div>
  );
}
