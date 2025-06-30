import { useState } from 'react'
import wardsonarLogo from './assets/wardsonarLogo.png'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div className="container">
          <img src={wardsonarLogo}  className="logo" alt="WardSonar logo" />
          <h1>Welcome</h1>
          <p className="subtitle">Click here to get started</p>

          <div className="button-group">
            <button className="nav-button" onClick={() => alert('navigate to patient interface')}>
              Patient
            </button>
            <button className="nav-button" onClick={() => alert('navigate to staff interface')}>
              Staff
            </button>
          </div>
      </div>
    </>
  );
}

export default App
