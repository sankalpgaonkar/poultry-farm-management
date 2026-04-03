import { useState, useEffect } from 'react';
import api from '../utils/axios';
import { 
  Plus, 
  Package, 
  Trash2, 
  Activity, 
  ArrowRight, 
  CheckCircle2,
  TrendingUp,
  BarChart3,
  Layers,
  Zap,
  ArrowUpRight,
  ShieldCheck,
  User,
  X
} from 'lucide-react';
import { getConsistentImage } from '../utils/imageConstants';

export default function FarmerMarketplace() {
  const [listings, setListings] = useState([]);
  const [orders, setOrders] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);

  const [productName, setProductName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [price, setPrice] = useState('');

  const fetchData = async () => {
    try {
      setLoading(true);
      const [resListings, resOrders] = await Promise.all([
        api.get('/marketplace/my-listings'),
        api.get('/marketplace/orders')
      ]);
      setListings(resListings.data);
      setOrders(resOrders.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const getProductImage = (title) => getConsistentImage(title);

  const handleCreateListing = async (e) => {
    e.preventDefault();
    try {
      await api.post('/marketplace', {
        productName,
        quantity: Number(quantity),
        pricePerUnit: Number(price)
      });
      setShowModal(false);
      setProductName(''); setQuantity(''); setPrice('');
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteListing = async (id) => {
    if (!window.confirm("Authorize de-listing? Signal will be permanent.")) return;
    try {
      await api.delete(`/marketplace/${id}`);
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateOrder = async (orderId, status) => {
    try {
      await api.put(`/marketplace/orders/${orderId}/status`, { status });
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 animate-pulse">
        <div className="w-20 h-20 bg-slate-100 rounded-[2.5rem] mb-6"></div>
        <div className="h-4 w-64 bg-slate-100 rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="space-y-16 pb-20">
      
      {/* Cinematic Header Layer */}
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-end gap-10">
        <div className="space-y-4 max-w-2xl">
           <div className="inline-flex items-center gap-3 px-5 py-3 bg-slate-100 rounded-full border border-slate-200">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-ping"></div>
              <span className="text-xs font-black uppercase tracking-wider text-slate-500">Commercial Node Terminal</span>
           </div>
           <h1 className="text-farmer-title text-6xl lg:text-8xl font-black text-slate-900 tracking-tight uppercase leading-tight">
              Market <span className="text-emerald-600">Commander.</span>
           </h1>
           <p className="text-slate-400 font-medium text-xl leading-relaxed">
             Deploy farm assets to the global exchange. Monitor liquidity, fulfill inbound requests, and optimize your market positioning.
           </p>
        </div>
        
        <div className="flex flex-col sm:flex-row items-center gap-6 w-full xl:w-auto">
           <div className="flex-1 xl:flex-none px-8 py-6 bg-white border border-slate-50 rounded-[2.5rem] shadow-2xl shadow-slate-100 flex items-center gap-6">
              <div className="space-y-1">
                 <span className="text-xs font-black uppercase text-slate-400 tracking-wider">Active Listings</span>
                 <h4 className="text-3xl font-black text-slate-950 tracking-tight leading-none">{listings.length} <span className="text-slate-300 text-sm italic font-medium">Nodes</span></h4>
              </div>
           </div>
           
           <button 
             onClick={() => setShowModal(true)}
             className="w-full sm:w-auto h-20 px-12 bg-slate-950 text-white rounded-[2rem] font-black text-sm uppercase tracking-wider hover:bg-emerald-600 hover:-translate-y-1 transition-all duration-500 shadow-3xl shadow-slate-200 flex items-center justify-center gap-4 group"
           >
             <Plus size={24} className="group-hover:rotate-90 transition-transform duration-500" />
             Initiate Listing
           </button>
        </div>
      </div>

      {/* Active Inventory Section */}
      <section className="space-y-10">
        <div className="flex items-center justify-between pb-6 border-b border-slate-50">
           <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white rounded-2xl border border-slate-100 flex items-center justify-center text-emerald-600 shadow-sm">
                 <Package size={22} />
              </div>
              <div>
                 <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight">Live Assets</h2>
                 <p className="text-sm font-black text-slate-400 uppercase tracking-wider mt-1">Global Exchange Presence</p>
              </div>
           </div>
           <div className="hidden md:flex items-center gap-4 h-full">
              <div className="h-4 w-[1px] bg-slate-100"></div>
              <span className="text-sm font-bold text-slate-300 uppercase tracking-[0.2em]">Telemetry Active</span>
           </div>
        </div>
        
        {listings.length === 0 ? (
          <div className="bg-slate-50/50 rounded-[4rem] p-24 text-center border-4 border-dashed border-slate-100 flex flex-col items-center gap-6">
            <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center text-slate-200 shadow-xl">
               <Layers size={40} />
            </div>
            <p className="text-slate-400 font-bold text-sm uppercase tracking-wider">Global inventory is currently vacant.</p>
            <button onClick={() => setShowModal(true)} className="text-emerald-600 font-black text-xs uppercase tracking-wider hover:text-emerald-700 underline underline-offset-8">Execute Listing Command</button>
          </div>
        ) : (
          <div className="grid gap-16 md:grid-cols-2 lg:grid-cols-3">
            {listings.map(l => (
              <div key={l._id} className="group bg-white border border-slate-50 rounded-[4rem] overflow-hidden hover:shadow-[0_45px_100px_-25px_rgba(16,185,129,0.15)] transition-all duration-700 flex flex-col relative">
                <div className="absolute top-6 left-6 z-20">
                   <div className="px-5 py-3 bg-white/80 backdrop-blur-xl border border-white rounded-2xl shadow-xl">
                      <span className="text-xs font-black uppercase tracking-wider text-slate-900">Verified Listing</span>
                   </div>
                </div>
                <div className="h-64 overflow-hidden relative">
                  <img src={getProductImage(l.productName)} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 grayscale group-hover:grayscale-0" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
                  <div className="absolute top-6 right-6">
                    <button onClick={() => handleDeleteListing(l._id)} className="bg-rose-500 text-white p-4 rounded-2xl shadow-2xl hover:bg-rose-600 hover:scale-110 transition-all duration-300">
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
                <div className="p-14 flex-grow">
                  <h3 className="text-farmer-header text-4xl mb-10 group-hover:text-emerald-600 transition-colors leading-none">{l.productName}</h3>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="bg-slate-50 rounded-[2.5rem] p-10 border border-slate-100/50 space-y-4">
                      <p className="text-farmer-label italic">Available Stock</p>
                      <p className="text-farmer-value !text-4xl">{l.quantity} <span className="text-sm text-slate-300">UNITS</span></p>
                    </div>
                    <div className="bg-emerald-50/50 rounded-[2.5rem] p-10 border border-emerald-100/50 space-y-4">
                       <p className="text-farmer-label !text-emerald-600/60 italic">Price Per Unit</p>
                       <p className="text-farmer-value !text-4xl">₹{l.pricePerUnit.toLocaleString()}</p>
                    </div>
                  </div>
                  <div className="mt-8 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                     <span className="text-sm font-black uppercase tracking-wider text-emerald-500">Global Signal Broadcasted</span>
                     <Activity size={20} className="text-emerald-500 animate-pulse" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Customer Orders Section */}
      <section className="space-y-10">
        <div className="flex items-center justify-between pb-6 border-b border-slate-50">
           <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white rounded-2xl border border-slate-100 flex items-center justify-center text-blue-600 shadow-sm">
                 <BarChart3 size={22} />
              </div>
              <div>
                 <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight">Inbound Requests</h2>
                 <p className="text-sm font-black text-slate-400 uppercase tracking-wider mt-1">External Commercial Traffic</p>
              </div>
           </div>
        </div>

        {orders.length === 0 ? (
          <div className="bg-slate-50/30 rounded-[3rem] p-20 text-center border-2 border-dashed border-slate-100">
            <p className="text-slate-300 font-bold text-xs uppercase tracking-wider">No incoming commercial packets detected.</p>
          </div>
        ) : (
          <div className="grid gap-6">
            {orders.map(o => (
              <div key={o._id} className="group bg-white border border-slate-50 rounded-[3rem] p-8 hover:shadow-2xl hover:shadow-slate-100 transition-all duration-700 flex flex-col xl:flex-row justify-between items-center gap-10">
                <div className="flex flex-col md:flex-row items-center gap-8 flex-1 w-full">
                  <div className="h-24 w-24 rounded-3xl overflow-hidden border border-slate-100 shadow-xl shrink-0 group-hover:scale-110 transition-transform">
                     <img src={getProductImage(o.listing?.productName)} className="w-full h-full object-cover" alt="" />
                  </div>
                  <div className="flex-1 space-y-2 text-center md:text-left">
                    <h4 className="font-black text-xl text-slate-950 uppercase tracking-tight group-hover:text-emerald-600 transition-colors">{o.listing?.productName || 'Deleted Product'} <span className="text-slate-300 font-medium">× {o.quantityOrdered}</span></h4>
                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
                       <p className="text-sm font-black text-slate-400 uppercase tracking-wider flex items-center gap-2">
                          <User size={12} className="text-emerald-500" /> {o.buyer?.name}
                       </p>
                       <div className="w-1 h-1 bg-slate-200 rounded-full"></div>
                       <p className="text-sm font-black text-emerald-600 uppercase tracking-wider flex items-center gap-2">
                          Revenue Potential: <span className="text-base text-emerald-700 tracking-tight">₹{o.totalPrice.toLocaleString()}</span>
                       </p>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row items-center gap-6 w-full xl:w-auto">
                  <span className={`px-10 py-4 rounded-2xl text-sm font-black uppercase tracking-[0.2em] shadow-sm border ${
                    o.status === 'Pending' ? 'bg-amber-50 text-amber-600 border-amber-100 animate-pulse' : 
                    o.status === 'Accepted' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-rose-50 text-rose-600 border-rose-100'
                  }`}>
                    {o.status}
                  </span>
                  {o.status === 'Pending' && (
                    <div className="flex gap-4 w-full sm:w-auto">
                       <button 
                         onClick={() => handleUpdateOrder(o._id, 'Accepted')} 
                         className="flex-1 sm:flex-none w-16 h-16 bg-emerald-600 text-white rounded-2xl hover:bg-emerald-500 transition-all shadow-xl shadow-emerald-100 flex items-center justify-center group/btn"
                       >
                         <CheckCircle2 size={24} className="group-hover/btn:scale-125 transition-transform" />
                       </button>
                       <button 
                         onClick={() => handleUpdateOrder(o._id, 'Rejected')} 
                         className="flex-1 sm:flex-none w-16 h-16 bg-rose-500 text-white rounded-2xl hover:bg-rose-600 transition-all shadow-xl shadow-rose-100 flex items-center justify-center group/btn"
                       >
                         <X size={24} className="group-hover/btn:rotate-90 transition-transform" />
                       </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Listing Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-xl animate-in fade-in" onClick={() => setShowModal(false)} />
          <div className="relative bg-white rounded-[4rem] p-12 md:p-16 w-full max-w-2xl shadow-[0_50px_200px_-50px_rgba(0,0,0,0.5)] overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-20 duration-500">
            <div className="absolute top-0 left-0 w-full h-3 bg-emerald-600" />
            
            <div className="flex justify-between items-start mb-12">
               <div className="space-y-2">
                  <h2 className="text-4xl font-black text-slate-900 uppercase tracking-tight leading-none">Deploy <span className="text-emerald-600">Asset.</span></h2>
                  <p className="text-sm font-black text-slate-400 uppercase tracking-wider">Initiating Global Commercial Broadcast</p>
               </div>
               <button onClick={() => setShowModal(false)} className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 hover:text-rose-500 transition-all">
                  <X size={24} />
               </button>
            </div>

            <form onSubmit={handleCreateListing} className="space-y-10">
              <div className="space-y-4">
                <label className="block text-sm font-black uppercase text-slate-500 tracking-[0.2em] px-2 italic">Commercial ID / Product Name</label>
                <div className="relative">
                   <Package className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
                   <input required type="text" className="w-full bg-slate-50 border border-slate-100 pl-16 pr-8 py-6 rounded-3xl focus:ring-4 focus:ring-emerald-500/10 outline-none focus:border-emerald-500 font-black text-xs uppercase tracking-wider text-slate-900 transition-all" placeholder="e.g. ULTRA-FRESH GRADE-A EGGS" value={productName} onChange={e => setProductName(e.target.value)} />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <label className="block text-sm font-black uppercase text-slate-500 tracking-[0.2em] px-2 italic">Stock Quantity</label>
                  <div className="relative">
                    <Layers className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
                    <input required type="number" className="w-full bg-slate-50 border border-slate-100 pl-16 pr-8 py-6 rounded-3xl focus:ring-4 focus:ring-emerald-500/10 outline-none focus:border-emerald-500 font-black text-xs text-slate-900 transition-all" value={quantity} onChange={e => setQuantity(e.target.value)} />
                  </div>
                </div>
                <div className="space-y-4">
                  <label className="block text-sm font-black uppercase text-slate-500 tracking-[0.2em] px-2 italic">Unit Exchange Value (₹)</label>
                  <div className="relative">
                    <Zap className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
                    <input required type="number" step="0.01" className="w-full bg-slate-50 border border-slate-100 pl-16 pr-8 py-6 rounded-3xl focus:ring-4 focus:ring-emerald-500/10 outline-none focus:border-emerald-500 font-black text-xs text-slate-900 transition-all" value={price} onChange={e => setPrice(e.target.value)} />
                  </div>
                </div>
              </div>

              <div className="pt-8 flex flex-col sm:flex-row gap-6">
                <button type="submit" className="flex-1 h-20 bg-slate-950 text-white rounded-3xl font-black uppercase tracking-wider text-sm shadow-3xl shadow-slate-200 hover:bg-emerald-600 transition-all duration-500 flex items-center justify-center gap-4">
                   Commit to Exchange <ArrowUpRight size={20} />
                </button>
              </div>
              
              <div className="flex items-center justify-center gap-3 opacity-40">
                 <ShieldCheck size={14} className="text-emerald-500" />
                 <span className="text-xs font-black uppercase tracking-[0.4em]">Proprietary Commercial Encryption Active</span>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
