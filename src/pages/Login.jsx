import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { Mail, Lock, Eye, EyeOff, Bus } from 'lucide-react';
import toast from 'react-hot-toast';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || '/';

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      
      toast.success('Logged in successfully!');
      navigate(from);
    } catch (error) {
      toast.error(error.message || 'Failed to login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-160px)] flex items-center justify-center bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full relative">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-indigo-500 shadow-xl transform -skew-y-3 sm:skew-y-0 sm:-rotate-3 sm:rounded-3xl opacity-20 z-0"></div>
        
        <div className="bg-white p-8 rounded-2xl shadow-xl relative z-10 border border-slate-100">
          <div className="text-center mb-10">
            <div className="mx-auto h-16 w-16 bg-blue-50 rounded-full flex items-center justify-center mb-4">
              <Bus className="h-8 w-8 text-primary" />
            </div>
            <h2 className="text-3xl font-extrabold text-slate-800 tracking-tight">Welcome Back</h2>
            <p className="mt-2 text-slate-500">Sign in to manage your bookings</p>
          </div>

          <form className="space-y-6" onSubmit={handleLogin}>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary bg-slate-50 focus:bg-white transition-colors"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-10 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary bg-slate-50 focus:bg-white transition-colors"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-slate-400 hover:text-slate-600 transition-colors" />
                  ) : (
                    <Eye className="h-5 w-5 text-slate-400 hover:text-slate-600 transition-colors" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-primary focus:ring-primary border-slate-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-slate-600">
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <a href="#" className="font-medium text-primary hover:text-blue-500">
                  Forgot password?
                </a>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-bold text-white bg-primary hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-70 transition-colors"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          <div className="mt-8 text-center text-sm text-slate-500">
            Don't have an account?{' '}
            <Link 
              to="/register" 
              state={{ from }}
              className="font-bold text-primary hover:text-blue-500 transition-colors"
            >
              Create an account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
