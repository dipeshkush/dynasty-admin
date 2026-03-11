// src/App.jsx
import { useState } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import './index.css';
import './App.css';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { MainLayout } from './components/layout/MainLayout';
import { UserManagement } from './pages/UserManagement';
import { Products } from './pages/Products';
import { CategoryManagement } from './pages/CategoryManagement';
import { Orders } from './pages/Orders';
import { Customers } from './pages/Customers';
import { Wallet } from './pages/Wallet';
import { Membership } from './pages/Membership';
import { Reports } from './pages/Reports';
import { HomePageManagement } from './pages/HomePageManagement';
import { PushNotifications } from './pages/PushNotifications';
import { Settings } from './pages/Settings';
import { HelpSupport } from './pages/HelpSupport';
import { Profile } from './pages/Profile';

function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    // Check localStorage on initial mount
    return localStorage.getItem('isAuthenticated') === 'true';
  });

  const login = () => {
    localStorage.setItem('isAuthenticated', 'true');
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem('isAuthenticated');
    setIsAuthenticated(false);
  };

  return { isAuthenticated, login, logout };
}

// Protected Route Wrapper
function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" replace />;
}

function App() {
  const { isAuthenticated, login, logout } = useAuth();

  return (
    <Router>
      <Routes>
        {/* Public: Login */}
        <Route
          path="/login"
          element={
            isAuthenticated ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <Login onLoginSuccess={login} />
            )
          }
        />

        {/* Protected: All pages inside MainLayout */}
        <Route
          element={
            <ProtectedRoute>
              <MainLayout onLogout={logout} />
            </ProtectedRoute>
          }
        >
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/user-management" element={<UserManagement />} />
          <Route path="/products" element={<Products />} />
          <Route path="/category-management" element={<CategoryManagement />} />
          <Route path="/Orders" element={<Orders />} />
          <Route path="/customers" element={<Customers />} />
          <Route path="/wallet" element={<Wallet />} />
          <Route path="/membership" element={<Membership />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/home-page" element={<HomePageManagement />} />
          <Route path="/notifications" element={<PushNotifications />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/help-support" element={<HelpSupport />} />
          <Route path="/profile" element={<Profile />} />

          {/* 404 */}
          <Route path="*" element={
            <div className="flex items-center justify-center min-h-screen bg-gray-50">
              <h1 className="text-4xl font-bold text-gray-800">404 - Page Not Found</h1>
            </div>
          } />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;