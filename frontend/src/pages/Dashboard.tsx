import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { Camera, MapPin, Clock, CheckCircle, XCircle } from 'lucide-react';

const API_URL = 'http://localhost:5000/api';

const Dashboard: React.FC = () => {
  const { user, token, logout } = useAuth();
  const [attendance, setAttendance] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const res = await axios.get(`${API_URL}/attendance/history`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAttendance(res.data);
    } catch (err) {
      console.error('Error fetching history', err);
    }
  };

  const handleAction = async (type: 'check-in' | 'check-out') => {
    setLoading(true);
    setMessage(null);
    try {
      // 1. Get Location
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
      });

      // 2. Camera "Verification" (PRD: take local photo but don't upload)
      // For MVP simulation: we just assume camera was activated.
      const cameraVerified = true; 

      const res = await axios.post(`${API_URL}/attendance/${type}`, {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        accuracy: position.coords.accuracy,
        cameraVerified
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setMessage({ type: 'success', text: res.data.message });
      fetchHistory();
    } catch (err: any) {
      setMessage({ 
        type: 'error', 
        text: err.response?.data?.message || 'Action failed' 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>MagangTrack</h1>
        <div className="user-info">
          <span>{user?.email} ({user?.role})</span>
          <button onClick={logout} className="logout-btn">Logout</button>
        </div>
      </header>

      <main className="dashboard-content">
        <section className="action-card">
          <h2>Daily Attendance</h2>
          {message && (
            <div className={`alert ${message.type}`}>
              {message.type === 'success' ? <CheckCircle size={18} /> : <XCircle size={18} />}
              {message.text}
            </div>
          )}
          
          <div className="action-buttons">
            <button 
              disabled={loading} 
              onClick={() => handleAction('check-in')}
              className="btn btn-primary"
            >
              <Camera size={20} />
              {loading ? 'Processing...' : 'Check In'}
            </button>
            <button 
              disabled={loading} 
              onClick={() => handleAction('check-out')}
              className="btn btn-secondary"
            >
              <Clock size={20} />
              {loading ? 'Processing...' : 'Check Out'}
            </button>
          </div>
          <p className="hint">
            <MapPin size={14} /> Location and Camera required
          </p>
        </section>

        <section className="history-section">
          <h3>My Attendance History</h3>
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Clock In</th>
                  <th>Clock Out</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {attendance.length === 0 ? (
                  <tr><td colSpan={4}>No records found</td></tr>
                ) : (
                  attendance.map((item) => (
                    <tr key={item.id}>
                      <td>{new Date(item.date).toLocaleDateString()}</td>
                      <td>{item.clockIn ? new Date(item.clockIn).toLocaleTimeString() : '-'}</td>
                      <td>{item.clockOut ? new Date(item.clockOut).toLocaleTimeString() : '-'}</td>
                      <td>
                        <span className={`status-badge ${item.status.toLowerCase()}`}>
                          {item.status}
                        </span>
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

export default Dashboard;
