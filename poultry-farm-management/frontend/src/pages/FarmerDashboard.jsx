import { Routes, Route, Link, useLocation } from 'react-router-dom';
import DashboardOverview from './DashboardOverview';
import FarmManagement from './FarmManagement';
import Marketplace from './Marketplace';
import FarmerOrders from './FarmerOrders';
import AIAssistant from '../components/AIAssistant';
import EggPrediction from './EggPrediction';
import HealthIntelligence from './HealthIntelligence';
import ProfitAnalyzer from './ProfitAnalyzer';
import Inventory from './Inventory';
import Community from './Community';
import SmartFeatures from './SmartFeatures';
import FarmStore from './FarmStore';
import SupplyTracking from './SupplyTracking';
import { 
  LayoutDashboard, 
  Stethoscope, 
  Calculator, 
  Package, 
  LineChart, 
  Globe, 
  Users, 
  Settings, 
  ShoppingBag, 
  Store, 
  MessageSquare, 
  ShoppingCart, 
  Mic,
  Search,
  Bell,
  ChevronRight,
  LogOut,
  User as UserIcon,
  Activity,
  Zap,
  TrendingUp,
  Cpu,
  Layers,
  ShieldCheck,
  Radar,
  Egg
} from 'lucide-react';
import { useState, useEffect } from 'react';

