import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import { inventoryAPI } from '../services/api';
import { useSearch } from '../hooks/useSearch';
import { useSidebar } from '../hooks/useSidebar';
import { Save, Trash2, Plus, Sliders, X, ShieldCheck } from 'lucide-react';

import LoadingScreen from '../components/LoadingScreen';

const Admin = () => {
  const [items, setItems] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [showAdd, setShowAdd] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [loading, setLoading] = useState(true);
  const { searchTerm } = useSearch() || { searchTerm: '' };
  const { isCollapsed } = useSidebar();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2400)); // Artificial buffer
      const [invRes, supRes] = await Promise.all([
        inventoryAPI.getInventory(),
        inventoryAPI.getSuppliers()
      ]);
      setItems(invRes.data || []);
      setSuppliers(supRes.data || []);
    } catch (err) {}
    setLoading(false);
  };

  const handleUpdate = async (sku, currentStock, supplierLeadTime, price) => {
    try {
      await inventoryAPI.updateItem(sku, { currentStock, supplierLeadTime, price });
      setMessage({ text: `Parameters committed for SKU: ${sku}`, type: 'success' });
      fetchData();
      setTimeout(() => setMessage({ text: '', type: '' }), 3000);
    } catch (err) {
      setMessage({ text: 'Parameter commitment failed', type: 'error' });
    }
  };

  const handleDelete = async (sku) => {
    if (!window.confirm('purging SKU. Proceed?')) return;
    try {
      await inventoryAPI.deleteItem(sku);
      setMessage({ text: `SKU Purged.`, type: 'success' });
      fetchData();
    } catch (err) {}
  };

  const filteredItems = items.filter(item => {
    const s = searchTerm || '';
    return (item.name || '').toLowerCase().includes(s.toLowerCase()) || 
           (item.sku || '').toLowerCase().includes(s.toLowerCase());
  });

  return (
    <div className="app-container">
      <Sidebar />
      <main className={`main-content overflow-y-auto h-screen ${isCollapsed ? 'ml-20' : 'ml-72'}`}>
        <Header title="Control">
          <button 
            onClick={() => setShowAdd(true)}
            className="btn-primary flex items-center space-x-3 !py-3 px-6"
          >
            <Plus className="h-4 w-4" />
            <span>Initialize SKU</span>
          </button>
        </Header>

        {loading && items.length === 0 ? (
          <LoadingScreen />
        ) : (
          <div className="space-y-12 animate-fade-up">
          {message.text && (
            <div className={`p-6 rounded-2xl flex items-center space-x-4 border shadow-xl ${message.type === 'error' ? 'bg-red-50 text-red-600' : 'bg-emerald-50 text-emerald-600'}`}>
              <span className="font-black text-[10px] uppercase tracking-widest">{message.text}</span>
            </div>
          )}

          <div className="bento-card overflow-hidden bg-white">
            <div className="px-10 py-8 border-b border-black flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Sliders className="h-5 w-5 text-black" />
                <h2 className="text-lg font-black text-black tracking-tighter">Inventory Configuration</h2>
              </div>
              <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">{filteredItems.length} ACTIVE</span>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-black">
                    <th className="px-10 py-6 text-[10px] font-black text-black uppercase tracking-widest">Identifier</th>
                    <th className="px-10 py-6 text-[10px] font-black text-black uppercase tracking-widest">Stock Units</th>
                    <th className="px-10 py-6 text-[10px] font-black text-black uppercase tracking-widest">Price (₹)</th>
                    <th className="px-10 py-6 text-[10px] font-black text-black uppercase tracking-widest">Lead Time</th>
                    <th className="px-10 py-6 text-right text-[10px] font-black text-black uppercase tracking-widest">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-black">
                  {filteredItems.map((item) => (
                    <EditableRow key={item.sku} item={item} onSave={handleUpdate} onDelete={handleDelete} />
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          </div>
        )}

        {showAdd && <AddModal suppliers={suppliers} onClose={() => setShowAdd(false)} onSuccess={() => { setShowAdd(false); fetchData(); }} />}
      </main>
    </div>
  );
};

const AddModal = ({ suppliers, onClose, onSuccess }) => {
  const [form, setForm] = useState({ sku: '', name: '', category: '', price: 0, currentStock: 0, minThreshold: 10, supplierId: suppliers[0]?.id || '', supplierLeadTime: 7 });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await inventoryAPI.addItem(form);
      onSuccess();
    } catch (err) {}
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-12">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm animate-in fade-in" onClick={onClose}></div>
      <div className="relative w-full max-w-2xl bg-white border border-black p-12 rounded-2xl shadow-[8px_8px_0px_rgba(0,0,0,1)] animate-in zoom-in-95 duration-200">
        <button onClick={onClose} className="absolute top-10 right-10 p-2 text-black hover:bg-emerald-500 border border-transparent hover:border-black rounded-xl transition-all"><X className="h-6 w-6" /></button>
        <div className="mb-10">
          <h2 className="text-3xl font-black text-black tracking-tighter">Initialize SKU</h2>
          <p className="text-gray-500 text-sm font-black uppercase tracking-widest mt-1">Predictive Supply chain onboarding</p>
        </div>
        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-black uppercase tracking-widest">SKU Identifier</label>
            <input required type="text" className="input-field" value={form.sku} onChange={e => setForm({...form, sku: e.target.value})} />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-black uppercase tracking-widest">Name</label>
            <input required type="text" className="input-field" value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-black uppercase tracking-widest">Price</label>
            <input required type="number" className="input-field" value={form.price} onChange={e => setForm({...form, price: e.target.value})} />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-black uppercase tracking-widest">Stock</label>
            <input required type="number" className="input-field" value={form.currentStock} onChange={e => setForm({...form, currentStock: e.target.value})} />
          </div>
          <button type="submit" className="col-span-2 btn-primary !py-5 mt-4">Create Product SKU</button>
        </form>
      </div>
    </div>
  );
};

