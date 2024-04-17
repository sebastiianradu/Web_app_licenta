import React, { useState, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import axiosInstance from './AxiosInstance'; // Ensure this path is correct

const ProtectedRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const verifyTokenAndSetAuth = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setAuthChecked(true); // No token found, auth check completed
        return;
      }
  
      try {
        // Attempt to fetch user details or validate the token
        await axiosInstance.get('/user/details', {
          headers: { Authorization: `Bearer ${token}` },
        });
        // If the above request succeeds, the token is valid
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Error validating token:', error);
        // If an error occurs, assume the token is invalid or expired
        setIsAuthenticated(false);
      }
      setAuthChecked(true); // Auth check completed
    };

    verifyTokenAndSetAuth();
  }, []);

  if (!authChecked) {
    // Authentication check is in progress, show nothing or a loading indicator
    return null; // or <LoadingSpinner />
  }

  if (!isAuthenticated) {
    // User is not authenticated, redirect to login page
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // User is authenticated, render the protected route's children
  return children;
};

export default ProtectedRoute;
