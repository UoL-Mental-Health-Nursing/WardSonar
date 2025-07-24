import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import './WardDashboard.css'; // Assuming common CSS, or you might have FactorDetails.css

ChartJS.register(ArcElement, Tooltip, Legend);

export default function FactorDetails() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState('all');
  const [filteredData, setFilteredData] = useState([]);
  const [ward, setWard] = useState('');

  // FIX 1: Changed 'staff' to 'the staff' to match backend seeding
  const factorLabels = ['ward environment', 'the staff', 'other patients', 'personal feelings', 'other'];
  const factorColors = ['#ffeebb', '#ffa600', '#ffc456', '#247bff', '#b4c3ff'];

  useEffect(() => {
    const savedWard = localStorage.getItem('ward');
    if (!savedWard) {
      alert('No ward info found. Please log in again.');
      navigate('/staff/login');
      return;
    }
    setWard(savedWard);
  }, [navigate]); // Added ward to dependency array as it's used in the next useEffect

  useEffect(() => {
    if (!ward) return; // Ensure ward is set before fetching

    fetch(`https://n8cir.onrender.com/api/responses/${encodeURIComponent(ward)}`)
      .then((res) => res.json())
      .then((data) => {
        const now = new Date();
        const filtered = data.filter((entry) => {
          // FIX 2: Use entry.created_at as the timestamp field from the backend
          const time = new Date(entry.created_at); 
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
  }, [filter, ward]); // Added ward to dependency array

  // FIX 3: Calculate factorCounts based on 'causes' from backend
  const factorCounts = (() => {
    const counts = {};
    factorLabels.forEach((label) => (counts[label] = 0)); // Initialize counts

    filteredData.forEach((entry) => {
      // FIX 4: Access entry.causes (plural) instead of entry.factors
      entry.causes?.forEach((cause) => { 
        if (factorLabels.includes(cause)) { // Only count if it's an expected factor
          counts[cause]++;
        }
      });
    });
    return counts;
  })();

  const toChartData = (labels, counts, colors) => ({
    labels,
    datasets: [
      {
        data: labels.map((label) => counts[label] || 0), // Ensure default to 0 for missing counts
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
                  {/* FIX 5: Use entry.created_at for timestamp in comments */}
                  <p><strong>{new Date(entry.created_at).toLocaleString()}</strong></p>
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
