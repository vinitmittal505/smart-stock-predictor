import React, { useState, useEffect, useRef } from 'react';
import { Search, Bell, Calendar, X } from 'lucide-react';
import { inventoryAPI } from '../services/api';
import { useSearch } from '../hooks/useSearch';

const Header = ({ title, children }) => {
  const [alerts, setAlerts] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const { searchTerm, setSearchTerm } = useSearch() || { searchTerm: '', setSearchTerm: () => {} };
  const dropdownRef = useRef(null);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await inventoryAPI.getInventory();
        if (res.data) setAlerts(res.data.filter(i => i.status !== 'Healthy'));
      } catch (err) {}
    };
    fetch();
    const interval = setInterval(fetch, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="flex justify-between items-center mb-10 relative">
      <div className="flex items-center space-x-6">
        <h1 className="text-3xl font-black tracking-tighter text-black">{title}</h1>
        <div className="h-6 w-px bg-black"></div>
        <div className="flex items-center space-x-2 text-black font-black text-[10px] uppercase tracking-widest">
          <Calendar className="h-4 w-4" />
          <span>{new Date().toLocaleDateString('en-GB').replace(/\//g, '-')}</span>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        {children}
        <div className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-black group-focus-within:text-emerald-500 transition-colors" />
          <input 
            type="text" 
            placeholder="Global SKU Search..."
            className="input-field !pl-12 !pr-4 !py-3 w-48 lg:w-64"
            value={searchTerm || ''}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="relative" ref={dropdownRef}>
          <button 
            onClick={() => setShowDropdown(!showDropdown)}
            className={`p-2.5 rounded-xl border transition-all duration-200 relative shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-y-0.5 flex items-center justify-center ${
              showDropdown 
                ? 'bg-black text-white border-black' 
                : alerts.length > 0 
                  ? 'bg-white text-black border-black hover:bg-emerald-500 hover:text-black' 
                  : 'bg-white text-black border-black hover:bg-emerald-500'
            }`}
          >
            <Bell className={`h-5 w-5 ${showDropdown ? 'scale-110' : ''}`} />
            {alerts.length > 0 && (
              <span className={`absolute -top-1 -right-1 w-4 h-4 text-[9px] font-black rounded-full flex items-center justify-center border-2 border-white shadow-sm ${
                showDropdown ? 'bg-red-500 text-white animate-none' : 'bg-red-500 text-white animate-bounce'
              }`}>
                {alerts.length}
              </span>
            )}
          </button>
          
          {showDropdown && (
            <div className="absolute right-0 mt-4 w-80 bg-white border-2 border-black shadow-[8px_8px_0px_rgba(0,0,0,1)] p-6 rounded-2xl z-[100] animate-fade-up">
              <div className="flex justify-between items-center mb-6">
                <p className="text-[11px] font-black text-black uppercase tracking-widest">Risk Notifications</p>
                <button onClick={() => setShowDropdown(false)} className="p-1 hover:bg-emerald-500 rounded-lg transition-colors text-black">
                  <X className="h-4 w-4" />
                </button>
              </div>
              
              <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
                {alerts.length === 0 ? (
                  <p className="text-sm font-black text-gray-500 text-center py-8">All systems optimal.</p>
                ) : (
                  alerts.map(a => (
                    <div key={a.sku} className="flex items-center justify-between p-3.5 bg-white rounded-xl border border-black hover:bg-emerald-500 transition-all cursor-pointer group shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-y-0.5">
                      <div>
                        <p className="text-sm font-black text-black transition-colors">{a.name}</p>
                        <p className="text-[11px] font-bold text-gray-600">{a.sku}</p>
                      </div>
                      <span className={a.status === 'Critical' ? 'status-critical' : 'status-low'}>{a.status}</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
