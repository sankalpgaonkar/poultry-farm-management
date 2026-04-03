import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import FarmerDashboard from './pages/FarmerDashboard';
import BuyerDashboard from './pages/BuyerDashboard';
import AIAssistant from './components/AIAssistant';

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col relative">
        <Navbar />
        <main className="flex-grow p-4 md:p-8">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/farmer/*" element={<FarmerDashboard />} />
            <Route path="/buyer/*" element={<BuyerDashboard />} />
          </Routes>
        </main>
        <AIAssistant />
      </div>
    </Router>
  );
}

export default App;
