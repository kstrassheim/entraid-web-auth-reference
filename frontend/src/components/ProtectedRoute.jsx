import React from 'react';
import { Navigate } from 'react-router-dom';
import { useMsal } from '@azure/msal-react';

const ProtectedRoute = ({ children, requiredRoles = [] }) => {
  const { instance } = useMsal();
  const account = instance.getActiveAccount();
  
  // If there is no active account, redirect to logon (or a login page)
  if (!account) {
    return <Navigate to="/access-denied" replace />;
  }

  // Get user roles from the token claims (depends on your configuration)
  const userRoles = account.idTokenClaims?.roles || [];
  
  // Check if the user has all required roles
  const hasAccess = requiredRoles.every(role => userRoles.includes(role));
  
  if (!hasAccess) {
    sessionStorage.setItem("redirectPath", location.pathname);
    return <Navigate to="/access-denied" replace />;
  }
  
  return children;
};

export default ProtectedRoute;