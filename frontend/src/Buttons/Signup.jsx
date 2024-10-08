import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Signup = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const navigate = useNavigate(); // Use navigate for redirection

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(''); // Clear previous error
        setSuccessMessage(''); // Clear previous success message

        const userData = { name, email, password, confirmPassword };

        try {
            const response = await axios.post('http://localhost:5000/api/signup', userData);
            if (response.status === 201) {
                setSuccessMessage(response.data.msg);

                // Save the token to localStorage
                localStorage.setItem('token', response.data.token);

                // Optionally, you can navigate elsewhere or show a message without redirection
                // navigate('/some-other-page'); 
            }
        } catch (err) {
            if (err.response) {
                // Handle error message from backend
                setError(err.response.data.msg);
            } else {
                // General error message
                setError('Error registering user');
            }
        }
    };

    return (
        <div style={{ maxWidth: '400px', margin: '0 auto', padding: '20px', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', backgroundColor: '#FAEBEB' }}>
            <h2 className="text-center mb-4">Sign Up</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="name" className="form-label">Name</label>
                    <input
                        type="text"
                        className="form-control"
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Enter your name"
                        required
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="email" className="form-label">Email address</label>
                    <input
                        type="email"
                        className="form-control"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email"
                        required
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="password" className="form-label">Password</label>
                    <input
                        type="password"
                        className="form-control"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter your password"
                        required
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
                    <input
                        type="password"
                        className="form-control"
                        id="confirmPassword"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Confirm your password"
                        required
                    />
                </div>
                <button type="submit" className="btn btn-primary">Sign Up</button>
            </form>
            {error && <div style={{ color: 'red', marginTop: '10px' }}>{error}</div>}
            {successMessage && <div style={{ color: 'green', marginTop: '10px' }}>{successMessage}</div>}
        </div>
    );
};

export default Signup;
