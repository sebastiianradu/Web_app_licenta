import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);


  async function verifyTokenWithBackend(token) {
    try {
      const response = await fetch('http://localhost:3001/api/auth/verify-token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
      });
  
      if (!response.ok) {
        throw new Error('Token verification failed');
      }
  
      const userDetails = await response.json();
      return userDetails; // Return the user details on successful verification
    } catch (error) {
      console.error('Error verifying token:', error);
      return null; // Indicate failure
    }
  }


  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      verifyTokenWithBackend(token).then(userDetails => {
        if (userDetails) {
          setCurrentUser(userDetails);
        } else {
          // Token is not valid or did not verify correctly
          localStorage.removeItem('token'); // Consider removing the token if invalid
          setCurrentUser(null);
        }
      });
    }
  }, []);

  const [authToken, setAuthToken] = useState(null);

  const login = (token) => {
    setAuthToken(token);
    localStorage.setItem('token', token); // Store token for session persistence
  };

  const logout = () => {
    setAuthToken(null);
    localStorage.removeItem('token');
  };

  // Function to update currentUser upon login/logout
  const value = {
    currentUser,
    setCurrentUser,
    login,
    logout
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};