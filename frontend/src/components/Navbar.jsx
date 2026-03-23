import { Link, useNavigate } from 'react-router-dom';
import { Egg } from 'lucide-react';

export default function Navbar() {
  const navigate = useNavigate();
  const userInfoStr = localStorage.getItem('userInfo');
  const userInfo = userInfoStr ? JSON.parse(userInfoStr) : null;

  const handleLogout = () => {
    localStorage.removeItem('userInfo');
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2">
              <Egg className="h-8 w-8 text-brand-600" />
              <span className="font-bold text-xl text-gray-900 tracking-tight">PoultrySmart</span>
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            {userInfo ? (
              <>
                <Link
                  to={userInfo.role === 'Farmer' ? '/farmer' : '/buyer'}
                  className="text-gray-600 hover:text-brand-600 font-medium transition-colors"
                >
                  Dashboard
                </Link>
                {userInfo.role === 'Farmer' && (
                  <Link to="/farmer/listings" className="text-gray-600 hover:text-brand-600 font-medium transition-colors">
                    Marketplace
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-medium transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-gray-600 hover:text-brand-600 font-medium transition-colors">
                  Log in
                </Link>
                <Link
                  to="/signup"
                  className="bg-brand-600 hover:bg-brand-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                >
                  Sign up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
