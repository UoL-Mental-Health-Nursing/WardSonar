import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import './WardDashboard.css';

ChartJS.register(ArcElement, Tooltip, Legend);

export default function FactorDetails() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState('all');
  const [filteredData, setFilteredData] = useState([]);
  const [ward, setWard] = useState('');

  const factorLabels = ['ward environment', 'staff', 'other patients', 'personal feelings', 'other'];
  const factorColors = ['#ffeebb', '#ffa600', '#ffc456', '#247bff', '#b4c3ff'];

  useEffect(() => {
  const savedWard = localStorage.getItem('ward');
    if (!savedWard) {
      alert('No ward info found. Please log in again.');
      navigate('/staff/login');
      return;
    }
    setWard(savedWard);
  }, [navigate]);

  useEffect(() => {
    if (!ward) return;

    fetch(`https://n8cir.onrender.com/api/responses/${encodeURIComponent(ward)}`)
      .then((res) => res.json())
      .then((data) => {
        const now = new Date();
        const filtered = data.filter((entry) => {
          const time = new Date(entry.timestamp);
          if (filter === 'today') return time.toDateString() === now.toDateString();
          if (filter === 'week') {
            const oneWeekAgo = new Date();
            oneWeekAgo.setDate(now.getDate() - 7);
            return time >= oneWeekAgo;
          }
          if (filter === 'month') {
            const oneMonthAgo = new Date();
            oneMonthAgo.setMonth(now.getMonth() - 1);
            return time >= oneMonthAgo;
          }
          return true;
        });
        setFilteredData(filtered);
      })
      .catch((err) => {
        console.error('Failed to fetch factors data:', err);
        alert('Could not load contributing factors data');
      });
  }, [filter, ward]);


  const factorCounts = factorLabels.reduce((acc, label) => {
    acc[label] = 0;
    return acc;
  }, {});

  filteredData.forEach((entry) => {
    entry.factors?.forEach((factor) => {
      if (factorCounts.hasOwnProperty(factor)) {
        factorCounts[factor]++;
      }
    });
  });

  const toChartData = (labels, counts, colors) => ({
    labels,
    datasets: [
      {
        data: labels.map((label) => counts[label]),
        backgroundColor: colors,
      },
    ],
  });
  const totalResponses = filteredData.length;
  return (
    <div className="details-container">
      <h2>Contributing Factors – {ward}</h2>

      <div className="filter-buttons">
        <button onClick={() => setFilter('today')}>Today</button>
        <button onClick={() => setFilter('week')}>This Week</button>
        <button onClick={() => setFilter('month')}>This Month</button>
        <button onClick={() => setFilter('all')}>All Time</button>
      </div>

      <div className="chart-wrapper">
        <Pie
          data={toChartData(factorLabels, factorCounts, factorColors)}
          options={{
            responsive: true,
            plugins: {
              legend: {
                position: 'right',
              },
            },
          }}
        />
      </div>

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

      {filteredData.length > 0 && (
        <div className="comments-section">
          <h2>Patient Comments</h2>
          <ul className="comments-list">
            {filteredData
              .filter(entry => entry.comment?.trim())
              .map((entry, index) => (
                <li key={index} className="comment-item">
                  <p><strong>{new Date(entry.timestamp).toLocaleString()}</strong></p>
                  <p>{entry.comment}</p>
                </li>
              ))}
          </ul>
        </div>
      )}

      <button onClick={() => navigate('/staff/dashboard')}>← Back to Dashboard</button>
    </div>
  );
}
