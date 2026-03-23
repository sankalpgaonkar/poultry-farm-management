import { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Package, IndianRupee, Trash2 } from 'lucide-react';

export default function FarmerMarketplace() {
  const [listings, setListings] = useState([]);
  const [orders, setOrders] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const [productName, setProductName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [price, setPrice] = useState('');

  const fetchData = async () => {
    try {
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
      
      const resListings = await axios.get('http://localhost:5000/api/marketplace/my-listings', config);
      setListings(resListings.data);

      const resOrders = await axios.get('http://localhost:5000/api/marketplace/orders', config);
      setOrders(resOrders.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const getProductIcon = (title) => {
    const text = (title || '').toLowerCase();
    
    // Massive smart dictionary mapping to EMOJIS
    const iconMap = {
      broiler: '🐔', layer: '🐓', chick: '🐥', chicks: '🐥', hen: '🐔',
      rooster: '🐓', duck: '🦆', quail: '🐦', turkey: '🦃', bird: '🕊️', chicken: '🐔',
      feed: '🌾', mash: '🥣', pellet: '💊', crumble: '🍪', grain: '🌾',
      corn: '🌽', maize: '🌽', wheat: '🌾',
      med: '🏥', medicine: '💊', vitamin: '🧪', vaccine: '💉', antibiotic: '💊',
      powder: '🧂', spray: '🧴',
      equip: '⚙️', drinker: '💧', feeder: '🍽️', lamp: '💡', brooder: '🔥',
      incubator: '🌡️', tray: '🗃️', cage: '🏗️', coop: '🏠',
      meat: '🥩', breast: '🥩', wing: '🍗', thigh: '🍗', frozen: '🧊',
      brown: '🥚', white: '🥚', organic: '🥚', jumbo: '🥚', egg: '🥚', eggs: '🥚'
    };

    const words = text.split(/[^a-z]+/);
    for (const word of words) {
      if (iconMap[word]) return iconMap[word];
    }
    
    for (const [key, icon] of Object.entries(iconMap)) {
      if (text.includes(key)) return icon;
    }

    // Stable fallback emoji based on hash
    const fallbacks = ['📦', '🏷️', '🛒', '🛍️', '🥚'];
    let hash = 0;
    for (let i = 0; i < text.length; i++) { hash = text.charCodeAt(i) + ((hash << 5) - hash); }
    return fallbacks[Math.abs(hash) % fallbacks.length];
  };

  const handleCreateListing = async (e) => {
    e.preventDefault();
    try {
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
      
      await axios.post('http://localhost:5000/api/marketplace', {
        productName,
        quantity: Number(quantity),
        pricePerUnit: Number(price)
      }, config);
      
      setShowModal(false);
      setProductName(''); setQuantity(''); setPrice('');
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteListing = async (id) => {
    if (!window.confirm("Are you sure you want to delete this listing?")) return;
    try {
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
      await axios.delete(`http://localhost:5000/api/marketplace/${id}`, config);
      fetchData();
    } catch (err) {
      console.error(err);
      alert('Failed to delete listing.');
    }
  };

  const handleUpdateOrder = async (orderId, status) => {
    try {
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
      
      await axios.put(`http://localhost:5000/api/marketplace/orders/${orderId}/status`, { status }, config);
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">My Listings</h1>
        <button 
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
        >
          <Plus size={18} /> New Listing
        </button>
      </div>

      {listings.length === 0 ? (
        <p className="text-gray-500">You have no active listings.</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-3">
          {listings.map(l => (
            <div key={l._id} className="border border-gray-100 rounded-2xl overflow-hidden hover:shadow-lg transition-shadow bg-white flex flex-col group">
              <div className="h-40 bg-brand-50 flex items-center justify-center border-b group-hover:bg-brand-100 transition-colors duration-500">
                <div className="text-7xl group-hover:scale-110 transition-transform duration-500">
                  {getProductIcon(l.productName)}
                </div>
              </div>
              <div className="p-4 flex-1 flex flex-col bg-white relative z-10">
                <h3 className="font-bold text-lg">{l.productName}</h3>
                <div className="mt-4 flex justify-between text-sm text-gray-600 items-end">
                  <div className="space-y-1">
                    <span className="flex items-center gap-1"><Package size={16}/> {l.quantity} units</span>
                    <span className="flex items-center gap-1 text-green-700 font-semibold"><IndianRupee size={16}/> {l.pricePerUnit} / unit</span>
                  </div>
                  <button 
                    onClick={() => handleDeleteListing(l._id)} 
                    className="text-red-500 hover:text-red-700 p-2 rounded-lg hover:bg-red-50 transition-colors"
                    title="Delete Listing"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <hr className="my-8" />
      
      <h1 className="text-2xl font-bold text-gray-900">Incoming Orders</h1>
      {orders.length === 0 ? (
        <p className="text-gray-500">No orders received yet.</p>
      ) : (
        <div className="space-y-4">
          {orders.map(o => (
            <div key={o._id} className="border p-4 rounded-xl flex justify-between items-center bg-gray-50">
              <div>
                <p className="font-bold">{o.listing?.productName || 'Product'} (x{o.quantityOrdered})</p>
                <p className="text-sm text-gray-500">Buyer: {o.buyer?.name} • Total: ₹{o.totalPrice}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className={`px-3 py-1 text-xs font-bold rounded-full ${o.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' : o.status === 'Accepted' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                  {o.status}
                </span>
                {o.status === 'Pending' && (
                  <div className="flex gap-2">
                    <button onClick={() => handleUpdateOrder(o._id, 'Accepted')} className="px-3 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700">Accept</button>
                    <button onClick={() => handleUpdateOrder(o._id, 'Rejected')} className="px-3 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700">Reject</button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-xl">
            <h2 className="text-xl font-bold mb-4 text-gray-900">Create Listing</h2>
            <form onSubmit={handleCreateListing} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
                <input required type="text" className="w-full border px-3 py-2 rounded-lg focus:ring-2 outline-none focus:ring-brand-500" placeholder="e.g. Organic Free-Range Eggs" value={productName} onChange={e => setProductName(e.target.value)} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Quantity (Trays/Units)</label>
                <input required type="number" className="w-full border px-3 py-2 rounded-lg" value={quantity} onChange={e => setQuantity(e.target.value)} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Price per Unit (₹)</label>
                <input required type="number" step="0.01" className="w-full border px-3 py-2 rounded-lg" value={price} onChange={e => setPrice(e.target.value)} />
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700">Publish Listing</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
