import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { ShoppingBag, MessageSquare, Clock } from 'lucide-react';
import BuyerMarketplace from './BuyerMarketplace';
import BuyerChat from './BuyerChat';

export default function BuyerDashboard() {
  const location = useLocation();

  const navItems = [
    { label: 'Browse Eggs', path: '/buyer', icon: ShoppingBag },
    { label: 'My Orders', path: '/buyer/orders', icon: Clock },
    { label: 'Messages', path: '/buyer/chat', icon: MessageSquare },
  ];

  return (
    <div className="flex h-full gap-6">
      <aside className="w-64 bg-white rounded-xl shadow-sm p-4 h-[calc(100vh-8rem)] sticky top-24">
        <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4 px-3">Buyer Menu</h2>
        <nav className="space-y-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path || (item.path !== '/buyer' && location.pathname.startsWith(item.path));
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium transition-colors ${
                  isActive ? 'bg-brand-50 text-brand-700' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <item.icon size={20} className={isActive ? 'text-brand-600' : 'text-gray-400'} />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>
      
      <main className="flex-1 bg-white rounded-xl shadow-sm p-6 overflow-y-auto min-h-[calc(100vh-8rem)]">
        <Routes>
          <Route path="/" element={<BuyerMarketplace />} />
          <Route path="/orders" element={<div className="text-center py-10"><h2 className="text-xl font-bold">My Orders</h2><p className="text-gray-500 mt-2">All your previous orders will appear here (coming soon).</p></div>} />
          <Route path="/chat" element={<BuyerChat />} />
        </Routes>
      </main>
    </div>
  );
}
