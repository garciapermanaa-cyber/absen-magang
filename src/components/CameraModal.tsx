import React, { useRef, useState, useEffect } from 'react';
import { Camera, X, Check } from 'lucide-react';

interface CameraModalProps {
  onCapture: () => void;
  onClose: () => void;
}

const CameraModal: React.FC<CameraModalProps> = ({ onCapture, onClose }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [captured, setCaptured] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    startCamera();
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'user' } 
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err) {
      setError('Could not access camera. Please check permissions.');
    }
  };

  const takePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext('2d');
      if (context) {
        canvasRef.current.width = videoRef.current.videoWidth;
        canvasRef.current.height = videoRef.current.videoHeight;
        context.drawImage(videoRef.current, 0, 0);
        setCaptured(true);
        // Stop the stream after capture
        if (stream) {
          stream.getTracks().forEach(track => track.stop());
        }
      }
    }
  };

  const handleConfirm = () => {
    onCapture();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content camera-modal">
        <div className="modal-header">
          <h3>Camera Verification</h3>
          <button onClick={onClose} className="btn-icon"><X size={20} /></button>
        </div>

        <div className="camera-view-container">
          {error ? (
            <div className="camera-error">{error}</div>
          ) : (
            <>
              <video 
                ref={videoRef} 
                autoPlay 
                playsInline 
                className={captured ? 'hidden' : ''}
              />
              <canvas 
                ref={canvasRef} 
                className={!captured ? 'hidden' : ''}
              />
            </>
          )}
        </div>

        <div className="modal-footer">
          {!captured ? (
            <button 
              onClick={takePhoto} 
              disabled={!!error}
              className="btn btn-primary full-width"
            >
              <Camera size={20} /> Take Photo
            </button>
          ) : (
            <button 
              onClick={handleConfirm} 
              className="btn btn-success full-width"
            >
              <Check size={20} /> Verify & Proceed
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CameraModal;
