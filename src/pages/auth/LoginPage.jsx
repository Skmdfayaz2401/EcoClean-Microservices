import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import {
  Recycle,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ChevronDown,
  Leaf,
  Shield,
  Truck,
  BarChart3,
  AlertCircle,
  ArrowRight,
  Sparkles,
  CheckCircle2
} from 'lucide-react';
import './LoginPage.css';

/**
 * EcoClean Municipal Smart Waste Management System
 * LoginPage Component
 * Features split-screen branding, environmental telemetry theme,
 * role-based authentication, validation, and 1-click demo access.
 */
export default function LoginPage() {
  const navigate = useNavigate();
  const { login, user } = useAuth();

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('admin');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  // Status & Feedback states
  const [isLoading, setIsLoading] = useState(false);
  const [activeDemoRole, setActiveDemoRole] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});

  // Restore remembered email on initial mount
  useEffect(() => {
    try {
      const remembered = localStorage.getItem('ecoclean_remember_email');
      if (remembered) {
        setEmail(remembered);
        setRememberMe(true);
        if (remembered.toLowerCase().includes('driver')) {
          setRole('driver');
        } else {
          setRole('admin');
        }
      }
    } catch (e) {
      console.warn('Could not read remembered email from localStorage', e);
    }
  }, []);

  // Redirect if already authenticated
  useEffect(() => {
    if (user && user.role) {
      if (user.role === 'admin') {
        navigate('/admin/dashboard', { replace: true });
      } else if (user.role === 'driver') {
        navigate('/driver/dashboard', { replace: true });
      }
    }
  }, [user, navigate]);

  // Form field validation
  const validate = (targetEmail, targetPassword) => {
    const errors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!targetEmail || !targetEmail.trim()) {
      errors.email = 'Email address is required';
    } else if (!emailRegex.test(targetEmail.trim())) {
      errors.email = 'Please enter a valid email address';
    }

    if (!targetPassword) {
      errors.password = 'Password is required';
    } else if (targetPassword.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }

    return errors;
  };

  // Centralized authentication executor
  const executeAuthentication = async (targetEmail, targetPassword, fallbackRole, demoType = null) => {
    setErrorMessage('');
    const validationErrors = validate(targetEmail, targetPassword);

    if (Object.keys(validationErrors).length > 0) {
      setFieldErrors(validationErrors);
      return;
    }

    setFieldErrors({});
    setIsLoading(true);
    if (demoType) setActiveDemoRole(demoType);

    try {
      const cleanEmail = targetEmail.trim();
      const result = await login(cleanEmail, targetPassword);

      // Handle remember me persistence
      if (rememberMe) {
        localStorage.setItem('ecoclean_remember_email', cleanEmail);
      } else {
        localStorage.removeItem('ecoclean_remember_email');
      }

      // Determine navigation based on authenticated role
      const resolvedRole = result?.user?.role || fallbackRole;

      if (resolvedRole === 'admin') {
        navigate('/admin/dashboard');
      } else if (resolvedRole === 'driver') {
        navigate('/driver/dashboard');
      } else {
        navigate('/admin/dashboard');
      }
    } catch (err) {
      setErrorMessage(err?.message || 'Invalid email or password. Please verify your credentials.');
    } finally {
      setIsLoading(false);
      setActiveDemoRole(null);
    }
  };

  // Standard form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    executeAuthentication(email, password, role);
  };

  // 1-Click Quick Demo Login
  const handleDemoLogin = (demoEmail, demoPassword, demoRole) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
    setRole(demoRole);
    setFieldErrors({});
    setErrorMessage('');
    executeAuthentication(demoEmail, demoPassword, demoRole, demoRole);
  };

  // Forgot password handler
  const handleForgotPassword = (e) => {
    e.preventDefault();
    alert(
      'Municipal Access Recovery:\n\nPassword reset instructions have been dispatched to your municipal administrator. For emergency access, please contact Municipal IT Support (ops@ecoclean.gov / Ext. 4410).'
    );
  };

  // Role selector change
  const handleRoleChange = (e) => {
    const newRole = e.target.value;
    setRole(newRole);
    setErrorMessage('');
    setFieldErrors({});
  };

  return (
    <div className="login-page">
      {/* ====================================================================
          Left Branding Panel (Environmental / Municipal Theme)
          ==================================================================== */}
      <div className="login-branding-panel">
        <div className="login-brand-bg-pattern" />
        <div className="login-brand-mesh-lines" />

        <div className="login-brand-content">
          {/* Brand Header */}
          <div className="login-brand-header">
            <div className="login-logo-glow-wrapper">
              <div className="login-logo-ring" />
              <Recycle className="login-logo-icon" size={38} />
            </div>

            <h1 className="login-brand-title">
              Eco<span>Clean</span>
            </h1>
            <p className="login-brand-tagline">Smart Waste. Cleaner Cities.</p>

            <div className="login-status-pill">
              <span className="login-status-dot" />
              <span>Municipal Telemetry Grid • 120 Smart Bins Online</span>
            </div>
          </div>

          {/* 3 Telemetry Feature Highlights */}
          <div className="login-features-list">
            {/* Feature 1: IoT Bin Telemetry */}
            <div className="login-feature-card">
              <div className="login-feature-icon-wrapper">
                <BarChart3 size={22} />
              </div>
              <div className="login-feature-content">
                <div className="login-feature-header">
                  <span className="login-feature-title">IoT Bin Telemetry</span>
                  <span className="login-feature-badge">99.8% Uptime</span>
                </div>
                <p className="login-feature-desc">
                  Continuous ultrasonic fill-level tracking, temperature alerts, and fill-rate forecasting across city sectors.
                </p>
              </div>
            </div>

            {/* Feature 2: Dynamic Route Optimization */}
            <div className="login-feature-card">
              <div className="login-feature-icon-wrapper">
                <Truck size={22} />
              </div>
              <div className="login-feature-content">
                <div className="login-feature-header">
                  <span className="login-feature-title">Dynamic Route Optimization</span>
                  <span className="login-feature-badge">AI Optimized</span>
                </div>
                <p className="login-feature-desc">
                  Automated dispatch algorithms minimize fuel consumption, mileage, and vehicle idle times while preventing overflows.
                </p>
              </div>
            </div>

            {/* Feature 3: Municipal Fleet Governance */}
            <div className="login-feature-card">
              <div className="login-feature-icon-wrapper">
                <Shield size={22} />
              </div>
              <div className="login-feature-content">
                <div className="login-feature-header">
                  <span className="login-feature-title">Role-Secured Governance</span>
                  <span className="login-feature-badge">Enterprise</span>
                </div>
                <p className="login-feature-desc">
                  Segregated access control for municipal operations managers and collection crews with verified audit trails.
                </p>
              </div>
            </div>
          </div>

          {/* Bottom Environmental Impact Callout */}
          <div className="login-impact-card">
            <div className="login-impact-icon">
              <Leaf size={22} />
            </div>
            <div className="login-impact-text">
              <h4>
                <span>14.8 Metric Tons CO₂ Offset</span>
              </h4>
              <p>
                Telemetric route planning prevented 4,200 km of unnecessary truck idling across the municipal grid this month.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ====================================================================
          Right Authentication Form Panel
          ==================================================================== */}
      <div className="login-form-panel">
        <div className="login-form-container">
          {/* Mobile-Only Header */}
          <div className="login-mobile-branding">
            <div className="login-mobile-logo">
              <Recycle size={26} />
            </div>
            <div className="login-mobile-text">
              <h2>EcoClean</h2>
              <p>Smart Waste. Cleaner Cities.</p>
            </div>
          </div>

          {/* Form Header */}
          <div className="login-form-header">
            <h2 className="login-title">Sign In</h2>
            <p className="login-subtitle">
              Enter your credentials to access telemetry dashboards, route dispatches, and fleet control.
            </p>
          </div>

          {/* Global Error Banner */}
          {errorMessage && (
            <div className="login-error-alert" role="alert">
              <AlertCircle size={20} className="login-error-icon" />
              <div className="login-error-message">{errorMessage}</div>
              <button
                type="button"
                className="login-error-dismiss"
                onClick={() => setErrorMessage('')}
                aria-label="Dismiss error"
              >
                &times;
              </button>
            </div>
          )}

          {/* Login Form */}
          <form className="login-form" onSubmit={handleSubmit} noValidate>
            {/* Role Selection Dropdown */}
            <div className="login-field-group">
              <label htmlFor="login-role" className="login-label">
                <span>Portal Role</span>
              </label>
              <div className="login-select-wrapper">
                <select
                  id="login-role"
                  className="login-select"
                  value={role}
                  onChange={handleRoleChange}
                  disabled={isLoading}
                >
                  <option value="admin">Administrator (Municipal Operations & Analytics)</option>
                  <option value="driver">Driver (Waste Collection & Route Navigator)</option>
                </select>
                <ChevronDown size={18} className="login-select-arrow" />
              </div>
            </div>

            {/* Email Field */}
            <div className="login-field-group">
              <label htmlFor="login-email" className="login-label">
                <span>
                  Email Address <span className="login-label-required">*</span>
                </span>
              </label>
              <div className="login-input-wrapper">
                <Mail size={18} className="login-input-icon" />
                <input
                  id="login-email"
                  type="email"
                  className={`login-input ${fieldErrors.email ? 'has-error' : ''}`}
                  placeholder="admin@ecoclean.com or driver@ecoclean.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (fieldErrors.email) {
                      setFieldErrors((prev) => ({ ...prev, email: '' }));
                    }
                  }}
                  disabled={isLoading}
                  autoComplete="email"
                />
              </div>
              {fieldErrors.email && (
                <div className="login-field-error">
                  <AlertCircle size={14} />
                  <span>{fieldErrors.email}</span>
                </div>
              )}
            </div>

            {/* Password Field with Toggle */}
            <div className="login-field-group">
              <label htmlFor="login-password" className="login-label">
                <span>
                  Password <span className="login-label-required">*</span>
                </span>
              </label>
              <div className="login-input-wrapper">
                <Lock size={18} className="login-input-icon" />
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  className={`login-input ${fieldErrors.password ? 'has-error' : ''}`}
                  placeholder="Enter your password (min. 6 chars)"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (fieldErrors.password) {
                      setFieldErrors((prev) => ({ ...prev, password: '' }));
                    }
                  }}
                  disabled={isLoading}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className="login-password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {fieldErrors.password && (
                <div className="login-field-error">
                  <AlertCircle size={14} />
                  <span>{fieldErrors.password}</span>
                </div>
              )}
            </div>

            {/* Remember Me & Forgot Password Row */}
            <div className="login-row-options">
              <label className="login-remember-label">
                <input
                  type="checkbox"
                  className="login-checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  disabled={isLoading}
                />
                <span>Remember this device</span>
              </label>

              <button
                type="button"
                className="login-forgot-link"
                onClick={handleForgotPassword}
              >
                Forgot password?
              </button>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="login-submit-btn"
              disabled={isLoading}
            >
              {isLoading && !activeDemoRole ? (
                <>
                  <span className="login-spinner" />
                  <span>Signing In...</span>
                </>
              ) : (
                <>
                  <span>Sign In to Portal</span>
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          {/* ==================================================================
              Quick Demo Access Section (1-Click Auto-Login)
              ================================================================== */}
          <div className="login-demo-section">
            <div className="login-demo-header">
              <div className="login-demo-label">
                <Sparkles size={15} className="login-demo-sparkle" />
                <span>Quick Demo Access</span>
              </div>
              <span className="login-demo-hint">1-click test accounts</span>
            </div>

            <div className="login-demo-grid">
              {/* Demo 1: Admin */}
              <button
                type="button"
                className="login-demo-card admin"
                onClick={() => handleDemoLogin('admin@ecoclean.com', 'admin123', 'admin')}
                disabled={isLoading}
                title="Click to sign in instantly as Administrator"
              >
                <div className="login-demo-card-top">
                  <div className="login-demo-icon-badge">
                    <Shield size={18} />
                  </div>
                  <span className="login-demo-role-badge">Admin</span>
                </div>
                <div className="login-demo-name">Admin Portal</div>
                <div className="login-demo-email">admin@ecoclean.com</div>
                {activeDemoRole === 'admin' && isLoading ? (
                  <div className="login-demo-loading-indicator">
                    <span className="login-demo-card-spinner" />
                    <span>Signing in...</span>
                  </div>
                ) : (
                  <div className="login-demo-cta">
                    <span>Instant Sign In</span>
                    <ArrowRight size={14} />
                  </div>
                )}
              </button>

              {/* Demo 2: Driver */}
              <button
                type="button"
                className="login-demo-card driver"
                onClick={() => handleDemoLogin('driver@ecoclean.com', 'driver123', 'driver')}
                disabled={isLoading}
                title="Click to sign in instantly as Field Driver James Wilson"
              >
                <div className="login-demo-card-top">
                  <div className="login-demo-icon-badge">
                    <Truck size={18} />
                  </div>
                  <span className="login-demo-role-badge">Driver</span>
                </div>
                <div className="login-demo-name">James Wilson (DRV-001)</div>
                <div className="login-demo-email">driver@ecoclean.com</div>
                {activeDemoRole === 'driver' && isLoading ? (
                  <div className="login-demo-loading-indicator">
                    <span className="login-demo-card-spinner" />
                    <span>Signing in...</span>
                  </div>
                ) : (
                  <div className="login-demo-cta">
                    <span>Instant Sign In</span>
                    <ArrowRight size={14} />
                  </div>
                )}
              </button>
            </div>
          </div>

          {/* Municipal Gateway Footer */}
          <div className="login-footer-info">
            <div className="login-footer-badge">
              <CheckCircle2 size={13} style={{ color: 'var(--primary)' }} />
              <span>EcoClean Municipal Waste Telemetry v1.0</span>
            </div>
            <span>Encrypted Municipal Gateway • Protected Under City Smart Urban Data Protocol</span>
          </div>
        </div>
      </div>
    </div>
  );
}
