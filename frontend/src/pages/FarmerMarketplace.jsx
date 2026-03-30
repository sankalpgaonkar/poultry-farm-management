import { useState, useEffect } from 'react';
import api from '../utils/axios';
import { Plus, Package, IndianRupee, Trash2 } from 'lucide-react';

export default function FarmerMarketplace() {
  const [listings, setListings] = useState([]);
  const [orders, setOrders] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);

  const [productName, setProductName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [price, setPrice] = useState('');
  const [farms, setFarms] = useState([]);
  const [selectedFarm, setSelectedFarm] = useState('');

  const fetchData = async () => {
    try {
      setLoading(true);
      const [resListings, resOrders, resFarms] = await Promise.all([
        api.get('/marketplace/my-listings'),
        api.get('/marketplace/orders'),
        api.get('/farms')
      ]);
      setListings(resListings.data);
      setOrders(resOrders.data);
      setFarms(resFarms.data);
      if (resFarms.data.length > 0) {
        setSelectedFarm(resFarms.data[0]._id);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const getProductImage = (title) => {
    const text = (title || '').toLowerCase();
    
    const imageMap = {
      broiler: 'https://images.unsplash.com/photo-1548550023-2bf3b4e4eea5?q=80&w=800&auto=format&fit=crop',
      layer: 'https://images.unsplash.com/photo-1548550023-2bf3b4e4eea5?q=80&w=800&auto=format&fit=crop',
      hen: 'https://images.unsplash.com/photo-1548550023-2bf3b4e4eea5?q=80&w=800&auto=format&fit=crop',
      rooster: 'https://images.unsplash.com/photo-1548550023-2bf3b4e4eea5?q=80&w=800&auto=format&fit=crop',
      chicken: 'https://images.unsplash.com/photo-1548550023-2bf3b4e4eea5?q=80&w=800&auto=format&fit=crop',
      bird: 'https://images.unsplash.com/photo-1548550023-2bf3b4e4eea5?q=80&w=800&auto=format&fit=crop',
      chick: 'https://images.unsplash.com/photo-1522856339183-5a9b7367cefc?q=80&w=800&auto=format&fit=crop',
      chicks: 'https://images.unsplash.com/photo-1522856339183-5a9b7367cefc?q=80&w=800&auto=format&fit=crop',
      duck: 'https://images.unsplash.com/photo-1456926631375-92c8ce872def?q=80&w=800&auto=format&fit=crop',
      turkey: 'https://images.unsplash.com/photo-1605333166669-0268da87c8cb?q=80&w=800&auto=format&fit=crop',
      quail: 'https://images.unsplash.com/photo-1548550023-2bf3b4e4eea5?q=80&w=800&auto=format&fit=crop',
      feed: 'https://images.unsplash.com/photo-1586208035324-747f15dbbc4b?q=80&w=800&auto=format&fit=crop',
      mash: 'https://images.unsplash.com/photo-1586208035324-747f15dbbc4b?q=80&w=800&auto=format&fit=crop',
      pellet: 'https://images.unsplash.com/photo-1586208035324-747f15dbbc4b?q=80&w=800&auto=format&fit=crop',
      crumble: 'https://images.unsplash.com/photo-1586208035324-747f15dbbc4b?q=80&w=800&auto=format&fit=crop',
      grain: 'https://images.unsplash.com/photo-1586208035324-747f15dbbc4b?q=80&w=800&auto=format&fit=crop',
      corn: 'https://images.unsplash.com/photo-1586208035324-747f15dbbc4b?q=80&w=800&auto=format&fit=crop',
      maize: 'https://images.unsplash.com/photo-1586208035324-747f15dbbc4b?q=80&w=800&auto=format&fit=crop',
      wheat: 'https://images.unsplash.com/photo-1586208035324-747f15dbbc4b?q=80&w=800&auto=format&fit=crop',
      med: 'https://images.unsplash.com/photo-1584308666744-24d5e4b78bb7?q=80&w=800&auto=format&fit=crop',
      medicine: 'https://images.unsplash.com/photo-1584308666744-24d5e4b78bb7?q=80&w=800&auto=format&fit=crop',
      vitamin: 'https://images.unsplash.com/photo-1584308666744-24d5e4b78bb7?q=80&w=800&auto=format&fit=crop',
      vaccine: 'https://images.unsplash.com/photo-1584308666744-24d5e4b78bb7?q=80&w=800&auto=format&fit=crop',
      antibiotic: 'https://images.unsplash.com/photo-1584308666744-24d5e4b78bb7?q=80&w=800&auto=format&fit=crop',
      powder: 'https://images.unsplash.com/photo-1584308666744-24d5e4b78bb7?q=80&w=800&auto=format&fit=crop',
      spray: 'https://images.unsplash.com/photo-1584308666744-24d5e4b78bb7?q=80&w=800&auto=format&fit=crop',
      equip: 'https://images.unsplash.com/photo-1589923188900-85dae523342b?q=80&w=800&auto=format&fit=crop',
      drinker: 'https://images.unsplash.com/photo-1589923188900-85dae523342b?q=80&w=800&auto=format&fit=crop',
      feeder: 'https://images.unsplash.com/photo-1589923188900-85dae523342b?q=80&w=800&auto=format&fit=crop',
      lamp: 'https://images.unsplash.com/photo-1589923188900-85dae523342b?q=80&w=800&auto=format&fit=crop',
      brooder: 'https://images.unsplash.com/photo-1589923188900-85dae523342b?q=80&w=800&auto=format&fit=crop',
      incubator: 'https://images.unsplash.com/photo-1589923188900-85dae523342b?q=80&w=800&auto=format&fit=crop',
      tray: 'https://images.unsplash.com/photo-1589923188900-85dae523342b?q=80&w=800&auto=format&fit=crop',
      cage: 'https://images.unsplash.com/photo-1589923188900-85dae523342b?q=80&w=800&auto=format&fit=crop',
      coop: 'https://images.unsplash.com/photo-1589923188900-85dae523342b?q=80&w=800&auto=format&fit=crop',
      meat: 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?q=80&w=800&auto=format&fit=crop',
      breast: 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?q=80&w=800&auto=format&fit=crop',
      wing: 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?q=80&w=800&auto=format&fit=crop',
      thigh: 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?q=80&w=800&auto=format&fit=crop',
      frozen: 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?q=80&w=800&auto=format&fit=crop',
      brown: 'https://images.unsplash.com/photo-1587486913049-53fc88980cfc?q=80&w=800&auto=format&fit=crop',
      white: 'https://images.unsplash.com/photo-1587486913049-53fc88980cfc?q=80&w=800&auto=format&fit=crop',
      organic: 'https://images.unsplash.com/photo-1587486913049-53fc88980cfc?q=80&w=800&auto=format&fit=crop',
      jumbo: 'https://images.unsplash.com/photo-1587486913049-53fc88980cfc?q=80&w=800&auto=format&fit=crop',
      egg: 'https://images.unsplash.com/photo-1587486913049-53fc88980cfc?q=80&w=800&auto=format&fit=crop',
      eggs: 'https://images.unsplash.com/photo-1587486913049-53fc88980cfc?q=80&w=800&auto=format&fit=crop'
    };

    const words = text.split(/[^a-z]+/);
    for (const word of words) {
      if (imageMap[word]) return imageMap[word];
    }
    
    for (const [key, imgUrl] of Object.entries(imageMap)) {
      if (text.includes(key)) return imgUrl;
    }

    const fallbacks = [
      'https://images.unsplash.com/photo-1516467508483-a7212febe31a?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1595856461973-19cbbf904fdb?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1529313780224-1a12b682208ea?q=80&w=800&auto=format&fit=crop'
    ];
    let hash = 0;
    for (let i = 0; i < text.length; i++) { hash = text.charCodeAt(i) + ((hash << 5) - hash); }
    return fallbacks[Math.abs(hash) % fallbacks.length];
  };

  const handleCreateListing = async (e) => {
    e.preventDefault();
    try {
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
      
      await axios.post('/api/marketplace', {
        productName,
        quantity: Number(quantity),
        pricePerUnit: Number(price),
        farmId: selectedFarm
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
      await axios.delete(`/api/marketplace/${id}`, config);
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
      
      await axios.put(`/api/marketplace/orders/${orderId}/status`, { status }, config);
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
              <div className="h-40 w-full border-b overflow-hidden relative">
                <img 
                  src={getProductImage(l.productName)} 
                  alt={l.productName}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
              </div>
              <div className="p-4 flex-1 flex flex-col bg-white relative z-10">
                <h3 className="font-bold text-lg">{l.productName}</h3>
                {l.farm && <p className="text-xs text-brand-600 font-medium">{l.farm.name}</p>}
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
              {farms.length === 0 ? (
                <div className="bg-yellow-50 text-yellow-800 p-4 rounded-lg text-sm border border-yellow-200">
                  You need to create a farm in Farm Management before you can list products.
                </div>
              ) : (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Select Farm</label>
                    <select required className="w-full border px-3 py-2 rounded-lg" value={selectedFarm} onChange={e => setSelectedFarm(e.target.value)}>
                      {farms.map(f => <option key={f._id} value={f._id}>{f.name} ({f.location})</option>)}
                    </select>
                  </div>
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
                </>
              )}
              <div className="flex justify-end gap-3 mt-6">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">Cancel</button>
                <button type="submit" disabled={farms.length === 0} className="px-4 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700 disabled:opacity-50">Publish Listing</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
