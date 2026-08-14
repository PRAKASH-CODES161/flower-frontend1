import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';
import AdminLayout from './components/layout/AdminLayout';

// Lazy loading to improve initial load time
const Login = lazy(() => import('./pages/auth/Login'));
const Register = lazy(() => import('./pages/auth/Register'));
const ForgotPassword = lazy(() => import('./pages/auth/ForgotPassword'));
const Dashboard = lazy(() => import('./pages/dashboard/Dashboard'));
const Wholesalers = lazy(() => import('./pages/wholesalers/Wholesalers'));
const Stock = lazy(() => import('./pages/stock/Stock'));
const Purchase = lazy(() => import('./pages/purchase/Purchase'));
const Expenses = lazy(() => import('./pages/expenses/Expenses'));
const Profile = lazy(() => import('./pages/profile/Profile'));
const Orders = lazy(() => import('./pages/orders/Orders'));
const Sales = lazy(() => import('./pages/sales/Sales'));
const Reports = lazy(() => import('./pages/reports/Reports'));

// Placeholder for missing pages
const Placeholder = ({ title }) => (
  <div className="glass-card p-8 text-center h-64 flex flex-col items-center justify-center">
    <h2 className="text-2xl font-bold text-slate-800 mb-2">{title}</h2>
    <p className="text-slate-500">This module is under construction.</p>
  </div>
);

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="min-h-screen flex items-center justify-center bg-mint-light/30">Loading...</div>;
  if (!user) return <Navigate to="/login" />;
  return <AdminLayout>{children}</AdminLayout>;
};

const FallbackLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-mint-light/30 text-mint-dark font-medium">Loading...</div>
);

export default function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <Suspense fallback={<FallbackLoader />}>
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" />} />
            
            {/* Auth Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            
            {/* Protected Routes */}
            <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
            <Route path="/purchase" element={<PrivateRoute><Purchase /></PrivateRoute>} />
            <Route path="/stock" element={<PrivateRoute><Stock /></PrivateRoute>} />
            <Route path="/sales" element={<PrivateRoute><Sales /></PrivateRoute>} />
            <Route path="/orders" element={<PrivateRoute><Orders /></PrivateRoute>} />
            <Route path="/expenses" element={<PrivateRoute><Expenses /></PrivateRoute>} />
            <Route path="/wholesalers" element={<PrivateRoute><Wholesalers /></PrivateRoute>} />
            <Route path="/reports" element={<PrivateRoute><Reports /></PrivateRoute>} />
            <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
          </Routes>
        </Suspense>
      </AuthProvider>
    </LanguageProvider>
  );
}
