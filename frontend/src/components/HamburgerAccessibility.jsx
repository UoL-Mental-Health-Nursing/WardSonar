// src/components/HamburgerAccessibility.jsx
import { useState, useContext, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaBars, FaTimes } from 'react-icons/fa';
import { AccessibilityContext } from '../context/AccessibilityContext';
import './HamburgerAccessibility.css';

export default function HamburgerAccessibility() {
  const navigate = useNavigate();
  const location = useLocation();
  const { setFontScale, highContrast, setHighContrast } = useContext(AccessibilityContext);
  const [open, setOpen] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);

  // Detect login status on mount and when location changes
  useEffect(() => {
    setLoggedIn(localStorage.getItem('loggedIn') === 'true');
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem('loggedIn');
    navigate('/');
  };

  return (
    <div className="hamburger-wrapper">
      <button
        className="hamburger-toggle"
        aria-label={open ? 'Close menu' : 'Open menu'}
        onClick={() => {
          setOpen((v) => !v);
          if (!open) setShowSettings(false);
        }}
      >
        {open ? <FaTimes size={24} /> : <FaBars size={24} />}
      </button>

      {open && (
        <div className="hamburger-menu">
          <button
            className="menu-item"
            onClick={() => setShowSettings((v) => !v)}
          >
            Accessibility
          </button>
          {showSettings && (
            <div className="accessibility-submenu">
              <div className="control-group">
                <span>Font Size:</span>
                <button onClick={() => setFontScale((f) => Math.max(0.75, f - 0.1))}>A–</button>
                <button onClick={() => setFontScale((f) => Math.min(2, f + 0.1))}>A+</button>
              </div>
              <div className="control-group">
                <label>
                  <input
                    type="checkbox"
                    checked={highContrast}
                    onChange={(e) => setHighContrast(e.target.checked)}
                  />
                  High Contrast
                </label>
              </div>
            </div>
          )}

          {/* Only show Logout when loggedIn===true */}
          {loggedIn && (
            <button
              className="menu-item logout-item"
              onClick={handleLogout}
            >
              Logout
            </button>
          )}
        </div>
      )}
    </div>
  );
}
