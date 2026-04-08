import { useState, useEffect } from 'react';
import api from '../utils/axios';
import { 
  Plus, 
  Package, 
  Trash2, 
  Activity, 
  CheckCircle2, 
  ShoppingCart, 
  Search,
  Filter,
  Tag,
  LayoutGrid,
  List as ListIcon,
  ShoppingBag,
  ArrowRight,
  TrendingUp,
  MapPin,
  Clock,
  ChevronRight,
  X,
  Plus as PlusIcon,
  Minus as MinusIcon,
  Zap,
  ShieldCheck,
  Globe,
  User
} from 'lucide-react';
import { POULTRY_IMAGES, getConsistentImage, formatRupee } from '../utils/imageConstants';

export default function Marketplace() {
  const userInfo = JSON.parse(localStorage.getItem('userInfo')) || {};
  const isFarmer = userInfo.role === 'Farmer';

  const [activeTab, setActiveTab] = useState(isFarmer ? 'my-listings' : 'browse'); 
  const [listings, setListings] = useState([]);
  const [myListings, setMyListings] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  
  // Modals
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showOrderModal, setShowOrderModal] = useState(false);
  
  // Form States
  const [selectedListing, setSelectedListing] = useState(null);
  const [orderQuantity, setOrderQuantity] = useState(1);
  const [productForm, setProductForm] = useState({ name: '', quantity: '', price: '', category: 'EGG', description: '' });

  const fetchData = async () => {
    try {
      setLoading(true);
      const requests = [api.get('/marketplace')]; // Global browse
      
      if (isFarmer) {
        requests.push(api.get('/marketplace/my-listings'));
        requests.push(api.get('/marketplace/orders')); // Incoming
      } else {
        requests.push(api.get('/marketplace/orders')); // Outgoing for buyer
      }

      const results = await Promise.all(requests);
      setListings(results[0].data);
      if (isFarmer) {
        setMyListings(results[1].data);
        setOrders(results[2].data);
      } else {
        setOrders(results[1].data);
      }
    } catch (err) {
      console.error('Marketplace fetch failed', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateListing = async (e) => {
    e.preventDefault();
    try {
      await api.post('/marketplace', {
        productName: productForm.name,
        quantity: Number(productForm.quantity),
        pricePerUnit: Number(productForm.price),
        category: productForm.category,
        description: productForm.description
      });
      setShowCreateModal(false);
      setProductForm({ name: '', quantity: '', price: '', category: 'EGG', description: '' });
      fetchData();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Error creating listing.');
    }
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    try {
      await api.post('/marketplace/orders', {
        listingId: selectedListing._id,
        quantityOrdered: Number(orderQuantity)
      });
      setShowOrderModal(false);
      setOrderQuantity(1);
      fetchData();
      alert('Order placed successfully! Check your purchases tab.');
    } catch (err) {
      alert(err.response?.data?.message || 'Error placing order');
    }
  };

  const handleDeleteListing = async (id) => {
    if (!window.confirm("Remove this listing?")) return;
    try {
      await api.delete(`/marketplace/${id}`);
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateStatus = async (orderId, status) => {
    try {
      await api.put(`/marketplace/orders/${orderId}/status`, { status });
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const filteredListings = listings.filter(l => {
    const matchesSearch = l.productName.toLowerCase().includes(search.toLowerCase()) ||
                          l.farmer?.name?.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = categoryFilter === 'ALL' || l.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  if (loading) return (
    <div className="flex flex-col items-center justify-center py-40 animate-pulse italic text-slate-300 font-bold uppercase tracking-[0.2em]">
      Loading market data...
    </div>
  );

  return (
    <div className="space-y-16 pb-20">
      
      {/* Cinematic Header Container */}
      <div className="relative overflow-hidden bg-white border border-slate-100 rounded-[2.5rem] p-8 lg:p-12 text-slate-900 shadow-3xl shadow-slate-100">
        <div className="absolute top-0 right-0 w-[50%] h-full bg-gradient-to-l from-emerald-500/10 via-emerald-500/5 to-transparent pointer-events-none"></div>
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-emerald-500/5 rounded-full blur-[100px] pointer-events-none"></div>
        
        <div className="relative z-10 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-12">
          <div className="space-y-8 max-w-2xl">
            <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-emerald-50 border border-emerald-100 text-sm font-black uppercase tracking-wider text-emerald-600">
               <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping"></div>
               Live Mandi Activity
            </div>
            <h1 className="text-5xl lg:text-8xl font-black tracking-tight leading-[0.85] uppercase">
              Mandi & <br />
              <span className="text-emerald-600">Market.</span>
            </h1>
            <p className="text-slate-400 text-xl font-medium leading-relaxed max-w-lg">
              Buy and sell directly with other farmers. Everything is clear and trust-based.
            </p>
          </div>

          <div className="flex flex-col gap-6 w-full lg:w-auto">
            {isFarmer && ( activeTab === 'my-listings' || activeTab === 'orders' ) && (
              <button 
                onClick={() => setShowCreateModal(true)}
                className="group flex items-center justify-center gap-6 bg-emerald-600 hover:bg-emerald-500 text-white px-8 py-4 rounded-2xl font-black text-base transition-all hover:-translate-y-2 active:scale-95 shadow-2xl shadow-emerald-100"
              >
                <Plus size={20} className="group-hover:rotate-90 transition-transform duration-500" /> 
                Sell My Stock
              </button>
            )}
            <div className="grid grid-cols-2 gap-4">
               <div className="bg-slate-50 border border-slate-100 p-6 rounded-[2rem]">
                  <span className="text-slate-400 text-xs font-black uppercase tracking-wider block mb-1">Items for Sale</span>
                  <h4 className="text-2xl font-black tracking-tight text-slate-900">{listings.length}</h4>
               </div>
               <div className="bg-slate-50 border border-slate-100 p-6 rounded-[2rem]">
                  <span className="text-slate-400 text-xs font-black uppercase tracking-wider block mb-1">Active Farmers</span>
                  <h4 className="text-2xl font-black text-emerald-600 tracking-tight">{listings.length + 12}+</h4>
               </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs & Filters */}
      <div className="flex flex-col xl:flex-row gap-8 items-stretch xl:items-center">
        <div className="bg-slate-100 p-2 rounded-[2.8rem] flex gap-2 self-start xl:self-auto border border-white shadow-xl shadow-slate-200/50">
          {[
            ...(isFarmer ? [] : [{ id: 'browse', label: 'Buy from Market', icon: Activity }]),
            ...(isFarmer ? [{ id: 'my-listings', label: 'My Listings', icon: Package }] : []),
            { id: 'orders', label: isFarmer ? 'Orders Received' : 'My Purchases', icon: ShoppingBag },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-4 px-10 py-5 rounded-[2rem] text-sm font-black uppercase tracking-wider transition-all duration-500 ${
                activeTab === tab.id 
                  ? 'bg-emerald-600 text-white shadow-2xl translate-y-[-1px]' 
                  : 'text-slate-500 hover:text-slate-950 hover:bg-slate-200/50'
              }`}
            >
              <tab.icon size={16} />
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === 'browse' && (
          <div className="flex flex-col md:flex-row flex-1 gap-4">
             <div className="relative flex-1 group">
                <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-emerald-500 transition-colors duration-500" size={20} />
                <input 
                  type="text" 
                  placeholder="Search in Market..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="w-full pl-16 pr-8 py-5 bg-white border border-slate-100 rounded-[2rem] outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all font-black text-sm uppercase tracking-wider"
                />
             </div>
             <div className="flex gap-2 p-1.5 bg-slate-50 rounded-[2.2rem] border border-slate-100 overflow-x-auto no-scrollbar">
                {['ALL', 'EGG', 'BIRD', 'FEED', 'EQUIPMENT'].map(cat => (
                  <button
                    key={cat}
                    onClick={() => setCategoryFilter(cat)}
                    className={`px-6 py-4 rounded-[1.5rem] font-black uppercase tracking-[0.2em] text-xs transition-all whitespace-nowrap active:scale-95 ${
                      categoryFilter === cat 
                        ? 'bg-white text-emerald-600 shadow-xl shadow-emerald-100' 
                        : 'text-slate-400 hover:text-slate-900'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
             </div>
          </div>
        )}
      </div>

      {/* Main Content Area */}
      <div className="min-h-[400px]">
        {activeTab === 'browse' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 text-slate-900">
            {filteredListings.length === 0 ? (
               <div className="col-span-full py-48 text-center space-y-10">
                 <div className="bg-slate-50 w-32 h-32 rounded-[3.5rem] flex items-center justify-center mx-auto text-slate-200">
                    <Globe size={48} className="opacity-20" />
                 </div>
                 <div className="space-y-2">
                    <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight">No items found</h3>
                    <p className="text-slate-400 font-bold text-xs uppercase tracking-wider">Waiting for new listings from other farmers.</p>
                 </div>
               </div>
            ) : (
              filteredListings.map(listing => (
                <div key={listing._id} className="group relative bg-white rounded-[2.5rem] border border-slate-100 overflow-hidden hover:shadow-4xl hover:shadow-slate-200 transition-all duration-700 flex flex-col hover:-translate-y-2">
                   <div className="h-64 overflow-hidden relative border-b border-slate-50">
                    <img 
                      src={getConsistentImage(listing.productName, listing.category)} 
                      alt="" 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 grayscale-[0.2] group-hover:grayscale-0" 
                    />
                    <div className="absolute top-8 left-8 flex flex-col gap-2">
                      <div className="bg-white/90 backdrop-blur-xl px-4 py-2 rounded-2xl text-xs font-black uppercase tracking-wider text-emerald-600 shadow-2xl border border-white/50 flex items-center gap-2">
                        <ShieldCheck size={12} /> Verified Seller
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-8 flex-1 flex flex-col space-y-6">
                    <div className="flex justify-between items-start">
                      <div className="space-y-1">
                        <h3 className="text-3xl font-black text-slate-900 uppercase tracking-tight leading-none group-hover:text-emerald-600 transition-colors">{listing.productName}</h3>
                        <p className="text-sm font-black text-slate-400 uppercase tracking-wider flex items-center gap-2 italic"><MapPin size={12} className="text-emerald-500" /> Nearby Farmer</p>
                      </div>
                      <div className="text-right">
                        <span className="text-xs font-black text-slate-400 uppercase tracking-wider block opacity-50 mb-1">Price</span>
                        <span className="text-3xl font-black text-slate-950 tracking-tight leading-none">{formatRupee(listing.pricePerUnit)}</span>
                      </div>
                    </div>
                    
                    <p className="text-slate-500 font-medium leading-relaxed line-clamp-2 h-12 text-sm">
                      {listing.description || `Fresh ${listing.category.toLowerCase()} available for sale. Direct from my farm.`}
                    </p>
                    
                    <div className="grid grid-cols-2 gap-4 p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100/50">
                       <div className="border-r border-slate-200">
                          <span className="text-xs font-black text-slate-400 uppercase tracking-wider italic mb-2 block">Seller</span>
                          <p className="font-black text-slate-900 text-xs uppercase tracking-tight truncate">{listing.farmer?.name || 'Local Farmer'}</p>
                       </div>
                       <div className="pl-4">
                          <span className="text-xs font-black text-slate-400 uppercase tracking-wider italic mb-2 block">Quantity</span>
                          <p className="font-black text-slate-900 text-xs uppercase tracking-tight">{listing.quantity} Units</p>
                       </div>
                    </div>

                    <button 
                      onClick={() => { setSelectedListing(listing); setOrderQuantity(1); setShowOrderModal(true); }}
                      className="w-full bg-emerald-600 hover:bg-emerald-700 text-white h-20 rounded-[1.8rem] font-black uppercase tracking-wider text-sm transition-all shadow-3xl shadow-emerald-100 flex items-center justify-center gap-4 active:scale-95"
                    >
                       Buy Now <ChevronRight size={18} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'my-listings' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {myListings.map(l => (
              <div key={l._id} className="group bg-white border border-slate-100 rounded-[2.5rem] p-8 hover:shadow-2xl transition-all duration-700 relative overflow-hidden flex flex-col">
                 <div className="absolute top-8 right-8">
                    <button onClick={() => handleDeleteListing(l._id)} className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-300 hover:bg-rose-500 hover:text-white transition-all transform hover:rotate-12">
                       <Trash2 size={20} />
                    </button>
                 </div>
                 
                 <div className="space-y-8 mt-4 flex-1">
                    <div className="space-y-4">
                       <span className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-600 rounded-lg text-xs font-black uppercase tracking-wider border border-emerald-100">
                          Active Listing
                       </span>
                       <h3 className="text-3xl font-black text-slate-900 uppercase tracking-tight leading-tight group-hover:text-emerald-600">{l.productName}</h3>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                       <div className="p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100 flex flex-col items-center justify-center text-center">
                          <span className="text-xs font-black text-slate-400 uppercase tracking-wider italic mb-2">Available</span>
                          <p className="text-3xl font-black text-slate-900 tracking-tight">{l.quantity}</p>
                       </div>
                       <div className="p-8 bg-emerald-600 rounded-[2.5rem] text-white flex flex-col items-center justify-center text-center shadow-xl shadow-emerald-100">
                          <span className="text-xs font-black text-white/60 uppercase tracking-wider italic mb-2">Price</span>
                          <p className="text-xl font-black tracking-tight">{formatRupee(l.pricePerUnit)}</p>
                       </div>
                    </div>
                 </div>
              </div>
            ))}
            
            <div 
              onClick={() => setShowCreateModal(true)}
              className="group cursor-pointer bg-slate-50 border-4 border-dashed border-slate-200 rounded-[4rem] flex flex-col items-center justify-center p-16 hover:border-emerald-500/50 hover:bg-emerald-50/20 transition-all duration-700"
            >
               <div className="w-20 h-20 rounded-[2rem] bg-white flex items-center justify-center text-slate-200 group-hover:text-emerald-500 group-hover:scale-110 transition-all duration-700 shadow-xl mb-6">
                  <Plus size={32} />
               </div>
               <h4 className="text-xl font-black text-slate-900 uppercase tracking-tight">Add New Item</h4>
               <p className="text-slate-400 font-bold text-xs uppercase tracking-wider mt-2">Sell your farm produce</p>
            </div>
          </div>
        )}

        {activeTab === 'orders' && (
          <div className="space-y-8">
            {orders.length === 0 ? (
               <div className="py-40 text-center space-y-8">
                  <div className="w-24 h-24 bg-slate-50 rounded-[2.5rem] flex items-center justify-center mx-auto text-slate-200 shadow-inner">
                    <ShoppingBag size={32} className="opacity-20" />
                  </div>
                  <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">No activity yet</h3>
                  <p className="text-slate-400 font-bold text-xs uppercase tracking-wider">History of your orders will show up here.</p>
               </div>
            ) : (
              orders.map(o => (
                <div key={o._id} className="group bg-white border border-slate-100 rounded-[2.5rem] p-6 hover:shadow-2xl transition-all duration-700 flex flex-col lg:flex-row justify-between items-center gap-10 border-l-[12px] border-l-slate-100 hover:border-l-emerald-600">
                  <div className="flex items-center gap-8 w-full lg:w-auto">
                    <div className="h-24 w-24 rounded-[2rem] overflow-hidden border border-slate-100 shrink-0">
                       <img src={getConsistentImage(o.listing?.productName, o.listing?.category)} className="w-full h-full object-cover" alt="" />
                    </div>
                    <div className="flex-1 space-y-2">
                        <h4 className="font-black text-2xl text-slate-900 tracking-tight uppercase leading-none">{o.listing?.productName || 'Removed Item'}</h4>
                        <div className="flex flex-wrap items-center gap-4">
                           <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
                              <User size={12} /> {isFarmer ? `Buyer: ${o.buyer?.name}` : `Seller: ${o.listing?.farmer?.name}`}
                           </div>
                           <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
                              <Calendar size={12} /> {new Date(o.createdAt).toLocaleDateString()}
                           </div>
                        </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col lg:flex-row items-center gap-8 w-full lg:w-auto justify-between lg:justify-end">
                    <div className="text-center lg:text-right">
                       <p className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">Total Amount</p>
                       <p className="text-3xl font-black text-slate-950 tracking-tight">{formatRupee(o.totalPrice)}</p>
                    </div>
                    
                    <div className="flex items-center gap-4">
                       <span className={`px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-wider border transition-all ${
                         o.status === 'Accepted' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 
                         o.status === 'Pending' ? 'bg-amber-50 text-amber-600 border-amber-100' : 'bg-rose-50 text-rose-600 border-rose-100'
                       }`}>
                         {o.status}
                       </span>
                       
                       {isFarmer && o.status === 'Pending' && (
                         <div className="flex gap-2">
                            <button onClick={() => handleUpdateStatus(o._id, 'Accepted')} className="bg-emerald-600 text-white w-12 h-12 flex items-center justify-center rounded-xl hover:bg-emerald-700 shadow-xl shadow-emerald-50 transition-all">
                              <CheckCircle2 size={20} />
                            </button>
                            <button onClick={() => handleUpdateStatus(o._id, 'Rejected')} className="bg-white border border-slate-100 text-slate-400 w-12 h-12 flex items-center justify-center rounded-xl hover:bg-rose-500 hover:text-white transition-all">
                              <X size={20} />
                            </button>
                         </div>
                       )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* Checkout Modal */}
      {showOrderModal && selectedListing && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-6 z-[300]">
          <div className="bg-white rounded-[4rem] p-12 w-full max-w-xl shadow-4xl animate-in zoom-in-95 duration-500">
            <div className="flex justify-between items-start mb-10">
               <div>
                  <h2 className="text-4xl font-black text-slate-900 tracking-tight uppercase leading-[0.9]">Buy <span className="text-emerald-600">Item.</span></h2>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mt-2">{selectedListing.productName}</p>
               </div>
               <button onClick={() => setShowOrderModal(false)} className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 hover:text-rose-500 transition-all">
                  <X size={20} />
               </button>
            </div>

            <div className="space-y-10">
               <div className="bg-slate-50 rounded-[2.5rem] p-8 border border-slate-100 space-y-8">
                  <div className="flex items-center gap-6">
                     <div className="w-24 h-24 rounded-3xl overflow-hidden border-4 border-white shadow-xl shrink-0">
                        <img src={getConsistentImage(selectedListing.productName, selectedListing.category)} className="w-full h-full object-cover" alt="" />
                     </div>
                     <div>
                        <p className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-1 italic">Seller: {selectedListing.farmer?.name}</p>
                        <div className="flex items-center gap-2 font-black text-slate-900 text-xl tracking-tight">
                           ₹{selectedListing.pricePerUnit} <span className="text-sm text-slate-400">/ Unit</span>
                        </div>
                     </div>
                  </div>

                  <div className="space-y-4">
                     <label className="block text-xs font-black uppercase text-slate-400 tracking-wider text-center">How many pieces do you want?</label>
                     <div className="flex items-center justify-between bg-white px-6 py-4 rounded-[1.8rem] border border-slate-100">
                        <button onClick={() => setOrderQuantity(q => Math.max(1, q-1))} className="w-14 h-14 bg-slate-100 text-slate-400 rounded-xl hover:bg-emerald-500 hover:text-white transition-all flex items-center justify-center"><MinusIcon size={20} /></button>
                        <input 
                           type="number" 
                           min="1" 
                           max={selectedListing.quantity} 
                           className="flex-1 text-center font-black text-4xl outline-none bg-transparent" 
                           value={orderQuantity} 
                           onChange={e => setOrderQuantity(Number(e.target.value))} 
                        />
                        <button onClick={() => setOrderQuantity(q => Math.min(selectedListing.quantity, q+1))} className="w-14 h-14 bg-slate-100 text-slate-400 rounded-xl hover:bg-emerald-500 hover:text-white transition-all flex items-center justify-center"><PlusIcon size={20} /></button>
                     </div>
                  </div>

                  <div className="pt-8 border-t border-slate-200 flex justify-between items-center">
                     <div>
                        <p className="text-xs font-black text-slate-400 uppercase tracking-wider mb-1">Final Price</p>
                        <p className="text-4xl font-black text-emerald-600 tracking-tight">{formatRupee(orderQuantity * selectedListing.pricePerUnit)}</p>
                     </div>
                     <button 
                        onClick={handlePlaceOrder}
                        className="px-10 h-16 bg-emerald-600 text-white rounded-2xl font-black uppercase tracking-wider text-sm shadow-xl shadow-emerald-50 hover:bg-emerald-500 transition-all hover:-translate-y-1"
                     >
                        Place Order
                     </button>
                  </div>
               </div>
            </div>
          </div>
        </div>
      )}

      {/* Sell Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-6 z-[300]">
          <div className="bg-white rounded-[4rem] p-12 w-full max-w-2xl shadow-4xl animate-in zoom-in-95 duration-500">
            <div className="flex justify-between items-start mb-10">
               <div>
                  <h2 className="text-4xl font-black text-slate-900 tracking-tight uppercase leading-[0.9]">Sell Your <span className="text-emerald-600">Stock.</span></h2>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mt-2">Add items to the mandi</p>
               </div>
               <button onClick={() => setShowCreateModal(false)} className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 hover:text-rose-500 transition-all">
                  <X size={20} />
               </button>
            </div>
            
            <form onSubmit={handleCreateListing} className="space-y-6">
              <div className="space-y-3">
                 <label className="block text-sm font-black uppercase text-slate-400 tracking-wider px-4">Item Name</label>
                 <input 
                   required type="text" 
                   className="w-full h-16 px-8 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:border-emerald-500 font-bold text-slate-900 uppercase tracking-wider text-xs" 
                   placeholder="e.g. Fresh Brown Eggs" 
                   value={productForm.name} 
                   onChange={e => setProductForm({...productForm, name: e.target.value})} 
                 />
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-3">
                   <label className="block text-sm font-black uppercase text-slate-400 tracking-wider px-4">Quantity</label>
                   <input required type="number" className="w-full h-16 px-8 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:border-emerald-500 font-bold" value={productForm.quantity} onChange={e => setProductForm({...productForm, quantity: e.target.value})} />
                </div>
                <div className="space-y-3">
                   <label className="block text-sm font-black uppercase text-slate-400 tracking-wider px-4">Price per Unit (₹)</label>
                   <input required type="number" step="0.01" className="w-full h-16 px-8 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:border-emerald-500 font-bold" value={productForm.price} onChange={e => setProductForm({...productForm, price: e.target.value})} />
                </div>
              </div>

              <div className="space-y-3">
                 <label className="block text-sm font-black uppercase text-slate-400 tracking-wider px-4">Category</label>
                 <div className="flex gap-2">
                    {['EGG', 'BIRD', 'FEED', 'EQUIPMENT'].map(cat => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => setProductForm({...productForm, category: cat})}
                        className={`flex-1 h-12 rounded-xl font-black uppercase tracking-wider text-xs border transition-all ${
                          productForm.category === cat ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white text-slate-400 border-slate-100 hover:border-slate-300'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                 </div>
              </div>

              <div className="space-y-3">
                 <label className="block text-sm font-black uppercase text-slate-400 tracking-wider px-4">Brief Details</label>
                 <textarea className="w-full px-8 py-6 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:border-emerald-500 font-bold text-slate-700 h-24" placeholder="Mention quality, variety, etc." value={productForm.description} onChange={e => setProductForm({...productForm, description: e.target.value})} />
              </div>

              <button type="submit" className="w-full h-20 bg-emerald-600 text-white rounded-[1.8rem] font-black uppercase tracking-[0.2em] text-sm shadow-xl shadow-emerald-50 hover:bg-emerald-500 transition-all mt-4">
                 List Item for Sale
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
