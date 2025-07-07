import { useEffect, useState } from 'react';
import { Bar, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, registerables } from 'chart.js';
import { useNavigate } from 'react-router-dom';
import DirectionMeter from '../components/DirectionMeter';
import './WardDashboard.css';

ChartJS.register(...registerables);

export default function ManagerDashboard() {
  const navigate = useNavigate();
  const [wards, setWards] = useState([]);
  const [selectedWard, setSelectedWard] = useState('');
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch('https://your-backend-url/api/all-wards')
      .then(res => res.json())
      .then(setWards);
  }, []);

  useEffect(() => {
    if (selectedWard) {
      fetch(`https://your-backend-url/api/responses/${selectedWard}`)
        .then(res => res.json())
        .then(setData);
    }
  }, [selectedWard]);

  const countByKey = (key, possibleValues) => {
    const counts = {};
    possibleValues.forEach(val => (counts[val] = 0));
    data.forEach(entry => {
      if (key === 'factors') {
        entry.factors?.forEach(f => counts[f]++);
      } else {
        counts[entry[key]]++;
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
        data: labels.map(label => counts[label] || 0),
        backgroundColor: colors,
      },
    ],
  });

  return (
    <div className="dashboard-container">
      <h1>Manager Dashboard</h1>

      <label>
        Select Ward: &nbsp;
        <select value={selectedWard} onChange={(e) => setSelectedWard(e.target.value)}>
          <option value="">-- Choose a Ward --</option>
          {wards.map((ward) => (
            <option key={ward} value={ward}>{ward}</option>
          ))}
        </select>
      </label>

      {selectedWard && (
        <>
          <h2>Mood Responses for {selectedWard}</h2>
          <div className="chart-wrapper">
            <Bar
              data={toChartData(
                ['very-calm', 'calm', 'neutral', 'stormy', 'very-stormy'],
                moodCounts,
                ['#26c6da', '#00acc1', '#0097a7', '#1976d2', '#283593']
              )}
            />
          </div>

          <h2>Direction of Change</h2>
          <DirectionMeter counts={directionCounts} />

          <h2>Contributing Factors</h2>
          <Pie
            data={toChartData(
              ['ward environment', 'staff', 'other patients', 'personal feelings', 'other'],
              factorCounts,
              ['#ffeebb', '#ffa600', '#ffc456', '#247bff', '#b4c3ff']
            )}
            options={{
              cutout: '50%',
              plugins: {
                legend: {
                  position: 'right'
                }
              }
            }}
          />
        </>
      )}

      <button onClick={() => navigate('/')}>← Back to Home</button>
    </div>
  );
}
