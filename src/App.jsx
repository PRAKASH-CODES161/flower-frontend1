import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ForgotPassword from './pages/auth/ForgotPassword';
import AdminLayout from './components/layout/AdminLayout';
import Dashboard from './pages/dashboard/Dashboard';
import Wholesalers from './pages/wholesalers/Wholesalers';
import Stock from './pages/stock/Stock';
import Purchase from './pages/purchase/Purchase';
import Expenses from './pages/expenses/Expenses';
import Profile from './pages/profile/Profile';
import Orders from './pages/orders/Orders';
import Sales from './pages/sales/Sales';
import Reports from './pages/reports/Reports';

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

export default function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
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
    </AuthProvider>
    </LanguageProvider>
  );
}
