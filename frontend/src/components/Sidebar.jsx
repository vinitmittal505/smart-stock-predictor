import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Leaf, BarChart3, Package, Users, BrainCircuit, LogOut, PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import { useSidebar } from '../hooks/useSidebar';

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const { isCollapsed, toggleSidebar } = useSidebar();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const navItems = [
    { icon: BarChart3, label: 'Overview', path: '/dashboard' },
    { icon: Package, label: 'Inventory', path: '/admin' },
    { icon: Users, label: 'Suppliers', path: '/suppliers' },
    { icon: BrainCircuit, label: 'AI Intelligence', path: '/insights' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <div className={`sidebar-container ${isCollapsed ? 'w-20' : 'w-72'} px-4 py-8 flex flex-col`}>
      <div className="flex items-center justify-between mb-12 px-2">
        <div className="flex items-center space-x-3 cursor-pointer group" onClick={() => navigate('/dashboard')}>
          <div className="bg-black p-2.5 rounded-xl group-hover:bg-emerald-500 transition-colors shrink-0">
            <Leaf className="h-5 w-5 text-white group-hover:text-black transition-colors" />
          </div>
          {!isCollapsed && <span className="text-xl font-black text-black tracking-tighter truncate animate-fade-in">Smart Stock</span>}
        </div>
        <button onClick={toggleSidebar} className="p-2 hover:bg-zinc-100 rounded-xl transition-all">
          {isCollapsed ? <PanelLeftOpen className="h-5 w-5" /> : <PanelLeftClose className="h-5 w-5" />}
        </button>
      </div>

      <nav className="flex-1 space-y-2">
        <p className={`px-4 text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4 ${isCollapsed ? 'text-center' : ''}`}>
          {isCollapsed ? '•' : 'Navigation'}
        </p>
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 border border-transparent ${
                isActive(item.path) 
                  ? 'bg-black text-white font-bold shadow-sm' 
                  : 'text-black hover:bg-emerald-500 hover:text-black hover:border-black'
              } ${isCollapsed ? 'justify-center !px-0' : ''}`}
            >
              <Icon className={`h-5 w-5 shrink-0 ${isActive(item.path) ? 'text-white' : 'text-black'}`} />
              {!isCollapsed && <span className="text-sm font-bold uppercase tracking-widest truncate animate-fade-in">{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto pt-8 border-t border-black">
        <div className={`flex items-center space-x-3 px-2 mb-6 ${isCollapsed ? 'justify-center' : ''}`}>
          <div className="h-10 w-10 rounded-xl bg-black flex items-center justify-center text-white font-black text-sm uppercase shrink-0">
            {user.username?.[0]}
          </div>
          {!isCollapsed && (
            <div className="flex-1 overflow-hidden animate-fade-in">
              <p className="text-sm font-black text-black truncate">{user.username}</p>
              <p className="text-[10px] font-bold text-gray-500 uppercase mt-0.5 truncate">{user.role?.replace('_', ' ')}</p>
            </div>
          )}
        </div>
        <button 
          onClick={handleLogout}
          className={`w-full flex items-center justify-center space-x-2 py-3 rounded-xl bg-white border border-black text-black hover:bg-emerald-500 transition-all font-black text-[10px] uppercase tracking-widest shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-y-0.5 ${isCollapsed ? '!px-0' : ''}`}
        >
          <LogOut className="h-4 w-4 shrink-0" />
          {!isCollapsed && <span>Exit System</span>}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
