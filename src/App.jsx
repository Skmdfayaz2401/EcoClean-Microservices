import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext.jsx';
import { NotificationProvider } from './context/NotificationContext.jsx';
import Layout from './components/layout/Layout.jsx';

// Auth pages
import LoginPage from './pages/auth/LoginPage.jsx';

// Admin pages
import DashboardPage from './pages/admin/DashboardPage.jsx';
import BinMonitoringPage from './pages/admin/BinMonitoringPage.jsx';
import BinDetailPage from './pages/admin/BinDetailPage.jsx';
import CollectionManagementPage from './pages/admin/CollectionManagementPage.jsx';
import PickupSchedulingPage from './pages/admin/PickupSchedulingPage.jsx';
import RouteOptimizationPage from './pages/admin/RouteOptimizationPage.jsx';
import RouteDetailPage from './pages/admin/RouteDetailPage.jsx';
import DriverManagementPage from './pages/admin/DriverManagementPage.jsx';
import ReportsPage from './pages/admin/ReportsPage.jsx';
import NotificationsPage from './pages/admin/NotificationsPage.jsx';
import ProfilePage from './pages/admin/ProfilePage.jsx';

// Driver pages
import DriverDashboardPage from './pages/driver/DriverDashboardPage.jsx';
import DriverCollectionsPage from './pages/driver/DriverCollectionsPage.jsx';
import DriverRoutesPage from './pages/driver/DriverRoutesPage.jsx';
import DriverRouteDetailPage from './pages/driver/DriverRouteDetailPage.jsx';
import DriverProfilePage from './pages/driver/DriverProfilePage.jsx';

import './index.css';

// Protected Route Component
function ProtectedRoute({ children, allowedRole }) {
  const { user, loading, isAuthenticated } = useAuth();

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        color: 'var(--gray-500)',
        fontSize: '1rem',
      }}>
        Loading...
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRole && user.role !== allowedRole) {
    const redirect = user.role === 'admin' ? '/admin/dashboard' : '/driver/dashboard';
    return <Navigate to={redirect} replace />;
  }

  return <Layout>{children}</Layout>;
}

// Public Route - redirect if already logged in
function PublicRoute({ children }) {
  const { user, loading, isAuthenticated } = useAuth();

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        color: 'var(--gray-500)',
        fontSize: '1rem',
      }}>
        Loading...
      </div>
    );
  }

  if (isAuthenticated) {
    const redirect = user.role === 'admin' ? '/admin/dashboard' : '/driver/dashboard';
    return <Navigate to={redirect} replace />;
  }

  return children;
}

function AppRoutes() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />

      {/* Admin routes */}
      <Route path="/admin/dashboard" element={<ProtectedRoute allowedRole="admin"><DashboardPage /></ProtectedRoute>} />
      <Route path="/admin/bins" element={<ProtectedRoute allowedRole="admin"><BinMonitoringPage /></ProtectedRoute>} />
      <Route path="/admin/bins/:id" element={<ProtectedRoute allowedRole="admin"><BinDetailPage /></ProtectedRoute>} />
      <Route path="/admin/collections" element={<ProtectedRoute allowedRole="admin"><CollectionManagementPage /></ProtectedRoute>} />
      <Route path="/admin/schedule" element={<ProtectedRoute allowedRole="admin"><PickupSchedulingPage /></ProtectedRoute>} />
      <Route path="/admin/routes" element={<ProtectedRoute allowedRole="admin"><RouteOptimizationPage /></ProtectedRoute>} />
      <Route path="/admin/routes/:id" element={<ProtectedRoute allowedRole="admin"><RouteDetailPage /></ProtectedRoute>} />
      <Route path="/admin/drivers" element={<ProtectedRoute allowedRole="admin"><DriverManagementPage /></ProtectedRoute>} />
      <Route path="/admin/reports" element={<ProtectedRoute allowedRole="admin"><ReportsPage /></ProtectedRoute>} />
      <Route path="/admin/notifications" element={<ProtectedRoute allowedRole="admin"><NotificationsPage /></ProtectedRoute>} />
      <Route path="/admin/profile" element={<ProtectedRoute allowedRole="admin"><ProfilePage /></ProtectedRoute>} />

      {/* Driver routes */}
      <Route path="/driver/dashboard" element={<ProtectedRoute allowedRole="driver"><DriverDashboardPage /></ProtectedRoute>} />
      <Route path="/driver/collections" element={<ProtectedRoute allowedRole="driver"><DriverCollectionsPage /></ProtectedRoute>} />
      <Route path="/driver/routes" element={<ProtectedRoute allowedRole="driver"><DriverRoutesPage /></ProtectedRoute>} />
      <Route path="/driver/routes/:id" element={<ProtectedRoute allowedRole="driver"><DriverRouteDetailPage /></ProtectedRoute>} />
      <Route path="/driver/profile" element={<ProtectedRoute allowedRole="driver"><DriverProfilePage /></ProtectedRoute>} />

      {/* Default redirect */}
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <NotificationProvider>
          <AppRoutes />
        </NotificationProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
