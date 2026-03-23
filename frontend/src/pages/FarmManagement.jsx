import { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, CheckCircle2 } from 'lucide-react';

export default function FarmManagement() {
  const [farms, setFarms] = useState([]);
  const [showFarmModal, setShowFarmModal] = useState(false);
  const [showLogModal, setShowLogModal] = useState(false);
  const [selectedFarm, setSelectedFarm] = useState(null);

  // Form states
  const [farmName, setFarmName] = useState('');
  const [location, setLocation] = useState('');
  const [chickens, setChickens] = useState('');

  const [eggs, setEggs] = useState('');
  const [temperature, setTemperature] = useState('');
  const [feed, setFeed] = useState('');

  const fetchFarms = async () => {
    try {
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
      const { data } = await axios.get('http://localhost:5000/api/farms', config);
      setFarms(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchFarms();
  }, []);

  const handleCreateFarm = async (e) => {
    e.preventDefault();
    try {
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
      await axios.post('http://localhost:5000/api/farms', { name: farmName, location, totalChickens: Number(chickens) }, config);
      setShowFarmModal(false);
      setFarmName(''); setLocation(''); setChickens('');
      fetchFarms();
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddLog = async (e) => {
    e.preventDefault();
    try {
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
      await axios.post('http://localhost:5000/api/logs', {
        farmId: selectedFarm,
        totalEggs: Number(eggs),
        temperature: Number(temperature),
        feedConsumed: Number(feed)
      }, config);
      setShowLogModal(false);
      setEggs(''); setTemperature(''); setFeed('');
      alert('Daily log added successfully!');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">My Farms</h1>
        <button 
          onClick={() => setShowFarmModal(true)}
          className="flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
        >
          <Plus size={18} /> Add Farm
        </button>
      </div>

      {farms.length === 0 ? (
        <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-xl">
          <p className="text-gray-500 mb-4">You have not added any farms yet.</p>
          <button onClick={() => setShowFarmModal(true)} className="text-brand-600 font-medium hover:underline">Add your first farm</button>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {farms.map((farm) => (
            <div key={farm._id} className="border border-gray-100 bg-white p-5 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">{farm.name}</h3>
                  <p className="text-sm text-gray-500">{farm.location}</p>
                </div>
                <span className="bg-green-100 text-green-700 text-xs px-2 py-1 flex items-center gap-1 rounded-md font-medium">
                  <CheckCircle2 size={14} /> Active
                </span>
              </div>
              <div className="space-y-2 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Total Chickens</span>
                  <span className="font-semibold text-gray-800">{farm.totalChickens}</span>
                </div>
              </div>
              <button
                onClick={() => { setSelectedFarm(farm._id); setShowLogModal(true); }}
                className="w-full bg-brand-50 hover:bg-brand-100 text-brand-700 font-medium py-2 rounded-lg text-sm transition-colors border border-brand-200"
              >
                Log Daily Data
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Add Farm Modal */}
      {showFarmModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-xl">
            <h2 className="text-xl font-bold mb-4 text-gray-900">Add New Farm</h2>
            <form onSubmit={handleCreateFarm} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Farm Name</label>
                <input required type="text" className="w-full border px-3 py-2 rounded-lg" value={farmName} onChange={e => setFarmName(e.target.value)} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                <input required type="text" className="w-full border px-3 py-2 rounded-lg" value={location} onChange={e => setLocation(e.target.value)} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Number of Chickens</label>
                <input required type="number" className="w-full border px-3 py-2 rounded-lg" value={chickens} onChange={e => setChickens(e.target.value)} />
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button type="button" onClick={() => setShowFarmModal(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700">Save Farm</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Log Modal */}
      {showLogModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-xl">
            <h2 className="text-xl font-bold mb-4 text-gray-900">Daily Log Entry</h2>
            <form onSubmit={handleAddLog} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Total Eggs Collected</label>
                <input required type="number" className="w-full border px-3 py-2 rounded-lg" value={eggs} onChange={e => setEggs(e.target.value)} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Avg Temperature (°C)</label>
                <input required type="number" step="0.1" className="w-full border px-3 py-2 rounded-lg" value={temperature} onChange={e => setTemperature(e.target.value)} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Feed Consumed (kg)</label>
                <input required type="number" className="w-full border px-3 py-2 rounded-lg" value={feed} onChange={e => setFeed(e.target.value)} />
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button type="button" onClick={() => setShowLogModal(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700">Submit Log</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
