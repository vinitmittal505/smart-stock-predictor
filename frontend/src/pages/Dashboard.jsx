import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import InventoryTable from '../components/InventoryTable';
import StockChart from '../components/StockChart';
import { inventoryAPI } from '../services/api';
import { useSearch } from '../hooks/useSearch';
import { useSidebar } from '../hooks/useSidebar';
import { 
  Loader2, RefreshCw, TrendingDown, 
  BrainCircuit, IndianRupee, Download, FileText, Search, Sparkles
} from 'lucide-react';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

import LoadingScreen from '../components/LoadingScreen';

const Dashboard = () => {
  const [items, setItems] = useState([]);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showLogs, setShowLogs] = useState(false);
  const { searchTerm } = useSearch() || { searchTerm: '' };
  const { isCollapsed } = useSidebar();
  const [categoryFilter, setCategoryFilter] = useState('All');

  const fetchData = async () => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2400)); // Artificial buffer
      const [invRes, logRes] = await Promise.all([
        inventoryAPI.getInventory(),
        inventoryAPI.getLogs()
      ]);
      setItems(invRes.data || []);
      setLogs(logRes.data || []);
    } catch (err) {
      console.error('Fetch error:', err);
    }
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const totalRevenue = items.reduce((acc, item) => acc + ((item.currentStock || 0) * (item.price || 0)), 0);
  const topSellers = [...items].sort((a, b) => (b.calculatedRunRate || 0) - (a.calculatedRunRate || 0)).slice(0, 3);
  const alerts = items.filter(i => i.status === 'Critical').length;

  const filteredItems = items.filter(item => {
    const s = searchTerm || '';
    const matchesSearch = (item.name || '').toLowerCase().includes(s.toLowerCase()) || 
                          (item.sku || '').toLowerCase().includes(s.toLowerCase());
    const matchesCategory = categoryFilter === 'All' || item.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const categories = ['All', ...new Set(items.map(item => item.category).filter(Boolean))];

  const exportCSV = () => {
    try {
      const headers = ['SKU', 'Name', 'Category', 'Stock', 'Run Rate', 'Status'];
      const rows = filteredItems.map(i => [i.sku, i.name, i.category, i.currentStock, i.calculatedRunRate, i.status]);
      const csv = [headers, ...rows].map(r => r.join(',')).join('\n');
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `inventory-report-${new Date().toLocaleDateString('en-GB').replace(/\//g, '-')}.csv`;
      a.click();
    } catch (e) {
      console.error('CSV Export failed', e);
    }
  };

  const exportPDF = () => {
    try {
      const doc = new jsPDF();
      doc.text('Smart Stock AI - Inventory Intelligence Report', 14, 15);
      doc.autoTable({
        startY: 25,
        head: [['SKU', 'Product', 'Category', 'Stock', 'Velocity', 'Status']],
        body: filteredItems.map(i => [i.sku, i.name, i.category, i.currentStock, i.calculatedRunRate, i.status]),
        theme: 'grid',
        headStyles: { fillStyle: '#10b981' }
      });
      doc.save(`inventory-intel-${new Date().toLocaleDateString('en-GB').replace(/\//g, '-')}.pdf`);
    } catch (e) {
      console.error('PDF Export failed', e);
    }
  };

  return (
    <div className="app-container">
      <Sidebar />
      <main className={`main-content overflow-y-auto h-screen ${isCollapsed ? 'ml-20' : 'ml-72'}`}>
        <Header title="Overview" />

        {loading && items.length === 0 ? (
          <LoadingScreen />
        ) : (
          <div className="grid grid-cols-12 auto-rows-min gap-8 animate-fade-up pb-12">
            
            <div className="col-span-12 lg:col-span-4">
              <StatCard label="Total Revenue" value={`₹${(totalRevenue/1000).toFixed(1)}k`} desc="Net Stock Valuation" icon={<IndianRupee className="h-5 w-5 text-black" />} color="black" />
            </div>
            <div className="col-span-12 lg:col-span-4">
              <StatCard label="Critical Alerts" value={alerts} desc="Action Required" icon={<TrendingDown className="h-5 w-5 text-red-600" />} color="red" />
            </div>
            <div className="col-span-12 lg:col-span-4">
              <div className="bento-card p-8 h-full flex flex-col justify-center">
                <div className="flex items-center justify-between mb-5">
                   <button onClick={() => setShowLogs(!showLogs)} className="btn-secondary px-5 py-2.5">
                    {showLogs ? 'Hide Audit Trail' : 'View Audit Trail'}
                  </button>
                  <button onClick={fetchData} className="p-2.5 rounded-xl bg-white border border-black hover:bg-emerald-500 transition-all text-black"><RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} /></button>
                </div>
                <div className="flex items-center justify-between mt-auto">
                  <span className="text-[11px] font-black text-black uppercase tracking-wider">Neural Engine</span>
                  <div className="flex items-center space-x-2"><div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div><span className="text-[10px] font-black text-emerald-600 uppercase tracking-wide">Sync active</span></div>
                </div>
              </div>
            </div>

            {showLogs ? (
              <div className="col-span-12 bento-card p-10">
                <h2 className="text-xl font-black text-black mb-8 tracking-tighter">System Activity</h2>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <tbody className="divide-y divide-gray-200">
                      {logs.map((log) => (
                        <tr key={log.id} className="hover:bg-emerald-500 hover:text-black transition-colors group">
                          <td className="py-5 text-xs font-black text-gray-500 group-hover:text-black font-mono w-48">
                            {new Date(log.timestamp).toLocaleDateString('en-GB').replace(/\//g, '-')} {new Date(log.timestamp).toLocaleTimeString('en-GB')}
                          </td>
                          <td className="py-5"><span className="text-[10px] font-black text-white bg-black group-hover:bg-white group-hover:text-black px-3 py-1 rounded-lg uppercase tracking-wide">{log.user}</span></td>
                          <td className="py-5 text-sm font-black text-black px-6">{log.action}</td>
                          <td className="py-5 text-sm text-gray-500 group-hover:text-black italic truncate max-w-md">{log.details}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <>
                <div className="col-span-12 xl:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                  <StockChart items={items} />
                </div>
                
                <div className="col-span-12 xl:col-span-4 bento-card p-8 flex flex-col">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-[10px] font-black text-black uppercase tracking-widest">Velocity Leaders</h3>
                    <div className="flex space-x-2">
                      <button onClick={exportCSV} className="p-2 rounded-lg bg-white border border-black text-black hover:bg-emerald-500 transition-all"><Download className="h-4 w-4" /></button>
                      <button onClick={exportPDF} className="p-2 rounded-lg bg-white border border-black text-black hover:bg-emerald-500 transition-all"><FileText className="h-4 w-4" /></button>
                    </div>
                  </div>
                  <div className="space-y-4 flex-1">
                    {topSellers.map((item, idx) => (
                      <div key={item.sku} className="flex items-center justify-between p-4 bg-white border border-black hover:bg-emerald-500 rounded-xl transition-all group">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 rounded-lg bg-black text-white group-hover:bg-white group-hover:text-black flex items-center justify-center text-xs font-black shadow-[2px_2px_0px_rgba(0,0,0,1)] group-hover:shadow-none transition-all">0{idx+1}</div>
                          <div>
                            <p className="text-sm font-black text-black leading-tight">{item.name}</p>
                            <p className="text-[10px] font-black text-gray-500 group-hover:text-black">{item.sku}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-black text-black group-hover:text-black">+{item.calculatedRunRate}</p>
                          <p className="text-[10px] font-black text-gray-500 group-hover:text-black">units/day</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-8 p-6 rounded-2xl bg-black text-white relative overflow-hidden">
                    <BrainCircuit className="absolute top-0 right-0 p-4 opacity-10 h-24 w-24 text-white" />
                    <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-2 flex items-center"><Sparkles className="h-3 w-3 mr-1"/> AI Demand Insight</p>
                    <p className="text-sm font-bold leading-relaxed">Inventory velocity is high for computing accessories. Recommend replenishment soon.</p>
                  </div>
                </div>

                <div className="col-span-12 mt-4 space-y-6">
                  <div className="flex flex-col md:flex-row items-start md:items-center justify-between px-2 gap-4">
                    <div>
                      <h2 className="text-2xl font-black text-black tracking-tighter leading-none">Catalog Intelligence</h2>
                      <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mt-2">Real-time unit tracking & velocity</p>
                    </div>
                    <div className="flex items-center gap-4 w-full md:w-auto">
                      <div className="relative group flex-1 md:w-64">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-black group-focus-within:text-emerald-500 transition-colors" />
                        <input type="text" placeholder="Search Catalog..." className="input-field !pl-12 !py-3" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
                      </div>
                      <select className="input-field appearance-none cursor-pointer w-auto !py-3" value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)}>
                        {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                      </select>
                    </div>
                  </div>
                  <InventoryTable items={filteredItems} />
                </div>
              </>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

const StatCard = ({ label, value, desc, icon, color }) => {
  return (
    <div className="bento-card p-8 h-full flex flex-col justify-between group relative overflow-hidden bg-white">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2">{label}</p>
          <span className={`text-4xl font-black tracking-tighter ${color === 'red' ? 'text-red-600' : 'text-black'}`}>{value}</span>
        </div>
        <div className={`p-3.5 rounded-2xl border border-black shadow-[4px_4px_0px_rgba(0,0,0,1)] group-hover:translate-x-1 group-hover:translate-y-1 group-hover:shadow-none transition-all duration-200 ${color === 'red' ? 'bg-red-50' : 'bg-white'}`}>{icon}</div>
      </div>
      <p className="text-[10px] font-black text-black uppercase tracking-widest mt-8 flex items-center">
        <span className={`w-2 h-2 rounded-full mr-2 border border-black ${color === 'red' ? 'bg-red-500' : 'bg-emerald-500'}`}></span>
        {desc}
      </p>
    </div>
  );
};

export default Dashboard;
