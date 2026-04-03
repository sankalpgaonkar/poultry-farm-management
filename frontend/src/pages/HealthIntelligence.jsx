import { useState } from 'react';
import api from '../utils/axios';
import { 
  Stethoscope, 
  AlertTriangle, 
  ShieldCheck, 
  Bug, 
  Activity, 
  Zap, 
  ChevronRight, 
  Dna,
  HeartPulse,
  Microscope,
  ShieldAlert,
  ArrowUpRight,
  TrendingUp,
  X,
  Loader2,
  Cpu,
  RefreshCw,
  Search,
  Scan,
  Waves,
  ArrowRight
} from 'lucide-react';

export default function HealthIntelligence() {
  const [symptomsInput, setSymptomsInput] = useState('');
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);

  const predefinedSymptoms = [
    'sneezing', 'coughing', 'drop in eggs', 'bloody diarrhea', 'lethargy', 'pale comb',
    'gasping', 'twisted neck', 'weight loss', 'panting', 'watery eyes', 'increased thirst'
  ];

  const handleAnalyze = async () => {
    if (!symptomsInput) return;
    setLoading(true);
    try {
      const symptomsArray = symptomsInput.split(',').map(s => s.trim()).filter(Boolean);
      const res = await api.post('/health/analyze', { symptoms: symptomsArray });
      setResults(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const addSymptom = (s) => {
    setSymptomsInput(prev => prev ? prev + ', ' + s : s);
  };

  const clearSymptoms = () => setSymptomsInput('');

  return (
    <div className="space-y-12 pb-20">
      
      {/* Friendly Header */}
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-end gap-10">
        <div className="space-y-4 max-w-3xl">
           <div className="inline-flex items-center gap-3 px-4 py-2 bg-rose-50 rounded-full border border-rose-100">
              <div className="w-2 h-2 bg-rose-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-black uppercase tracking-wider text-rose-600">Health Check</span>
           </div>
           <h1 className="text-4xl lg:text-7xl font-black text-slate-900 tracking-tight uppercase leading-none">
              Disease <span className="text-rose-600">Finder.</span>
           </h1>
           <p className="text-slate-500 font-medium text-lg leading-relaxed">
             Pick the signs you see in your chickens. Kisan Mitra will tell you what could be wrong and how to fix it.
           </p>
        </div>
        
        <div className="flex flex-col sm:flex-row items-center gap-4">
           <div className="h-20 px-8 bg-white border border-slate-200 rounded-3xl shadow-lg flex items-center gap-6">
              <div className="w-12 h-12 bg-rose-50 rounded-2xl flex items-center justify-center text-rose-500">
                 <HeartPulse size={24} className="animate-pulse" />
              </div>
              <div className="space-y-0.5">
                 <span className="text-xs font-black uppercase text-slate-300 tracking-wider">Doctor Status</span>
                 <h4 className="text-sm font-black text-slate-900 tracking-tight uppercase">Ready to Help</h4>
              </div>
           </div>
           
           <button onClick={clearSymptoms} className="h-20 w-20 bg-slate-50 border border-slate-200 rounded-3xl flex items-center justify-center text-slate-400 hover:text-rose-500 hover:bg-white hover:shadow-xl transition-all">
              <RefreshCw size={24} />
           </button>
        </div>
      </div>

      <div className="grid xl:grid-cols-12 gap-12">
        
        {/* Input - Left Side */}
        <div className="xl:col-span-5 space-y-8">
           <div className="bg-white border border-slate-100 rounded-[3rem] p-10 md:p-12 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-16 opacity-[0.02] pointer-events-none">
                 <Dna size={200} />
              </div>
              
              <div className="flex justify-between items-center mb-8 relative z-10">
                 <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight flex items-center gap-3">
                    Select Signs <Microscope size={22} className="text-rose-400" />
                 </h2>
              </div>
              
              <div className="space-y-10 relative z-10">
                <div className="space-y-4">
                  <label className="block text-sm font-black uppercase text-slate-400 tracking-wider px-4">Signs / Symptoms</label>
                  <textarea 
                    rows="4"
                    value={symptomsInput}
                    onChange={(e) => setSymptomsInput(e.target.value)}
                    placeholder="Type signs e.g., sneezing, not eating..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-[2rem] p-8 focus:ring-4 focus:ring-rose-500/10 outline-none focus:border-rose-400/50 resize-none font-bold text-sm uppercase tracking-wide text-slate-900 transition-all placeholder:text-slate-300 shadow-inner"
                  />
                </div>

                <div className="space-y-4">
                  <p className="text-sm font-black text-slate-400 uppercase tracking-wider px-4">Quick Select Signs :</p>
                  <div className="flex flex-wrap gap-2 px-2">
                    {predefinedSymptoms.map(s => (
                      <button 
                        key={s} 
                        onClick={() => addSymptom(s)}
                        className="bg-white hover:bg-rose-500 hover:text-white text-slate-500 border border-slate-100 px-4 py-2 rounded-xl text-sm font-bold uppercase tracking-wider transition-all active:scale-95 shadow-sm"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>

                <button 
                  onClick={handleAnalyze} 
                  disabled={loading || !symptomsInput}
                  className="w-full h-20 bg-slate-900 text-white rounded-[2rem] font-black text-xs uppercase tracking-wider shadow-xl shadow-slate-200 enabled:hover:bg-rose-600 enabled:hover:-translate-y-1 transition-all flex items-center justify-center gap-4 group disabled:opacity-30"
                >
                  {loading ? (
                    <><Loader2 size={24} className="animate-spin text-rose-400" /> Kisan Mitra is Thinking...</>
                  ) : (
                    <><Cpu size={24} className="text-rose-400" /> Find Disease</>
                  )}
                </button>
              </div>
           </div>
           
           <div className="bg-slate-900 rounded-[2.5rem] p-10 text-white flex items-center gap-8 border border-slate-800 shadow-xl group hover:-translate-y-1 transition-all">
              <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center shrink-0 group-hover:bg-rose-600 transition-colors">
                 <ShieldCheck size={32} className="text-rose-400 group-hover:text-white" />
              </div>
              <div className="space-y-1 relative z-10">
                 <h4 className="text-xl font-black uppercase tracking-tight">Doctor Help</h4>
                 <p className="text-sm font-medium text-slate-400 uppercase tracking-wider leading-relaxed">Serious problem? Call a local Vet immediately.</p>
              </div>
           </div>
        </div>

        {/* Results - Right Side */}
        <div className="xl:col-span-7 space-y-10">
          <div className="flex items-center gap-4 pb-4 border-b border-slate-100">
             <div className="w-10 h-10 bg-rose-50 rounded-xl flex items-center justify-center text-rose-500 shadow-sm">
                <Activity size={20} />
             </div>
             <h2 className="text-lg font-black text-slate-900 uppercase tracking-tight">Check Result</h2>
          </div>

          <div className="space-y-8">
            {results ? (
              results.length > 0 ? (
                results.map((r, i) => (
                  <div key={i} className={`group relative bg-white border rounded-[3rem] p-10 transition-all overflow-hidden flex flex-col hover:-translate-y-2 ${
                    i===0 ? 'border-rose-100 shadow-xl ring-4 ring-rose-50' : 'border-slate-100 shadow-lg'
                  }`}>
                    
                    {/* Color Bar */}
                    <div className={`absolute top-0 left-0 w-full h-3 ${
                       r.riskLevel === 'Critical' ? 'bg-rose-600' : 
                       r.riskLevel === 'High' ? 'bg-orange-500' : 'bg-amber-400'
                    }`}></div>
                    
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-8 relative z-10">
                      <div className="space-y-2">
                        <div className="flex items-center gap-3">
                           <span className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider border ${
                             r.riskLevel === 'Critical' ? 'bg-rose-600 text-white border-rose-700' : 
                             r.riskLevel === 'High' ? 'bg-orange-500 text-white border-orange-600' : 'bg-amber-400 text-slate-900 border-amber-500'
                           }`}>
                             {r.riskLevel} ALERT
                           </span>
                           <span className="text-xs font-black text-slate-300 uppercase tracking-wider">Result Found</span>
                        </div>
                        <h3 className="text-3xl font-black text-slate-900 uppercase tracking-tight group-hover:text-rose-600 transition-colors">{r.disease}</h3>
                      </div>
                      
                      <div className="bg-slate-50 px-8 py-5 rounded-3xl border border-slate-100 flex flex-col items-center">
                         <span className="text-xs font-black text-slate-400 uppercase tracking-wider mb-1 italic">Match Score</span>
                         <span className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-1">
                           {r.confidence} <span className="text-xs text-rose-500/50">%</span>
                         </span>
                      </div>
                    </div>

                    <div className="bg-slate-900 rounded-[2rem] p-8 border border-slate-800 space-y-6 relative z-10">
                      <div className="flex items-start gap-6">
                         <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center text-rose-500 shrink-0">
                            <ShieldAlert size={24} />
                         </div>
                         <div className="space-y-3">
                            <div className="flex items-center gap-2">
                               <TrendingUp size={12} className="text-rose-500" />
                               <p className="text-sm font-black text-rose-400 uppercase tracking-wider">How to fix this :</p>
                            </div>
                            <p className="text-white font-bold text-xl lg:text-2xl leading-tight">{r.action}</p>
                         </div>
                      </div>
                    </div>
                    
                    <div className="mt-8 flex items-center justify-between">
                       <div className="flex items-center gap-3">
                          <Waves size={16} className="text-rose-500 animate-pulse" />
                          <span className="text-xs font-black text-slate-300 uppercase tracking-wider italic">Analysis Done</span>
                       </div>
                       <button className="h-12 px-6 rounded-xl bg-slate-50 text-slate-900 text-sm font-black uppercase tracking-wider flex items-center gap-3 hover:bg-slate-900 hover:text-white transition-all">
                          See Details <ArrowRight size={16} />
                       </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="bg-slate-50 rounded-[3rem] p-24 text-center border-2 border-dashed border-slate-200 flex flex-col items-center gap-8">
                  <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center text-slate-200 shadow-lg">
                     <AlertTriangle size={40} className="text-slate-300" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight">No matching disease found</h3>
                    <p className="text-slate-400 font-bold text-sm uppercase tracking-wider max-w-sm mx-auto leading-relaxed">Could not identify a disease. Please provide more signs or try generic medicine.</p>
                  </div>
                </div>
              )
            ) : (
               <div className="h-full min-h-[400px] bg-slate-50/50 border-2 border-dashed border-slate-100 rounded-[3rem] flex flex-col items-center justify-center p-12 text-center group">
                 <div className="w-24 h-24 bg-white rounded-3xl flex items-center justify-center text-slate-200 mb-8 shadow-inner group-hover:scale-105 transition-transform">
                    <Scan size={48} className="opacity-10 group-hover:opacity-30" />
                 </div>
                 <h3 className="text-2xl font-black text-slate-300 uppercase tracking-tight italic">Waiting for you to select signs...</h3>
                 <div className="flex items-center gap-3 mt-6">
                    <div className="w-1.5 h-1.5 bg-slate-200 rounded-full animate-bounce"></div>
                    <div className="w-1.5 h-1.5 bg-slate-200 rounded-full animate-bounce delay-75"></div>
                    <div className="w-1.5 h-1.5 bg-slate-200 rounded-full animate-bounce delay-150"></div>
                 </div>
                 <p className="text-slate-200 font-black text-xs uppercase tracking-wider mt-8">Ready for check</p>
               </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
