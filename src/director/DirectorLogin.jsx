import React, { useState } from 'react';
import { signIn } from 'aws-amplify/auth';
import { useNavigate } from 'react-router-dom';
import './DirectorLogin.css';

function DirectorLogin() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const user = await signIn({ username, password });
            console.log('Login successful', user);
            // Redirect to /director
            navigate('/director');
        } catch (error) {
            console.error('Login failed', error);
            setError(error.message);
        }
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <h1 className={"director"}>Welcome</h1>
                <h2 className={"director"}>Sign in to your account</h2>
                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <input
                            type="text"
                            id="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            placeholder="Username"
                        />
                    </div>
                    <div className="input-group">
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            placeholder="Password"
                        />
                    </div>
                    <button className="director-submit" type="submit">Sign In</button>
                </form>
                {error && <p className="error">{error}</p>}
            </div>
        </div>
    );
}

export default DirectorLogin;