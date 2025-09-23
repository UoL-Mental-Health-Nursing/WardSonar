import { useNavigate } from 'react-router-dom';

export default function ManagerHome() {
  const navigate = useNavigate();

  return (
    <div style={{ padding: 20, textAlign: 'center' }}>
      <h1>Manager Dashboard</h1>
      <button
        style={{ margin: '10px', padding: '10px 20px' }}
        onClick={() => navigate('/manager/reports')}
      >
        View Reports Dashboard
      </button>
    </div>
  );
}
