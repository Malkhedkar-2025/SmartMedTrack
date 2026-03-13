import React, { useState } from 'react';
import { User, Shield, Key, Save, X } from 'lucide-react';
import { motion } from 'framer-motion';

const Profile = ({ user, onUpdate, onClose }) => {
    const [fullName, setFullName] = useState(user.fullName || '');
    const [password, setPassword] = useState('');
    const [licenseNumber, setLicenseNumber] = useState(user.licenseNumber || '');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage({ type: '', text: '' });

        try {
            const response = await fetch(`http://localhost:8080/api/users/${user.id}/profile`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    fullName,
                    password,
                    licenseNumber
                })
            });

            if (response.ok) {
                const updatedUser = await response.json();
                onUpdate(updatedUser);
                setMessage({ type: 'success', text: 'Profile updated successfully!' });
            } else {
                setMessage({ type: 'error', text: 'Failed to update profile.' });
            }
        } catch (error) {
            console.error('Update profile error:', error);
            setMessage({ type: 'error', text: 'An error occurred.' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="card"
            style={{
                width: '100%',
                maxWidth: '500px',
                margin: '2rem auto',
                padding: '2rem'
            }}
        >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h2 style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <User size={28} color="var(--primary)" /> User Profile
                </h2>
                <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={24} /></button>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div className="form-group">
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--primary)', fontWeight: '600' }}>
                        <User size={18} /> Full Name
                    </label>
                    <input
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="form-control"
                        placeholder="Enter your full name"
                    />
                </div>

                <div className="form-group">
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--primary)', fontWeight: '600' }}>
                        <Key size={18} /> New Password
                    </label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="form-control"
                        placeholder="Leave blank to keep current"
                    />
                </div>

                <div className="form-group">
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--primary)', fontWeight: '600' }}>
                        <Shield size={18} /> License Number
                    </label>
                    <input
                        type="text"
                        value={licenseNumber}
                        onChange={(e) => setLicenseNumber(e.target.value)}
                        className="form-control"
                        placeholder="Professional license number"
                    />
                </div>

                <div style={{ padding: '10px', background: '#f8f9fa', borderRadius: '8px', fontSize: '0.9rem' }}>
                    <p style={{ margin: 0 }}><strong>Username:</strong> {user.username}</p>
                    <p style={{ margin: 0 }}><strong>Role:</strong> {user.role}</p>
                    <p style={{ margin: 0 }}><strong>Status:</strong> {user.isVerified ? 'Verified' : 'Pending Verification'}</p>
                </div>

                {message.text && (
                    <p style={{
                        padding: '10px',
                        borderRadius: '4px',
                        backgroundColor: message.type === 'success' ? '#d4edda' : '#f8d7da',
                        color: message.type === 'success' ? '#155724' : '#721c24',
                        textAlign: 'center'
                    }}>
                        {message.text}
                    </p>
                )}

                <button
                    type="submit"
                    disabled={loading}
                    className="login-btn"
                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}
                >
                    <Save size={18} /> {loading ? 'Saving...' : 'Save Changes'}
                </button>
            </form>
        </motion.div>
    );
};

export default Profile;
