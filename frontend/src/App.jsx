import { useState } from 'react'
import wardsonarLogo from './assets/wardsonarLogo.png'
import './App.css'

import PatientStep1 from './pages/PatientStep1.jsx'
import PatientStep2 from './pages/PatientStep2.jsx'
import PatientStep3 from './pages/PatientStep3.jsx'

function Home() {
  const navigate = useNavigate()

  return (
    <>
      <div className="container">
          <img src={wardsonarLogo}  className="logo" alt="WardSonar logo" />
          <h1>Welcome</h1>
          <p className="subtitle">Click here to get started</p>

          <div className="button-group">
            <button className="nav-button" onClick={() => navigate(' /patient')}>
              Patient
            </button>
            <button className="nav-button" onClick={() => navigate('/staff')}>
              Staff
            </button>
          </div>
      </div>
    </>
  );
}

function App() {
  return(
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/patient" element={<PatientStep1 />} />
      <Route path="/patient/step2" element={<PatientStep2 />} />
      <Route path="/patient/step3" element={<PatientStep3 />} />
      {/* Future: <Route path="/staff" element={StaffDashboard />} /> */}
    </Routes>
  )
}
export default Home
