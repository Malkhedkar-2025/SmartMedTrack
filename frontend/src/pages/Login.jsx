import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../index.css';

const Login = ({ onLogin }) => {
    const [role, setRole] = useState('CLINICIAN');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Check if user is verified in the backend
        try {
            const response = await fetch(`http://localhost:8080/api/users/${username}`);
            if (response.ok) {
                const user = await response.json();
                console.log('User status check:', user);
                // Spring Boot/Jackson often serializes isVerified as confirmed or verified
                const isVerified = user.isVerified !== undefined ? user.isVerified : user.verified;

                if (!isVerified && user.role !== 'ADMIN') {
                    alert('Your account is pending verification by an administrator.');
                    return;
                }
            }
        } catch (error) {
            console.error('Login check failed:', error);
            // In case of error (like CORS), we might want to prevent login or just log it
        }

        const userData = {
            username: username || 'User',
            role: role
        };
        onLogin(userData);
        navigate('/dashboard');
    };

    return (
        <div className="login-container scrollable">
            <div className="login-card compact">
                <div className="login-header">
                    <span style={{ fontSize: '3rem' }}>⚕️</span>
                    <h2>SmartMedtrack</h2>
                    <p className="text-muted" style={{ color: 'var(--primary)', fontWeight: '600' }}>Secure Access Portal</p>
                </div>

                <form onSubmit={handleSubmit} className="login-form">
                    <div className="form-group">
                        <label style={{ color: 'var(--primary)' }}>Select Your Role</label>
                        <select
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                            className="form-control"
                        >
                            <option value="CLINICIAN">Clinician / Physician</option>
                            <option value="PHARMACIST">Pharmacist / Stock Manager</option>
                            <option value="ADMIN">System Administrator</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label style={{ color: 'var(--primary)' }}>Username</label>
                        <input
                            type="text"
                            placeholder="Enter your username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="form-control"
                        />
                    </div>

                    <div className="form-group">
                        <label style={{ color: 'var(--primary)' }}>Password</label>
                        <input
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="form-control"
                        />
                    </div>

                    <button type="submit" className="login-btn">Sign In to Dashboard</button>
                </form>

                <div className="login-footer">
                    <p style={{ marginBottom: '1rem', fontSize: '0.95rem' }}>
                        New Staff? <Link to="/register" style={{ color: 'var(--primary)', fontWeight: 'bold', textDecoration: 'underline' }}>Create Account</Link>
                    </p>
                    <p className="text-muted">© 2026 SmartMedtrack Healthcare Solutions</p>
                    <p style={{ marginTop: '0.5rem' }}>
                        <a href="#" style={{ color: 'var(--secondary)' }}>Forgot Password?</a> • <a href="#" style={{ color: 'var(--secondary)' }}>Support</a>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