const EditableRow = ({ item, onSave, onDelete }) => {
  const [stock, setStock] = useState(item.currentStock);
  const [leadTime, setLeadTime] = useState(item.supplierLeadTime);
  const [price, setPrice] = useState(item.price);

  return (
    <tr className="hover:bg-emerald-500 hover:text-black transition-colors group">
      <td className="px-10 py-7 whitespace-nowrap">
        <div className="text-sm font-black text-black">{item.name}</div>
        <div className="text-[10px] font-black text-gray-500 group-hover:text-black uppercase tracking-tighter">{item.sku}</div>
      </td>
      <td className="px-10 py-7 whitespace-nowrap">
        <input type="number" className="w-24 px-4 py-2.5 bg-white border border-black rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 font-black text-xs" value={stock} onChange={e => setStock(e.target.value)} />
      </td>
      <td className="px-10 py-7 whitespace-nowrap">
        <input type="number" className="w-24 px-4 py-2.5 bg-white border border-black rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 font-black text-xs" value={price} onChange={e => setPrice(e.target.value)} />
      </td>
      <td className="px-10 py-7 whitespace-nowrap">
        <input type="number" className="w-24 px-4 py-2.5 bg-white border border-black rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 font-black text-xs" value={leadTime} onChange={e => setLeadTime(e.target.value)} />
      </td>
      <td className="px-10 py-7 whitespace-nowrap text-right space-x-3">
        <button onClick={() => onDelete(item.sku)} className="p-2 text-black bg-white border border-black hover:bg-red-500 hover:text-white rounded-lg shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-y-0.5 transition-all"><Trash2 className="h-4 w-4" /></button>
        <button onClick={() => onSave(item.sku, stock, leadTime, price)} className="btn-primary !py-2.5 !px-5 !text-[9px]">Commit</button>
      </td>
    </tr>
  );
};

export default Admin;
