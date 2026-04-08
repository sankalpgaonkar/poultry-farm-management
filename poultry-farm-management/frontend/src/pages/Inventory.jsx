import { useState, useEffect } from 'react';
import api from '../utils/axios';
import { 
  Package, 
  Plus, 
  AlertCircle, 
  Trash2, 
  Camera, 
  Loader2, 
  Sparkles,
  BarChart3,
  Search,
  ArrowRight,
  ShieldAlert,
  Calendar,
  Layers,
  Zap,
  ChevronRight,
  X
} from 'lucide-react';

export default function Inventory() {
  const [items, setItems] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ itemName: '', category: 'Feed', quantity: '', unit: 'kg', lowStockThreshold: '', dailyConsumptionRate: '' });
  const [isScanning, setIsScanning] = useState(false);
  const [search, setSearch] = useState('');

  const fetchInventory = async () => {
    try {
      const res = await api.get('/inventory');
      setItems(res.data.items);
      setAlerts(res.data.alerts);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  const filteredItems = items.filter(item => 
    item.itemName.toLowerCase().includes(search.toLowerCase()) ||
    item.category.toLowerCase().includes(search.toLowerCase())
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        quantity: Number(formData.quantity) || 0,
        lowStockThreshold: Number(formData.lowStockThreshold) || 10,
        dailyConsumptionRate: Number(formData.dailyConsumptionRate) || 0
      };

      await api.post('/inventory', payload);
      setShowModal(false);
      setFormData({ itemName: '', category: 'Feed', quantity: '', unit: 'kg', lowStockThreshold: '', dailyConsumptionRate: '' });
      fetchInventory();
    } catch (err) {
      console.error(err);
    }
  };

  const deleteItem = async (id) => {
    if(!window.confirm('Do you want to remove this item from your stock?')) return;
    try {
      await api.delete(`/inventory/${id}`);
      fetchInventory();
    } catch (err) {
      console.error(err);
    }
  };

  const handleSmartLog = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsScanning(true);
    const formDataUpload = new FormData();
    formDataUpload.append('photo', file);

    try {
      const { data } = await api.post('/ai/process-photo', formDataUpload, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      setFormData(prev => ({
        ...prev,
        itemName: data.itemName,
        category: data.category || 'Feed',
        quantity: data.quantity,
        unit: data.unit
      }));
      setShowModal(true);
    } catch (err) {
      alert('Kisan Mitra: Could not read the photo. Please try again with a clearer picture.');
    } finally {
      setIsScanning(false);
    }
  };

  return (
    <div className="space-y-12 pb-20">
      
      {/* Balanced Header Layer */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-8 bg-white p-8 rounded-[2rem] border border-slate-100 shadow-soft relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-50/50 rounded-full translate-x-32 -translate-y-32 blur-3xl opacity-30"></div>
        
        <div className="space-y-4 relative z-10">
           <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-emerald-50 rounded-full border border-emerald-100">
              <span className="text-[11px] font-bold uppercase tracking-widest text-emerald-600">Stock Center</span>
           </div>
           <h1 className="text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
              Farm <span className="text-emerald-600">Inventory</span>
           </h1>
           <p className="text-slate-500 font-medium text-sm leading-relaxed max-w-xl">
             Keep track of your feed, medicine, and equipment. We'll alert you when items are running low.
           </p>
        </div>
        
        <div className="flex flex-wrap items-center gap-4 relative z-10 w-full lg:w-auto">
           <label className={`group cursor-pointer ${isScanning ? 'opacity-50 pointer-events-none' : ''} h-14 px-6 bg-slate-900 border border-slate-800 text-white rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-3 transition-all hover:bg-slate-800 shadow-lg`}>
              {isScanning ? <Loader2 size={18} className="animate-spin text-emerald-400" /> : <Camera size={18} className="text-emerald-400" />}
              {isScanning ? 'Scanning...' : 'Smart Scan'}
              <input type="file" className="hidden" accept="image/*" onChange={handleSmartLog} />
           </label>
           
           <button 
             onClick={() => setShowModal(true)}
             className="flex-1 lg:flex-none h-14 px-8 bg-emerald-600 text-white rounded-xl font-bold text-xs uppercase tracking-wider hover:bg-emerald-700 transition-all shadow-lg flex items-center justify-center gap-3"
           >
              <Plus size={18} />
              Add Item
           </button>
        </div>
      </div>


      {alerts.length > 0 && (
        <div className="relative overflow-hidden bg-rose-50 border border-slate-100 rounded-[2rem] p-8 flex flex-col md:flex-row gap-8 items-center shadow-soft">
          <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-rose-500 border border-rose-100 shadow-sm shrink-0">
             <ShieldAlert size={32} className="animate-pulse" />
          </div>
          <div className="flex-1 space-y-1.5 text-center md:text-left">
            <h3 className="text-lg font-bold text-slate-900 tracking-tight">Low Stock Alert</h3>
            <div className="flex flex-wrap justify-center md:justify-start gap-4">
              {alerts.map((a, i) => (
                <div key={i} className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                   <div className="w-1 w-1 bg-rose-400 rounded-full"></div> {a}
                </div>
              ))}
            </div>
          </div>
          <button onClick={() => window.location.href='/farmer/store'} className="px-6 py-3.5 bg-rose-600 text-white rounded-xl font-bold text-xs uppercase tracking-wider hover:bg-rose-700 transition-all shadow-md flex items-center gap-2">
             Restock Now <ArrowRight size={14} />
          </button>
        </div>
      )}


      {/* Item List */}
      <div className="space-y-6">
        <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-soft flex flex-col md:flex-row justify-between items-center gap-6">
           <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center text-white shadow-md shadow-emerald-100">
                 <Package size={20} />
              </div>
              <h2 className="text-lg font-bold text-slate-900 tracking-tight leading-none">Stock List</h2>
           </div>
           
           <div className="relative group w-full md:w-96">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-emerald-500 transition-colors" size={18} />
              <input 
                type="text" 
                placeholder="Search inventory items..." 
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-12 pr-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all font-semibold text-sm text-slate-900 placeholder:text-slate-400"
              />
           </div>
        </div>


        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredItems.map(item => {
            const isLow = item.quantity <= item.lowStockThreshold;
            const daysLeft = item.dailyConsumptionRate > 0 ? Math.floor(item.quantity / item.dailyConsumptionRate) : '---';

            return (
              <div key={item._id} className="group bg-white border border-slate-100 rounded-[2rem] p-6 hover:shadow-strong transition-all duration-300 flex flex-col">
                 <div className="flex justify-between items-start mb-6">
                    <div className="space-y-1">
                       <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{item.category}</span>
                       <h4 className="text-xl font-bold text-slate-900 leading-tight group-hover:text-emerald-600 transition-colors truncate">{item.itemName}</h4>
                    </div>
                    {isLow && (
                       <div className="bg-rose-50 text-rose-600 px-3 py-1.5 rounded-lg border border-rose-100 flex items-center gap-2 animate-pulse shrink-0">
                          <ShieldAlert size={12} strokeWidth={2.5} />
                          <span className="text-[10px] font-bold uppercase tracking-wider">Low</span>
                       </div>
                    )}
                 </div>

                 <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 space-y-6 mb-8">
                    <div className="flex justify-between items-end">
                       <div className="space-y-1">
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Quantity Left</span>
                          <div className="flex items-baseline gap-2">
                             <span className={`text-4xl font-extrabold tracking-tight tabular-nums ${isLow ? 'text-rose-600' : 'text-slate-900'}`}>{item.quantity}</span>
                             <span className="text-xs font-bold text-slate-400 uppercase text-slate-400">{item.unit}</span>
                          </div>
                       </div>
                    </div>
                    
                    <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
                       <div className={`h-full rounded-full transition-all duration-1000 ${isLow ? 'bg-rose-500' : 'bg-emerald-500'}`} style={{ width: `${Math.min((item.quantity / (item.lowStockThreshold * 3 || 1)) * 100, 100)}%` }}></div>
                    </div>
                 </div>

                 <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-100 mt-auto">
                    <div className="flex items-center gap-1.5 text-slate-400 font-bold text-[10px] uppercase tracking-wider">
                       <Calendar size={12} className="text-emerald-500" /> {daysLeft} Days Left
                    </div>
                    <div className="flex items-center gap-3">
                       <button 
                         onClick={() => deleteItem(item._id)} 
                         className="w-10 h-10 bg-slate-50 text-slate-300 rounded-lg flex items-center justify-center hover:text-rose-600 hover:bg-rose-50 transition-all"
                       >
                          <Trash2 size={16} />
                       </button>
                    </div>
                 </div>
              </div>
            );
          })}

          
          {filteredItems.length === 0 && (
            <div className="py-20 text-center space-y-4">
              <Package size={48} className="mx-auto text-slate-200" />
              <p className="text-slate-400 font-black text-xs uppercase tracking-wider">No items found. Add something new!</p>
            </div>
          )}
        </div>
      </div>

      {/* Add New Item Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-md animate-in fade-in" onClick={() => setShowModal(false)} />
          <div className="relative bg-white rounded-[3rem] p-10 md:p-12 w-full max-w-2xl shadow-2xl overflow-hidden animate-in zoom-in-95">
            <div className="absolute top-0 left-0 w-full h-2 bg-emerald-600" />
            
            <div className="flex justify-between items-start mb-10">
               <div className="space-y-1">
                  <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tight flex items-center gap-3">
                     Add to <span className="text-emerald-600">Stock.</span> <Sparkles size={24} className="text-emerald-400" />
                  </h2>
                  <p className="text-sm font-black text-slate-400 uppercase tracking-wider">Adding a new item to your farm stock</p>
               </div>
               <button onClick={() => setShowModal(false)} className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 hover:text-rose-500 transition-all">
                  <X size={20} />
               </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-3">
                <label className="block text-sm font-black uppercase text-slate-500 tracking-wider px-2">Item Name</label>
                <div className="relative">
                   <Package className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                   <input required type="text" className="w-full bg-slate-50 border border-slate-100 pl-14 pr-6 py-4 rounded-2xl focus:ring-4 focus:ring-emerald-500/10 outline-none focus:border-emerald-500 font-bold text-xs uppercase tracking-wider text-slate-900 transition-all" placeholder="e.g. Broiler Feed Bag" value={formData.itemName} onChange={e=>setFormData({...formData, itemName: e.target.value})} />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <label className="block text-sm font-black uppercase text-slate-500 tracking-wider px-2">Category</label>
                  <select value={formData.category} onChange={e=>setFormData({...formData, category: e.target.value})} className="w-full bg-slate-50 border border-slate-100 px-6 py-4 rounded-2xl focus:ring-4 focus:ring-emerald-500/10 outline-none focus:border-emerald-500 font-bold text-xs uppercase tracking-wider text-slate-900 transition-all appearance-none cursor-pointer">
                    <option value="Feed">Feed</option>
                    <option value="Medicine">Medicine</option>
                    <option value="Equipment">Equipment</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div className="space-y-3">
                  <label className="block text-sm font-black uppercase text-slate-500 tracking-wider px-2">Unit (kg/bags/L)</label>
                  <input required type="text" className="w-full bg-slate-50 border border-slate-100 px-6 py-4 rounded-2xl focus:ring-4 focus:ring-emerald-500/10 outline-none focus:border-emerald-500 font-bold text-xs uppercase tracking-wider text-slate-900 transition-all" placeholder="kg / Bags / L" value={formData.unit} onChange={e=>setFormData({...formData, unit: e.target.value})} />
                </div>
                <div className="space-y-3">
                  <label className="block text-sm font-black uppercase text-slate-500 tracking-wider px-2">Total Quantity</label>
                  <div className="relative">
                    <Layers className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                    <input required type="number" className="w-full bg-slate-50 border border-slate-100 pl-14 pr-6 py-4 rounded-2xl focus:ring-4 focus:ring-emerald-500/10 outline-none focus:border-emerald-500 font-bold text-xs text-slate-900 transition-all" value={formData.quantity} onChange={e=>setFormData({...formData, quantity: e.target.value})} />
                  </div>
                </div>
                <div className="space-y-3">
                   <label className="block text-sm font-black uppercase text-slate-500 tracking-wider px-2">Alert Me When Low (Count)</label>
                   <div className="relative">
                     <ShieldAlert className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                     <input required type="number" className="w-full bg-slate-50 border border-slate-100 pl-14 pr-6 py-4 rounded-2xl focus:ring-4 focus:ring-emerald-500/10 outline-none focus:border-emerald-500 font-bold text-xs text-slate-900 transition-all" value={formData.lowStockThreshold} onChange={e=>setFormData({...formData, lowStockThreshold: e.target.value})} />
                   </div>
                </div>
              </div>

              <div className="space-y-3">
                <label className="block text-sm font-black uppercase text-slate-500 tracking-wider px-2">Used Daily (Amount)</label>
                <div className="relative">
                  <Activity className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                  <input type="number" step="0.1" className="w-full bg-slate-50 border border-slate-100 pl-14 pr-6 py-4 rounded-2xl focus:ring-4 focus:ring-emerald-500/10 outline-none focus:border-emerald-500 font-bold text-xs text-slate-900 transition-all" value={formData.dailyConsumptionRate} onChange={e=>setFormData({...formData, dailyConsumptionRate: e.target.value})} />
                </div>
              </div>

              <div className="pt-6">
                <button type="submit" className="w-full h-18 bg-emerald-600 text-white rounded-2xl font-black uppercase tracking-wider text-sm shadow-lg shadow-emerald-100 hover:bg-emerald-700 transition-all flex items-center justify-center gap-3">
                   Save to Stock <ChevronRight size={18} />
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
