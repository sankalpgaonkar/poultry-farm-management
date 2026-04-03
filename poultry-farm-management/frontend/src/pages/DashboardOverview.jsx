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
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-end gap-8">
        <div className="space-y-4">
           <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-lg shadow-emerald-200"></div>
              <span className="text-sm font-black uppercase tracking-wider text-slate-400">Status: Farm is Active</span>
           </div>
           <div className="space-y-1">
              <h1 className="text-5xl lg:text-7xl font-black text-slate-900 tracking-tight leading-tight">My Farm <br /><span className="text-emerald-600">Today.</span></h1>
              <p className="text-slate-500 font-bold text-sm uppercase tracking-wider flex items-center gap-2 mt-6">
                 <Globe size={14} className="text-emerald-500" /> Verified PoultrySmart Farmer
              </p>
           </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3 p-3 bg-white border border-slate-100 rounded-3xl shadow-xl">
           <button className="w-full sm:w-auto px-10 py-5 bg-slate-50 text-slate-700 rounded-2xl text-xs font-black uppercase tracking-wider hover:bg-slate-100 transition-all border border-slate-200">
              Download Report
           </button>
           <button className="w-full sm:w-auto px-10 py-5 bg-slate-900 text-white rounded-2xl text-xs font-black uppercase tracking-wider shadow-lg shadow-slate-200 hover:bg-emerald-600 transition-all hover:-translate-y-1">
              Check Full Farm
           </button>
        </div>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
        {[
          { label: 'Total Birds', value: totalChickens, sub: 'Current Birds', icon: Bird, color: '#10b981', image: POULTRY_IMAGES.STATS.CHICKENS },
          { label: 'Eggs Today', value: todaysEggs, sub: 'Collected Today', icon: Layers, color: '#3b82f6', image: POULTRY_IMAGES.STATS.EGGS },
          { label: 'Orders', value: activeOrdersCount, sub: 'Pending Orders', icon: Truck, color: '#f59e0b', image: POULTRY_IMAGES.STATS.CHICKENS },
          { label: 'My Farms', value: farms.length, sub: 'Active Units', icon: Activity, color: '#8b5cf6', image: POULTRY_IMAGES.STATS.FARMS },
        ].map((stat, i) => (
          <div key={i} className="group relative bg-white rounded-[3rem] p-12 border border-slate-100 shadow-xl shadow-slate-100/50 hover:shadow-2xl transition-all duration-500 overflow-hidden flex flex-col hover:-translate-y-2">
            
            <div className="absolute top-0 right-0 w-24 h-24 blur-[40px] opacity-[0.05]" style={{ backgroundColor: stat.color }}></div>
            
            <div className="relative z-10 space-y-8">
               <div className="flex justify-between items-start mb-6">
                  <div className="w-18 h-18 rounded-3xl flex items-center justify-center text-white shadow-2xl transition-transform group-hover:scale-110" style={{ backgroundColor: stat.color }}>
                     <stat.icon size={36} strokeWidth={3} />
                  </div>
                  <div className="text-right">
                     <div className="flex items-center gap-1 justify-end">
                        <TrendingUp size={14} className="text-emerald-500" />
                        <span className="text-xs font-black text-emerald-500 uppercase">+12%</span>
                     </div>
                     <span className="text-sm font-black text-slate-300 uppercase tracking-wider">Growth</span>
                  </div>
               </div>

               <div className="space-y-2 py-4">
                  <h3 className="text-farmer-value">{stat.value}</h3>
                  <p className="text-farmer-label">{stat.label}</p>
               </div>

               <div className="pt-6 border-t border-slate-50 flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">{stat.sub}</span>
                  <ArrowRight size={14} className="text-slate-200 group-hover:text-emerald-600 group-hover:translate-x-2 transition-all" />
               </div>
            </div>
          </div>
        ))}
      </div>

      {/* Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        
        {/* Marketplace Card */}
        <Link to="/farmer/listings" className="group relative bg-emerald-600 rounded-[3rem] p-12 overflow-hidden shadow-2xl shadow-emerald-100 transition-all duration-500 hover:-translate-y-2">
           <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-white/10 to-transparent pointer-events-none"></div>
           
           <div className="relative z-10 flex flex-col h-full justify-between gap-8">
              <div className="space-y-8">
                 <div className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-white/10 border border-white/20 text-xs font-black uppercase tracking-wider text-white">
                    <ShieldCheck size={18} /> Safe Marketplace
                 </div>
                 <h2 className="text-4xl lg:text-6xl font-black text-white tracking-tight leading-tight uppercase">Sell Your <br />Products.</h2>
                 <p className="text-emerald-50 text-lg font-medium leading-relaxed max-w-sm">Sell your eggs and birds to other farmers and shopkeepers easily and get better prices.</p>
              </div>

              <div className="flex items-center justify-between mt-10">
                 <div className="flex items-center gap-4 bg-white px-8 py-4 rounded-xl shadow-lg group-hover:scale-105 transition-transform">
                    <span className="text-sm font-black uppercase tracking-wider text-emerald-600">See My Items</span>
                    <ArrowRight size={20} className="text-emerald-600 group-hover:translate-x-1 transition-transform" />
                 </div>
                 <Globe size={64} className="text-white/20 group-hover:rotate-12 transition-transform duration-700" />
              </div>
           </div>
        </Link>
        
        {/* Store Card */}
        <Link to="/farmer/store" className="group relative bg-white border border-slate-200 rounded-[3rem] p-12 overflow-hidden shadow-xl shadow-slate-100 transition-all duration-500 hover:-translate-y-2">
           <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-slate-50 to-transparent pointer-events-none"></div>
           
           <div className="relative z-10 flex flex-col h-full justify-between gap-8">
              <div className="space-y-8">
                 <div className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-slate-50 border border-slate-100 text-xs font-black uppercase tracking-wider text-slate-500">
                    <Store size={18} /> Shop Supplies
                 </div>
                 <h2 className="text-4xl lg:text-6xl font-black text-slate-900 tracking-tight leading-tight uppercase">Buy Feed & <br />Medicine.</h2>
                 <p className="text-slate-500 text-lg font-medium leading-relaxed max-w-sm">Order quality feed, medicine, and equipment for your farm with home delivery.</p>
              </div>

              <div className="flex items-center justify-between mt-10">
                 <div className="flex items-center gap-4 bg-slate-900 px-8 py-4 rounded-xl shadow-lg group-hover:bg-emerald-600 transition-colors group-hover:scale-105 transition-transform">
                    <span className="text-sm font-black uppercase tracking-wider text-white">Shop Now</span>
                    <ArrowRight size={20} className="text-emerald-400 group-hover:translate-x-1 transition-transform" />
                 </div>
                 <Package size={64} className="text-slate-100 group-hover:-rotate-12 transition-transform duration-700" />
              </div>
           </div>
        </Link>
      </div>

      {/* Production Chart Section */}
      <div className="bg-white rounded-[3rem] p-12 border border-slate-100 shadow-xl shadow-slate-100 relative overflow-hidden">
         <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-8 mb-12 relative z-10">
            <div className="space-y-6">
               <h4 className="text-5xl font-black text-slate-900 uppercase tracking-tight">Egg Production Chart</h4>
               <p className="text-base font-black text-slate-400 uppercase tracking-wider leading-relaxed">Showing your last 14 days egg collection data</p>
            </div>
            <div className="flex items-center gap-4 bg-slate-50 p-2 rounded-2xl border border-slate-100">
               <div className="px-6 py-3 bg-white rounded-xl shadow-sm border border-slate-100 flex items-center gap-3">
                  <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse"></div>
                  <span className="text-sm font-black uppercase tracking-wider text-slate-900">Change: +12.4%</span>
               </div>
               <div className="px-4 py-3 text-slate-400 font-black text-sm uppercase tracking-wider flex items-center gap-2">
                  <Activity size={16} /> Everything is Good
               </div>
            </div>
         </div>

         <div className="h-[350px] w-full relative z-10">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                   <linearGradient id="colorEggs" x1="0" y1="0" x2="0" y2="1">
                     <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                     <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                   </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="8 8" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="date" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 9, fontWeight: 700, textTransform: 'uppercase', fill: '#94a3b8', letterSpacing: '0.1em' }} 
                  dy={15}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 9, fontWeight: 700, fill: '#94a3b8' }} 
                />
                <Tooltip 
                  contentStyle={{ 
                    borderRadius: '20px', 
                    border: '1px solid #f1f5f9', 
                    boxShadow: '0 20px 40px rgba(0,0,0,0.05)', 
                    padding: '20px',
                    background: 'white',
                  }}
                  itemStyle={{ 
                    fontWeight: 900, 
                    fontSize: '11px', 
                    textTransform: 'uppercase', 
                  }}
                />
                <Area 
                  type="monotone" 
                  dataKey="eggs" 
                  stroke="#10b981" 
                  strokeWidth={6} 
                  fillOpacity={1} 
                  fill="url(#colorEggs)" 
                  animationDuration={2000}
                />
              </AreaChart>
            </ResponsiveContainer>
         </div>
      </div>

      {/* Health Alerts Section */}
      {alerts.length > 0 && (
        <div className="bg-rose-50 rounded-[3rem] p-12 border-2 border-rose-100 border-dashed relative overflow-hidden">
           <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8 mb-12 relative z-10">
              <div className="space-y-4">
                 <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-rose-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-rose-200">
                       <AlertCircle size={28} strokeWidth={3} />
                    </div>
                    <h4 className="text-3xl font-black text-rose-950 uppercase tracking-tight">Health Alerts!</h4>
                 </div>
                 <p className="text-sm font-black text-rose-400 uppercase tracking-wider italic">Important health warnings for your birds in this area.</p>
              </div>
              <button className="px-8 py-4 bg-rose-600 text-white rounded-2xl text-sm font-black uppercase tracking-wider shadow-xl shadow-rose-200 hover:-translate-y-1 transition-all">
                Take Action Now
              </button>
           </div>
           
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
              {alerts.map((alert, idx) => (
                <div key={idx} className="bg-white p-8 rounded-[2rem] border border-rose-100 shadow-lg shadow-rose-100/20 hover:shadow-xl transition-all duration-500 flex flex-col gap-4 group">
                   <div className="flex justify-between items-start">
                      <div className="w-10 h-10 rounded-xl bg-rose-50 flex items-center justify-center text-rose-600 group-hover:bg-rose-600 group-hover:text-white transition-colors">
                         <Zap size={20} />
                      </div>
                      <span className="text-xs font-black text-rose-300 uppercase tracking-wider">{alert.type || 'HEALTH'}</span>
                   </div>
                   
                   <div className="space-y-2">
                      <h5 className="text-sm font-black text-rose-900 uppercase tracking-wider">{alert.crop || 'Birds'} Alert</h5>
                      <p className="text-xs font-bold text-rose-800/80 leading-relaxed">{alert.message}</p>
                   </div>
                   
                   <button className="w-full py-3 mt-2 rounded-xl bg-rose-50 text-rose-600 text-xs font-black uppercase tracking-wider hover:bg-rose-600 hover:text-white transition-all">
                      Mark as Done
                   </button>
                </div>
              ))}
           </div>
        </div>
      )}
    </div>
  );
}
