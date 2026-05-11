import React from 'react';
import { 
  AreaChart, Area, LineChart, Line, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, ReferenceLine 
} from 'recharts';

const StockChart = ({ items }) => {
  const barData = items.map(item => ({
    name: item.name,
    stock: item.currentStock,
    velocity: item.calculatedRunRate,
    threshold: item.minThreshold
  }));

  const historicalData = [
    { name: '08-05-2026', SKU001: 180, SKU002: 60, SKU003: 20, SKU004: 35, SKU005: 15, SKU006: 80 },
    { name: '09-05-2026', SKU001: 170, SKU002: 55, SKU003: 18, SKU004: 30, SKU005: 12, SKU006: 75 },
    { name: '10-05-2026', SKU001: 165, SKU002: 50, SKU003: 15, SKU004: 28, SKU005: 10, SKU006: 70 },
    { name: '11-05-2026', SKU001: 150, SKU002: 45, SKU003: 12, SKU004: 25, SKU005: 8, SKU006: 60 },
  ];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 border border-zinc-200 shadow-2xl rounded-2xl animate-fade-up">
          <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-3">{label}</p>
          <div className="space-y-2">
            {payload.map((entry, index) => (
              <div key={index} className="flex items-center justify-between space-x-8">
                <div className="flex items-center space-x-2">
                  <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: entry.color || entry.fill }}></div>
                  <span className="text-[11px] font-bold text-zinc-500">{entry.name}:</span>
                </div>
                <span className="text-sm font-black text-zinc-900">{entry.value} <span className="text-[8px] font-normal text-zinc-400">UNITS</span></span>
              </div>
            ))}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <>
      {/* Demand Analysis - Advanced Area Chart */}
      <div className="bento-card p-10 flex flex-col h-full bg-white relative overflow-hidden group">
        <div className="mb-10 flex justify-between items-start">
          <div>
            <h3 className="text-xl font-black tracking-tighter text-zinc-900 group-hover:text-emerald-600 transition-colors">Demand Dynamics</h3>
            <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mt-1">Real-time Stock vs Daily Velocity</p>
          </div>
          <div className="flex items-center space-x-6">
            <LegendItem color="#10b981" label="Available" />
            <LegendItem color="#18181b" label="Velocity" />
          </div>
        </div>
        
        <div className="flex-1 min-h-[350px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={barData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="gradientStock" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.15}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="gradientVelocity" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#18181b" stopOpacity={0.1}/>
                  <stop offset="95%" stopColor="#18181b" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
              <XAxis dataKey="name" hide />
              <YAxis stroke="#e2e2e7" fontSize={10} fontWeight={900} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#000', strokeWidth: 1, strokeDasharray: '4 4' }} />
              <Area 
                type="monotone" 
                dataKey="stock" 
                name="Stock" 
                stroke="#10b981" 
                strokeWidth={4}
                fill="url(#gradientStock)"
                activeDot={{ r: 8, strokeWidth: 0, fill: '#10b981' }}
              />
              <Area 
                type="monotone" 
                dataKey="velocity" 
                name="Velocity" 
                stroke="#18181b" 
                strokeWidth={4}
                fill="url(#gradientVelocity)"
                activeDot={{ r: 8, strokeWidth: 0, fill: '#18181b' }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Trend History - Advanced Line Chart */}
      <div className="bento-card p-10 flex flex-col h-full bg-white relative overflow-hidden group">
        <div className="mb-10 flex justify-between items-start">
          <div>
            <h3 className="text-xl font-black tracking-tighter text-zinc-900 group-hover:text-zinc-600 transition-colors">Historical Drift</h3>
            <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mt-1">5-Day Multi-SKU Consumption</p>
          </div>
        </div>
        
        <div className="flex-1 min-h-[350px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={historicalData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
              <XAxis dataKey="name" stroke="#e2e2e7" fontSize={10} fontWeight={900} axisLine={false} tickLine={false} dy={15} />
              <YAxis stroke="#e2e2e7" fontSize={10} fontWeight={900} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#000', strokeWidth: 1, strokeDasharray: '4 4' }} />
              <Line 
                type="monotone" 
                dataKey="SKU001" 
                name="Mouse" 
                stroke="#18181b" 
                strokeWidth={5} 
                dot={{ r: 4, strokeWidth: 2, fill: '#fff' }} 
                activeDot={{ r: 9, strokeWidth: 0, fill: '#18181b' }}
                animationDuration={1500}
              />
              <Line 
                type="monotone" 
                dataKey="SKU002" 
                name="Keyboard" 
                stroke="#10b981" 
                strokeWidth={5} 
                dot={{ r: 4, strokeWidth: 2, fill: '#fff' }} 
                activeDot={{ r: 9, strokeWidth: 0, fill: '#10b981' }}
                animationDuration={1500}
                animationBegin={300}
              />
              <Line 
                type="monotone" 
                dataKey="SKU006" 
                name="Webcam" 
                stroke="#fbbf24" 
                strokeWidth={5} 
                dot={{ r: 4, strokeWidth: 2, fill: '#fff' }} 
                activeDot={{ r: 9, strokeWidth: 0, fill: '#fbbf24' }}
                animationDuration={1500}
                animationBegin={600}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </>
  );
};

const LegendItem = ({ color, label }) => (
  <div className="flex items-center space-x-2">
    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color }}></div>
    <span className="text-[10px] font-black uppercase text-zinc-400 tracking-tighter">{label}</span>
  </div>
);

export default StockChart;
