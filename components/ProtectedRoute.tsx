
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { UserRole } from '../types';
import { Loader } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactElement;
  roles: UserRole[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, roles }) => {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader className="w-12 h-12 animate-spin text-primary" />
      </div>
    );
  }
  
  if (!user) {
    // Redirect them to the /login page, but save the current location they were
    // trying to go to. This allows us to send them along to that page after they
    // login, which is a nicer user experience than dropping them off on the home page.
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!roles.includes(user.role)) {
      // If user is logged in but does not have the right role, redirect to home page
      return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
