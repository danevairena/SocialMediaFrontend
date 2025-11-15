import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/WelcomePage.css';
import api from '../api/axios';
import { login } from '../data/auth';
import { useProfileContext } from '../context/ProfileContext'; 

function WelcomePage() {
    const navigate = useNavigate();
    const { fetchProfile } = useProfileContext(); 
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSignIn = async (e) => {
        e.preventDefault();

        if (!username || !password) {
            setError('Please enter both username and password.');
            return;
        }

        try {
            const response = await api.post('/users/login', { username, password });
            const { token, user } = response.data;

            login(user, token);

            // fetch profile after log in
            await fetchProfile();

            navigate('/feed');
        } catch (err) {
            console.error('Login failed:', err);
            setError('Invalid username or password.');
        }
    };

    const handleGoToRegister = () => {
        navigate('/register');
    };

    return (
        <div className="welcome-page">
            <div className="left-panel">
                <img src="/logo-smw-transparent.png" alt="Logo" className="logo-image-home" />
                <h1 className="welcome-logo">SOCIAL MEDIA WEBSITE</h1>
            </div>

            <div className="right-panel">
                <form className="form-card" onSubmit={handleSignIn}>
                    <input
                        type="text"
                        placeholder="Username . . ."
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    <input
                        type="password"
                        placeholder="Password . . ."
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />

                    {error && <p className="error">{error}</p>}

                    <button className="sign-in-btn" type="submit">Sign in</button>
                    <hr />
                    <p className="signup-text">You are new here?</p>
                    <button className="signup-btn" type="button" onClick={handleGoToRegister}>
                        Create new account
                    </button>
                </form>
            </div>
        </div>
  );
}

export default WelcomePage;
