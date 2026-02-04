import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';

import Sidebar from './pages/SideBar';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import ProductList from './pages/ProductsList';
import Suppliers from './pages/Suppliers';
import Clients from './pages/Clients';
import Purchases from './pages/Purchases';
import PointOfSale from './pages/PointOfSale';
import IncomingHistory from './pages/IncomingHistory';
import SalesHistory from './pages/SalesHistory';
import User from './pages/User';
import { AuthProvider, useAuth } from './lib/AuthContext';
import ProtectedRoute from './lib/ProtectedRoute';


function Layout() {
  const location = useLocation();
  const { user } = useAuth();
  
  // Check if we are on the login page
  const isLoginPage = location.pathname === '/login';
  const isAuthenticated = !!user;

  return (
    <div style={{ display: 'flex' }}>
      {/* Show Sidebar only if NOT on login page AND user is authenticated */}
      {!isLoginPage && isAuthenticated && <Sidebar />}

      <div
        style={{
          // Only add margin if sidebar is visible
          marginLeft: !isLoginPage && isAuthenticated ? '260px' : '0',
          padding: '20px',
          width: '100%',
          minHeight: '100vh',
          backgroundColor: '#f8fafc',
        }}
      >
        <Routes>
          <Route path="/" element={isAuthenticated ? <Navigate to="/dashboard" /> : <Navigate to="/login" />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={
            <ProtectedRoute requiredRole="dashboard">
              <Dashboard />
            </ProtectedRoute>
          } />
          <Route path="/ProductsList" element={
            <ProtectedRoute requiredRole="ProductsList">
              <ProductList />
            </ProtectedRoute>
          } />
          <Route path="/Suppliers" element={
            <ProtectedRoute requiredRole="Suppliers">
              <Suppliers />
            </ProtectedRoute>
          } />
          <Route path="/Clients" element={
            <ProtectedRoute requiredRole="Clients">
              <Clients />
            </ProtectedRoute>
          } />
          <Route path="/Purchases" element={
            <ProtectedRoute requiredRole="Purchases">
              <Purchases />
            </ProtectedRoute>
          } />
          <Route path="/Sales" element={
            <ProtectedRoute requiredRole="Sales">
              <PointOfSale />
            </ProtectedRoute>
          } />
          <Route path="/incoming-history" element={
            <ProtectedRoute requiredRole="incoming-history">
              <IncomingHistory />
            </ProtectedRoute>
          } />
          <Route path="/sales-history" element={
            <ProtectedRoute requiredRole="sales-history">
              <SalesHistory />
            </ProtectedRoute>
          } />
          <Route path="/user-management" element={
            <ProtectedRoute requiredRole="user-management">
              <User />
            </ProtectedRoute>
          } />
        </Routes>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <Layout />
      </AuthProvider>
    </Router>
  );
}