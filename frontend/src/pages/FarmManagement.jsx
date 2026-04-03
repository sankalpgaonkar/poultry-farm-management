import { useState, useEffect } from 'react';
import api from '../utils/axios';
import { 
  Plus, 
  CheckCircle2, 
  MapPin, 
  Bird, 
  Activity, 
  Thermometer, 
  Database,
  ArrowRight,
  ShieldCheck,
  ChevronRight,
  TrendingUp,
  X,
  Cpu,
  Layers,
  Globe,
  Waves
} from 'lucide-react';

export default function FarmManagement() {
  const [farms, setFarms] = useState([]);
  const [showFarmModal, setShowFarmModal] = useState(false);
  const [showLogModal, setShowLogModal] = useState(false);
  const [selectedFarm, setSelectedFarm] = useState(null);
  const [loading, setLoading] = useState(true);

  // Form states
  const [farmName, setFarmName] = useState('');
  const [location, setLocation] = useState('');
  const [chickens, setChickens] = useState('');

  const [eggs, setEggs] = useState('');
  const [temperature, setTemperature] = useState('');
  const [feed, setFeed] = useState('');
  const [currentChickens, setCurrentChickens] = useState('');

  const fetchFarms = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/farms');
      setFarms(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFarms();
  }, []);

  const handleCreateFarm = async (e) => {
    e.preventDefault();
    try {
      await api.post('/farms', { name: farmName, location, totalChickens: Number(chickens) });
      setShowFarmModal(false);
      setFarmName(''); setLocation(''); setChickens('');
      fetchFarms();
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddLog = async (e) => {
    e.preventDefault();
    try {
      await api.post('/logs', {
        farmId: selectedFarm,
        totalEggs: Number(eggs),
        temperature: Number(temperature),
        feedConsumed: Number(feed),
        currentChickenCount: Number(currentChickens)
      });
      setShowLogModal(false);
      setEggs(''); setTemperature(''); setFeed(''); setCurrentChickens('');
      fetchFarms(); 
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-40 animate-pulse italic text-slate-300 font-bold uppercase tracking-wider">
        Loading your farms...
      </div>
    );
  }

  return (
    <div className="space-y-16 pb-20">
      
      {/* Cinematic Header Layer */}
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-end gap-12">
        <div className="space-y-6 max-w-3xl">
           <div className="inline-flex items-center gap-4 px-6 py-3 bg-white rounded-full border border-slate-100 shadow-sm">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-ping"></div>
              <span className="text-sm font-bold uppercase tracking-[0.2em] text-slate-400 italic">Farm List</span>
           </div>
           <h1 className="text-6xl lg:text-8xl font-black text-slate-950 tracking-tight uppercase leading-[0.85]">
              My Poultry <br /><span className="text-emerald-600">Farms.</span>
           </h1>
           <p className="text-slate-400 font-bold text-[12px] uppercase tracking-[0.1em] leading-loose max-w-xl">
             Manage your farms and update daily records. Track chickens, feed, and eggs easily.
           </p>
        </div>
        
        <button 
          onClick={() => setShowFarmModal(true)}
          className="h-24 px-12 bg-emerald-600 text-white rounded-[2.5rem] font-black text-sm uppercase tracking-[0.2em] hover:bg-emerald-700 hover:-translate-y-2 transition-all duration-700 shadow-4xl shadow-emerald-100 flex items-center justify-center gap-6 group"
        >
          <Plus size={28} className="group-hover:rotate-[360deg] transition-transform duration-1000" strokeWidth={3} />
          Add New Farm
        </button>
      </div>

      {farms.length === 0 ? (
        <div className="bg-slate-50/50 rounded-[4.5rem] p-40 text-center border-2 border-dashed border-slate-200 flex flex-col items-center gap-10 relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:24px_24px] opacity-50"></div>
          <div className="w-28 h-28 bg-white rounded-[2.8rem] flex items-center justify-center text-slate-200 shadow-3xl relative z-10">
             <Database size={56} strokeWidth={1.5} />
          </div>
          <div className="space-y-4 relative z-10">
            <h3 className="text-3xl font-black text-slate-950 uppercase tracking-tight">No farms added yet</h3>
            <p className="text-slate-400 font-bold text-sm uppercase tracking-[0.2em] max-w-xs mx-auto italic">Click the button below to add your first poultry farm.</p>
          </div>
          <button onClick={() => setShowFarmModal(true)} className="px-12 py-6 bg-emerald-600 text-white rounded-[1.8rem] font-black text-sm uppercase tracking-[0.2em] hover:bg-emerald-700 transition-all relative z-10 shadow-3xl shadow-emerald-100">Add First Farm</button>
        </div>
      ) : (
        <div className="grid gap-12 sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
          {farms.map((farm) => (
            <div key={farm._id} className="group relative bg-white border border-slate-100 rounded-[4rem] p-12 hover:shadow-4xl transition-all duration-1000 overflow-hidden flex flex-col hover:-translate-y-4">
              
              {/* Background Aesthetic Nodes */}
              <div className="absolute top-0 right-0 w-48 h-48 bg-slate-50/50 rounded-full translate-x-12 -translate-y-12 group-hover:bg-emerald-50 transition-colors duration-1000"></div>
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-emerald-500/5 blur-[80px] opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
              
              <div className="flex justify-between items-start mb-12 relative z-10">
                <div className="space-y-3">
                   <div className="flex items-center gap-3">
                      <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full shadow-[0_0_8px_rgba(16,185,129,1)]"></div>
                      <span className="text-xs font-bold text-emerald-500 uppercase tracking-wider italic leading-none">Running</span>
                   </div>
                   <h3 className="text-3xl font-black text-slate-950 uppercase tracking-tight group-hover:text-emerald-600 transition-colors leading-[0.9]">{farm.name}</h3>
                   <div className="flex items-center gap-2 text-slate-400 text-sm font-bold uppercase tracking-[0.1em]">
                      <MapPin size={12} className="text-emerald-500/60" /> {farm.location}
                   </div>
                </div>
                <div className="px-5 py-2.5 bg-white border border-slate-100 rounded-2xl text-xs font-bold uppercase tracking-[0.1em] flex items-center gap-3 shadow-xl shadow-slate-100/50 text-slate-600 group-hover:border-emerald-200 group-hover:text-emerald-600 transition-colors">
                   <ShieldCheck size={14} className="text-emerald-500" /> Everything OK
                </div>
              </div>

              <div className="bg-slate-50 rounded-[2.5rem] p-10 border border-slate-100 space-y-8 mb-12 relative z-10 group-hover:bg-white group-hover:shadow-3xl transition-all duration-700">
                <div className="flex justify-between items-center">
                  <div className="space-y-2">
                     <span className="text-xs font-bold text-slate-300 uppercase tracking-[0.2em] italic block">Chickens in Farm</span>
                     <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-slate-400 shadow-sm border border-slate-100">
                           <Bird size={24} strokeWidth={2.5} />
                        </div>
                        <span className="text-5xl font-black text-slate-950 tracking-tight tabular-nums leading-none">{farm.totalChickens}</span>
                     </div>
                  </div>
                  <div className="text-right">
                     <p className="text-[20px] font-black text-emerald-500 tracking-tight leading-none mb-1">92%</p>
                     <p className="text-xs font-bold text-slate-300 uppercase tracking-wider leading-none">Capacity</p>
                  </div>
                </div>
                
                <div className="h-3 w-full bg-slate-200/50 rounded-full overflow-hidden">
                   <div className="h-full bg-emerald-500 rounded-full transition-all duration-1000 group-hover:shadow-[0_0_15px_rgba(16,185,129,0.5)]" style={{ width: `${Math.min((farm.totalChickens / 1000) * 100, 100)}%` }}></div>
                </div>
              </div>

              <button
                onClick={() => { 
                  setSelectedFarm(farm._id); 
                  setCurrentChickens(farm.totalChickens);
                  setShowLogModal(true); 
                }}
                className="w-full h-20 bg-emerald-600 text-white font-black text-sm uppercase tracking-[0.2em] rounded-[1.8rem] hover:bg-emerald-700 hover:-translate-y-2 transition-all duration-700 flex items-center justify-center gap-4 group/btn relative z-10 shadow-3xl shadow-emerald-100"
              >
                Update Daily Data <ChevronRight size={16} className="group-hover/btn:translate-x-2 transition-transform duration-500" strokeWidth={3} />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Initialize Farm Modal */}
      {showFarmModal && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-6 sm:p-12">
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-3xl animate-in fade-in duration-500" onClick={() => setShowFarmModal(false)} />
          <div className="relative bg-white rounded-[5rem] p-16 md:p-24 w-full max-w-3xl shadow-4xl overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-20 duration-700">
            <div className="absolute top-0 left-0 w-full h-4 bg-gradient-to-r from-emerald-600 to-emerald-400" />
            
            <div className="flex justify-between items-start mb-16 relative z-10">
               <div className="space-y-4">
                  <h2 className="text-5xl lg:text-6xl font-black text-slate-950 uppercase tracking-tight leading-[0.9]">Add New <br /><span className="text-emerald-600">Farm.</span></h2>
                  <p className="text-sm font-bold text-slate-400 uppercase tracking-[0.2em] italic">Enter details to start tracking</p>
               </div>
               <button onClick={() => setShowFarmModal(false)} className="w-16 h-16 rounded-3xl bg-slate-50 flex items-center justify-center text-slate-400 hover:text-rose-500 hover:scale-110 transition-all border border-slate-100">
                  <X size={32} strokeWidth={2.5} />
               </button>
            </div>

            <form onSubmit={handleCreateFarm} className="space-y-12 relative z-10">
              <div className="space-y-6">
                <label className="block text-sm font-bold uppercase text-slate-400 tracking-[0.2em] px-4">Farm Name</label>
                <div className="relative">
                   <div className="absolute left-10 top-1/2 -translate-y-1/2 text-emerald-500">
                      <Cpu size={24} />
                   </div>
                   <input required type="text" placeholder="e.g. My Big Farm" className="w-full bg-slate-50 border border-slate-100 pl-24 pr-12 h-20 rounded-[1.8rem] focus:ring-8 focus:ring-emerald-500/5 outline-none focus:border-emerald-500/30 font-bold text-sm uppercase tracking-[0.1em] transition-all" value={farmName} onChange={e => setFarmName(e.target.value)} />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-6">
                   <label className="block text-sm font-bold uppercase text-slate-400 tracking-[0.2em] px-4">Location (City/Village)</label>
                   <div className="relative">
                      <MapPin className="absolute left-10 top-1/2 -translate-y-1/2 text-slate-300" size={24} />
                      <input required type="text" placeholder="e.g. Karnal, Haryana" className="w-full bg-slate-50 border border-slate-100 pl-24 pr-12 h-20 rounded-[1.8rem] focus:ring-8 focus:ring-emerald-500/5 outline-none focus:border-emerald-500/30 font-bold text-sm uppercase tracking-[0.1em] transition-all" value={location} onChange={e => setLocation(e.target.value)} />
                   </div>
                </div>
                <div className="space-y-6">
                   <label className="block text-sm font-bold uppercase text-slate-400 tracking-[0.2em] px-4">Number of Chickens</label>
                   <div className="relative">
                      <Bird className="absolute left-10 top-1/2 -translate-y-1/2 text-slate-300" size={24} />
                      <input required type="number" className="w-full bg-slate-50 border border-slate-100 pl-24 pr-12 h-20 rounded-[1.8rem] focus:ring-8 focus:ring-emerald-500/5 outline-none focus:border-emerald-500/30 font-bold text-sm transition-all shadow-inner" value={chickens} onChange={e => setChickens(e.target.value)} />
                   </div>
                </div>
              </div>
              
              <div className="pt-10 flex flex-col sm:flex-row gap-6">
                <button type="submit" className="flex-1 h-24 bg-emerald-600 text-white rounded-[2.2rem] font-black uppercase tracking-[0.2em] text-[12px] shadow-4xl shadow-emerald-100 hover:bg-emerald-700 hover:-translate-y-2 transition-all duration-700 flex items-center justify-center gap-6 group/submit">
                   Save Farm <ShieldCheck size={28} className="group-hover/submit:scale-125 transition-transform" strokeWidth={2.5} />
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Daily Data Log Modal */}
      {showLogModal && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-6 sm:p-12">
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-3xl animate-in fade-in duration-500" onClick={() => setShowLogModal(false)} />
          <div className="relative bg-white rounded-[5rem] p-16 md:p-24 w-full max-w-3xl shadow-4xl overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-20 duration-700">
            <div className="absolute top-0 left-0 w-full h-4 bg-emerald-600" />
            
            <div className="flex justify-between items-start mb-16 relative z-10">
               <div className="space-y-4">
                  <h2 className="text-5xl lg:text-6xl font-black text-slate-950 uppercase tracking-tight leading-[0.9]">Daily <br /><span className="text-emerald-600">Entry.</span></h2>
                  <p className="text-sm font-bold text-slate-400 uppercase tracking-[0.2em] italic">Update daily numbers for your farm</p>
               </div>
               <button onClick={() => setShowLogModal(false)} className="w-16 h-16 rounded-3xl bg-slate-50 flex items-center justify-center text-slate-400 hover:text-rose-500 hover:scale-110 transition-all border border-slate-100">
                  <X size={32} strokeWidth={2.5} />
               </button>
            </div>

            <form onSubmit={handleAddLog} className="space-y-12 relative z-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-6">
                  <label className="block text-sm font-bold uppercase text-slate-400 tracking-[0.2em] px-4">Total Chickens Now</label>
                  <div className="relative">
                     <Bird className="absolute left-10 top-1/2 -translate-y-1/2 text-slate-300" size={24} />
                     <input required type="number" className="w-full bg-slate-50 border border-slate-100 pl-24 pr-12 h-20 rounded-[1.8rem] focus:ring-8 focus:ring-emerald-500/5 outline-none focus:border-emerald-500/30 font-bold text-sm text-slate-950 transition-all" value={currentChickens} onChange={e => setCurrentChickens(e.target.value)} />
                  </div>
                </div>
                <div className="space-y-6">
                  <label className="block text-sm font-bold uppercase text-slate-400 tracking-[0.2em] px-4">Eggs Collected Today</label>
                  <div className="relative">
                      <div className="absolute left-10 top-1/2 -translate-y-1/2 w-6 h-8 bg-amber-100 rounded-full border border-amber-200"></div>
                      <input required type="number" className="w-full bg-slate-50 border border-slate-100 pl-24 pr-12 h-20 rounded-[1.8rem] focus:ring-8 focus:ring-emerald-500/5 outline-none focus:border-emerald-500/30 font-bold text-sm text-slate-950 transition-all" value={eggs} onChange={e => setEggs(e.target.value)} />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-6">
                   <label className="block text-sm font-bold uppercase text-slate-400 tracking-[0.2em] px-4">Temperature (°C)</label>
                   <div className="relative">
                      <Thermometer className="absolute left-10 top-1/2 -translate-y-1/2 text-rose-500/60" size={24} />
                      <input required type="number" step="0.1" className="w-full bg-slate-50 border border-slate-100 pl-24 pr-12 h-20 rounded-[1.8rem] focus:ring-8 focus:ring-emerald-500/5 outline-none focus:border-emerald-500/30 font-bold text-sm text-slate-950 transition-all" value={temperature} onChange={e => setTemperature(e.target.value)} />
                   </div>
                </div>
                <div className="space-y-6">
                   <label className="block text-sm font-bold uppercase text-slate-400 tracking-[0.2em] px-4">Feed Used (kg)</label>
                   <div className="relative">
                      <Layers className="absolute left-10 top-1/2 -translate-y-1/2 text-slate-300" size={24} />
                      <input required type="number" className="w-full bg-slate-50 border border-slate-100 pl-24 pr-12 h-20 rounded-[1.8rem] focus:ring-8 focus:ring-emerald-500/5 outline-none focus:border-emerald-500/30 font-bold text-sm text-slate-950 transition-all" value={feed} onChange={e => setFeed(e.target.value)} />
                   </div>
                </div>
              </div>

              <div className="pt-10 flex flex-col sm:flex-row gap-6">
                <button type="submit" className="flex-1 h-24 bg-emerald-600 text-white rounded-[2.2rem] font-black uppercase tracking-[0.2em] text-[12px] shadow-4xl shadow-emerald-100 hover:bg-emerald-700 hover:-translate-y-2 transition-all duration-700 flex items-center justify-center gap-6 group/submit">
                   Save Daily Record <Activity size={28} className="group-hover/submit:animate-bounce transition-all" strokeWidth={2.5} />
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
