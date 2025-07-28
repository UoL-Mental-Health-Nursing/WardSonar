import { useEffect, useState } from 'react';
import { Bar, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, registerables } from 'chart.js';
import { useNavigate } from 'react-router-dom';
import DirectionMeter from '../components/DirectionMeter';
import './WardDashboard.css';

ChartJS.register(...registerables);

// Mappings for backend integer values to frontend display strings
const ATMOSPHERE_MAP = {
  1: 'very-calm',
  2: 'calm',
  3: 'neutral',
  4: 'stormy',
  5: 'very-stormy',
};

const DIRECTION_MAP = {
  1: 'better',
  0: 'same',
  '-1': 'worse',
};

export default function ManagerDashboard() {
  const navigate = useNavigate();
  const [wards, setWards] = useState([]);
  const [selectedWard, setSelectedWard] = useState('');
  const [data, setData] = useState([]);

  useEffect(() => {
    const isManagerLoggedIn = localStorage.getItem('managerLoggedIn');
    if (isManagerLoggedIn !== 'true') {
      navigate('/manager/login');
    }
  }, [navigate]);

  useEffect(() => {
    fetch('https://n8cir.onrender.com/api/wards')
      .then((res) => res.json())
      .then(setWards)
      .catch((err) => console.error("Failed to fetch wards:", err));
  }, []);

  useEffect(() => {
    if (selectedWard) {
      fetch(`https://n8cir.onrender.com/api/responses/${encodeURIComponent(selectedWard)}`)
        .then((res) => res.json())
        .then(setData)
        .catch((err) => console.error("Failed to fetch data:", err));
    } else {
      setData([]);
    }
  }, [selectedWard]);

  const countByKey = (key, possibleValues) => {
    const counts = {};
    possibleValues.forEach((val) => (counts[val] = 0));

    data.forEach((entry) => {
      if (key === 'mood') {
        const moodString = ATMOSPHERE_MAP[entry.atmosphere];
        if (moodString) {
          counts[moodString]++;
        }
      } else if (key === 'direction') {
        const directionString = DIRECTION_MAP[entry.direction];
        if (directionString) {
          counts[directionString]++;
        }
      } else if (key === 'factors') {
        entry.causes?.forEach((cause) => {
          if (possibleValues.includes(cause)) {
            counts[cause]++;
          }
        });
      }

    });
    return counts;
  };

  const moodLabels = ['very-calm', 'calm', 'neutral', 'stormy', 'very-stormy'];
  const moodColors = ['#26c6da', '#00acc1', '#0097a7', '#1976d2', '#283593'];

  const directionLabels = ['better', 'same', 'worse'];
  const factorLabels = ['ward environment', 'the staff', 'other patients', 'personal feelings', 'other'];
  const factorColors = ['#ffeebb', '#ffa600', '#ffc456', '#247bff', '#b4c3ff'];

  const moodCounts = countByKey('mood', moodLabels);
  const directionCounts = countByKey('direction', directionLabels);
  const factorCounts = countByKey('factors', factorLabels);

  const totalResponses = data.length;

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
      <h1>{selectedWard ? `${selectedWard} Dashboard` : "Manager Dashboard"}</h1>

      <label>
        Select Ward: &nbsp;
        <select value={selectedWard} onChange={(e) => setSelectedWard(e.target.value)}>
          <option value="">-- Choose a Ward --</option>
          {wards.map((ward) => (
            <option key={ward.id} value={ward.name}>{ward.name}</option>
          ))}
        </select>
      </label>

      {selectedWard && (
        <>
          <h2 className="total-responses">Total Responses: {totalResponses}</h2>

          <h2>Mood Responses</h2>
          <div className="chart-wrapper">
            <Bar
              data={toChartData(moodLabels, moodCounts, moodColors)}
              options={{ responsive: true, plugins: { legend: { display: false } } }}
            />
            {/* <button onClick={() => navigate(`/manager/details/mood/${encodeURIComponent(selectedWard)}`)}>Show Details</button> */}
          </div>

          <h2>Direction of Change</h2>
          <DirectionMeter counts={directionCounts} />
          {/* <button onClick={() => navigate(`/manager/details/direction/${encodeURIComponent(selectedWard)}`)}>Show Details</button> */}

          <h2>Contributing Factors</h2>
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
            {/* <button onClick={() => navigate(`/manager/details/factors/${encodeURIComponent(selectedWard)}`)}>Show Details</button> */}
          </div>
        </>
      )}
      <button onClick={() => navigate('/')}>← Back to Home</button>
    </div>
  );
}
