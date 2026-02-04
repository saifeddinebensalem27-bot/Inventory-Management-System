import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../lib/AuthContext';
import '../style/login.css';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(''); // To show error messages
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleLogin = (e) => {
        e.preventDefault();
        setError(''); // Clear previous errors
        
        console.log('Login attempt with email:', email);
        
        axios.post('http://localhost:8000/api/login', { email, password })
            .then(res => {
                console.log('Login response:', res.data);
                if (res.data.success) {
                    // Ensure the user object has the roles property
                    const userData = {
                        ...res.data.user,
                        roles: res.data.user.roles || [res.data.user.role] // Support both formats
                    };
                    login(userData);
                    navigate('/dashboard');
                } else {
                    setError(res.data.message || 'Login failed');
                }
            })
            .catch(err => {
                console.error('Login error:', err);
                if (err.response?.data?.message) {
                    setError(err.response.data.message);
                } else if (err.response?.status === 401) {
                    setError('Invalid email or password');
                } else {
                    setError('An error occurred during login. Please try again.');
                }
            });
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <div className="logo-box">
                    <svg width="35" height="35" viewBox="0 0 24 24" fill="white">
                        <path d="M21 16.5c0 .38-.21.71-.53.88l-7.97 4.43c-.31.17-.69.17-1 0L3.53 17.38c-.32-.17-.53-.5-.53-.88V7.5c0-.38.21-.71.53-.88l7.97-4.43c.31-.17.69-.17 1 0l7.97 4.43c.32.17.53.5.53.88v9z" />
                    </svg>
                </div>
                
                <h1 className="login-title">AutoParts ERP</h1>
                <p className="login-subtitle">Inventory Management System</p>
                
                {/* Show error message if login fails */}
                {error && <div style={{color: 'red', textAlign: 'center', marginBottom: '10px'}}>{error}</div>}

                <form onSubmit={handleLogin}>
                    <div className="form-group">
                        <input 
                            type="email" 
                            className="login-input"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required 
                        />
                    </div>
                    <div className="form-group">
                        <input 
                            type="password" 
                            className="login-input"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required 
                        />
                    </div>
                    
                    <button type="submit" className="login-button">
                        Login
                    </button>
                </form>

                <div className="login-footer">
                    <p>© 2026 AutoParts ERP. All rights reserved.</p>
                </div>
            </div>
        </div>
    );
};

export default Login;