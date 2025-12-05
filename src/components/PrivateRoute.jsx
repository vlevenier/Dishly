import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../auth/useAuth';


const PrivateRoute = ({ children, requiredRole }) => {
  const { user, loading, role } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div>Loading...</div>;
  }

  // Si no está autenticado o no tiene el rol adecuado
  if (!user || (requiredRole && role !== requiredRole)) {
    return <Navigate to="/login" state={{ from: location }} />;
  }

  return children;
};

export default PrivateRoute;
