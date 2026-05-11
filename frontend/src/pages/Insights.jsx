import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import { inventoryAPI } from '../services/api';
import { useSearch } from '../hooks/useSearch';
import { useSidebar } from '../hooks/useSidebar';
import { BrainCircuit, Sparkles, ShoppingCart, Loader2, Info, ArrowUpRight } from 'lucide-react';
import LoadingScreen from '../components/LoadingScreen';

const Insights = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { searchTerm } = useSearch();
  const { isCollapsed } = useSidebar();

  const fetchData = async () => {
    setIsRefreshing(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2400));
      const res = await inventoryAPI.getInventory();
      setItems(res.data);
    } catch (err) {}
    setLoading(false);
    setIsRefreshing(false);
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleExecutePO = async (sku) => {
    try {
      setIsRefreshing(true);
      await inventoryAPI.executePO(sku);
      await new Promise(r => setTimeout(r, 1500));
      const res = await inventoryAPI.getInventory();
      setItems(res.data);
    } catch (err) {
      console.error('PO execution failed', err);
    } finally {
      setIsRefreshing(false);
    }
  };

  const filteredItems = items.filter(i => 
    i.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    i.sku.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const criticalInsights = filteredItems.filter(i => i.status === 'Critical' || i.status === 'Low');
  const slowMoving = filteredItems.filter(i => i.isSlowMoving);

  return (
    <div className="app-container">
      <Sidebar />
      <main className={`main-content overflow-y-auto h-screen ${isCollapsed ? 'ml-20' : 'ml-72'}`}>
        <Header title="AI Intelligence" />
        
        {loading && items.length === 0 ? (
          <LoadingScreen />
        ) : (
          <div className="space-y-16 animate-fade-up">
            {/* Section: Priority Actions */}
            <div>
              <div className="flex items-center space-x-3 mb-10 px-2">
                <div className="p-2 bg-black rounded-lg text-white relative">
                  <BrainCircuit className="h-5 w-5" />
                  {isRefreshing && (
                    <span className="absolute top-0 right-0 -mt-1 -mr-1 flex h-2.5 w-2.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-4">
                  <h2 className="text-2xl font-black text-black tracking-tighter uppercase tracking-widest text-sm">Demand Intelligence</h2>
                  {isRefreshing && (
                    <div className="flex items-center space-x-2 bg-emerald-500 px-3 py-1.5 border border-black animate-fade-in shadow-[2px_2px_0px_rgba(0,0,0,1)]">
                      <Loader2 className="h-3 w-3 text-black animate-spin" />
                      <span className="text-[9px] font-black text-black uppercase tracking-widest">AI Generating...</span>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="grid grid-cols-1 gap-8">
                {criticalInsights.length === 0 ? (
                  <div className="bento-card p-12 text-center bg-white border-black">
                    <p className="text-gray-500 font-black uppercase tracking-widest text-xs">No priority actions detected.</p>
                  </div>
                ) : (
                  criticalInsights.map(item => (
                    <div key={item.sku} className="bento-card p-10 flex flex-col md:flex-row md:items-center gap-10 group bg-white hover:bg-emerald-500 transition-colors">
                      <div className={`w-20 h-20 rounded-[2rem] flex items-center justify-center shrink-0 border border-black shadow-[4px_4px_0px_rgba(0,0,0,1)] ${item.status === 'Critical' ? 'bg-red-500 text-black' : 'bg-amber-500 text-black'}`}>
                        <ShoppingCart className="h-8 w-8" />
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex flex-col md:flex-row md:items-center justify-between mb-3 gap-2">
                          <div className="flex items-center space-x-4">
                            <h3 className="text-2xl font-black text-black tracking-tighter">{item.name}</h3>
                            <span className="px-3 py-1 bg-white text-black border border-black text-[9px] font-black uppercase tracking-widest rounded-lg">{item.sku}</span>
                          </div>
                          <div className="flex items-center space-x-1.5 px-2.5 py-1 bg-white rounded-md border border-black shadow-[2px_2px_0px_rgba(0,0,0,1)] w-fit">
                            <Sparkles className="h-3 w-3 text-emerald-600" />
                            <span className="text-[8px] font-black text-black uppercase tracking-widest">AI Generated</span>
                          </div>
                        </div>
                        <p className="text-black font-black text-lg leading-relaxed mb-6 italic">"{item.aiInsight}"</p>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pt-8 border-t border-black">
                          <div>
                            <p className="text-[10px] font-black text-black uppercase tracking-widest mb-1">Stock Position</p>
                            <p className="text-sm font-black text-black">{item.currentStock} Units</p>
                          </div>
                          <div>
                            <p className="text-[10px] font-black text-black uppercase tracking-widest mb-1">Recommended</p>
                            <p className="text-sm font-black text-black">+{item.suggestedReorder} Units</p>
                          </div>
                          <div>
                            <p className="text-[10px] font-black text-black uppercase tracking-widest mb-1">Lead Time</p>
                            <p className="text-sm font-black text-black">{item.supplierLeadTime} Days</p>
                          </div>
                        </div>
                      </div>
                      
                      <button 
                        onClick={() => handleExecutePO(item.sku)}
                        disabled={isRefreshing}
                        className="btn-secondary md:self-end group-hover:bg-white disabled:opacity-50"
                      >
                        <span>{isRefreshing ? 'Processing...' : 'Execute P.O.'}</span>
                        <ArrowUpRight className="h-4 w-4" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Section: Optimization */}
            <div>
              <div className="flex items-center space-x-3 mb-10 px-2">
                <div className="p-2 bg-black rounded-lg text-white">
                  <Sparkles className="h-5 w-5" />
                </div>
                <h2 className="text-2xl font-black text-black tracking-tighter uppercase tracking-widest text-sm">System Optimization</h2>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {slowMoving.length === 0 ? (
                  <div className="col-span-2 bento-card p-12 text-center bg-white border-black">
                    <p className="text-gray-500 font-black uppercase tracking-widest text-xs">No optimization opportunities found.</p>
                  </div>
                ) : (
                  slowMoving.map(item => (
                    <div key={item.sku} className="bento-card p-10 flex flex-col border-l-[12px] border-l-black bg-white hover:bg-emerald-500 transition-colors group">
                      <div className="flex justify-between items-start mb-8 gap-4">
                        <div>
                          <h3 className="text-xl font-black text-black tracking-tighter">{item.name}</h3>
                          <p className="text-[10px] font-black text-gray-600 group-hover:text-black uppercase tracking-widest">{item.sku}</p>
                        </div>
                        <div className="flex items-center space-x-1.5 px-2 py-1 bg-white rounded-md border border-black shadow-[2px_2px_0px_rgba(0,0,0,1)] shrink-0">
                          <Sparkles className="h-3 w-3 text-black" />
                          <span className="text-[8px] font-black text-black uppercase tracking-widest">AI Generated</span>
                        </div>
                      </div>
                      
                      <p className="text-black font-black mb-8 italic">"{item.aiInsight}"</p>
                      
                      <div className="mt-auto p-6 bg-white rounded-2xl border border-black shadow-[4px_4px_0px_rgba(0,0,0,1)] flex justify-between items-center group-hover:shadow-none group-hover:translate-x-1 group-hover:translate-y-1 transition-all">
                        <div>
                          <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest mb-1">Capital Impact</p>
                          <p className="text-lg font-black text-black">₹{(item.currentStock * item.price).toLocaleString('en-IN')}</p>
                        </div>
                        <button className="text-[10px] font-black uppercase tracking-widest text-black hover:underline">
                          Analysis
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Insights;
