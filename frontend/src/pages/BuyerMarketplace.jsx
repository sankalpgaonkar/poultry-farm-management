import { useState, useEffect } from 'react';
import api from '../utils/axios';
import { ShoppingCart } from 'lucide-react';

export default function BuyerMarketplace() {
  const [listings, setListings] = useState([]);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [selectedListing, setSelectedListing] = useState(null);
  const [orderQuantity, setOrderQuantity] = useState('');
  const [search, setSearch] = useState('');

  const fetchListings = async () => {
    try {
      const res = await api.get('/marketplace');
      setListings(res.data);
    } catch (err) {
      console.error(err);
    }
  };

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

  useEffect(() => {
    fetchListings();
  }, []);

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    try {
      await api.post('/marketplace/orders', {
        listingId: selectedListing._id,
        quantityOrdered: Number(orderQuantity) || 1
      });
      
      setShowOrderModal(false);
      setOrderQuantity('');
      fetchListings(); // refresh available quantities
      alert('Order placed successfully!');
    } catch (err) {
      alert(err.response?.data?.message || 'Error placing order');
    }
  };

  const filteredListings = listings.filter(l => 
    l.productName.toLowerCase().includes(search.toLowerCase()) || 
    (l.farmer?.name && l.farmer.name.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Marketplace</h1>
          <p className="text-gray-500 text-sm mt-1">Directly purchase fresh eggs from local farmers.</p>
        </div>
        <input 
          type="text" 
          placeholder="Search product or farmer..." 
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="border px-4 py-2 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none w-full md:w-64"
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {filteredListings.length === 0 ? (
          <p className="text-gray-500 col-span-3">No available listings match your search.</p>
        ) : (
          filteredListings.map(l => (
            <div key={l._id} className="border border-gray-100 rounded-2xl overflow-hidden hover:shadow-lg transition-shadow bg-white flex flex-col group">
              <div className="h-48 w-full border-b overflow-hidden relative">
                <img 
                  src={getProductImage(l.productName)} 
                  alt={l.productName}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
              </div>
              <div className="p-5 flex-1 flex flex-col bg-white relative z-10">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-gray-900 text-lg">{l.productName}</h3>
                  <span className="text-brand-600 font-bold text-lg">₹{l.pricePerUnit}</span>
                </div>
                <div className="text-sm text-gray-500 mb-4 flex-1">
                  <p>By Farmer: <span className="font-medium text-gray-700">{l.farmer?.name || 'Unknown'}</span></p>
                  {l.farm && <p className="text-xs text-brand-600 font-medium">From {l.farm.name}</p>}
                </div>
                <div className="flex items-center justify-between mt-auto">
                  <span className="text-xs bg-brand-50 text-brand-700 px-2 flex items-center h-8 rounded-lg font-bold">{l.quantity} units left</span>
                  <button 
                    onClick={() => { setSelectedListing(l); setShowOrderModal(true); }}
                    className="bg-gray-900 hover:bg-black text-white px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 transition-colors"
                  >
                    <ShoppingCart size={16} /> Order
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {showOrderModal && selectedListing && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-sm shadow-xl">
            <h2 className="text-xl font-bold mb-1 text-gray-900">Complete Purchase</h2>
            <p className="text-sm text-gray-500 mb-4">{selectedListing.productName}</p>
            
            <form onSubmit={handlePlaceOrder} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
                <input 
                  type="number" 
                  min="1" 
                  max={selectedListing.quantity} 
                  required 
                  className="w-full border px-3 py-2 rounded-lg" 
                  value={orderQuantity} 
                  onChange={e => setOrderQuantity(e.target.value)} 
                />
                <p className="text-xs text-gray-400 mt-1">Available: {selectedListing.quantity}</p>
              </div>
              
              <div className="bg-gray-50 p-3 rounded-lg flex justify-between items-center border">
                <span className="text-sm font-medium text-gray-600">Total Price</span>
                <span className="font-bold text-lg text-gray-900">₹{(Number(orderQuantity) * selectedListing.pricePerUnit).toFixed(2)}</span>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button type="button" onClick={() => setShowOrderModal(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700 font-semibold">Confirm Order</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
