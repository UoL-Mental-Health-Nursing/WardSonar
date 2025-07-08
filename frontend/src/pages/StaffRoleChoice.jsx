import React from 'react';
import { useNavigate } from 'react-router-dom';
import staffRole from '../assets/care-staff-area.svg'
import managerRole from '../assets/manager.svg'
import './StaffRoleChoice.css';

export default function StaffRoleChoice() {
  const navigate = useNavigate();

  return (
    <div className="container">
      <h1>Select Your Role</h1>
      <div className="button-group">
        <button className="nav-button" onClick={() => navigate('/staff/login')}>
            <img src={staffRole}  className="logo" alt="staffRole" />
                Ward Staff
        </button>
        <button className="nav-button" onClick={() => navigate('/manager/login')}>
            <img src={managerRole}  className="logo" alt="managerRole" />
          Manager
        </button>
      </div>
    </div>
  );
}
