import { useState } from 'react';
import api from '../utils/axios';
import { 
  Calculator, 
  DollarSign, 
  TrendingDown, 
  TrendingUp, 
  ChevronRight, 
  PieChart as PieChartIcon, 
  BarChart3, 
  Info,
  ArrowUpRight,
  ArrowDownRight,
  Zap,
  Target,
  ArrowRight,
  Cpu,
  Layers,
  Activity,
  ShieldCheck,
  TrendingUp as TrendingUpIcon,
  PieChart as PieChartLucide,
  Briefcase,
  AlertTriangle
} from 'lucide-react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { formatRupee } from '../utils/imageConstants';

export default function ProfitAnalyzer() {
  const [formData, setFormData] = useState({
    birdsCount: '',
    dailyFeedKg: '',
    feedCostPerKg: '',
    dailyEggProduction: '',
    eggSalePrice: '',
    laborCostDaily: '',
    utilitiesCostDaily: ''
  });

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const calculate = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const payload = {
        birdsCount: Number(formData.birdsCount) || 0,
        dailyFeedKg: Number(formData.dailyFeedKg) || 0,
        feedCostPerKg: Number(formData.feedCostPerKg) || 0,
        dailyEggProduction: Number(formData.dailyEggProduction) || 0,
        eggSalePrice: Number(formData.eggSalePrice) || 0,
        laborCostDaily: Number(formData.laborCostDaily) || 0,
        utilitiesCostDaily: Number(formData.utilitiesCostDaily) || 0
      };
      const res = await api.post('/finance/calculate', payload);
      setResult(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444'];
  
  const getPieData = () => {
    if (!result) return [];
    return [
      { name: 'Feed', value: formData.dailyFeedKg * formData.feedCostPerKg },
      { name: 'Labor', value: Number(formData.laborCostDaily) },
      { name: 'Utilities', value: Number(formData.utilitiesCostDaily) }
    ];
  };

  return (
    <div className="space-y-12 pb-20">
      
      {/* Simple Header */}
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-end gap-10">
        <div className="space-y-4 max-w-3xl">
           <div className="inline-flex items-center gap-3 px-5 py-3 bg-emerald-50 rounded-full border border-emerald-100">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-black uppercase tracking-wider text-emerald-600">Money Calculator</span>
           </div>
           <h1 className="text-4xl lg:text-7xl font-black text-slate-900 tracking-tight uppercase leading-tight">
              Profit <span className="text-emerald-600">Check.</span>
           </h1>
           <p className="text-slate-500 font-medium text-xl leading-relaxed max-w-2xl">
             Enter your farm numbers below to see if you are making a profit. We will also give you tips to grow your business.
           </p>
        </div>
        
        <div className="flex items-center gap-6">
           <div className="h-24 px-10 bg-slate-900 border border-slate-800 rounded-3xl shadow-xl flex items-center gap-6">
              <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-emerald-400">
                 <Calculator size={24} />
              </div>
              <div className="space-y-0.5">
                 <span className="text-xs font-black uppercase text-slate-500 tracking-wider leading-none">Calculator</span>
                 <h4 className="text-sm font-black text-white tracking-tight uppercase">Ready for Math</h4>
              </div>
           </div>
        </div>
      </div>

      <div className="grid xl:grid-cols-12 gap-12">
        
        {/* Input Side */}
        <div className="xl:col-span-5 space-y-12">
           <div className="bg-white border border-slate-100 rounded-[4rem] p-14 md:p-16 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-16 opacity-[0.02] pointer-events-none">
                 <Cpu size={250} />
              </div>
              
              <div className="flex justify-between items-center mb-10 relative z-10">
                 <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight flex items-center gap-3">
                    My Daily Numbers <Target size={22} className="text-emerald-400" />
                 </h2>
              </div>
              
              <form onSubmit={calculate} className="space-y-8 relative z-10">
                <div className="grid grid-cols-2 gap-12">
                   <div className="space-y-6">
                      <label className="text-farmer-label">Number of Birds</label>
                      <input 
                        name="birdsCount" 
                        value={formData.birdsCount} 
                        onChange={handleChange}
                        className="w-full bg-slate-50 border border-slate-200 h-24 rounded-[2rem] focus:ring-8 focus:ring-emerald-500/10 outline-none focus:border-emerald-500 font-black text-3xl text-slate-900 transition-all text-center px-6"
                        placeholder="0"
                      />
                   </div>
                   <div className="space-y-6">
                      <label className="text-farmer-label">Total Eggs Today</label>
                      <input 
                        name="dailyEggProduction" 
                        value={formData.dailyEggProduction} 
                        onChange={handleChange}
                        className="w-full bg-slate-50 border border-slate-200 h-24 rounded-[2rem] focus:ring-8 focus:ring-emerald-500/10 outline-none focus:border-emerald-500 font-black text-3xl text-slate-900 transition-all text-center px-6"
                        placeholder="0"
                      />
                   </div>
                </div>

                <div className="grid grid-cols-2 gap-12">
                   <div className="space-y-4">
                      <label className="block text-sm font-black uppercase text-slate-400 tracking-wider px-2">Feed Used (kg)</label>
                      <input 
                        name="dailyFeedKg" 
                        step="0.1"
                        value={formData.dailyFeedKg} 
                        onChange={handleChange}
                        className="w-full bg-slate-50 border border-slate-200 h-20 rounded-2xl focus:ring-4 focus:ring-emerald-500/10 outline-none focus:border-emerald-500 font-black text-xl text-slate-900 transition-all text-center px-4"
                        placeholder="0.0"
                      />
                   </div>
                   <div className="space-y-4">
                      <label className="block text-sm font-black uppercase text-slate-400 tracking-wider px-2">Feed Price (₹/kg)</label>
                      <div className="relative">
                         <span className="absolute left-6 top-1/2 -translate-y-1/2 font-black text-emerald-500 text-xl">₹</span>
                         <input 
                           name="feedCostPerKg" 
                           step="0.01"
                           value={formData.feedCostPerKg} 
                           onChange={handleChange}
                           className="w-full bg-slate-50 border border-slate-200 h-20 rounded-2xl focus:ring-4 focus:ring-emerald-500/10 outline-none focus:border-emerald-500 font-black text-xl text-slate-900 transition-all pl-12 pr-4"
                           placeholder="0.00"
                         />
                      </div>
                   </div>
                </div>

                <div className="grid grid-cols-2 gap-12">
                   <div className="space-y-4">
                      <label className="block text-sm font-black uppercase text-slate-400 tracking-wider px-2">Sale Price (₹/Egg)</label>
                      <div className="relative">
                         <span className="absolute left-6 top-1/2 -translate-y-1/2 font-black text-emerald-500 text-xl">₹</span>
                         <input 
                           name="eggSalePrice" 
                           step="0.01"
                           value={formData.eggSalePrice} 
                           onChange={handleChange}
                           className="w-full bg-slate-50 border border-slate-200 h-20 rounded-2xl focus:ring-4 focus:ring-emerald-500/10 outline-none focus:border-emerald-500 font-black text-xl text-slate-900 transition-all pl-12 pr-4"
                           placeholder="0.00"
                         />
                      </div>
                   </div>
                   <div className="space-y-4">
                      <label className="block text-sm font-black uppercase text-slate-400 tracking-wider px-2">Other Costs Today</label>
                      <div className="relative">
                         <span className="absolute left-6 top-1/2 -translate-y-1/2 font-black text-emerald-500 text-xl">₹</span>
                         <input 
                           name="laborCostDaily" 
                           value={formData.laborCostDaily} 
                           onChange={handleChange}
                           className="w-full bg-slate-50 border border-slate-200 h-20 rounded-2xl focus:ring-4 focus:ring-emerald-500/10 outline-none focus:border-emerald-500 font-black text-xl text-slate-900 transition-all pl-12 pr-4"
                           placeholder="0"
                         />
                      </div>
                   </div>
                </div>

                <button 
                  type="submit" 
                  disabled={loading}
                  className="w-full h-24 bg-slate-900 text-white rounded-[2rem] font-black text-sm uppercase tracking-wider shadow-xl enabled:hover:bg-emerald-600 enabled:hover:-translate-y-1 transition-all flex items-center justify-center gap-4 group disabled:opacity-30"
                >
                   {loading ? (
                     <Loader2 className="w-6 h-6 animate-spin text-emerald-400" />
                   ) : (
                     <><ShieldCheck size={24} className="text-emerald-400" /> Check Profit</>
                   )}
                </button>
              </form>
           </div>
        </div>

        {/* Results Side */}
        <div className="xl:col-span-7 space-y-10">
            {result ? (
              <div className="space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
                 {/* Success/Warning Card */}
                 <div className={`relative overflow-hidden rounded-[3rem] p-12 text-white shadow-xl ${result.breakdown.dailyProfit >= 0 ? 'bg-emerald-600' : 'bg-rose-600'}`}>
                    <div className="absolute top-0 right-0 p-16 opacity-10 pointer-events-none">
                       {result.breakdown.dailyProfit >= 0 ? <TrendingUp size={180} /> : <TrendingDown size={180} />}
                    </div>
                    
                    <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-10">
                       <div className="space-y-6">
                          <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-md px-4 py-2 rounded-xl border border-white/10">
                             {result.breakdown.dailyProfit >= 0 ? <Activity className="text-emerald-300 animate-pulse" size={14} /> : <AlertTriangle className="text-rose-300 animate-pulse" size={14} />}
                             <span className="text-sm font-black uppercase tracking-wider">
                                {result.breakdown.dailyProfit >= 0 ? 'Good Profit Today!' : 'Losing Money Today!'}
                             </span>
                          </div>
                          <div className="space-y-1">
                             <p className="text-sm font-black uppercase tracking-wider opacity-70">Daily Profit</p>
                             <h3 className="text-7xl font-black tracking-tight tabular-nums">{formatRupee(result.breakdown.dailyProfit)}</h3>
                          </div>
                       </div>
                       
                       <div className="bg-slate-900/20 backdrop-blur-lg p-8 rounded-3xl border border-white/5 min-w-[200px]">
                          <p className="text-sm font-black uppercase tracking-wider opacity-60 mb-2 leading-none">Profit Margin</p>
                          <p className="text-4xl font-black tracking-tight tabular-nums">{ (result.breakdown.dailyProfit / (result.breakdown.totalDailyRevenue || 1) * 100).toFixed(1) }<span className="text-xl opacity-40 ml-1">%</span></p>
                          <div className="h-1.5 w-full bg-white/10 rounded-full mt-4 overflow-hidden">
                             <div className="h-full bg-white rounded-full transition-all duration-1000" style={{ width: `${Math.min(Math.max((result.breakdown.dailyProfit / (result.breakdown.totalDailyRevenue || 1) * 100), 0), 100)}%` }}></div>
                          </div>
                       </div>
                    </div>
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Cost Chart */}
                    <div className="bg-white border border-slate-100 rounded-[2.5rem] p-10 shadow-xl space-y-8 group">
                       <div className="flex items-center justify-between">
                          <div className="space-y-1">
                             <h4 className="text-xl font-black text-slate-900 uppercase tracking-tight">Where is your money going?</h4>
                             <p className="text-xs font-black text-slate-400 uppercase tracking-wider italic">Cost Breakdown</p>
                          </div>
                          <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-500 shadow-sm">
                             <PieChartLucide size={20} />
                          </div>
                       </div>
                       
                       <div className="h-60">
                          <ResponsiveContainer width="100%" height="100%">
                             <PieChart>
                                <Pie 
                                  data={getPieData()} 
                                  innerRadius={55} 
                                  outerRadius={80} 
                                  paddingAngle={8} 
                                  dataKey="value" 
                                  stroke="none"
                                >
                                   {getPieData().map((entry, index) => (
                                     <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} cornerRadius={10} />
                                   ))}
                                </Pie>
                                <Tooltip 
                                  contentStyle={{ borderRadius: '24px', border: 'none', boxShadow: '0 20px 40px rgba(0,0,0,0.1)', padding: '16px', backgroundColor: '#0f172a', color: '#fff' }}
                                  itemStyle={{ color: '#fff', fontWeight: '900', textTransform: 'uppercase', fontSize: '13px', letterSpacing: '0.1em' }}
                                  formatter={(value) => formatRupee(value)}
                                />
                             </PieChart>
                          </ResponsiveContainer>
                       </div>
                       
                       <div className="grid grid-cols-3 gap-3">
                         {getPieData().map((entry, index) => (
                           <div key={index} className="bg-slate-50 p-4 rounded-2xl flex flex-col items-center gap-2">
                              <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[index] }}></div>
                              <p className="text-xs font-black text-slate-900 uppercase tracking-wider truncate">{entry.name}</p>
                              <p className="text-sm font-bold text-slate-400">{((entry.value / result.breakdown.totalDailyCost) * 100).toFixed(0)}%</p>
                           </div>
                         ))}
                       </div>
                    </div>

                    <div className="space-y-8">
                       <div className="bg-slate-900 rounded-[2.5rem] p-10 text-white border border-slate-800 shadow-xl group">
                          <div className="flex items-center gap-5 mb-8">
                             <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-emerald-400">
                                <BarChart3 size={24} />
                             </div>
                             <h4 className="text-xl font-black uppercase tracking-tight">Summary Stats</h4>
                          </div>
                          
                          <div className="space-y-0.5">
                             <div className="flex justify-between items-center py-4 border-b border-white/5">
                                <span className="text-xs font-black text-slate-500 uppercase tracking-wider italic">Cost to Make 1 Egg</span>
                                <span className="text-xl font-black text-emerald-400 tabular-nums">{formatRupee(result.breakdown.costPerEgg)}</span>
                             </div>
                             <div className="flex justify-between items-center py-4 border-b border-white/5">
                                <span className="text-xs font-black text-slate-500 uppercase tracking-wider italic">Break-even Eggs</span>
                                <span className="text-xl font-black text-white tabular-nums">{result.breakdown.breakEvenEggs} <span className="text-xs opacity-30 ml-1">Eggs/Day</span></span>
                             </div>
                             <div className="flex justify-between items-center py-4">
                                <span className="text-xs font-black text-slate-500 uppercase tracking-wider italic">Feed ROI</span>
                                <span className="text-xl font-black text-emerald-400 tabular-nums">{ (result.breakdown.totalDailyRevenue / (formData.dailyFeedKg * formData.feedCostPerKg || 1)).toFixed(2) }x</span>
                             </div>
                          </div>
                       </div>

                       {result.suggestions.length > 0 && (
                          <div className="bg-white border border-slate-100 p-10 rounded-[2.5rem] shadow-xl space-y-6 relative overflow-hidden group">
                             <div className="flex items-center gap-4">
                                <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600 shadow-sm">
                                   <Zap size={20} className="animate-bounce" />
                                </div>
                                <h4 className="text-xl font-black uppercase tracking-tight">Tips to Increase Profit</h4>
                             </div>
                             <ul className="space-y-4">
                                {result.suggestions.map((s, i) => (
                                  <li key={i} className="flex gap-4">
                                     <div className="mt-2 w-1.5 h-1.5 bg-emerald-500 rounded-full shrink-0"></div>
                                     <p className="text-sm font-bold text-slate-700 uppercase tracking-wide leading-relaxed italic">{s}</p>
                                  </li>
                                ))}
                             </ul>
                          </div>
                       )}
                    </div>
                 </div>
              </div>
            ) : (
              <div className="h-full min-h-[500px] border-2 border-dashed border-slate-100 rounded-[4rem] flex flex-col items-center justify-center p-20 text-center space-y-10 bg-slate-50/20 group">
                 <div className="w-24 h-24 rounded-3xl bg-white shadow-xl flex items-center justify-center text-slate-100 border border-slate-50 group-hover:scale-105 transition-transform">
                    <Activity size={48} className="opacity-10 group-hover:opacity-40" />
                 </div>
                 <div className="space-y-2">
                    <h3 className="text-2xl font-black text-slate-300 uppercase tracking-tight italic">Waiting for Your Numbers...</h3>
                    <p className="text-slate-200 font-black text-sm uppercase tracking-wider max-w-sm mx-auto leading-relaxed">Enter your daily farm data on the left to see your profit analytics here.</p>
                 </div>
                 <div className="flex items-center gap-6 opacity-10 group-hover:opacity-30 transition-opacity">
                    <BarChart3 size={36} />
                    <PieChartIcon size={36} />
                    <TrendingUpIcon size={36} />
                 </div>
              </div>
            )}
        </div>
      </div>
    </div>
  );
}
