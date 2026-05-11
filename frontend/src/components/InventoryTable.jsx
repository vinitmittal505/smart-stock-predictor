import React from 'react';
import { ArrowUpRight } from 'lucide-react';

const InventoryTable = ({ items }) => {
  const getStatusBadge = (status) => {
    switch (status) {
      case 'Critical': return <span className="status-critical">Critical</span>;
      case 'Low': return <span className="status-low">Low Risk</span>;
      default: return <span className="status-healthy">Healthy</span>;
    }
  };

  const getStockProgress = (stock) => {
    const max = 200; 
    const percentage = Math.min((stock / max) * 100, 100);
    let color = 'bg-black';
    if (percentage < 15) color = 'bg-red-600';
    else if (percentage < 30) color = 'bg-emerald-500';

    return (
      <div className="w-24 h-1 bg-gray-100 rounded-full overflow-hidden border border-black/5">
        <div className={`h-full ${color} transition-all duration-1000`} style={{ width: `${percentage}%` }}></div>
      </div>
    );
  };

  return (
    <div className="bento-card bg-white overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-black bg-white">
              <th className="px-8 py-6 text-[10px] font-black text-black uppercase tracking-widest">Product</th>
              <th className="px-8 py-6 text-[10px] font-black text-black uppercase tracking-widest">Category</th>
              <th className="px-8 py-6 text-[10px] font-black text-black uppercase tracking-widest">In Stock</th>
              <th className="px-8 py-6 text-[10px] font-black text-black uppercase tracking-widest">Run Rate</th>
              <th className="px-8 py-6 text-[10px] font-black text-black uppercase tracking-widest">Depletion</th>
              <th className="px-8 py-6 text-[10px] font-black text-black uppercase tracking-widest text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {items.map((item) => (
              <tr key={item.sku} className="hover:bg-emerald-500 hover:text-black transition-all duration-200 group cursor-default">
                <td className="px-8 py-6 whitespace-nowrap">
                  <div className="flex items-center space-x-4">
                    <div className="w-8 h-8 rounded-lg bg-black text-white flex items-center justify-center group-hover:bg-white group-hover:text-black shadow-[2px_2px_0px_rgba(0,0,0,1)] group-hover:shadow-none transition-all">
                      <ArrowUpRight className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="text-sm font-black text-black leading-none">{item.name}</div>
                      <div className="text-[10px] font-black text-gray-500 group-hover:text-black uppercase tracking-tighter mt-1">{item.sku}</div>
                    </div>
                  </div>
                </td>
                <td className="px-8 py-6 whitespace-nowrap">
                  <span className="text-[9px] font-black text-black bg-white border border-black px-2.5 py-1 rounded-lg uppercase tracking-tight group-hover:bg-black group-hover:text-white transition-colors">
                    {item.category}
                  </span>
                </td>
                <td className="px-8 py-6 whitespace-nowrap">
                  <div className="flex items-center space-x-3">
                    <span className="text-sm font-black text-black group-hover:text-black">{item.currentStock}</span>
                    {getStockProgress(item.currentStock)}
                  </div>
                </td>
                <td className="px-8 py-6 whitespace-nowrap">
                  <div className="text-sm font-black text-black">+{item.calculatedRunRate}</div>
                  <div className="text-[9px] font-black text-gray-500 group-hover:text-black uppercase">per day</div>
                </td>
                <td className="px-8 py-6 whitespace-nowrap">
                  <div className="text-sm font-black text-black tracking-tight">
                    {item.stockoutDate ? new Date(item.stockoutDate).toLocaleDateString('en-GB').replace(/\//g, '-') : 'Stable'}
                  </div>
                  <div className="text-[9px] font-black text-gray-500 group-hover:text-black uppercase tracking-widest">DD-MM-YYYY</div>
                </td>
                <td className="px-8 py-6 whitespace-nowrap text-right">
                  <div className="group-hover:scale-110 transition-transform origin-right">
                    {getStatusBadge(item.status)}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default InventoryTable;
