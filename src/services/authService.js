import api from './api';

export const authService = {
  login: async (mobileNumber, password) => {
    try {
      const response = await api.post('/auth/login', { mobileNumber, password });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Login failed');
    }
  },

  register: async (mobileNumber, password, name, shopName) => {
    try {
      const response = await api.post('/auth/register', { mobileNumber, password, name, shopName });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Registration failed');
    }
  },

  sendOTP: async (mobileNumber) => {
    try {
      const response = await api.post('/auth/send-otp', { mobileNumber });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to send OTP');
    }
  },

  verifyOTP: async (mobileNumber, otp) => {
    try {
      const response = await api.post('/auth/verify-otp', { mobileNumber, otp });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'OTP verification failed');
    }
  },

  changePassword: async (oldPassword, newPassword) => {
    try {
      const response = await api.post('/auth/change-password', { oldPassword, newPassword });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to change password');
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getCurrentUser: () => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        return JSON.parse(userStr);
      } catch (e) {
        return null;
      }
    }
    return null;
  }
};
