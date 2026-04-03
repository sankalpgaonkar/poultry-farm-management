import { useState, useEffect } from 'react';
import api from '../utils/axios';
import { 
  ShoppingCart, 
  User, 
  Calendar, 
  CheckCircle, 
  XCircle, 
  Clock,
  ArrowRight,
  TrendingUp,
  Box,
  CreditCard,
  Zap,
  Activity,
  ArrowUpRight
} from 'lucide-react';
import { getConsistentImage } from '../utils/imageConstants';

const getProductImage = (title) => getConsistentImage(title);

export default function FarmerOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const { data } = await api.get('/marketplace/orders/farmer');
      setOrders(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (orderId, status) => {
    try {
      await api.put(`/marketplace/orders/${orderId}/status`, { status });
      fetchOrders();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
     return (
        <div className="flex flex-col items-center justify-center py-20 animate-pulse text-slate-300 font-bold uppercase tracking-wider text-xs">
           Loading orders...
        </div>
     );
  }

  return (
    <div className="space-y-12 pb-20">
      
      {/* Friendly Header Layer */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-10">
        <div className="space-y-4 max-w-2xl text-slate-900">
           <div className="inline-flex items-center gap-3 px-4 py-2 bg-emerald-50 rounded-full border border-emerald-100">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-ping"></div>
              <span className="text-sm font-black uppercase tracking-wider text-emerald-600">My Sales Record</span>
           </div>
           <h1 className="text-4xl lg:text-6xl font-black text-slate-900 tracking-tight uppercase leading-none">
              Sales <span className="text-emerald-600">History.</span>
           </h1>
           <p className="text-slate-400 font-medium text-lg leading-relaxed">
             Track all the orders you received from buyers. Approve or reject them here.
           </p>
        </div>
        
        <div className="flex items-center gap-6">
           <div className="px-8 py-6 bg-white border border-slate-100 rounded-[2.5rem] shadow-2xl shadow-slate-100 flex items-center gap-6">
              <div className="space-y-1">
                 <span className="text-xs font-black uppercase text-slate-400 tracking-wider">Total Orders</span>
                 <h4 className="text-3xl font-black text-slate-950 tracking-tight leading-none">{orders.length} <span className="text-slate-300 text-sm italic font-medium">Orders</span></h4>
              </div>
              <div className="w-12 h-12 bg-emerald-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-emerald-200">
                 <Activity size={20} />
              </div>
           </div>
        </div>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-32 bg-slate-50 rounded-[4rem] border-4 border-dashed border-slate-100 flex flex-col items-center justify-center space-y-6">
          <div className="w-24 h-24 bg-white rounded-[2rem] shadow-xl flex items-center justify-center text-slate-200">
             <ShoppingCart size={48} />
          </div>
          <div className="space-y-2">
             <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">No New Orders</h3>
             <p className="text-slate-400 font-medium text-sm max-w-xs mx-auto">No one has placed an order yet. Make sure your listings are active.</p>
          </div>
          <button onClick={() => window.location.href='/farmer/listings'} className="px-8 py-4 bg-slate-950 text-white rounded-2xl font-black text-sm uppercase tracking-wider hover:bg-emerald-600 transition-all shadow-xl shadow-slate-200">Go to Marketplace</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-8">
          {orders.map(o => (
            <div key={o._id} className="group relative bg-white border border-slate-100 rounded-[3.5rem] p-8 md:p-12 shadow-2xl shadow-slate-100/50 hover:shadow-[0_40px_100px_-20px_rgba(16,185,129,0.1)] transition-all duration-700 flex flex-col xl:flex-row gap-10 items-start xl:items-center overflow-hidden">
              <div className="absolute top-0 right-0 w-1/4 h-full bg-slate-50/50 -skew-x-12 translate-x-1/2 pointer-events-none group-hover:bg-emerald-500/5 transition-colors duration-700"></div>
              
              <div className="relative w-32 h-32 md:w-40 md:h-40 rounded-[2.5rem] overflow-hidden border border-slate-100 shrink-0 shadow-2xl group-hover:scale-105 transition-transform duration-700">
                <img 
                  src={getProductImage(o.listing?.productName || 'Deleted Product')} 
                  alt={o.listing?.productName || 'Deleted Product'} 
                  className="w-full h-full object-cover grayscale-[0.5] group-hover:grayscale-0 duration-700" 
                />
              </div>
              
              <div className="flex-1 space-y-8 relative z-10 w-full">
                <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                    <div className="space-y-1">
                       <span className="text-xs font-black uppercase tracking-wider text-emerald-500">{o.listing?.category || 'General'}</span>
                       <h3 className="font-black text-3xl text-slate-900 uppercase tracking-tight leading-none group-hover:text-emerald-600 transition-colors">{o.listing?.productName || 'Deleted Product'}</h3>
                    </div>
                    <div className={`px-6 py-3 rounded-2xl text-sm font-black uppercase tracking-wider shadow-xl flex items-center gap-3 border ${
                        o.status === 'Accepted' ? 'bg-emerald-50 text-emerald-700 border-emerald-100 shadow-emerald-100/20' :
                        o.status === 'Rejected' ? 'bg-rose-50 text-rose-700 border-rose-100 shadow-rose-100/20' :
                        'bg-amber-50 text-amber-700 border-amber-100 shadow-amber-100/20 italic animate-pulse'
                    }`}>
                        {o.status === 'Accepted' ? <CheckCircle size={14} /> : o.status === 'Rejected' ? <XCircle size={14} /> : <Clock size={14} />}
                        {o.status}
                    </div>
                </div>
                
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 pt-6 border-t border-slate-100">
                    <div className="space-y-2">
                        <span className="text-xs font-black uppercase text-slate-400 tracking-[0.2em] flex items-center gap-2 italic"> <User size={10} /> Buyer Name</span>
                        <p className="text-sm font-black text-slate-900 uppercase tracking-tight">{o.buyer?.name || 'Customer'}</p>
                    </div>
                    <div className="space-y-2">
                        <span className="text-xs font-black uppercase text-slate-400 tracking-[0.2em] flex items-center gap-2 italic"> <Calendar size={10} /> Order Date</span>
                        <p className="text-sm font-black text-slate-900 uppercase tracking-tight">{new Date(o.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div className="space-y-2">
                        <span className="text-xs font-black uppercase text-slate-400 tracking-[0.2em] flex items-center gap-2 italic"> <Box size={10} /> Quantity</span>
                        <p className="text-sm font-black text-slate-900 uppercase tracking-tight">{o.quantityOrdered} Units</p>
                    </div>
                    <div className="space-y-2">
                        <span className="text-xs font-black uppercase text-slate-400 tracking-[0.2em] flex items-center gap-2 italic"> <CreditCard size={10} /> Total Amount</span>
                        <p className="text-2xl font-black text-emerald-600 tracking-tight leading-none">₹{o.totalPrice.toLocaleString()}</p>
                    </div>
                </div>

                {o.status === 'Pending' && (
                    <div className="flex flex-col sm:flex-row gap-6 mt-10 pt-10 border-t border-slate-100">
                        <button 
                            onClick={() => handleUpdateStatus(o._id, 'Accepted')}
                            className="flex-1 bg-slate-950 text-white h-16 rounded-2xl font-black text-sm uppercase tracking-wider hover:bg-emerald-600 transition-all shadow-xl shadow-slate-100 flex items-center justify-center gap-3 active:scale-95 group/btn"
                        >
                            Accept Order <ArrowRight size={14} className="group-hover/btn:translate-x-2 transition-transform" />
                        </button>
                        <button 
                             onClick={() => handleUpdateStatus(o._id, 'Rejected')}
                             className="flex-1 bg-white text-rose-500 border border-slate-100 h-16 rounded-2xl font-black text-sm uppercase tracking-wider hover:bg-rose-50 hover:border-rose-100 transition-all flex items-center justify-center gap-3 active:scale-95"
                        >
                            Decline Request <XCircle size={14} />
                        </button>
                    </div>
                )}

                {o.status === 'Accepted' && (
                   <div className="mt-8 p-4 bg-emerald-50 rounded-2xl border border-emerald-100 flex items-center gap-3 animate-in slide-in-from-top-2">
                      <Zap size={14} className="text-emerald-500" />
                      <p className="text-xs font-black text-emerald-800 uppercase tracking-wider">Order accepted. Please prepare for delivery.</p>
                   </div>
                )}
              </div>
              
              <div className="absolute bottom-10 right-10 opacity-0 group-hover:opacity-10 transition-opacity">
                 <ArrowUpRight size={120} className="text-emerald-500" />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
