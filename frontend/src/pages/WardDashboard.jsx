import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bar, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, registerables, ArcElement } from 'chart.js';
import DirectionMeter from '../components/DirectionMeter';
import './WardDashboard.css';


ChartJS.register(...registerables, ArcElement);

export default function WardDashboard() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState('all');
  const [filteredData, setFilteredData] = useState([]);
  const [wardName, setWardName] = useState('');


  useEffect(() => {
    const loggedIn = localStorage.getItem('loggedIn');
    if (loggedIn !== 'true') navigate('/staff/login');
  }, [navigate]);

  useEffect(() => {
    const ward = localStorage.getItem('ward');
    if (!ward) {
      alert('No ward info found. Please log in again.');
      navigate('/staff/login');
      return
    }

    setWardName(ward);

    fetch(`https://n8cir.onrender.com/api/responses/${encodeURIComponent(ward)}`)
      .then(res => res.json())
      .then(data => {
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
      .catch(err => {
        console.error('Failed to fetch ward specific data:', err);
        alert('Could not load data for your ward');
      });
  }, [filter, navigate]);

  useEffect(() => {
    const listener = () => setFilter((f) => f);
    window.addEventListener('storage', listener);
    return () => window.removeEventListener('storage', listener);
  }, []);


  const countByKey = (key, possibleValues) => {
    const counts = {};
    possibleValues.forEach((val) => (counts[val] = 0));
    filteredData.forEach((item) => {
      if (key === 'factors') {
        item.factors?.forEach((f) => counts[f]++);
      } else {
        counts[item[key]]++;
      }
    });
    return counts;
  };

  const moodCounts = countByKey('mood', ['very-calm', 'calm', 'neutral', 'stormy', 'very-stormy']);
  const directionCounts = countByKey('direction', ['better', 'same', 'worse']);
  const factorCounts = countByKey('factors', ['ward environment', 'staff', 'other patients', 'personal feelings', 'other']);

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
    <div className="dashboard-container">
      <h1>{wardName} Dashboard</h1>

      <div className="filter-buttons">
        <button onClick={() => setFilter('today')}>Today</button>
        <button onClick={() => setFilter('week')}>This Week</button>
         <button onClick={() => setFilter('month')}>This Month</button>
        <button onClick={() => setFilter('all')}>All Time</button>
      </div>

      <h2>Mood Responses</h2>
      <div className="chart-wrapper">
        <Bar
          data={toChartData(
            ['very-calm', 'calm', 'neutral', 'stormy', 'very-stormy'],   
            moodCounts,
            ['#26c6da', '#00acc1', '#0097a7', '#1976d2', '#283593']
          )}
        />
      </div>
      <button onClick={() => navigate('/staff/details/mood')}>Show Details</button>

      <h2>Direction of Change</h2>
      <DirectionMeter counts={directionCounts} />
      <button onClick={() => navigate('/staff/details/direction')}>Show Details</button>

      <h2>Contributing Factors</h2>
      <Pie
        data={toChartData(
          ['ward environment', 'staff', 'other patients', 'personal feelings', 'other'],
          factorCounts,
          ['#ffeebb', '#ffa600', '#ffc456', '#247bff', '#b4c3ff']
        )}
        options={{
          cutout: '50%', 
          responsive: true,
          plugins: {
            legend: {
              position: 'right',
            },
          },
        }}
      />
      <button onClick={() => navigate('/staff/details/factors')}>Show Details</button>
    </div>
  );
}
