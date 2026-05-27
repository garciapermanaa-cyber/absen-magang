import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { Camera, MapPin, Clock, CheckCircle, XCircle } from 'lucide-react';
import CameraModal from '../components/CameraModal';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const Dashboard: React.FC = () => {
  const { user, token, logout } = useAuth();
  const [attendance, setAttendance] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const [showCamera, setShowCamera] = useState(false);
  const [pendingAction, setPendingAction] = useState<'check-in' | 'check-out' | null>(null);

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

  const initiateAction = (type: 'check-in' | 'check-out') => {
    setPendingAction(type);
    setShowCamera(true);
    setMessage(null);
  };

  const handleAction = async () => {
    if (!pendingAction) return;
    
    setLoading(true);
    setShowCamera(false);
    
    try {
      // 1. Get Location
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0
        });
      });

      // 2. Camera is verified by the modal
      const cameraVerified = true; 

      const res = await axios.post(`${API_URL}/attendance/${pendingAction}`, {
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
      let errorMsg = 'Action failed';
      if (err instanceof GeolocationPositionError) {
        errorMsg = 'Location access denied or unavailable.';
      } else if (err.response?.data?.message) {
        errorMsg = err.response.data.message;
      }
      
      setMessage({ type: 'error', text: errorMsg });
    } finally {
      setLoading(false);
      setPendingAction(null);
    }
  };

  return (
    <div className="dashboard-container">
      {showCamera && (
        <CameraModal 
          onCapture={handleAction} 
          onClose={() => setShowCamera(false)} 
        />
      )}
      
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
              onClick={() => initiateAction('check-in')}
              className="btn btn-primary"
            >
              <Camera size={20} />
              {loading ? 'Processing...' : 'Check In'}
            </button>
            <button 
              disabled={loading} 
              onClick={() => initiateAction('check-out')}
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
