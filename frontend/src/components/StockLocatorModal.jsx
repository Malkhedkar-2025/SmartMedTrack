import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MapPin, Package, PhoneCall } from 'lucide-react';

const StockLocatorModal = ({ isOpen, onClose, medicineName, availability }) => {
    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="modal-overlay" onClick={onClose}>
                <motion.div
                    initial={{ scale: 0.9, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.9, opacity: 0, y: 20 }}
                    className="modal-content"
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="modal-header">
                        <h3>Nearby Availability: {medicineName}</h3>
                        <button className="close-btn" onClick={onClose}><X size={20} /></button>
                    </div>

                    <div className="availability-list">
                        {availability.length > 0 ? (
                            availability.map((item, idx) => (
                                <motion.div
                                    key={idx}
                                    initial={{ x: -10, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    transition={{ delay: idx * 0.1 }}
                                    className="availability-item"
                                >
                                    <div className="facility-info">
                                        <div className="facility-name">
                                            <MapPin size={16} className="text-primary" />
                                            <strong>{item.facilityName}</strong>
                                            <span className="type-tag">{item.facilityType}</span>
                                        </div>
                                        <p className="text-muted small">{item.location}</p>
                                    </div>
                                    <div className="stock-info">
                                        <div className="qty-badge">
                                            <Package size={14} />
                                            {item.quantity} Units
                                        </div>
                                        <button className="contact-btn"><PhoneCall size={14} /> Contact</button>
                                    </div>
                                </motion.div>
                            ))
                        ) : (
                            <p className="text-muted text-center py-4">No other facilities currently have stock for this medicine.</p>
                        )}
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default StockLocatorModal;
