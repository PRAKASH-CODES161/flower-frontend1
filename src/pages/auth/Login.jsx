import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Flower2, Loader2 } from 'lucide-react';

export default function Login() {
  const [mobileNumber, setMobileNumber] = useState('9999999999');
  const [password, setPassword] = useState('password123');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!mobileNumber || !password) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      await login(mobileNumber, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="glass-card w-full max-w-md p-8 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-[-50px] right-[-50px] w-32 h-32 bg-mint-primary/20 rounded-full blur-2xl"></div>
        <div className="absolute bottom-[-50px] left-[-50px] w-32 h-32 bg-mint-light/40 rounded-full blur-2xl"></div>
        
        <div className="relative z-10">
          <div className="flex flex-col items-center mb-8">
            <img src="/floral.jpg" alt="Logo" className="w-20 h-20 object-contain mb-4 rounded-full shadow-lg border-2 border-mint-primary/20 bg-white" />
            <h1 className="text-2xl font-bold text-slate-800">Welcome Back</h1>
            <p className="text-slate-500 text-sm mt-1">Sign in to manage your shop</p>
          </div>

          {error && (
            <div className="bg-red-50/80 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-6 text-sm backdrop-blur-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Mobile Number</label>
              <input
                type="tel"
                value={mobileNumber}
                onChange={(e) => setMobileNumber(e.target.value)}
                className="glass-input"
                placeholder="Enter your mobile number"
              />
            </div>
            
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-sm font-medium text-slate-700">Password</label>
                <Link to="/forgot-password" className="text-xs text-mint-primary hover:text-mint-dark font-medium">
                  Forgot Password?
                </Link>
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="glass-input"
                placeholder="Enter your password"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="glass-button w-full flex items-center justify-center py-2.5 mt-2"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Sign In'}
            </button>
          </form>

          <p className="text-center text-sm text-slate-500 mt-6">
            Don't have an account?{' '}
            <Link to="/register" className="text-mint-primary hover:text-mint-dark font-semibold transition-colors">
              Register here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
