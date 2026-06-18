import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../supabaseClient';
import { Bus, Menu, X, User } from 'lucide-react';
import toast from 'react-hot-toast';

const Navbar = () => {
  const { user } = useAuth();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      toast.success('Logged out successfully');
      setIsDropdownOpen(false);
      setIsMobileMenuOpen(false);
    } catch (error) {
      toast.error('Error logging out');
    }
  };

  const isActive = (path) => {
    return location.pathname === path ? "text-primary font-semibold" : "text-slate-600 hover:text-primary transition-colors";
  };

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2">
              <div className="bg-primary text-white p-2 rounded-lg">
                <Bus className="h-6 w-6" />
              </div>
              <span className="font-bold text-xl tracking-tight text-slate-900">SwiftBus</span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className={isActive('/')}>Home</Link>
            
            {user ? (
              <>
                <Link to="/my-tickets" className={isActive('/my-tickets')}>My Tickets</Link>
                {/* Normally hidden for non-admins, but leaving accessible for the assignment */}
                <Link to="/admin" className={isActive('/admin')}>Admin</Link>
                
                <div className="relative">
                  <button 
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 px-4 py-2 rounded-full transition-colors"
                  >
                    <User className="h-4 w-4 text-slate-600" />
                    <span className="text-sm font-medium text-slate-700 max-w-[150px] truncate">
                      {user.email}
                    </span>
                  </button>

                  {isDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white border border-slate-100 rounded-lg shadow-lg py-1 z-50">
                      <Link 
                        to="/my-tickets" 
                        className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        My Bookings
                      </Link>
                      <button 
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                      >
                        Log out
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                <Link to="/login" className="text-slate-600 hover:text-primary font-medium transition-colors">
                  Log in
                </Link>
                <Link to="/register" className="bg-primary hover:bg-blue-700 text-white px-5 py-2 rounded-lg font-medium transition-colors shadow-sm shadow-blue-200">
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-slate-600 hover:text-primary"
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-slate-100 px-2 pt-2 pb-3 space-y-1 sm:px-3 shadow-lg">
          <Link 
            to="/" 
            className={`block px-3 py-2 rounded-md ${location.pathname === '/' ? 'bg-blue-50 text-primary font-medium' : 'text-slate-600'}`}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Home
          </Link>
          
          {user ? (
            <>
              <Link 
                to="/my-tickets" 
                className={`block px-3 py-2 rounded-md ${location.pathname === '/my-tickets' ? 'bg-blue-50 text-primary font-medium' : 'text-slate-600'}`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                My Tickets
              </Link>
              <Link 
                to="/admin" 
                className={`block px-3 py-2 rounded-md ${location.pathname === '/admin' ? 'bg-blue-50 text-primary font-medium' : 'text-slate-600'}`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Admin Panel
              </Link>
              <div className="px-3 py-3 border-t border-slate-100 mt-2">
                <div className="text-sm font-medium text-slate-500 mb-2">Signed in as {user.email}</div>
                <button 
                  onClick={handleLogout}
                  className="block w-full text-left py-2 text-red-600 font-medium"
                >
                  Log out
                </button>
              </div>
            </>
          ) : (
            <div className="mt-4 pt-4 border-t border-slate-100 flex flex-col gap-2 p-3">
              <Link 
                to="/login" 
                className="w-full text-center py-2 border border-slate-200 rounded-lg text-slate-700 font-medium"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Log in
              </Link>
              <Link 
                to="/register" 
                className="w-full text-center py-2 bg-primary text-white rounded-lg font-medium"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Register
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
