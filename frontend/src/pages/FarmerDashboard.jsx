import { Routes, Route, Link, useLocation } from 'react-router-dom';
import DashboardOverview from './DashboardOverview';
import FarmManagement from './FarmManagement';
import FarmerMarketplace from './FarmerMarketplace';
import AIAssistant from './AIAssistant';
import EggPrediction from './EggPrediction';
import HealthIntelligence from './HealthIntelligence';
import ProfitAnalyzer from './ProfitAnalyzer';
import Inventory from './Inventory';
import Community from './Community';
import SmartFeatures from './SmartFeatures';
import FarmStore from './FarmStore';
import { LayoutDashboard, Settings, ShoppingBag, MessageSquare, LineChart, Stethoscope, Calculator, Package, Users, Globe, Mic, Store, Bot } from 'lucide-react';
import { useState } from 'react';

export default function FarmerDashboard() {
  const location = useLocation();
  const [isListening, setIsListening] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);

  const navItems = [
    { label: 'Overview', path: '/farmer', icon: LayoutDashboard },
    { label: 'Health DB', path: '/farmer/health', icon: Stethoscope },
    { label: 'Finances', path: '/farmer/profit', icon: Calculator },
    { label: 'Inventory', path: '/farmer/inventory', icon: Package },
    { label: 'Egg Predictor', path: '/farmer/predict', icon: LineChart },
    { label: 'Smart Logistics', path: '/farmer/smart', icon: Globe },
    { label: 'Community', path: '/farmer/community', icon: Users },
    { label: 'Farm Manager', path: '/farmer/manage', icon: Settings },
    { label: 'Marketplace', path: '/farmer/listings', icon: ShoppingBag },
    { label: 'Farm Store', path: '/farmer/store', icon: Store },
    { label: 'AI Assistant', path: '/farmer/ai', icon: MessageSquare },
  ];

  const handleVoiceInput = () => {
    setIsListening(true);
    setTimeout(() => {
      setIsListening(false);
      alert('Voice Input simulation: Auto-filled the currently visible form based on your speech command.');
    }, 3000);
  };

  return (
    <div className="flex flex-col md:flex-row h-full gap-6">
      
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-white rounded-xl shadow-sm p-4 md:h-[calc(100vh-8rem)] md:sticky top-24 overflow-y-auto">
        <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 px-3">Farmer Menu</h2>
        <nav className="space-y-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path || (item.path !== '/farmer' && location.pathname.startsWith(item.path));
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-3 py-3 rounded-lg font-medium text-base transition-colors ${
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
      
      {/* Main Execution Area */}
      <main className="flex-1 bg-white rounded-xl shadow-sm p-5 md:p-8 md:overflow-y-auto md:min-h-[calc(100vh-8rem)] relative">
        <Routes>
          <Route path="/" element={<DashboardOverview />} />
          <Route path="/health" element={<HealthIntelligence />} />
          <Route path="/profit" element={<ProfitAnalyzer />} />
          <Route path="/inventory" element={<Inventory />} />
          <Route path="/predict" element={<EggPrediction />} />
          <Route path="/smart" element={<SmartFeatures />} />
          <Route path="/community" element={<Community />} />
          <Route path="/manage" element={<FarmManagement />} />
          <Route path="/listings" element={<FarmerMarketplace />} />
          <Route path="/store" element={<FarmStore />} />
          <Route path="/ai" element={<AIAssistant />} />
        </Routes>
      </main>

      {/* Floating AI Assistant Modal */}
      {isChatOpen && (
        <div className="fixed bottom-24 right-5 w-80 md:w-96 z-50 animate-fade-in-up">
           <AIAssistant isFloating={true} />
        </div>
      )}

      {/* Floating Action Buttons */}
      <div className="fixed bottom-6 right-6 flex flex-col gap-3 z-50">
        
        {/* Toggle AI Chat */}
        <button 
          onClick={() => setIsChatOpen(!isChatOpen)}
          className={`p-4 rounded-full shadow-xl flex items-center justify-center transition-all duration-300 ${isChatOpen ? 'bg-gray-800 scale-95' : 'bg-brand-600 hover:bg-brand-700 hover:scale-105 hover:shadow-2xl'} text-white group`}
          title="Open AI Assistant"
        >
          <Bot size={24} className={isChatOpen ? '' : 'animate-bounce'} />
        </button>

        {/* Toggle Voice Input */}
        <button 
          onClick={handleVoiceInput}
          className={`p-4 rounded-full shadow-xl flex items-center justify-center transition-all duration-300 ${isListening ? 'bg-red-500 animate-pulse scale-110' : 'bg-blue-600 hover:bg-blue-700 hover:scale-105 hover:shadow-2xl'} text-white`}
          title="Activate Voice Input"
        >
          <Mic size={24} />
        </button>
      </div>

      {/* Listening Overlay Notification */}
      {isListening && (
        <div className="fixed bottom-6 right-24 bg-white border border-red-200 text-red-600 font-bold px-4 py-3 rounded-xl shadow-lg animate-pulse z-50 text-sm flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-red-600 animate-ping"></span> Listening to your command...
        </div>
      )}

    </div>
  );
}
