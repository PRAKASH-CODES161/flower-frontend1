import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../services/authService';

export default function ForgotPassword() {
  const [step, setStep] = useState(1); // 1: mobile, 2: otp, 3: new password
  const [mobileNumber, setMobileNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await authService.sendOTP(mobileNumber);
      setMessage('OTP sent to your mobile number (check console).');
      setStep(2);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await authService.verifyOTP(mobileNumber, otp);
      // The backend returns a JWT token on successful verification.
      localStorage.setItem('token', res.token); 
      setMessage('OTP verified. You can now change your password.');
      setStep(3);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      return setError('Passwords do not match');
    }
    setError('');
    setLoading(true);
    try {
      // The changePassword endpoint relies on the token we just received
      await authService.changePassword('', newPassword);
      setMessage('Password changed successfully! Redirecting...');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-slate-50">
      <div className="w-full max-w-md p-8 glass-card bg-white rounded-2xl shadow-xl">
        <h2 className="text-2xl font-bold text-center text-slate-800 mb-6">Forgot Password</h2>
        
        {error && <div className="p-3 mb-4 text-sm text-red-600 bg-red-100 rounded-lg">{error}</div>}
        {message && <div className="p-3 mb-4 text-sm text-green-600 bg-green-100 rounded-lg">{message}</div>}

        {step === 1 && (
          <form onSubmit={handleSendOtp} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Mobile Number</label>
              <input
                type="tel"
                required
                value={mobileNumber}
                onChange={(e) => setMobileNumber(e.target.value)}
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-mint-primary outline-none"
                placeholder="Enter registered mobile number"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 bg-mint-primary hover:bg-mint-dark text-white rounded-lg font-medium transition-colors disabled:opacity-50"
            >
              {loading ? 'Sending...' : 'Send OTP'}
            </button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleVerifyOtp} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Enter OTP</label>
              <input
                type="text"
                required
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-mint-primary outline-none"
                placeholder="6-digit OTP"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 bg-mint-primary hover:bg-mint-dark text-white rounded-lg font-medium transition-colors disabled:opacity-50"
            >
              {loading ? 'Verifying...' : 'Verify OTP'}
            </button>
          </form>
        )}

        {step === 3 && (
          <form onSubmit={handleChangePassword} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">New Password</label>
              <input
                type="password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-mint-primary outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Confirm New Password</label>
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-mint-primary outline-none"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 bg-mint-primary hover:bg-mint-dark text-white rounded-lg font-medium transition-colors disabled:opacity-50"
            >
              {loading ? 'Updating...' : 'Change Password'}
            </button>
          </form>
        )}
        
        <div className="mt-6 text-center">
          <button onClick={() => navigate('/login')} className="text-sm text-slate-500 hover:text-mint-primary">
            Back to Login
          </button>
        </div>
      </div>
    </div>
  );
}
