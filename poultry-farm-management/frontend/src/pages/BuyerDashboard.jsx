import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { 
  ShoppingBag, 
  MessageSquare, 
  Clock, 
  LayoutDashboard, 
  ChevronRight, 
  Package, 
  Truck, 
  CreditCard,
  User,
  LogOut,
  Zap,
  ArrowRight,
  Calendar
} from 'lucide-react';
import Marketplace from './Marketplace';
import BuyerChat from './BuyerChat';
import { useState, useEffect } from 'react';
import api from '../utils/axios';
import { getConsistentImage } from '../utils/imageConstants';

const BuyerOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await api.get('/marketplace/orders/me');
        setOrders(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const getProductImage = (title) => getConsistentImage(title);

  if (loading) return (
    <div className="flex flex-col items-center justify-center py-20 animate-pulse italic text-slate-300 font-black uppercase tracking-wider text-xs">
      Loading your purchases...
    </div>
  );

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col gap-4">
        <h2 className="text-4xl font-black text-slate-900 uppercase tracking-tight leading-none">
          My <span className="text-indigo-600">Purchases.</span>
        </h2>
        <p className="text-sm font-black text-slate-400 uppercase tracking-wider italic">History of all items you bought</p>
      </div>

      {orders.length === 0 ? (
        <div className="bg-slate-50/50 rounded-[3rem] p-24 text-center border-4 border-dashed border-slate-100 flex flex-col items-center gap-8">
           <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-slate-200 shadow-xl">
              <Package size={32} />
           </div>
           <div className="space-y-2">
              <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight">No Purchases Yet</h3>
              <p className="text-slate-400 font-bold text-sm uppercase tracking-wider">You haven't bought anything from the marketplace yet.</p>
           </div>
           <Link to="/buyer" className="px-8 py-4 bg-slate-950 text-white rounded-2xl font-black text-sm uppercase tracking-wider hover:bg-indigo-600 transition-all">Start Shopping</Link>
        </div>
      ) : (
        <div className="grid gap-8">
          {orders.map(o => (
            <div key={o._id} className="group relative bg-white border border-slate-100 rounded-[3rem] p-8 hover:shadow-2xl hover:shadow-slate-100 transition-all duration-500 flex flex-col lg:flex-row items-center gap-10 overflow-hidden">
               <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50 rounded-full translate-x-10 -translate-y-10 group-hover:bg-indigo-50 transition-colors duration-700"></div>
               
               <div className="relative w-full lg:w-48 h-48 shrink-0 overflow-hidden rounded-[2rem] border border-slate-100 group-hover:rotate-1 transition-transform duration-700">
                <img 
                  src={getProductImage(o.listing?.productName)} 
                  alt={o.listing?.productName || 'Product'} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 grayscale-[0.3] group-hover:grayscale-0" 
                />
                <div className="absolute top-4 left-4">
                   <div className="bg-white/90 backdrop-blur px-3 py-1.5 rounded-xl border border-white/50 shadow-xl self-start">
                      <span className="text-sm font-black text-slate-900 uppercase tracking-wider">x{o.quantityOrdered}</span>
                   </div>
                </div>
              </div>

              <div className="flex-1 space-y-6 relative z-10 w-full px-2">
                <div className="space-y-2">
                  <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight group-hover:text-indigo-600 transition-colors leading-none">{o.listing?.productName || 'Deleted Item'}</h3>
                  <div className="flex items-center gap-4 text-sm font-black text-slate-400 uppercase tracking-wider italic">
                     <span className="flex items-center gap-2"><User size={12} className="text-indigo-500" /> Seller: {o.farmer?.name || 'Local Farmer'}</span>
                     <span className="w-1 h-1 bg-slate-200 rounded-full"></span>
                     <span className="flex items-center gap-2"><Calendar size={12} className="text-slate-300" /> {new Date(o.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                   <div className="bg-slate-50/50 p-6 rounded-2xl border border-slate-100">
                      <span className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] italic mb-1 block">Total Amount</span>
                      <p className="text-2xl font-black text-slate-950 tracking-tight leading-none">₹{o.totalPrice}</p>
                   </div>
                   <div className="bg-slate-50/50 p-6 rounded-2xl border border-slate-100 flex flex-col justify-center">
                      <span className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] italic mb-2 block">Order Status</span>
                      <span className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider shadow-sm border text-center ${
                        o.status === 'Accepted' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 
                        o.status === 'Pending' ? 'bg-amber-50 text-amber-700 border-amber-100 animate-pulse' : 'bg-rose-50 text-rose-700 border-rose-100'
                      }`}>
                        {o.status}
                      </span>
                   </div>
                </div>
              </div>

              <div className="lg:border-l border-slate-100 lg:pl-10 flex flex-col justify-center w-full lg:w-48 gap-4 relative z-10 shrink-0">
                  <button className="h-14 bg-slate-950 text-white rounded-2xl font-black text-xs uppercase tracking-wider hover:bg-indigo-600 transition-all flex items-center justify-center gap-3 group/link shadow-xl shadow-slate-100">
                     Track Delivery <Truck size={14} className="group-hover/link:translate-x-1" />
                  </button>
                  <button className="h-14 bg-white border border-slate-100 text-slate-950 rounded-2xl font-black text-xs uppercase tracking-wider hover:bg-slate-50 transition-all flex items-center justify-center gap-3">
                     View Details <ArrowRight size={14} />
                  </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default function BuyerDashboard() {
  const location = useLocation();

  const navItems = [
    { label: 'Marketplace', path: '/buyer', icon: ShoppingBag },
    { label: 'My Purchases', path: '/buyer/orders', icon: Clock },
    { label: 'Messages', path: '/buyer/chat', icon: MessageSquare },
  ];

  const handleLogout = () => {
    localStorage.removeItem('userInfo');
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  return (
    <div className="flex flex-col lg:flex-row h-full gap-10">
      
      {/* Sidebar Navigation */}
      <aside className="w-full lg:w-[320px] shrink-0">
         <div className="bg-white border border-slate-100 rounded-[3rem] p-8 shadow-2xl shadow-slate-100 flex flex-col h-fit sticky top-24">
            <div className="flex items-center gap-4 mb-12 px-2">
               <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-indigo-200">
                  <LayoutDashboard size={24} />
               </div>
               <div className="space-y-1">
                  <h2 className="text-xl font-black text-slate-950 uppercase tracking-tight leading-none">Buyer.</h2>
                  <p className="text-sm font-black text-slate-400 uppercase tracking-wider">Dashboard</p>
               </div>
            </div>

            <nav className="space-y-3 mb-12">
              {navItems.map((item) => {
                const isActive = location.pathname === item.path || (item.path !== '/buyer' && location.pathname.startsWith(item.path));
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center justify-between px-6 py-4 rounded-[1.5rem] font-black text-sm uppercase tracking-wider transition-all duration-500 group ${
                      isActive ? 'bg-slate-950 text-white shadow-2xl shadow-slate-200 translate-x-1' : 'text-slate-400 hover:bg-slate-50 hover:text-slate-950'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                       <item.icon size={18} className={isActive ? 'text-indigo-400' : 'text-slate-300 group-hover:text-slate-950'} strokeWidth={2.5} />
                       {item.label}
                    </div>
                    {isActive && <ChevronRight size={14} className="text-indigo-400" />}
                  </Link>
                );
              })}
            </nav>

            <div className="pt-8 border-t border-slate-50 mt-auto">
               <button onClick={handleLogout} className="w-full flex items-center justify-between px-6 py-4 rounded-[1.5rem] text-sm font-black uppercase tracking-wider text-rose-500 hover:bg-rose-50 transition-all">
                  Sign Out <LogOut size={16} />
               </button>
            </div>
         </div>

         {/* Secondary CTA card in sidebar */}
         <div className="mt-10 bg-indigo-900 rounded-[2.5rem] p-10 text-white relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl translate-x-10 -translate-y-10 group-hover:bg-white/20 transition-colors duration-700"></div>
            <Zap size={32} className="text-indigo-300 mb-6 group-hover:scale-110 group-hover:rotate-12 transition-transform duration-500" />
            <h4 className="text-xl font-black uppercase tracking-tight leading-none mb-3">Customer Help</h4>
            <p className="text-sm font-bold text-indigo-200 uppercase tracking-wider leading-relaxed">Direct support available for all your purchases.</p>
         </div>
      </aside>
      
      {/* Main Content Area */}
      <main className="flex-1">
         <div className="bg-white border border-slate-100 rounded-[4rem] p-10 md:p-16 min-h-[calc(100vh-12rem)] shadow-3xl shadow-slate-100 overflow-hidden relative">
            <div className="absolute top-0 left-0 w-full h-3 bg-indigo-600" />
            <Routes>
               <Route path="/" element={<Marketplace />} />
               <Route path="/orders" element={<BuyerOrders />} />
               <Route path="/chat" element={<BuyerChat />} />
            </Routes>
         </div>
      </main>
    </div>
  );
}
