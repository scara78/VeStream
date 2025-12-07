import React, { useEffect } from 'react';
import { CheckCircle, AlertCircle } from 'lucide-react';
import { THEME } from '@/constants/config';

const Toast = ({ message, type = 'success', onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div style={{
      position: 'fixed', bottom: '2rem', right: '2rem', zIndex: 9999,
      background: '#1e293b', border: `1px solid ${THEME.border}`,
      padding: '12px 20px', borderRadius: '8px',
      display: 'flex', alignItems: 'center', gap: '10px',
      boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
      animation: 'slideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
    }}>
      {type === 'success' ? <CheckCircle color={THEME.accent} size={20} /> : <AlertCircle color="#ef4444" size={20} />}
      <span style={{ color: '#fff', fontSize: '0.9rem', fontWeight: 500 }}>{message}</span>
      <style>{`@keyframes slideIn { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }`}</style>
    </div>
  );
};
export default Toast;