import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Leaf, LogOut, Settings, BarChart3 } from 'lucide-react';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="sticky top-4 z-50 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="glass rounded-[2rem] px-6 py-4 flex justify-between items-center transition-all duration-300">
        <div className="flex items-center space-x-3">
          <div className="bg-emerald-500 p-2 rounded-xl shadow-md shadow-emerald-100">
            <Leaf className="h-6 w-6 text-white" />
          </div>
          <span className="text-xl font-bold text-gray-900 tracking-tight">Smart-Stock AI</span>
        </div>
        
        <div className="hidden md:flex items-center space-x-2">
          <Link 
            to="/dashboard" 
            className={`px-5 py-2.5 rounded-xl flex items-center space-x-2 font-medium transition-all duration-200 ${
              isActive('/dashboard') 
                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-200' 
                : 'text-gray-600 hover:bg-white/50'
            }`}
          >
            <BarChart3 className="h-4 w-4" />
            <span>Dashboard</span>
          </Link>
          
          {user.role === 'admin' && (
            <Link 
              to="/admin" 
              className={`px-5 py-2.5 rounded-xl flex items-center space-x-2 font-medium transition-all duration-200 ${
                isActive('/admin') 
                  ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-200' 
                  : 'text-gray-600 hover:bg-white/50'
              }`}
            >
              <Settings className="h-4 w-4" />
              <span>Admin</span>
            </Link>
          )}
        </div>
        
        <div className="flex items-center space-x-4 pl-6 border-l border-gray-200">
          <div className="hidden sm:block text-right">
            <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">Authenticated</p>
            <p className="text-sm font-bold text-gray-900 capitalize">{user.username}</p>
          </div>
          <button 
            onClick={handleLogout}
            className="p-2.5 rounded-xl bg-white/50 text-gray-500 hover:text-red-500 hover:bg-red-50 transition-all duration-200 border border-white/60"
          >
            <LogOut className="h-5 w-5" />
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
