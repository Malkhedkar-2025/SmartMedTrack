import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../index.css';

const Register = () => {
    const [formData, setFormData] = useState({
        fullName: '',
        username: '',
        password: '',
        role: 'CLINICIAN',
        licenseNumber: ''
    });
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:8080/api/users/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    isVerified: false
                })
            });

            if (response.ok) {
                setMessage('Registration successful! Please wait for administrator verification.');
                setTimeout(() => navigate('/login'), 3000);
            } else {
                setMessage('Registration failed. Please try again.');
            }
        } catch (error) {
            setMessage('Error connecting to server.');
        }
    };

    return (
        <div className="login-container scrollable">
            <div className="login-card compact">
                <div className="login-header">
                    <span style={{ fontSize: '2.5rem' }}>⚕️</span>
                    <h2>Staff Registration</h2>
                    <p className="text-muted">Join the Medical Network</p>
                </div>

                <form onSubmit={handleSubmit} className="login-form">
                    <div className="form-group">
                        <label>Full Name</label>
                        <input
                            type="text"
                            name="fullName"
                            placeholder="Enter your full name"
                            value={formData.fullName}
                            onChange={handleChange}
                            className="form-control"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Select Role</label>
                        <select
                            name="role"
                            value={formData.role}
                            onChange={handleChange}
                            className="form-control"
                            required
                        >
                            <option value="CLINICIAN">Clinician / Physician</option>
                            <option value="PHARMACIST">Pharmacist / Stock Manager</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label>License Number</label>
                        <input
                            type="text"
                            name="licenseNumber"
                            placeholder="e.g. MD-12345"
                            value={formData.licenseNumber}
                            onChange={handleChange}
                            className="form-control"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Username</label>
                        <input
                            type="text"
                            name="username"
                            placeholder="Choose a username"
                            value={formData.username}
                            onChange={handleChange}
                            className="form-control"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Password</label>
                        <input
                            type="password"
                            name="password"
                            placeholder="••••••••"
                            value={formData.password}
                            onChange={handleChange}
                            className="form-control"
                            required
                        />
                    </div>

                    <button type="submit" className="login-btn">Submit for Verification</button>
                </form>

                {message && <p style={{ marginTop: '1rem', color: message.includes('successful') ? 'var(--success)' : 'var(--danger)', fontWeight: 'bold' }}>{message}</p>}

                <div className="login-footer">
                    <p className="text-muted">Already have an account? <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 'bold' }}>Sign In</Link></p>
                </div>
            </div>
        </div>
    );
};

export default Register;
