import { useState, useMemo } from 'react';
import { ShoppingCart, Plus, Minus, Tag, Truck, Store as StoreIcon, Search, ChevronLeft } from 'lucide-react';

const STORES = [
  {
    id: 1,
    name: 'National Agro Supplies',
    description: 'Top quality feed and daily farm essentials.',
    image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?q=80&w=800&auto=format&fit=crop',
    products: [
      { id: 101, name: 'Premium Layer Mash (50kg)', category: 'Feed', price: 1500, icon: '🌾', image: 'https://images.unsplash.com/photo-1586208035324-747f15dbbc4b?q=80&w=800&auto=format&fit=crop', description: 'High protein formula for maximum egg production.' },
      { id: 102, name: 'Broiler Starter Crumbles', category: 'Feed', price: 1800, icon: '🌽', image: 'https://images.unsplash.com/photo-1601593768929-d5e47a37ef2a?q=80&w=800&auto=format&fit=crop', description: 'Optimal nutrition for rapid early growth.' },
      { id: 103, name: 'Wood Shavings Bale (20kg)', category: 'Supplies', price: 150, icon: '🌲', image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=800&auto=format&fit=crop', description: 'Clean bedding material.' }
    ]
  },
  {
    id: 2,
    name: 'PoultryMed Pharma',
    description: 'Veterinary medicines and supplements.',
    image: 'https://images.unsplash.com/photo-1584308666744-24d5e4b78bb7?q=80&w=800&auto=format&fit=crop',
    products: [
      { id: 201, name: 'Amoxicillin Powder 500g', category: 'Medicine', price: 600, icon: '💊', image: 'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?q=80&w=800&auto=format&fit=crop', description: 'Broad-spectrum antibiotic.' },
      { id: 202, name: 'Liquid Multivitamins 1L', category: 'Medicine', price: 450, icon: '🧪', image: 'https://images.unsplash.com/photo-1512069772995-ec65ed45afd6?q=80&w=800&auto=format&fit=crop', description: 'Immune booster.' },
      { id: 203, name: 'Disinfectant Spray 5L', category: 'Supplies', price: 850, icon: '🧼', image: 'https://images.unsplash.com/photo-1585771724684-38269d6639fd?q=80&w=800&auto=format&fit=crop', description: 'Heavy-duty biosecurity spray.' }
    ]
  },
  {
    id: 3,
    name: 'Sunrise Hatcheries',
    description: 'Day-old chicks and heavy equipment.',
    image: 'https://images.unsplash.com/photo-1522856339183-5a9b7367cefc?q=80&w=800&auto=format&fit=crop',
    products: [
      { id: 301, name: 'White Leghorn Chicks (x100)', category: 'Chicks', price: 3500, icon: '🐥', image: 'https://images.unsplash.com/photo-1555629151-5738dff4ebb7?q=80&w=800&auto=format&fit=crop', description: 'Day-old layer chicks.' },
      { id: 302, name: 'Cobb 500 Broilers (x100)', category: 'Chicks', price: 3200, icon: '🐔', image: 'https://images.unsplash.com/photo-1548550023-2bf3b4e4eea5?q=80&w=800&auto=format&fit=crop', description: 'Fast-growing meat birds.' },
      { id: 303, name: 'Automatic Bell Drinker', category: 'Equipment', price: 250, icon: '💧', image: 'https://images.unsplash.com/photo-1589923188900-85dae523342b?q=80&w=800&auto=format&fit=crop', description: 'Gravity-fed watering system.' },
      { id: 304, name: 'Infrared Brooder Lamp', category: 'Equipment', price: 450, icon: '💡', image: 'https://images.unsplash.com/photo-1565008447742-97f6f38c985c?q=80&w=800&auto=format&fit=crop', description: '250W heating lamp.' }
    ]
  }
];

export default function FarmStore() {
  const [cart, setCart] = useState([]);
  const [selectedStore, setSelectedStore] = useState(null);
  const [search, setSearch] = useState('');
  const [showCart, setShowCart] = useState(false);

  const filteredStores = useMemo(() => {
    const lowerSearch = search.toLowerCase();
    return STORES.filter(store =>
      store.name.toLowerCase().includes(lowerSearch) ||
      store.description.toLowerCase().includes(lowerSearch)
    );
  }, [search]);

  const displayedProducts = useMemo(() => {
    if (!selectedStore) return [];
    const lowerSearch = search.toLowerCase();
    return selectedStore.products.filter(p => 
      p.name.toLowerCase().includes(lowerSearch)
    );
  }, [selectedStore, search]);

  const addToCart = (item) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) {
        return prev.map(i => i.id === item.id ? { ...i, qty: i.qty + 1 } : i);
      }
      return [...prev, { ...item, qty: 1 }];
    });
  };

  const updateQuantity = (id, delta) => {
    setCart(prev => prev.map(i => {
      if (i.id === id) {
        const newQty = Math.max(0, i.qty + delta);
        return { ...i, qty: newQty };
      }
      return i;
    }).filter(i => i.qty > 0));
  };

  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
  const cartItemCount = cart.reduce((sum, item) => sum + item.qty, 0);

  const handleCheckout = () => {
    if (cart.length === 0) return;
    alert(`Order placed successfully!\nTotal: ₹${cartTotal.toLocaleString()}\nItems will be delivered to your farm within 3 business days.`);
    setCart([]);
    setShowCart(false);
  };

  return (
    <div className="relative h-full flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <StoreIcon className="text-brand-600" /> {selectedStore ? selectedStore.name : 'Farm Supplies Network'}
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            {selectedStore ? 'Select products to add to your cart.' : 'Choose a vendor to browse their catalog.'}
          </p>
        </div>
        <button
          onClick={() => setShowCart(true)}
          className="relative bg-white border shadow-sm p-3 rounded-xl hover:bg-gray-50 transition-colors"
        >
          <ShoppingCart className="text-gray-700" />
          {cartItemCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-brand-600 text-white text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full">
              {cartItemCount}
            </span>
          )}
        </button>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col md:flex-row gap-4 mb-6 items-center">
        {selectedStore && (
          <button
            onClick={() => { setSelectedStore(null); setSearch(''); }}
            className="flex items-center gap-2 bg-white border px-4 py-3 rounded-xl font-semibold text-gray-700 hover:bg-gray-50"
          >
            <ChevronLeft size={18} /> Back to Stores
          </button>
        )}
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder={selectedStore ? "Search products..." : "Search stores..."}
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border rounded-xl outline-none focus:ring-2 focus:ring-brand-500"
          />
        </div>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-6 w-full">
        {!selectedStore ? (
          // Render Stores
          filteredStores.map(store => (
            <div
              key={store.id}
              onClick={() => { setSelectedStore(store); setSearch(''); }}
              className="bg-white border rounded-2xl overflow-hidden hover:shadow-xl transition-all cursor-pointer flex flex-col group"
            >
              <div className="h-40 overflow-hidden relative">
                <img 
                  src={store.image} 
                  alt={store.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  onError={(e) => { e.target.src = 'https://via.placeholder.com/400x300?text=Store+Image+Unavailable'; }}
                />
              </div>
              <div className="p-5 flex-1 flex flex-col bg-white relative z-10">
                <h3 className="font-bold text-gray-900 text-lg">{store.name}</h3>
                <p className="text-sm text-gray-500 mt-1">{store.description}</p>
                <div className="mt-4 text-brand-600 font-semibold text-sm flex items-center gap-1">
                  View {store.products.length} Products <ChevronLeft className="rotate-180" size={16} />
                </div>
              </div>
            </div>
          ))
        ) : (
          // Render Products
          displayedProducts.map(item => (
            <div key={item.id} className="bg-white border rounded-2xl overflow-hidden hover:shadow-xl transition-all flex flex-col relative">
              <div className="absolute top-0 right-0 bg-brand-50 text-brand-700 font-bold px-3 py-1 rounded-bl-xl text-xs flex items-center gap-1 z-10">
                <Tag size={12} /> {item.category}
              </div>

              <div className="h-40 overflow-hidden">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  onError={(e) => { e.target.onerror = null; e.target.src = `https://via.placeholder.com/400x300?text=${encodeURIComponent(item.name)}`; }}
                />
              </div>

              <div className="flex-1 flex flex-col p-5">
                <h3 className="font-bold text-gray-900 leading-tight mb-1">{item.name}</h3>
                <p className="text-xs text-gray-500 flex-1">{item.description}</p>

                <div className="mt-4 flex items-center justify-between">
                  <span className="font-black text-xl text-brand-700">₹{item.price.toLocaleString()}</span>
                  <button
                    onClick={(e) => { e.stopPropagation(); addToCart(item); }}
                    className="bg-gray-900 hover:bg-black text-white p-2 rounded-lg transition-colors flex items-center justify-center w-10 h-10"
                  >
                    <Plus size={20} />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Cart Sidebar Modal */}
      {showCart && (
        <div className="fixed inset-0 bg-black/50 z-50 flex justify-end transition-opacity">
          <div className="bg-white w-full max-w-md h-full shadow-2xl flex flex-col animate-slide-in-right">
            <div className="p-5 border-b flex justify-between items-center bg-gray-50">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <ShoppingCart /> Your Needs Cart
              </h2>
              <button onClick={() => setShowCart(false)} className="text-gray-500 hover:text-black font-bold p-2">✕ Close</button>
            </div>

            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {cart.length === 0 ? (
                <div className="text-center text-gray-400 py-10">
                  <ShoppingCart size={48} className="mx-auto mb-3 opacity-20" />
                  <p>Your cart is empty.</p>
                </div>
              ) : (
                cart.map(item => (
                  <div key={item.id} className="flex border rounded-xl p-3 gap-3 items-center bg-white shadow-sm">
                    <div className="text-3xl bg-gray-50 p-2 rounded-lg">{item.icon}</div>
                    <div className="flex-1">
                      <h4 className="font-bold text-sm leading-tight text-gray-800">{item.name}</h4>
                      <p className="text-brand-600 font-bold text-sm mt-1">₹{(item.price * item.qty).toLocaleString()}</p>
                    </div>
                    <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
                      <button onClick={() => updateQuantity(item.id, -1)} className="p-1 hover:bg-white rounded-md text-gray-600"><Minus size={14} /></button>
                      <span className="font-bold text-sm w-4 text-center">{item.qty}</span>
                      <button onClick={() => updateQuantity(item.id, 1)} className="p-1 hover:bg-white rounded-md text-gray-600"><Plus size={14} /></button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {cart.length > 0 && (
              <div className="p-5 border-t bg-white">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-gray-500 font-medium">Subtotal</span>
                  <span className="font-black text-2xl text-gray-900">₹{cartTotal.toLocaleString()}</span>
                </div>
                <button
                  onClick={handleCheckout}
                  className="w-full bg-brand-600 hover:bg-brand-700 text-white font-bold py-4 rounded-xl shadow-lg flex justify-center items-center gap-2 text-lg transition-all active:scale-95"
                >
                  <Truck size={20} /> Checkout Securely
                </button>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
