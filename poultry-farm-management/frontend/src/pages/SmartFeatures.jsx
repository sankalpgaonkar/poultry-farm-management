import { useState, useEffect } from 'react';
import api from '../utils/axios';
import { 
  Target, 
  MapPin, 
  Landmark, 
  FileText, 
  CheckCircle, 
  Sparkles,
  Zap,
  ChevronRight,
  TrendingUp,
  ShieldCheck,
  ArrowRight,
  Cpu
} from 'lucide-react';

export default function SmartFeatures() {
  const [schemes, setSchemes] = useState([]);
  const [buyers, setBuyers] = useState([]);
  const [report, setReport] = useState(null);

  useEffect(() => {
    const fetchSmartData = async () => {
      try {
        const [schRes, buyRes, repRes] = await Promise.all([
          api.get('/smart/schemes'),
          api.get('/smart/buyer-matches'),
          api.get('/smart/daily-report')
        ]);
        
        setSchemes(schRes.data);
        setBuyers(buyRes.data);
        setReport(repRes.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchSmartData();
  }, []);

  return (
    <div className="space-y-16 pb-20">
      
      {/* Friendly Header Layer */}
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-end gap-10">
        <div className="space-y-4 max-w-2xl text-slate-900">
           <div className="inline-flex items-center gap-3 px-4 py-2 bg-slate-100 rounded-full border border-slate-200">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-ping"></div>
              <span className="text-sm font-black uppercase tracking-wider text-slate-500">Smart Farm Tips</span>
           </div>
           <h1 className="text-4xl lg:text-7xl font-black text-slate-900 tracking-tight uppercase leading-none">
              Smart <span className="text-blue-600">Assists.</span>
           </h1>
           <p className="text-slate-400 font-medium text-lg leading-relaxed">
             Find government schemes, match with the best buyers nearby, and get daily health reports for your farm.
           </p>
        </div>
        
        <div className="flex items-center gap-6">
           <div className="h-20 px-8 bg-slate-900 text-white rounded-[2rem] shadow-2xl flex items-center gap-6 border border-slate-800">
              <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center text-blue-400">
                 <Cpu size={20} className="animate-spin-slow" />
              </div>
              <div className="space-y-1">
                 <span className="text-xs font-black uppercase text-slate-400 tracking-wider">AI Helper</span>
                 <h4 className="text-sm font-black text-white tracking-tight leading-none uppercase">Kisan Mitra AI</h4>
              </div>
           </div>
        </div>
      </div>

      {/* Daily Farm Health Report */}
      <section className="relative group">
        <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-[2.5rem] blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
        {report ? (
          <div className="relative bg-white rounded-[2.5rem] p-10 md:p-12 text-slate-900 shadow-3xl shadow-slate-200 overflow-hidden border border-slate-100">
            <div className="absolute top-0 right-0 w-[50%] h-full bg-gradient-to-l from-blue-500/5 to-transparent pointer-events-none"></div>
            
            <div className="relative z-10 grid xl:grid-cols-12 gap-16 items-center">
              <div className="xl:col-span-8 space-y-10">
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="w-1.5 h-8 bg-blue-500 rounded-full"></div>
                    <span className="text-sm font-black uppercase tracking-[0.4em] text-slate-400 italic">Daily Summary // {report.date}</span>
                  </div>
                  <h2 className="text-3xl md:text-5xl font-black tracking-tight uppercase leading-none">
                     Kisan Mitra <span className="text-blue-500">Daily Report</span>
                  </h2>
                  <p className="text-xl text-slate-500 font-medium leading-relaxed max-w-3xl">
                    {report.summary}
                  </p>
                </div>
                
                <div className="grid md:grid-cols-2 gap-8">
                  {report.actionItems.map((ai, i) => (
                    <div key={i} className="bg-slate-50 border border-slate-100 rounded-[1.5rem] p-6 flex items-start gap-6 group/item hover:bg-blue-50 transition-all duration-500">
                       <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-blue-400 shrink-0 group-hover/item:bg-blue-500 group-hover/item:text-white transition-all shadow-sm">
                          <CheckCircle size={24} />
                       </div>
                       <p className="text-sm font-bold text-slate-700 leading-relaxed uppercase tracking-tight pt-1">{ai}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="xl:col-span-4 flex flex-col items-center justify-center p-12 bg-slate-50 border border-slate-100 rounded-[3rem]">
                <div className="relative">
                   <svg className="w-48 h-48 -rotate-90">
                      <circle cx="96" cy="96" r="80" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-slate-200" />
                      <circle cx="96" cy="96" r="80" stroke="currentColor" strokeWidth="12" fill="transparent" strokeDasharray={502} strokeDashoffset={502 - (502 * report.efficiencyScore / 100)} className="text-blue-500 transition-all duration-[2000ms] stroke-round" />
                   </svg>
                   <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-6xl font-black tracking-tight">{report.efficiencyScore}%</span>
                      <span className="text-sm font-black text-slate-400 uppercase tracking-wider mt-1">Farm Health</span>
                   </div>
                </div>
                <div className="mt-8 text-center space-y-2">
                   <p className="text-sm font-black uppercase tracking-wider text-blue-500">Everything is OK</p>
                   <p className="text-xs text-slate-400 font-medium italic">Running smoothly</p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-slate-100 h-96 rounded-[4rem] animate-pulse"></div>
        )}
      </section>

      <div className="grid lg:grid-cols-2 gap-12">
        {/* Buyer Matching */}
        <section className="space-y-8">
           <div className="flex items-center gap-4 pb-4 border-b border-slate-100">
              <div className="w-12 h-12 bg-orange-50 rounded-2xl flex items-center justify-center text-orange-500">
                 <Target size={24} />
              </div>
              <div className="space-y-1">
                 <h2 className="text-lg font-black text-slate-900 uppercase tracking-tight leading-none">Best Buyer Matches</h2>
                 <p className="text-xs font-black text-slate-400 uppercase tracking-wider">Sell your stock to nearby buyers</p>
              </div>
           </div>

           <div className="space-y-6">
            {buyers.map(b => (
              <div key={b.id} className="group relative bg-white border border-slate-100 rounded-[2rem] p-6 hover:shadow-2xl hover:shadow-slate-100 transition-all duration-500 text-slate-900">
                <div className="flex justify-between items-start mb-6">
                  <div className="flex items-center gap-6">
                     <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-900 font-black text-2xl group-hover:bg-slate-900 group-hover:text-white transition-all duration-500 border border-slate-100">
                        {b.name.charAt(0)}
                     </div>
                     <div>
                        <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight group-hover:text-orange-600 transition-colors leading-none">{b.name}</h3>
                        <p className="text-sm font-black text-slate-400 uppercase tracking-wider flex items-center gap-2 mt-2 italic bg-slate-50 w-fit px-3 py-1 rounded-full"><MapPin size={12} className="text-orange-500" /> {b.distanceMiles} km away</p>
                     </div>
                  </div>
                  <div className="bg-emerald-50 px-4 py-2 rounded-xl border border-emerald-100 shadow-xl shadow-emerald-50">
                    <span className="text-sm font-black text-emerald-700 uppercase tracking-wider">Match: {b.matchScore}%</span>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-6 mt-8 p-6 bg-slate-50 rounded-3xl border border-slate-100">
                   <div className="space-y-1 border-r border-slate-200">
                      <span className="text-xs font-black text-slate-400 uppercase tracking-wider italic">Quantity Needed</span>
                      <p className="text-xl font-black text-slate-900 tracking-tight leading-none">{b.neededQuantity} <span className="text-sm font-bold text-slate-400 uppercase">Units</span></p>
                   </div>
                   <div className="space-y-1 px-4">
                      <span className="text-xs font-black text-slate-400 uppercase tracking-wider italic">Buying Price</span>
                      <p className="text-xl font-black text-emerald-600 tracking-tight leading-none">₹{b.offeredPrice.toFixed(2)}/unit</p>
                   </div>
                </div>
                
                <button className="w-full mt-6 h-14 bg-white border border-slate-900 text-slate-950 font-black text-sm uppercase tracking-[0.2em] rounded-2xl hover:bg-slate-950 hover:text-white transition-all duration-500 flex items-center justify-center gap-3 group/btn">
                   Contact Buyer <ChevronRight size={14} className="group-hover/btn:translate-x-1" />
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* Government Schemes / Subsidies */}
        <section className="space-y-8">
           <div className="flex items-center gap-4 pb-4 border-b border-slate-100">
              <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600">
                 <Landmark size={24} />
              </div>
              <div className="space-y-1">
                 <h2 className="text-lg font-black text-slate-900 uppercase tracking-tight leading-none">Government Schemes</h2>
                 <p className="text-xs font-black text-slate-400 uppercase tracking-wider">Schemes and Support for you</p>
              </div>
           </div>

           <div className="space-y-6">
            {schemes.map(s => (
              <div key={s.id} className="group bg-white border border-slate-100 rounded-[2rem] p-8 hover:shadow-2xl hover:shadow-slate-100 transition-all duration-500 relative overflow-hidden text-slate-900">
                <div className="absolute top-0 right-0 p-8">
                   <div className="w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-400 group-hover:scale-125 transition-transform duration-700">
                      <TrendingUp size={24} />
                   </div>
                </div>
                
                <div className="space-y-6 relative z-10">
                   <span className="text-xs font-black px-4 py-1.5 bg-slate-900 text-white rounded-full uppercase tracking-wider">{s.region} Area</span>
                   <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight group-hover:text-emerald-600 transition-colors max-w-sm leading-tight">{s.title}</h3>
                   <p className="text-sm text-slate-500 font-medium leading-relaxed">{s.description}</p>
                   
                   <div className="flex flex-wrap gap-4 pt-4">
                     {s.benefits.map((ben, i) => (
                       <div key={i} className="text-sm font-black text-emerald-700 bg-emerald-50 border border-emerald-100 px-5 py-2.5 rounded-2xl flex items-center gap-3 shadow-xl shadow-emerald-50 group-hover:bg-emerald-600 group-hover:text-white transition-all duration-500">
                          <ShieldCheck size={14} /> {ben}
                       </div>
                     ))}
                   </div>
                   
                   <div className="pt-8 border-t border-slate-100 mt-8 flex items-center justify-between">
                      <span className="text-sm font-black text-slate-400 uppercase tracking-wider flex items-center gap-2 italic">
                         <Sparkles size={12} className="text-amber-400" /> High Success Rate
                      </span>
                      <button className="flex items-center gap-2 text-xs font-black uppercase text-slate-900 hover:text-emerald-600 transition-colors group/apply">
                         Apply Now <ArrowRight size={16} className="group-apply:translate-x-1 transition-transform" />
                      </button>
                   </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
