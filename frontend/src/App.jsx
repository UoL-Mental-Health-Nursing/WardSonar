import React from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom'
import wardsonarLogo from './assets/wardsonarLogo.png'
import './App.css'
import HamburgerAccessibility from './components/HamburgerAccessibility';

import WardEntry from './pages/PatientWardEntry.jsx' 
import PatientStep1 from './pages/PatientStep1.jsx'
import PatientStep2 from './pages/PatientStep2.jsx'
import PatientStep3 from './pages/PatientStep3.jsx'

import StaffRoleChoice from './pages/StaffRoleChoice.jsx'
import WardLogin from './pages/WardLogin.jsx'
import WardDashboard from './pages/WardDashboard.jsx'
import ManagerLogin from './pages/ManagerLogin.jsx'
import ManagerDashboard from './pages/ManagerDashboard.jsx'

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
          <p className="subtitle">
            WardSonar is a real-time patient feedback tool designed to give staff and managers
            insight into patient wellbeing. It empowers patients to share how they’re feeling,
            and helps healthcare teams monitor mood, detect early warning signs, and respond faster.
          </p>

          <p className="instruction">
            Select an option below to begin:
          </p>

          <div className="button-group">
            <button className="nav-button" onClick={() => navigate('/patient')}>
              Patient
            </button>
            <button className="nav-button" onClick={() => navigate('/staff')}>
              Dashboard
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
          <Route path="/patient" element={<WardEntry />} />
          <Route path="/patient/step1" element={<PatientStep1 />} />
          <Route path="/patient/step2" element={<PatientStep2 />} />
          <Route path="/patient/step3" element={<PatientStep3 />} />
          <Route path="/staff" element={<StaffRoleChoice />} />
          <Route path="/staff/login" element={<WardLogin />} />
          <Route path="/staff/dashboard" element={<WardDashboard />} />
          <Route path="/staff/details/mood" element={<Step1Stats />} />
          <Route path="/staff/details/direction" element={<Step2Stats />} />
          <Route path="/staff/details/factors" element={<Step3Stats />} />
          <Route path="/manager/login" element={<ManagerLogin />} />
          <Route path="/manager/dashboard" element={<ManagerDashboard />} />
        </Routes>
    </>
  )
}
export default App
