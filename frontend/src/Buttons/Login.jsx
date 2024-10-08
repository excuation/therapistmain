import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate(); // Initialize useNavigate

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(''); // Reset error message
        setLoading(true); // Start loading state

        // Basic validation
        if (!email || !password) {
            setError('Please enter all fields');
            setLoading(false);
            return;
        }

        try {
            const res = await axios.post('http://localhost:5000/api/login', { email, password });
            console.log('Login successful!', res.data.token);
            // Save token to localStorage for further authentication
            localStorage.setItem('token', res.data.token);

            // Show success message (you can redirect or change the state here as needed)
            alert('Login successful!'); // Temporary success message
            
            // Redirect user to the home page
            navigate('/'); // Redirecting to home page

        } catch (err) {
            console.error('Login error:', err.response ? err.response.data : err.message);
            setError('Invalid credentials'); // Show error message
        } finally {
            setLoading(false); // End loading state
        }
    };

    return (
        <div style={{ maxWidth: '400px', margin: 'auto', padding: '20px', border: '1px solid #ccc', borderRadius: '5px' }}>
            <h2>Login</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        style={{ width: '100%', marginBottom: '10px' }}
                    />
                </div>
                <div>
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        style={{ width: '100%', marginBottom: '10px' }}
                    />
                </div>
                <button type="submit" disabled={loading} style={{ width: '100%', padding: '10px' }}>
                    {loading ? 'Logging in...' : 'Login'}
                </button>
                {error && <p style={{ color: 'red' }}>{error}</p>}
            </form>
        </div>
    );
};

export default Login;