import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import profile from '../assets/profile.svg';
import './WardLogin.css';

export default function StaffLogin(){
    const [username, setUsername] =  useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = (e) => {
        e.preventDefault();

        //Dummy credentials
        if (username === 'admin' && password === 'admin'){
            localStorage.setItem('loggedIn', 'true');
            navigate('/staff/dashboard');
        } else{
            alert('Incorrect username or password');
        }
    };

    return (
        <div className="login-container">
            <img src={profile}  className="logo" alt="profile" />
            <h2>Ward Login</h2>
            <form onSubmit={handleLogin} className="login-form">
                <label>
                    Username: 
                    <input 
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required />
                </label>

                <label>
                    Password:
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required />
                </label>
                <button type="submit">Login</button>
            </form>
        </div>
    )
}