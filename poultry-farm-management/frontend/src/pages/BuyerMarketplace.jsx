import { useState, useEffect } from 'react';
import api from '../utils/axios';
import { ShoppingCart } from 'lucide-react';
import { getConsistentImage } from '../utils/imageConstants';

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

  const getProductImage = (title) => getConsistentImage(title);


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
              <div className="h-48 overflow-hidden relative">
                <img 
                  src={getProductImage(l.productName)} 
                  alt={l.productName}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  onError={(e) => { e.target.src = 'https://via.placeholder.com/400x300?text=Product+Image'; }}
                />
              </div>
              <div className="p-5 flex-1 flex flex-col bg-white relative z-10">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-gray-900 text-lg">{l.productName}</h3>
                  <span className="text-brand-600 font-bold text-lg">₹{l.pricePerUnit}</span>
                </div>
                <p className="text-sm text-gray-500 mb-4 flex-1">By Farmer: <span className="font-medium text-gray-700">{l.farmer?.name || 'Unknown'}</span></p>
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