export default function FarmerDashboard() {
  const location = useLocation();
  const [isListening, setIsListening] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const userInfo = JSON.parse(localStorage.getItem('userInfo')) || { name: 'Producer' };

  const navGroups = [
    {
      title: "Daily Farm Work",
      items: [
        { label: 'Dashboard', path: '/farmer', icon: LayoutDashboard },
        { label: 'My Farm Data', path: '/farmer/manage', icon: Layers },
        { label: 'Feed & Supplies', path: '/farmer/inventory', icon: Package },
      ]
    },
    {
      title: "Bird Health & AI",
      items: [
        { label: 'Check Health', path: '/farmer/health', icon: Stethoscope },
        { label: 'Daily Tips', path: '/farmer/predict', icon: Cpu },
        { label: 'My Earnings', path: '/farmer/profit', icon: Calculator },
        { label: 'Advanced Tools', path: '/farmer/smart', icon: Radar },
      ]
    },
    {
      title: "Buy & Sell",
      items: [
        { label: 'Marketplace', path: '/farmer/listings', icon: ShoppingBag },
        { label: 'Your Orders', path: '/farmer/orders', icon: ShoppingCart },
        { label: 'Farm Store', path: '/farmer/store', icon: Store },
        { label: 'Track Deliveries', path: '/farmer/supplies', icon: Zap },
      ]
    },
    {
      title: "Community",
      items: [
        { label: 'Farmer Groups', path: '/farmer/community', icon: Users },
        { label: 'Kisan Mitra AI', path: '/farmer/ai', icon: MessageSquare },
      ]
    }
  ];

  const handleVoiceInput = () => {
    setIsListening(true);
    setTimeout(() => {
      setIsListening(false);
      alert('Kisan Mitra: Thinking about your question...');
    }, 2800);
  };

  const handleLogout = () => {
    localStorage.removeItem('userInfo');
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  return (
    <div className="flex h-screen bg-[#F8FAFC] overflow-hidden">
      
      {/* Friendly Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-[300px] bg-white border-r border-slate-100 transition-all duration-700 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} xl:relative xl:translate-x-0 flex flex-col shadow-xl shadow-slate-200/50`}>
        
        {/* Simple Brand Header */}
        <div className="p-10 pb-8">
           <div className="flex items-center gap-4 group cursor-pointer">
              <div className="relative w-12 h-12 bg-emerald-600 rounded-2xl flex items-center justify-center text-white shadow-xl transition-all duration-700">
                 <Egg size={24} className="fill-white" />
                 <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full border-2 border-white"></div>
              </div>
              <div className="space-y-0.5">
                 <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-none">PoultrySmart.</h1>
                 <p className="text-sm font-bold tracking-wider text-slate-400 uppercase leading-none">Farmer Dashboard</p>
              </div>
           </div>
        </div>

        {/* Navigation Clusters */}
        <div className="flex-1 overflow-y-auto px-6 space-y-10 py-6 no-scrollbar">
           {navGroups.map((group) => (group.items.length > 0 && (
             <div key={group.title} className="space-y-4">
               <h3 className="text-sm font-black text-slate-300 uppercase tracking-wider px-4">{group.title}</h3>
               <div className="space-y-1">
                 {group.items.map((item) => {
                    const isActive = location.pathname === item.path || (item.path !== '/farmer' && location.pathname.startsWith(item.path));
                    return (
                      <Link
                        key={item.path}
                        to={item.path}
                        className={`group flex items-center justify-between px-6 py-4 rounded-2xl transition-all duration-500 relative ${
                          isActive 
                            ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-100' 
                            : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                        }`}
                      >
                        <div className="flex items-center gap-4 relative z-10">
                           <item.icon size={20} className={`transition-all duration-500 ${isActive ? 'text-white' : 'text-slate-300 group-hover:text-emerald-600'}`} />
                           <span className="text-sm font-bold">{item.label}</span>
                        </div>
                        {isActive && <ChevronRight size={14} className="text-white relative z-10" />}
                      </Link>
                    );
                 })}
               </div>
             </div>
           )))}
        </div>

        {/* User Profile & Logout */}
        <div className="p-8 border-t border-slate-50">
           <div className="bg-slate-50 rounded-2xl p-4 mb-6 flex items-center gap-4 border border-slate-100 overflow-hidden relative">
              <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center text-emerald-600 shadow-sm font-black text-xl border border-slate-100">
                 {userInfo.name.charAt(0)}
              </div>
              <div className="flex-1 truncate">
                 <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Farmer Account</span>
                 </div>
                 <h4 className="text-sm font-black text-slate-900 truncate uppercase tracking-tight">{userInfo.name}</h4>
              </div>
           </div>
           
           <button 
             onClick={handleLogout}
             className="w-full flex items-center justify-between px-6 py-4 bg-white border border-slate-200 rounded-2xl text-sm font-black text-rose-500 uppercase tracking-wider hover:bg-rose-50 hover:border-rose-200 transition-all active:scale-95 group"
           >
              Logout <LogOut size={16} />
           </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 relative h-full">
        
        {/* Simple Header Bar */}
        <header className="h-24 bg-white border-b border-slate-100 px-8 flex items-center justify-between z-40 sticky top-0">
           <div className="flex items-center gap-8">
              <div className="hidden xl:flex items-center gap-4 px-6 py-3 bg-slate-50 rounded-xl border border-slate-200 focus-within:border-emerald-500/30 transition-all w-[350px]">
                 <Search className="text-slate-300" size={18} />
                 <input type="text" placeholder="Search for anything..." className="bg-transparent outline-none text-sm font-bold text-slate-900 uppercase tracking-wider w-full placeholder:text-slate-300" />
              </div>
              <div className="flex items-center gap-4">
                 <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 border border-emerald-100">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                    <span className="text-sm font-black uppercase text-emerald-600">App is Active</span>
                 </div>
                 <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 border border-indigo-100">
                    <TrendingUp size={14} className="text-indigo-500" />
                    <span className="text-sm font-black uppercase text-indigo-600">Market Rates Up</span>
                 </div>
              </div>
           </div>

           <div className="flex items-center gap-6">
              <div className="flex gap-2">
                <button className="relative w-12 h-12 bg-white border border-slate-200 rounded-xl flex items-center justify-center text-slate-400 hover:text-emerald-600 transition-all">
                    <Bell size={20} />
                    <span className="absolute top-3 right-3 w-2 h-2 bg-rose-500 rounded-full border-2 border-white"></span>
                </button>
              </div>
              
              <div className="h-8 w-[1px] bg-slate-100 mx-1"></div>
              
              <button 
                onClick={handleVoiceInput}
                className={`relative px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-wider transition-all duration-500 overflow-hidden ${
                  isListening 
                    ? 'bg-rose-500 text-white' 
                    : 'bg-slate-900 text-white hover:bg-emerald-600'
                }`}
              >
                 <div className="flex items-center gap-3 relative z-10">
                    <Mic size={18} className={isListening ? 'animate-pulse' : ''} />
                    <span>{isListening ? 'Listening...' : 'Talk to AI'}</span>
                 </div>
              </button>
           </div>
        </header>

        {/* Dashboard Pages */}
        <div className="flex-1 overflow-y-auto bg-slate-50">
           <div className="p-8 lg:p-12 xl:p-16">
              <Routes>
                <Route path="/" element={<DashboardOverview />} />
                <Route path="/health" element={<HealthIntelligence />} />
                <Route path="/profit" element={<ProfitAnalyzer />} />
                <Route path="/inventory" element={<Inventory />} />
                <Route path="/predict" element={<EggPrediction />} />
                <Route path="/smart" element={<SmartFeatures />} />
                <Route path="/community" element={<Community />} />
                <Route path="/manage" element={<FarmManagement />} />
                <Route path="/listings" element={<Marketplace />} />
                <Route path="/orders" element={<FarmerOrders />} />
                <Route path="/store" element={<FarmStore />} />
                <Route path="/supplies" element={<SupplyTracking />} />
                <Route path="/ai" element={<AIAssistant isStatic={true} />} />
              </Routes>
           </div>
        </div>
      </main>

      {/* Voice Assistant Popup */}
      {isListening && (
        <div className="fixed bottom-24 right-12 bg-white rounded-[2rem] border-2 border-rose-100 text-rose-600 font-bold px-10 py-6 shadow-2xl z-[70] flex items-center gap-8 animate-bounce">
           <div className="flex gap-1.5 items-end h-5">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="w-1 bg-rose-500 rounded-full animate-voice-bar" style={{ height: '100%', animationDelay: `${i * 0.1}s` }}></div>
              ))}
           </div>
           <div className="space-y-0.5">
              <p className="text-sm uppercase tracking-wider font-black">Kisan Mitra Listening</p>
              <p className="text-xs font-bold text-rose-300 uppercase tracking-wider">Processing your voice...</p>
           </div>
        </div>
      )}

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes voice-bar {
          0%, 100% { height: 20%; opacity: 0.5; }
          50% { height: 100%; opacity: 1; }
        }
        .animate-voice-bar {
          animation: voice-bar infinite ease-in-out;
        }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}} />
    </div>
  );
}
