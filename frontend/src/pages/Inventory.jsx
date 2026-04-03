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
      
      {/* Simple Header */}
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-end gap-10">
        <div className="space-y-4 max-w-2xl">
           <div className="inline-flex items-center gap-3 px-4 py-2 bg-emerald-50 rounded-full border border-emerald-100">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-black uppercase tracking-wider text-emerald-600">Stock Room</span>
           </div>
           <h1 className="text-4xl lg:text-7xl font-black text-slate-900 tracking-tight uppercase leading-none">
              My <span className="text-emerald-600">Stock.</span>
           </h1>
           <p className="text-slate-500 font-medium text-lg leading-relaxed">
             Keep track of your feed, medicine, and equipment to make sure you never run out unexpectedly.
           </p>
        </div>
        
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full xl:w-auto">
           <label className={`group cursor-pointer ${isScanning ? 'opacity-50 pointer-events-none' : ''} h-20 px-8 bg-white border border-slate-200 text-slate-900 rounded-3xl font-black text-sm uppercase tracking-wider flex items-center justify-center gap-4 transition-all hover:bg-slate-50 shadow-xl`}>
              {isScanning ? <Loader2 size={24} className="animate-spin text-emerald-600" /> : <Camera size={24} className="text-emerald-600 group-hover:scale-110 transition-transform" />}
              {isScanning ? 'Kisan Mitra is Scanning...' : 'Scan Bag/Bottle'}
              <input type="file" className="hidden" accept="image/*" onChange={handleSmartLog} />
           </label>
           
           <button 
             onClick={() => setShowModal(true)}
             className="w-full sm:w-auto h-20 px-10 bg-emerald-600 text-white rounded-3xl font-black text-sm uppercase tracking-wider hover:bg-emerald-700 hover:-translate-y-1 transition-all shadow-xl shadow-emerald-100 flex items-center justify-center gap-4 group"
           >
             <Plus size={24} className="group-hover:rotate-90 transition-transform duration-500" />
             Add New Item
           </button>
        </div>
      </div>

      {alerts.length > 0 && (
        <div className="relative overflow-hidden bg-rose-50 border border-rose-100 rounded-[2.5rem] p-10 flex flex-col md:flex-row gap-8 items-center animate-in slide-in-from-top-10 duration-700">
          <div className="w-16 h-16 bg-rose-100 rounded-2xl flex items-center justify-center text-rose-600 shrink-0">
             <ShieldAlert size={36} className="animate-pulse" />
          </div>
          <div className="flex-1 space-y-2 text-center md:text-left">
            <h3 className="text-xl font-black text-rose-900 uppercase tracking-tight leading-none">
               Low Stock Alert!
            </h3>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-1">
              {alerts.map((a, i) => (
                <li key={i} className="text-sm font-bold text-rose-700/70 uppercase tracking-wider flex items-center gap-2">
                   <div className="w-1.5 h-1.5 bg-rose-400 rounded-full"></div> {a}
                </li>
              ))}
            </ul>
          </div>
          <button onClick={() => window.location.href='/farmer/store'} className="px-8 py-4 bg-rose-600 text-white rounded-xl font-black text-sm uppercase tracking-wider hover:bg-rose-700 transition-all shadow-lg flex items-center gap-3">
             Buy Now <ArrowRight size={14} />
          </button>
        </div>
      )}

      {/* Item List */}
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 pb-4">
           <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-white">
                 <Package size={20} />
              </div>
              <h2 className="text-lg font-black text-slate-900 uppercase tracking-tight">My Items List</h2>
           </div>
           
           <div className="relative group w-full md:w-80">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
              <input 
                type="text" 
                placeholder="Search for feed, medicine..." 
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-12 pr-6 py-4 bg-white border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all font-bold text-xs text-slate-900 placeholder:text-slate-300"
              />
           </div>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {filteredItems.map(item => {
            const daysLeft = item.dailyConsumptionRate > 0 ? Math.floor(item.quantity / item.dailyConsumptionRate) : '---';
            const isLow = item.quantity <= item.lowStockThreshold;
            
            return (
              <div key={item._id} className="group bg-white border border-slate-100 rounded-3xl p-6 hover:shadow-xl transition-all duration-500 flex flex-col md:flex-row items-center gap-6 md:gap-8">
                <div className="flex items-center gap-6 flex-1 w-full">
                   <div className={`w-16 h-16 rounded-2xl flex items-center justify-center border-2 ${isLow ? 'bg-rose-50 border-rose-100 text-rose-500' : 'bg-emerald-50 border-emerald-100 text-emerald-600'} shrink-0 group-hover:scale-105 transition-transform`}>
                      {item.category === 'Feed' ? <Zap size={28} /> : item.category === 'Medicine' ? <Activity size={28} /> : <Package size={28} />}
                   </div>
                   <div className="flex-1 space-y-1">
                      <span className="text-xs font-black uppercase tracking-wider text-slate-300">{item.category}</span>
                      <h4 className="text-lg font-black text-slate-900 uppercase tracking-tight group-hover:text-emerald-600 transition-colors">{item.itemName}</h4>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-slate-400">STOPS AT:</span>
                        <span className="text-sm font-black text-slate-900">{item.lowStockThreshold} {item.unit}</span>
                      </div>
                   </div>
                </div>

                <div className="grid grid-cols-2 gap-8 w-full md:w-auto px-6 border-l border-slate-100">
                   <div className="space-y-0.5">
                      <span className="text-xs font-black text-slate-400 uppercase tracking-wider">Left in Stock</span>
                      <p className={`text-2xl font-black tracking-tight ${isLow ? 'text-rose-600' : 'text-slate-900'}`}>
                        {item.quantity} <span className="text-xs font-bold text-slate-300">{item.unit}</span>
                      </p>
                   </div>
                   <div className="space-y-0.5">
                      <span className="text-xs font-black text-slate-400 uppercase tracking-wider">Will Finish in</span>
                      <div className="flex items-center gap-1.5">
                         <Calendar size={14} className="text-emerald-600" />
                         <p className="text-2xl font-black text-slate-900 tracking-tight">{daysLeft} <span className="text-xs font-bold text-slate-300">Days</span></p>
                      </div>
                   </div>
                </div>

                <div className="flex items-center gap-3 w-full md:w-auto">
                   <button 
                     onClick={() => deleteItem(item._id)} 
                     className="w-12 h-12 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-center text-slate-300 hover:text-rose-500 hover:bg-rose-50 hover:border-rose-100 transition-all"
                   >
                      <Trash2 size={18} />
                   </button>
                   <div className="w-12 h-12 bg-slate-900 text-white rounded-xl flex items-center justify-center group-hover:bg-emerald-600 transition-all">
                      <ChevronRight size={18} />
                   </div>
                </div>
              </div>
            )
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
