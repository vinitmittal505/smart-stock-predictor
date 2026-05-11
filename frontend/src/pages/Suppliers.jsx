import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import { inventoryAPI } from '../services/api';
import { useSearch } from '../hooks/useSearch';
import { useSidebar } from '../hooks/useSidebar';
import { Mail, Building2, ExternalLink, Phone } from 'lucide-react';
import LoadingScreen from '../components/LoadingScreen';

const Suppliers = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { searchTerm } = useSearch();
  const { isCollapsed } = useSidebar();

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        await new Promise(resolve => setTimeout(resolve, 2400)); // Artificial buffer
        const res = await inventoryAPI.getSuppliers();
        setSuppliers(res.data);
      } catch (err) {}
      setLoading(false);
    };
    fetch();
  }, []);

  const filteredSuppliers = suppliers.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    s.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="app-container">
      <Sidebar />
      <main className={`main-content overflow-y-auto h-screen ${isCollapsed ? 'ml-20' : 'ml-72'}`}>
        <Header title="Suppliers" />
        
        {loading && suppliers.length === 0 ? (
          <LoadingScreen />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 animate-fade-up pb-12">
            {filteredSuppliers.map(s => (
              <div key={s.id} className="bento-card p-10 flex flex-col group bg-white hover:bg-emerald-500 transition-colors">
                <div className="flex justify-between items-start mb-10">
                  <div className="w-14 h-14 rounded-2xl bg-black text-white flex items-center justify-center shadow-[4px_4px_0px_rgba(0,0,0,1)] group-hover:shadow-none group-hover:translate-x-1 group-hover:translate-y-1 transition-all">
                    <Building2 className="h-6 w-6" />
                  </div>
                  <span className="text-[10px] font-black text-gray-500 group-hover:text-black uppercase tracking-widest">{s.id}</span>
                </div>
                
                <div className="mb-8">
                  <h3 className="text-2xl font-black text-black tracking-tighter mb-2">{s.name}</h3>
                  <span className="text-[10px] font-black text-black bg-white border border-black shadow-[2px_2px_0px_rgba(0,0,0,1)] px-3 py-1 rounded-lg uppercase tracking-widest inline-block">
                    {s.category}
                  </span>
                </div>

                <div className="space-y-5 pt-8 border-t border-black flex-1">
                  <div className="flex items-center space-x-3 text-black">
                    <Mail className="h-4 w-4" />
                    <span className="text-sm font-black tracking-tight">{s.contact}</span>
                  </div>
                  <div className="flex items-center space-x-3 text-gray-700 group-hover:text-black font-bold">
                    <Phone className="h-4 w-4" />
                    <span className="text-xs font-black">+1 (555) 000-0000</span>
                  </div>
                </div>

                <button className="w-full mt-10 flex items-center justify-center space-x-2 py-4 rounded-xl bg-white border border-black text-black font-black text-[10px] uppercase tracking-[0.2em] shadow-[4px_4px_0px_rgba(0,0,0,1)] group-hover:shadow-none group-hover:translate-y-1 transition-all">
                  <span>Partner Portal</span>
                  <ExternalLink className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        )}
        
        {filteredSuppliers.length === 0 && !loading && (
          <div className="text-center py-40">
            <p className="text-gray-500 font-black uppercase tracking-widest text-sm">No suppliers matching "{searchTerm}"</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default Suppliers;
