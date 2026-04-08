import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/axios';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { 
  AlertCircle, 
  Activity,
  PlusCircle, 
  Store, 
  ArrowRight,
  Truck,
  Zap,
  Bird,
  Layers,
  TrendingUp,
  Search,
  Bell,
  Star,
  Monitor,
  ShieldCheck,
  Cpu,
  Globe,
  Waves,
  Package
} from 'lucide-react';
import { POULTRY_IMAGES, getConsistentImage } from '../utils/imageConstants';

export default function DashboardOverview() {
  const [logs, setLogs] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [farms, setFarms] = useState([]);
  const [supplies, setSupplies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [resAlerts, resFarms, resLogs, resSupplies] = await Promise.all([
          api.get('/ai/alerts'),
          api.get('/farms'),
          api.get('/logs'),
          api.get('/supplies/my-orders')
        ]);
        
        setAlerts(resAlerts.data.alerts || []);
        setFarms(Array.isArray(resFarms.data) ? resFarms.data : []);
        const logData = Array.isArray(resLogs.data) ? resLogs.data : [];
        setLogs([...logData].reverse()); 
        setSupplies(Array.isArray(resSupplies.data) ? resSupplies.data : []);
      } catch (err) {
        console.error('Failed to fetch dashboard data', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const totalChickens = Array.isArray(farms) ? farms.reduce((acc, f) => acc + (f.totalChickens || 0), 0) : 0;
  const todaysEggs = (Array.isArray(logs) && logs.length > 0) ? logs[logs.length - 1].totalEggs : 0;

  const chartData = (Array.isArray(logs) ? logs : []).slice(-14).map(log => ({
    date: new Date(log.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
    eggs: log.totalEggs || 0,
    temp: log.temperature || 0
  }));

  const activeOrdersCount = supplies.filter(s => s.status !== 'Delivered').length;

  if (loading) return (
     <div className="flex flex-col items-center justify-center py-40 animate-pulse italic text-slate-300 font-bold uppercase tracking-wider">
       Opening your Farm Dashboard...
     </div>
  );

  return (
    <div className="space-y-12 pb-20">
      
      {/* Friendly Header Section */}
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-end gap-8 bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-soft">
        <div className="space-y-4">
           <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-emerald-50 rounded-full border border-emerald-100">
              <span className="text-[11px] font-bold uppercase tracking-widest text-emerald-600">Active Status</span>
           </div>
           <div className="space-y-1">
              <h1 className="text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
                My Farm <span className="text-emerald-600">Today</span>
              </h1>
              <p className="text-slate-500 font-medium text-sm leading-relaxed max-w-xl">
                 Real-time updates from your poultry units and stock inventory.
              </p>
           </div>
        </div>

        <div className="flex flex-wrap items-center gap-4 relative z-10 w-full lg:w-auto">
           <button className="h-14 px-8 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-xl text-xs font-bold uppercase tracking-wider transition-all border border-slate-200">
              Download Report
           </button>
           <button className="h-14 px-8 bg-slate-900 hover:bg-emerald-600 text-white rounded-xl text-xs font-bold uppercase tracking-wider shadow-lg transition-all flex items-center gap-2 group">
              Check Full Farm <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
           </button>
        </div>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {[
          { label: 'Total Birds', value: totalChickens, sub: 'Current Birds', icon: Bird, color: 'emerald' },
          { label: 'Eggs Today', value: todaysEggs, sub: 'Collected Today', icon: Layers, color: 'blue' },
          { label: 'Orders', value: activeOrdersCount, sub: 'Pending Orders', icon: Truck, color: 'amber' },
          { label: 'My Units', value: farms.length, sub: 'Active Farms', icon: Activity, color: 'indigo' },
        ].map((stat, i) => (
          <div key={i} className="group bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-soft hover:shadow-strong transition-all overflow-hidden flex flex-col">
            <div className="flex justify-between items-start mb-8">
               <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-${stat.color}-100 bg-${stat.color}-500 transition-transform group-hover:scale-110`}>
                  <stat.icon size={24} />
               </div>
               <div className="text-right">
                  <div className="flex items-center gap-1 justify-end">
                     <TrendingUp size={12} className="text-emerald-500" />
                     <span className="text-[10px] font-bold text-emerald-500 uppercase">+12%</span>
                  </div>
                  <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">Growth</span>
               </div>
            </div>

            <div className="space-y-1 mb-8">
               <h3 className="text-4xl font-extrabold text-slate-900 tracking-tight">{stat.value}</h3>
               <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{stat.label}</p>
            </div>

            <div className="pt-6 border-t border-slate-50 flex items-center justify-between">
               <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">{stat.sub}</span>
               <ArrowRight size={14} className="text-slate-200 group-hover:text-emerald-600 group-hover:translate-x-1 transition-all" />
            </div>
          </div>
        ))}
      </div>

      {/* Action Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Marketplace Card */}
        <Link to="/farmer/listings" className="group relative bg-emerald-600 rounded-[2.5rem] p-10 overflow-hidden shadow-soft hover:shadow-strong transition-all">
           <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-32 -mt-32"></div>
           <div className="relative z-10 flex flex-col h-full justify-between gap-12">
              <div className="space-y-6">
                 <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-[10px] font-bold uppercase tracking-widest text-white">
                    <ShieldCheck size={14} /> Safe Marketplace
                 </div>
                 <h2 className="text-3xl lg:text-4xl font-extrabold text-white tracking-tight leading-tight">Sell Your <br />Farm Products</h2>
                 <p className="text-emerald-50/70 text-sm font-medium leading-relaxed max-w-sm">Connect directly with buyers and get the best prices for your produce.</p>
              </div>

              <div className="flex items-center justify-between">
                 <div className="flex items-center gap-3 bg-white px-6 py-3 rounded-xl shadow-lg group-hover:scale-105 transition-transform">
                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">Explore Market</span>
                    <ArrowRight size={16} className="text-emerald-700 group-hover:translate-x-1 transition-transform" />
                 </div>
                 <Globe size={48} className="text-white/20 group-hover:rotate-12 transition-all duration-700" />
              </div>
           </div>
        </Link>
        
        {/* Store Card */}
        <Link to="/farmer/store" className="group relative bg-white border border-slate-100 rounded-[2.5rem] p-10 overflow-hidden shadow-soft hover:shadow-strong transition-all">
           <div className="absolute top-0 right-0 w-64 h-64 bg-slate-50 rounded-full blur-3xl -mr-32 -mt-32"></div>
           <div className="relative z-10 flex flex-col h-full justify-between gap-12">
              <div className="space-y-6">
                 <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-50 border border-slate-100 text-[10px] font-bold uppercase tracking-widest text-slate-500">
                    <Store size={14} /> Shop Supplies
                 </div>
                 <h2 className="text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">Buy Quality <br />Feed & Medicine</h2>
                 <p className="text-slate-500 text-sm font-medium leading-relaxed max-w-sm">Top-grade supplies delivered directly to your farm gate.</p>
              </div>

              <div className="flex items-center justify-between">
                 <div className="flex items-center gap-3 bg-slate-900 px-6 py-3 rounded-xl shadow-lg group-hover:bg-emerald-600 transition-colors group-hover:scale-105 transition-transform">
                    <span className="text-xs font-bold uppercase tracking-wider text-white">Shop Now</span>
                    <ArrowRight size={16} className="text-emerald-400 group-hover:translate-x-1 transition-transform" />
                 </div>
                 <Package size={48} className="text-slate-100 group-hover:-rotate-12 transition-all duration-700" />
              </div>
           </div>
        </Link>
      </div>

      {/* Production Chart Section */}
      <div className="bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-soft relative overflow-hidden">
         <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8 mb-12 relative z-10">
            <div className="space-y-2">
               <h4 className="text-2xl font-extrabold text-slate-900 tracking-tight">Egg Production Trends</h4>
               <p className="text-xs font-bold text-slate-400 uppercase tracking-widest leading-relaxed">Daily collection data for the last 14 days</p>
            </div>
            <div className="flex items-center gap-4 bg-slate-50 p-1.5 rounded-xl border border-slate-100">
               <div className="px-4 py-2 bg-white rounded-lg shadow-sm border border-slate-100 flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-900">+12.4% Productivity</span>
               </div>
            </div>
         </div>

         <div className="h-[300px] w-full relative z-10">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                   <linearGradient id="colorEggs" x1="0" y1="0" x2="0" y2="1">
                     <stop offset="5%" stopColor="#10b981" stopOpacity={0.1}/>
                     <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                   </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="date" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fontWeight: 600, fill: '#94a3b8' }} 
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fontWeight: 600, fill: '#94a3b8' }} 
                />
                <Tooltip 
                  contentStyle={{ 
                    borderRadius: '16px', 
                    border: '1px solid #f1f5f9', 
                    boxShadow: '0 10px 30px rgba(0,0,0,0.05)', 
                    padding: '12px 16px',
                    background: 'white',
                  }}
                  itemStyle={{ 
                    fontWeight: 700, 
                    fontSize: '12px', 
                    color: '#10b981'
                  }}
                />
                <Area 
                  type="monotone" 
                  dataKey="eggs" 
                  stroke="#10b981" 
                  strokeWidth={4} 
                  fillOpacity={1} 
                  fill="url(#colorEggs)" 
                  animationDuration={1500}
                />
              </AreaChart>
            </ResponsiveContainer>
         </div>
      </div>

      {/* Health Alerts Section */}
      {alerts.length > 0 && (
        <div className="bg-rose-50/50 rounded-[2.5rem] p-10 border border-rose-100 relative overflow-hidden">
           <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8 mb-10 relative z-10">
              <div className="space-y-2">
                 <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-rose-600 rounded-xl flex items-center justify-center text-white shadow-md shadow-rose-100">
                       <AlertCircle size={20} />
                    </div>
                    <h4 className="text-2xl font-extrabold text-slate-900 tracking-tight">Active Health Alerts</h4>
                 </div>
                 <p className="text-xs font-bold text-rose-500 uppercase tracking-widest">Important warnings for your livestock</p>
              </div>
              <button className="h-12 px-6 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold uppercase tracking-wider shadow-lg transition-all">
                Take Action
              </button>
           </div>
           
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
              {alerts.map((alert, idx) => (
                <div key={idx} className="bg-white p-6 rounded-2xl border border-rose-100 shadow-sm hover:shadow-md transition-all flex flex-col gap-4 group">
                   <div className="flex justify-between items-start">
                      <div className="w-8 h-8 rounded-lg bg-rose-50 flex items-center justify-center text-rose-600">
                         <Zap size={16} />
                      </div>
                      <span className="text-[10px] font-bold text-rose-300 uppercase tracking-widest">{alert.type || 'HEALTH'}</span>
                   </div>
                   
                   <div className="space-y-1">
                      <h5 className="text-[11px] font-bold text-rose-900 uppercase tracking-wider">{alert.crop || 'Birds'} Alert</h5>
                      <p className="text-xs text-slate-600 font-medium leading-relaxed">{alert.message}</p>
                   </div>
                   
                   <button className="w-full py-2.5 mt-2 rounded-lg bg-slate-50 text-slate-600 text-[10px] font-bold uppercase tracking-wider hover:bg-rose-600 hover:text-white transition-all">
                      Acknowledge
                   </button>
                </div>
              ))}
           </div>
        </div>
      )}
    </div>
  );
}
