import React, { useState, useEffect } from 'react';

// Global toast emitter — call showToast('Saved!', 'success') from anywhere
let listeners = [];

export const showToast = (message, type = 'success') => {
  const toast = { id: Date.now() + Math.random(), message, type };
  listeners.forEach(listener => listener(toast));
};

const Toaster = () => {
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    const listener = (toast) => {
      setToasts(prev => [...prev, toast]);
      setTimeout(() => {
        setToasts(prev => prev.filter(t => t.id !== toast.id));
      }, 3200);
    };
    listeners.push(listener);
    return () => {
      listeners = listeners.filter(l => l !== listener);
    };
  }, []);

  const icons = { success: '✓', error: '✕', info: 'ℹ' };

  return (
    <div className="toast-container" role="status" aria-live="polite">
      {toasts.map(t => (
        <div key={t.id} className={`toast toast-${t.type}`}>
          <span className="toast-icon">{icons[t.type] || 'ℹ'}</span>
          <span className="toast-msg">{t.message}</span>
        </div>
      ))}
    </div>
  );
};

export default Toaster;
