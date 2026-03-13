import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, MapPin, AlertCircle, Send, Package, Users, CheckCircle, XCircle, Plus, Settings, User as UserIcon, LogOut } from 'lucide-react';
import StockLocatorModal from '../components/StockLocatorModal';
import NotificationCenter from '../components/NotificationCenter';
import Profile from './Profile';
import '../index.css';

const Dashboard = ({ user }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMed, setSelectedMed] = useState(null);
  const [activeTab, setActiveTab] = useState('inventory'); // inventory, requests, admin, settings
  const [showProfile, setShowProfile] = useState(false);
  const [currentUser, setCurrentUser] = useState(user);

  const [medicines, setMedicines] = useState([
    { id: 1, name: 'Paracetamol', sku: 'PC-500', stock: 1250, requirement: 800, status: 'OK' },
    { id: 2, name: 'Amoxicillin', sku: 'AMX-250', stock: 150, requirement: 700, status: 'Low' },
    { id: 3, name: 'Insulin Glargine', sku: 'INS-GL', stock: 12, requirement: 45, status: 'Critical' },
    { id: 4, name: 'Ibuprofen', sku: 'IBU-400', stock: 4500, requirement: 3200, status: 'OK' },
  ]);

  const [requests, setRequests] = useState([
    { id: 1, medName: 'Amoxicillin', qty: 500, requester: 'Dr. Sarah', status: 'Pending', timestamp: '2h ago' },
    { id: 2, medName: 'Insulin', qty: 50, requester: 'Dr. Mike', status: 'Approved', timestamp: '5h ago' },
  ]);

  const [pendingUsers, setPendingUsers] = useState([
    { id: 1, name: 'Dr. Emily Watson', role: 'CLINICIAN', license: 'MD-99281', status: 'Pending' },
    { id: 2, name: 'John Pharmacist', role: 'PHARMACIST', license: 'PH-11022', status: 'Pending' },
  ]);

  const [allUsers, setAllUsers] = useState([]);
  const [newUser, setNewUser] = useState({ username: '', password: '', role: 'CLINICIAN', fullName: '' });

  useEffect(() => {
    if (activeTab === 'settings' && currentUser?.role === 'ADMIN') {
      fetchAllUsers();
    }
  }, [activeTab]);

  const fetchAllUsers = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/users');
      if (response.ok) {
        const data = await response.json();
        setAllUsers(data);
      }
    } catch (error) {
      console.error('Failed to fetch users:', error);
    }
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:8080/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...newUser, isVerified: true })
      });
      if (response.ok) {
        alert('User created successfully');
        setNewUser({ username: '', password: '', role: 'CLINICIAN', fullName: '' });
        fetchAllUsers();
      }
    } catch (error) {
      console.error('Create user error:', error);
    }
  };

  const handleLocate = (med) => {
    setSelectedMed(med.name);
    setIsModalOpen(true);
  };

  const handleSendRequest = (med) => {
    const newReq = {
      id: requests.length + 1,
      medName: med.name,
      qty: med.requirement - med.stock,
      requester: user.username,
      status: 'Pending',
      timestamp: 'Just now'
    };
    setRequests([newReq, ...requests]);
    alert(`Request for ${med.name} sent to Pharmacist.`);
  };

  const handleFulfill = (reqId) => {
    setRequests(requests.map(req => req.id === reqId ? { ...req, status: 'Fulfilled' } : req));
  };

  const handleVerifyUser = (userId, status) => {
    setPendingUsers(pendingUsers.filter(u => u.id !== userId));
    alert(`User ${status === 'Approved' ? 'verified' : 'rejected'} successfully.`);
  };

  return (
    <div className="dashboard-container">
      <motion.header
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="header"
      >
        <div>
          <h1 className="text-secondary" style={{ fontSize: '2.5rem' }}>SmartMedtrack</h1>
          <p className="text-muted">Medical Inventory Management • Welcome, <strong>{currentUser?.username}</strong> <span className="type-tag">{currentUser?.role}</span></p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <NotificationCenter userId={currentUser?.id} />

          <button
            onClick={() => setShowProfile(true)}
            className="card"
            style={{
              padding: '0.8rem 1.2rem',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              cursor: 'pointer',
              border: 'none',
              transition: 'transform 0.2s'
            }}
          >
            <UserIcon size={20} color="var(--primary)" />
            <p style={{ fontWeight: 700, margin: 0 }}>Profile</p>
          </button>

          <div className="card" style={{ padding: '0.8rem 1.5rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <MapPin size={20} color="var(--primary)" />
            <div>
              <p style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)' }}>CURRENT FACILITY</p>
              <p style={{ fontWeight: 700 }}>City General Hospital (A-01)</p>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Role-Based Navigation Tabs */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2.5rem', borderBottom: '2px solid #e9ecef', paddingBottom: '1rem' }}>
        <button
          onClick={() => setActiveTab('inventory')}
          className={`locate-btn ${activeTab === 'inventory' ? '' : 'text-muted'}`}
          style={{ background: activeTab === 'inventory' ? 'var(--primary)' : 'transparent' }}
        >
          <Package size={18} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
          Inventory Status
        </button>
        {(user?.role === 'PHARMACIST' || user?.role === 'CLINICIAN') && (
          <button
            onClick={() => setActiveTab('requests')}
            className={`locate-btn ${activeTab === 'requests' ? '' : 'text-muted'}`}
            style={{ background: activeTab === 'requests' ? 'var(--primary)' : 'transparent' }}
          >
            <Send size={18} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
            Medicine Requests
          </button>
        )}
        {user?.role === 'ADMIN' && (
          <>
            <button
              onClick={() => setActiveTab('admin')}
              className={`locate-btn ${activeTab === 'admin' ? '' : 'text-muted'}`}
              style={{ background: activeTab === 'admin' ? 'var(--primary)' : 'transparent' }}
            >
              <Users size={18} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
              User Verification
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`locate-btn ${activeTab === 'settings' ? '' : 'text-muted'}`}
              style={{ background: activeTab === 'settings' ? 'var(--primary)' : 'transparent' }}
            >
              <Settings size={18} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
              Admin Settings
            </button>
          </>
        )}
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'inventory' && (
          <motion.div
            key="inventory"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
          >
            <div className="stats-grid">
              {[
                { label: 'Total SKUs', val: '124', color: 'var(--primary)' },
                { label: 'Critical Shortages', val: '5', color: 'var(--danger)' },
                { label: 'Daily Utilization', val: '+842 Units', color: 'var(--success)' }
              ].map((stat, i) => (
                <div key={i} className="card">
                  <h3 className="text-muted" style={{ fontSize: '0.8rem', textTransform: 'uppercase' }}>{stat.label}</h3>
                  <p style={{ fontSize: '2.2rem', color: stat.color, fontWeight: '800' }}>{stat.val}</p>
                </div>
              ))}
            </div>

            <section className="card" style={{ padding: '0' }}>
              <div style={{ padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2>Live Inventory Monitor</h2>
                <div className="search-bar" style={{ display: 'flex', alignItems: 'center', background: '#f8f9fa', padding: '0.5rem 1rem', borderRadius: '10px', border: '1px solid #e9ecef' }}>
                  <Search size={18} className="text-muted" style={{ marginRight: '10px' }} />
                  <input type="text" placeholder="Search by name or SKU..." style={{ border: 'none', background: 'transparent', outline: 'none' }} />
                </div>
              </div>

              <div className="medicine-table-container">
                <table className="medicine-table">
                  <thead>
                    <tr>
                      <th>Medicine Name</th>
                      <th>SKU ID</th>
                      <th>Current Stock</th>
                      <th>Requirement</th>
                      <th>Status</th>
                      <th>Quick Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {medicines.map((med) => (
                      <tr key={med.id}>
                        <td><strong>{med.name}</strong></td>
                        <td><code style={{ background: '#f0f4f8', padding: '2px 6px', borderRadius: '4px' }}>{med.sku}</code></td>
                        <td>{med.stock} Units</td>
                        <td>{med.requirement} Units</td>
                        <td>
                          <span className={`status-badge status-${med.stock < med.requirement * 0.2 ? 'out' : med.stock < med.requirement ? 'low' : 'ok'}`}>
                            {med.stock < med.requirement * 0.2 ? 'Critical' : med.stock < med.requirement ? 'Low Stock' : 'Optimized'}
                          </span>
                        </td>
                        <td>
                          <div style={{ display: 'flex', gap: '10px' }}>
                            <button onClick={() => handleLocate(med)} className="locate-btn" style={{ padding: '6px 12px', fontSize: '0.8rem' }}>Locate</button>
                            {user?.role === 'CLINICIAN' && med.stock < med.requirement && (
                              <button onClick={() => handleSendRequest(med)} className="locate-btn" style={{ background: 'var(--success)', padding: '6px 12px', fontSize: '0.8rem' }}>Request Refill</button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </motion.div>
        )}

        {activeTab === 'requests' && (
          <motion.div
            key="requests"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
          >
            <section className="card">
              <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between' }}>
                <h2>Medicine Refill Requests</h2>
                {user?.role === 'CLINICIAN' && (
                  <button className="locate-btn" style={{ background: 'var(--accent)' }}><Plus size={18} /> New Manual Request</button>
                )}
              </div>

              <div className="medicine-table-container">
                <table className="medicine-table">
                  <thead>
                    <tr>
                      <th>Medicine</th>
                      <th>Quantity</th>
                      <th>Requested By</th>
                      <th>Status</th>
                      <th>Time</th>
                      <th>Fulfillment</th>
                    </tr>
                  </thead>
                  <tbody>
                    {requests.map(req => (
                      <tr key={req.id}>
                        <td><strong>{req.medName}</strong></td>
                        <td>{req.qty} Units</td>
                        <td>{req.requester}</td>
                        <td>
                          <span className={`status-badge ${req.status === 'Pending' ? 'status-low' : 'status-ok'}`}>
                            {req.status}
                          </span>
                        </td>
                        <td className="text-muted">{req.timestamp}</td>
                        <td>
                          {user?.role === 'PHARMACIST' && req.status === 'Pending' ? (
                            <button onClick={() => handleFulfill(req.id)} className="locate-btn" style={{ background: 'var(--success)' }}>Fulfill Now</button>
                          ) : (
                            <span className="text-muted">{req.status === 'Fulfilled' || req.status === 'Approved' ? 'Completed' : 'Awaiting Review'}</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </motion.div>
        )}

        {activeTab === 'admin' && (
          <motion.div
            key="admin"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
          >
            <section className="card">
              <div style={{ marginBottom: '2rem' }}>
                <h2>User Verification Queue</h2>
                <p className="text-muted">Review and verify professional licenses for new staff members.</p>
              </div>

              <div className="medicine-table-container">
                <table className="medicine-table">
                  <thead>
                    <tr>
                      <th>Full Name</th>
                      <th>Role</th>
                      <th>License Number</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pendingUsers.map(u => (
                      <tr key={u.id}>
                        <td><strong>{u.name}</strong></td>
                        <td><span className="type-tag">{u.role}</span></td>
                        <td><code>{u.license}</code></td>
                        <td><span className="status-badge status-low">{u.status}</span></td>
                        <td>
                          <div style={{ display: 'flex', gap: '10px' }}>
                            <button onClick={() => handleVerifyUser(u.id, 'Approved')} className="locate-btn" style={{ background: 'var(--success)', display: 'flex', alignItems: 'center gap 5px' }}><CheckCircle size={16} /> Verify</button>
                            <button onClick={() => handleVerifyUser(u.id, 'Rejected')} className="locate-btn" style={{ background: 'var(--danger)', display: 'flex', alignItems: 'center gap 5px' }}><XCircle size={16} /> Reject</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </motion.div>
        )}
        {activeTab === 'settings' && user?.role === 'ADMIN' && (
          <motion.div
            key="settings"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
          >
            <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))' }}>
              <section className="card">
                <h2>Add New Staff Member</h2>
                <p className="text-muted" style={{ marginBottom: '1.5rem' }}>Create a new account for clinicians or pharmacists.</p>
                <form onSubmit={handleCreateUser} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div className="form-group">
                    <label>Full Name</label>
                    <input type="text" className="form-control" value={newUser.fullName} onChange={e => setNewUser({ ...newUser, fullName: e.target.value })} />
                  </div>
                  <div className="form-group">
                    <label>Username</label>
                    <input type="text" className="form-control" value={newUser.username} onChange={e => setNewUser({ ...newUser, username: e.target.value })} />
                  </div>
                  <div className="form-group">
                    <label>Password</label>
                    <input type="password" className="form-control" value={newUser.password} onChange={e => setNewUser({ ...newUser, password: e.target.value })} />
                  </div>
                  <div className="form-group">
                    <label>Role</label>
                    <select className="form-control" value={newUser.role} onChange={e => setNewUser({ ...newUser, role: e.target.value })}>
                      <option value="CLINICIAN">Clinician</option>
                      <option value="PHARMACIST">Pharmacist</option>
                    </select>
                  </div>
                  <button type="submit" className="login-btn" style={{ marginTop: '1rem' }}>Create User Account</button>
                </form>
              </section>

              <section className="card">
                <h2>Stock Order Monitoring</h2>
                <p className="text-muted" style={{ marginBottom: '1.5rem' }}>Track all refill requests and their fulfillment status.</p>
                <div className="medicine-table-container">
                  <table className="medicine-table">
                    <thead>
                      <tr>
                        <th>Medicine</th>
                        <th>Qty</th>
                        <th>Status</th>
                        <th>Requester</th>
                      </tr>
                    </thead>
                    <tbody>
                      {requests.map(req => (
                        <tr key={req.id}>
                          <td><strong>{req.medName}</strong></td>
                          <td>{req.qty}</td>
                          <td>
                            <span className={`status-badge ${req.status === 'Pending' ? 'status-low' : 'status-ok'}`}>
                              {req.status}
                            </span>
                          </td>
                          <td>{req.requester}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showProfile && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 2000,
            padding: '20px'
          }}>
            <Profile
              user={currentUser}
              onClose={() => setShowProfile(false)}
              onUpdate={(updated) => {
                setCurrentUser(updated);
                // setShowProfile(false);
              }}
            />
          </div>
        )}
      </AnimatePresence>

      <section className="prediction-box">
        <AlertCircle size={40} />
        <div>
          <h3>Smart Insight • Predictive Analysis</h3>
          <p>AI suggests that <strong>Amoxicillin</strong> consumption will spike by 25% next week due to seasonal trends. We Recommend increasing safety stock level.</p>
        </div>
      </section>

      <StockLocatorModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        medicineName={selectedMed}
        availability={[
          { facilityName: 'City Polyclinic', facilityType: 'POLYCLINIC', quantity: 450, location: 'Sector 4' },
          { facilityName: 'St. Mary Hospital', facilityType: 'HOSPITAL', quantity: 1200, location: 'Ave 12' },
        ]}
      />
    </div>
  );
};

export default Dashboard;
