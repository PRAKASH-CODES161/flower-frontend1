import React, { createContext, useState, useContext, useEffect } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
    }
    setLoading(false);
  }, []);

  const login = async (mobileNumber, password) => {
    const response = await authService.login(mobileNumber, password);
    localStorage.setItem('token', response.token);
    // response itself contains the user info (_id, name, mobileNumber)
    const userData = { _id: response._id, name: response.name, mobileNumber: response.mobileNumber };
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
    return userData;
  };

  const register = async (mobileNumber, password, name, shopName) => {
    const response = await authService.register(mobileNumber, password, name, shopName);
    localStorage.setItem('token', response.token);
    const userData = { _id: response._id, name: response.name, mobileNumber: response.mobileNumber };
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
    return userData;
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
