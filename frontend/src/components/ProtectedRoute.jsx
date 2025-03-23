import React from 'react';
import { Navigate } from 'react-router-dom';
import { useMsal } from '@azure/msal-react';
import appInsights from './appInsights';

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
    appInsights.trackEvent({ name: 'Protected Route - Redirecting to Access denied page' });
    sessionStorage.setItem("redirectPath", location.pathname);
    return <Navigate to="/access-denied" replace state={{ requiredRoles }} />;
  }
  
  return children;
};

export default ProtectedRoute;