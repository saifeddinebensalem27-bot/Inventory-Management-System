import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { canAccessPage } from './rolePermissions';

const ProtectedRoute = ({ children, requiredRole = null }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Get the role - handle both array and string formats
  const userRole = Array.isArray(user.roles) ? user.roles[0] : user.roles;
  
  // Check if user has role permission for this page
  if (requiredRole && !canAccessPage(userRole, requiredRole)) {
    console.log('Access Denied - User role:', userRole, 'Required:', requiredRole);
    return (
      <div style={{
        padding: '40px',
        textAlign: 'center',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div>
          <h1>Access Denied</h1>
          <p>You don't have permission to access this page.</p>
          <a href="/dashboard" style={{
            display: 'inline-block',
            marginTop: '20px',
            padding: '10px 20px',
            backgroundColor: '#3b82f6',
            color: 'white',
            textDecoration: 'none',
            borderRadius: '4px'
          }}>
            Go to Dashboard
          </a>
        </div>
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;
