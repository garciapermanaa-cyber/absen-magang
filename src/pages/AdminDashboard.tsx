import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { Users, UserCheck, UserX, AlertCircle, RefreshCw } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const AdminDashboard: React.FC = () => {
  const { token, logout } = useAuth();
  const [attendance, setAttendance] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [attRes, statsRes] = await Promise.all([
        axios.get(`${API_URL}/admin/attendance`, { headers: { Authorization: `Bearer ${token}` } }),
        axios.get(`${API_URL}/admin/stats`, { headers: { Authorization: `Bearer ${token}` } })
      ]);
      setAttendance(attRes.data);
      setStats(statsRes.data);
    } catch (err) {
      console.error('Error fetching admin data', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>Admin Monitor</h1>
        <div className="header-actions">
          <button onClick={fetchData} className="btn-icon"><RefreshCw size={18} /></button>
          <button onClick={logout} className="logout-btn">Logout</button>
        </div>
      </header>

      {stats && (
        <div className="stats-grid">
          <div className="stat-card">
            <Users className="icon-blue" />
            <div className="stat-info">
              <span className="label">Total Interns</span>
              <span className="value">{stats.totalUsers}</span>
            </div>
          </div>
          <div className="stat-card">
            <UserCheck className="icon-green" />
            <div className="stat-info">
              <span className="label">Present Today</span>
              <span className="value">{stats.presentToday}</span>
            </div>
          </div>
          <div className="stat-card">
            <AlertCircle className="icon-orange" />
            <div className="stat-info">
              <span className="label">Late Today</span>
              <span className="value">{stats.lateToday}</span>
            </div>
          </div>
          <div className="stat-card">
            <UserX className="icon-red" />
            <div className="stat-info">
              <span className="label">Absent Today</span>
              <span className="value">{stats.absentToday}</span>
            </div>
          </div>
        </div>
      )}

      <main className="dashboard-content">
        <section className="history-section">
          <h3>All Attendance Records</h3>
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Intern Email</th>
                  <th>Date</th>
                  <th>Clock In</th>
                  <th>Clock Out</th>
                  <th>Status</th>
                  <th>Verification</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={6} style={{ textAlign: 'center' }}>Loading...</td></tr>
                ) : attendance.length === 0 ? (
                  <tr><td colSpan={6} style={{ textAlign: 'center' }}>No records found</td></tr>
                ) : (
                  attendance.map((item) => (
                    <tr key={item.id}>
                      <td>{item.user.email}</td>
                      <td>{new Date(item.date).toLocaleDateString()}</td>
                      <td>{item.clockIn ? new Date(item.clockIn).toLocaleTimeString() : '-'}</td>
                      <td>{item.clockOut ? new Date(item.clockOut).toLocaleTimeString() : '-'}</td>
                      <td>
                        <span className={`status-badge ${item.status.toLowerCase()}`}>
                          {item.status}
                        </span>
                      </td>
                      <td>
                         <div className="verification-pills">
                            <span className={`pill ${item.locationValidIn ? 'valid' : 'invalid'}`}>Loc</span>
                            <span className={`pill ${item.cameraVerifiedIn ? 'valid' : 'invalid'}`}>Cam</span>
                         </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
};

export default AdminDashboard;
