import React, { useState, useEffect } from 'react';
import { Bell, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const NotificationCenter = ({ userId }) => {
    const [notifications, setNotifications] = useState([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);

    useEffect(() => {
        if (userId) {
            fetchNotifications();
            const interval = setInterval(fetchNotifications, 30000); // Poll every 30s
            return () => clearInterval(interval);
        }
    }, [userId]);

    const fetchNotifications = async () => {
        try {
            const response = await fetch(`http://localhost:8080/api/notifications/user/${userId}`);
            if (response.ok) {
                const data = await response.json();
                setNotifications(data);
                setUnreadCount(data.filter(n => n.status === 'UNREAD').length);
            }
        } catch (error) {
            console.error('Failed to fetch notifications:', error);
        }
    };

    const markAsRead = async (id) => {
        try {
            const response = await fetch(`http://localhost:8080/api/notifications/${id}/read`, {
                method: 'PUT'
            });
            if (response.ok) {
                setNotifications(notifications.map(n => n.id === id ? { ...n, status: 'READ' } : n));
                setUnreadCount(prev => Math.max(0, prev - 1));
            }
        } catch (error) {
            console.error('Failed to mark notification as read:', error);
        }
    };

    return (
        <div className="notification-wrapper" style={{ position: 'relative' }}>
            <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="icon-btn"
                style={{ position: 'relative', background: 'none', border: 'none', cursor: 'pointer', padding: '10px' }}
            >
                <Bell size={24} color="var(--primary)" />
                {unreadCount > 0 && (
                    <span className="notification-badge" style={{
                        position: 'absolute',
                        top: '5px',
                        right: '5px',
                        background: 'var(--danger)',
                        color: 'white',
                        borderRadius: '50%',
                        padding: '2px 6px',
                        fontSize: '10px',
                        fontWeight: 'bold'
                    }}>
                        {unreadCount}
                    </span>
                )}
            </button>

            <AnimatePresence>
                {showDropdown && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="card"
                        style={{
                            position: 'absolute',
                            right: 0,
                            top: '100%',
                            width: '320px',
                            maxHeight: '400px',
                            overflowY: 'auto',
                            zIndex: 1000,
                            boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
                            padding: '1rem'
                        }}
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                            <h3 style={{ margin: 0, fontSize: '1.1rem' }}>Notifications</h3>
                            <button onClick={() => setShowDropdown(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>Close</button>
                        </div>

                        {notifications.length === 0 ? (
                            <p className="text-muted" style={{ textAlign: 'center', padding: '2rem 0' }}>No notifications yet.</p>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                {notifications.map(n => (
                                    <div
                                        key={n.id}
                                        style={{
                                            padding: '12px',
                                            borderRadius: '8px',
                                            background: n.status === 'UNREAD' ? '#f0f7ff' : '#f8f9fa',
                                            borderLeft: n.status === 'UNREAD' ? '4px solid var(--primary)' : '4px solid #dee2e6',
                                            position: 'relative'
                                        }}
                                    >
                                        <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-dark)' }}>{n.message}</p>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px' }}>
                                            <span className="text-muted" style={{ fontSize: '0.75rem' }}>{new Date(n.createdAt).toLocaleString()}</span>
                                            {n.status === 'UNREAD' && (
                                                <button
                                                    onClick={() => markAsRead(n.id)}
                                                    style={{ background: 'none', border: 'none', color: 'var(--success)', cursor: 'pointer', display: 'flex', alignItems: 'center', fontSize: '0.75rem' }}
                                                >
                                                    <Check size={14} style={{ marginRight: '2px' }} /> Mark read
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default NotificationCenter;
