import React from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom'
import wardsonarLogo from './assets/wardsonarLogo.png'
import './App.css'
import HamburgerAccessibility from './components/HamburgerAccessibility';

import PatientStep1 from './pages/PatientStep1.jsx'
import PatientStep2 from './pages/PatientStep2.jsx'
import PatientStep3 from './pages/PatientStep3.jsx'

import StaffLogin from './pages/StaffLogin.jsx'
import StaffDashboard from './pages/StaffDashboard.jsx'

import Step1Stats from './pages/Step1Stats.jsx'
import Step2Stats from './pages/Step2Stats.jsx'
import Step3Stats from './pages/Step3Stats.jsx'

function Home() {
  const navigate = useNavigate()

  return (
    <>
      <div className="container">
          <img src={wardsonarLogo}  className="logo" alt="WardSonar logo" />
          <h1>Welcome</h1>
          <p className="subtitle">Click here to get started</p>

          <div className="button-group">
            <button className="nav-button" onClick={() => navigate('/patient')}>
              Patient
            </button>
            <button className="nav-button" onClick={() => navigate('/staff/login')}>
              Staff
            </button>
          </div>
      </div>
    </>
  );
}

function App() {
  return(
    <>
      <HamburgerAccessibility />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/patient" element={<PatientStep1 />} />
          <Route path="/patient/step2" element={<PatientStep2 />} />
          <Route path="/patient/step3" element={<PatientStep3 />} />
          <Route path="/staff/login" element={<StaffLogin />} />
          <Route path="/staff/dashboard" element={<StaffDashboard />} />
          <Route path="/staff/details/mood" element={<Step1Stats />} />
          <Route path="/staff/details/direction" element={<Step2Stats />} />
          <Route path="/staff/details/factors" element={<Step3Stats />} />
        </Routes>
    </>
  )
}
export default App
