import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { Mail, Lock, User, Eye, EyeOff, CheckCircle2, ShieldCheck } from 'lucide-react';
import toast from 'react-hot-toast';

const Register = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || '/';

  const getPasswordStrength = (pass) => {
    let strength = 0;
    if (pass.length > 5) strength += 1;
    if (pass.length > 8) strength += 1;
    if (/[A-Z]/.test(pass)) strength += 1;
    if (/[0-9]/.test(pass)) strength += 1;
    return strength;
  };

  const strength = getPasswordStrength(password);
  const strengthColors = ['bg-slate-200', 'bg-red-400', 'bg-amber-400', 'bg-emerald-400', 'bg-emerald-600'];
  const strengthLabels = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong'];

  const handleRegister = async (e) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (!termsAccepted) {
      toast.error('You must accept the Terms and Conditions');
      return;
    }

    setLoading(true);

    try {
      // 1. Sign up user
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          }
        }
      });

      if (error) throw error;
      
      toast.success('Account created successfully!');
      navigate(from);
    } catch (error) {
      toast.error(error.message || 'Failed to create account');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-160px)] flex items-center justify-center bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full relative">
        <div className="absolute inset-0 bg-gradient-to-r from-amber-400 to-orange-500 shadow-xl transform skew-y-3 sm:-skew-y-0 sm:rotate-3 sm:rounded-3xl opacity-20 z-0"></div>
        
        <div className="bg-white p-8 rounded-2xl shadow-xl relative z-10 border border-slate-100">
          <div className="text-center mb-10">
            <div className="mx-auto h-16 w-16 bg-amber-50 rounded-full flex items-center justify-center mb-4">
              <ShieldCheck className="h-8 w-8 text-amber-500" />
            </div>
            <h2 className="text-3xl font-extrabold text-slate-800 tracking-tight">Create Account</h2>
            <p className="mt-2 text-slate-500">Join SwiftBus for seamless travel</p>
          </div>

          <form className="space-y-5" onSubmit={handleRegister}>
            {/* Full Name */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-slate-50 focus:bg-white transition-colors"
                  placeholder="John Doe"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-slate-50 focus:bg-white transition-colors"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-10 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-slate-50 focus:bg-white transition-colors"
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
              
              {/* Password Strength Indicator */}
              {password && (
                <div className="mt-2">
                  <div className="flex gap-1 h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                    {[0, 1, 2, 3].map((index) => (
                      <div 
                        key={index} 
                        className={`flex-1 ${index < strength ? strengthColors[strength] : 'bg-transparent'} transition-colors duration-300`}
                      ></div>
                    ))}
                  </div>
                  <p className={`text-xs mt-1 font-medium ${strength > 2 ? 'text-emerald-600' : 'text-slate-500'}`}>
                    {strengthLabels[strength]}
                  </p>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Confirm Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <CheckCircle2 className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-slate-50 focus:bg-white transition-colors"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div className="flex items-start mt-4">
              <div className="flex items-center h-5">
                <input
                  id="terms"
                  type="checkbox"
                  required
                  checked={termsAccepted}
                  onChange={(e) => setTermsAccepted(e.target.checked)}
                  className="w-4 h-4 border border-slate-300 rounded bg-slate-50 focus:ring-3 focus:ring-amber-300 text-amber-500"
                />
              </div>
              <label htmlFor="terms" className="ml-2 text-sm font-medium text-slate-600">
                I agree with the <a href="#" className="text-amber-600 hover:underline">Terms and Conditions</a> and <a href="#" className="text-amber-600 hover:underline">Privacy Policy</a>.
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-6 flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-bold text-white bg-amber-500 hover:bg-amber-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 disabled:opacity-70 transition-colors"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                'Create Account'
              )}
            </button>
          </form>

          <div className="mt-8 text-center text-sm text-slate-500">
            Already have an account?{' '}
            <Link 
              to="/login" 
              state={{ from }}
              className="font-bold text-amber-600 hover:text-amber-700 transition-colors"
            >
              Log in here
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
