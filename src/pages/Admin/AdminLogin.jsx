import React, { useState } from 'react';
import { useNavigate, Navigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useSettings } from '../../context/SettingsContext';
import { showToast } from '../../components/Toaster';

const AdminLogin = () => {
  const { isAdmin, loginAsAdmin } = useAuth();
  const { settings } = useSettings();
  const navigate = useNavigate();

  const [form, setForm] = useState({ username: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Pehle se admin login hai → dashboard
  if (isAdmin) return <Navigate to="/admin" replace />;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const validate = () => {
    if (!form.username.trim()) return 'Username is required.';
    if (!form.password) return 'Password is required.';
    if (form.password.length < 4) return 'Password must be at least 4 characters.';
    return '';
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    setTimeout(() => {
      const result = loginAsAdmin(form.username, form.password);
      if (result.success) {
        showToast('Welcome back, Administrator!', 'success');
        navigate('/admin', { replace: true });
      } else {
        setError(result.error);
        showToast(result.error, 'error');
      }
      setLoading(false);
    }, 400);
  };

  return (
    <div className="admin-login-page">
      <div className="admin-login-card">
        <div className="admin-login-brand">
          <span className="admin-login-mark">
            {settings.logo ? <img src={settings.logo} alt={settings.brandName} /> : 'S'}
          </span>
          <h1>Admin Panel</h1>
          <p>{settings.brandName}</p>
        </div>

        {error && <div className="admin-login-error">⚠️ {error}</div>}

        <form onSubmit={handleSubmit} className="admin-form" noValidate>
          <div className="admin-field">
            <label htmlFor="admin-username">Username</label>
            <input
              id="admin-username"
              type="text"
              name="username"
              autoComplete="username"
              placeholder="Enter admin username"
              value={form.username}
              onChange={handleChange}
            />
          </div>

          <div className="admin-field">
            <label htmlFor="admin-password">Password</label>
            <div className="admin-input-wrap">
              <input
                id="admin-password"
                type={showPassword ? 'text' : 'password'}
                name="password"
                autoComplete="current-password"
                placeholder="Enter admin password"
                value={form.password}
                onChange={handleChange}
              />
              <button
                type="button"
                className="admin-input-toggle"
                onClick={() => setShowPassword(!showPassword)}
                aria-label="Toggle password visibility"
              >
                {showPassword ? '🙈' : '👁️'}
              </button>
            </div>
          </div>

          <button type="submit" className="admin-btn admin-btn-gradient admin-btn-block" disabled={loading}>
            {loading ? 'Signing in…' : 'Login to Dashboard'}
          </button>
        </form>

        <div className="admin-login-footer">
          <Link to="/">← Back to store</Link>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
