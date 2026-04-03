import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Egg, LogOut, LayoutDashboard, ShoppingBag, User } from 'lucide-react';

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const userInfoStr = localStorage.getItem('userInfo');
  let userInfo = null;
  try {
    userInfo = userInfoStr ? JSON.parse(userInfoStr) : null;
  } catch (e) {
    console.error('Navbar: Error parsing userInfo', e);
  }

  const handleLogout = () => {
    localStorage.removeItem('userInfo');
    navigate('/login');
  };

  const isHome = location.pathname === '/';

  return (
    <nav className={`sticky top-0 z-[100] transition-all duration-500 ${isHome ? 'bg-white/70 backdrop-blur-2xl border-b border-white/20 shadow-sm' : 'bg-white/80 backdrop-blur-xl border-b border-gray-100 shadow-sm'}`}>
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex justify-between h-20">
          {/* Logo Section */}
          <div className="flex items-center">
            <Link to="/" className="group flex items-center gap-3">
              <div className="bg-brand-600 p-2 rounded-2xl group-hover:rotate-12 transition-transform shadow-lg shadow-brand-200">
                <Egg className="h-6 w-6 text-white" />
              </div>
              <span className="font-black text-2xl text-gray-900 tracking-tighter uppercase italic">
                Poultry<span className="text-brand-600 not-italic">Smart</span>
              </span>
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="flex items-center space-x-2 md:space-x-8">
            {userInfo ? (
              <div className="flex items-center gap-6">
                <div className="hidden md:flex items-center gap-6">
                   <Link
                     to={userInfo.role === 'Farmer' ? '/farmer' : '/buyer'}
                     className={`flex items-center gap-2 text-base font-black uppercase tracking-wider transition-colors ${location.pathname.includes('dashboard') ? 'text-brand-600' : 'text-gray-500 hover:text-brand-600'}`}
                   >
                     <LayoutDashboard size={20} /> Dashboard
                   </Link>
                   <Link 
                     to={userInfo.role === 'Farmer' ? '/farmer/listings' : '/buyer'} 
                     className={`flex items-center gap-2 text-base font-black uppercase tracking-wider transition-colors ${location.pathname.includes('listings') ? 'text-brand-600' : 'text-gray-500 hover:text-brand-600'}`}
                   >
                     <ShoppingBag size={20} /> Market
                   </Link>
                </div>

                <div className="h-8 w-px bg-gray-200 hidden md:block" />

                <div className="flex items-center gap-3">
                   <div className="hidden lg:flex flex-col items-end">
                      <span className="text-sm font-black text-gray-900 leading-none capitalize">{userInfo.name}</span>
                      <span className="text-xs font-bold text-brand-600 uppercase tracking-wider">{userInfo.role} Account</span>
                   </div>
                   <button
                     onClick={handleLogout}
                     className="bg-gray-900 hover:bg-black text-white p-3 md:px-6 md:py-3 rounded-2xl font-black text-sm uppercase tracking-wider transition-all hover:scale-105 active:scale-95 flex items-center gap-3 shadow-xl shadow-gray-200"
                   >
                     <LogOut size={18} /><span className="hidden md:inline">Logout</span>
                   </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <Link to="/login" className="text-sm font-black uppercase tracking-widest text-gray-500 hover:text-brand-600 transition-colors">
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="bg-brand-600 hover:bg-brand-500 text-white px-8 py-3 rounded-2xl font-black text-sm uppercase tracking-widest transition-all shadow-xl shadow-brand-100 hover:scale-105 active:scale-95"
                >
                  Join Now
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
