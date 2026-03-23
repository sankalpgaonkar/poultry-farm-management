import { useState, useEffect } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LabelList } from 'recharts';
import { BrainCircuit, AlertCircle, Lightbulb, TrendingUp } from 'lucide-react';

export default function EggPrediction() {
  const [formData, setFormData] = useState({
    chickens: '',
    age: '',
    feedQuality: 'Good',
    feedQty: '',
    temperature: '',
    humidity: '',
    lighting: '',
    breed: 'Leghorn'
  });

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  // Auto-run "What if" simulation when formData changes
  useEffect(() => {
    const runSimulation = async () => {
      if (formData.chickens <= 0 || formData.age <= 0) return;
      setLoading(true);
      try {
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
        
        const payload = {
          ...formData,
          chickens: Number(formData.chickens) || 0,
          age: Number(formData.age) || 0,
          feedQty: Number(formData.feedQty) || 0,
          temperature: Number(formData.temperature) || 0,
          humidity: Number(formData.humidity) || 0,
          lighting: Number(formData.lighting) || 0
        };
        const { data } = await axios.post('http://localhost:5000/api/ai/predict', payload, config);
        setResult(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    // Debounce the call to avoid spamming the backend while typing
    const timeoutId = setTimeout(runSimulation, 600);
    return () => clearTimeout(timeoutId);
  }, [formData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const chartData = (result && result.prediction) ? [
    { name: 'Predicted', Eggs: result.prediction.predictedEggs || 0, fill: '#3b82f6' },
    { name: 'Ideal Max', Eggs: result.idealProduction || 0, fill: '#10b981' }
  ] : [];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="bg-brand-100 p-2 rounded-lg text-brand-600">
          <BrainCircuit size={24} />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Advanced AI Egg Prediction</h1>
          <p className="text-sm text-gray-500">Simulate parameters to foresee production output instantly.</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        
        {/* Input Form Column */}
        <div className="bg-white rounded-xl shadow-sm border p-6 space-y-5">
          <h2 className="font-bold text-lg border-b pb-2">Simulation Parameters</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Number of Chickens</label>
              <input type="number" name="chickens" value={formData.chickens} onChange={handleChange} className="w-full border rounded p-2 text-sm bg-gray-50 focus:ring-2 focus:ring-brand-500 outline-none" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Avg Age (Weeks)</label>
              <input type="number" name="age" value={formData.age} onChange={handleChange} className="w-full border rounded p-2 text-sm bg-gray-50 focus:ring-2 focus:ring-brand-500 outline-none" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Daily Feed Qty (kg)</label>
              <input type="number" name="feedQty" value={formData.feedQty} onChange={handleChange} className="w-full border rounded p-2 text-sm bg-gray-50 focus:ring-2 focus:ring-brand-500 outline-none" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Feed Quality</label>
              <select name="feedQuality" value={formData.feedQuality} onChange={handleChange} className="w-full border rounded p-2 text-sm bg-gray-50 focus:ring-2 focus:ring-brand-500 outline-none">
                <option value="Poor">Poor</option>
                <option value="Average">Average</option>
                <option value="Good">Good</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Temperature (°C)</label>
              <input type="number" name="temperature" value={formData.temperature} onChange={handleChange} className="w-full border rounded p-2 text-sm bg-gray-50 focus:ring-2 focus:ring-brand-500 outline-none" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Humidity (%)</label>
              <input type="number" name="humidity" value={formData.humidity} onChange={handleChange} className="w-full border rounded p-2 text-sm bg-gray-50 focus:ring-2 focus:ring-brand-500 outline-none" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Lighting (Hours/Day)</label>
              <input type="number" name="lighting" value={formData.lighting} onChange={handleChange} className="w-full border rounded p-2 text-sm bg-gray-50 focus:ring-2 focus:ring-brand-500 outline-none" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Breed Type</label>
              <input type="text" name="breed" value={formData.breed} onChange={handleChange} className="w-full border rounded p-2 text-sm bg-gray-50 focus:ring-2 focus:ring-brand-500 outline-none" />
            </div>
          </div>
          {loading && <p className="text-xs text-brand-600 animate-pulse font-medium">Running simulation...</p>}
        </div>

        {/* Output & Visualization Column */}
        <div className="space-y-6">
          
          {/* Results Summary Box */}
          <div className="bg-brand-600 rounded-xl shadow-lg p-6 text-white flex justify-between items-center relative overflow-hidden">
            <div className="relative z-10">
              <p className="text-brand-100 text-sm font-semibold uppercase tracking-wider mb-1">Predicted Eggs / Day</p>
              <h2 className="text-5xl font-extrabold">{result?.prediction?.predictedEggs != null ? result.prediction.predictedEggs.toLocaleString() : '--'}</h2>
              <p className="text-brand-200 text-sm mt-2 flex items-center gap-1">
                <TrendingUp size={16}/> Efficiency: <span className="font-bold text-white">{result?.efficiency != null ? result.efficiency : 0}%</span>
              </p>
            </div>
            <div className="relative z-10 text-right">
              <p className="text-brand-200 text-sm font-medium">AI Confidence</p>
              <div className="text-3xl font-bold">{result?.prediction?.confidence != null ? result.prediction.confidence : '--'}%</div>
            </div>
            {/* Background pattern */}
            <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none transform translate-x-4 translate-y-4">
               <BrainCircuit size={160} />
            </div>
          </div>

          {/* Graph Comparison */}
          {(result && result.prediction) && (
            <div className="bg-white rounded-xl shadow-sm border p-6 h-64">
              <h3 className="text-sm font-bold text-gray-700 mb-4 text-center">Predicted vs Ideal Production</h3>
              <ResponsiveContainer width="100%" height="80%">
                <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" tickLine={false} axisLine={false} />
                  <YAxis hide />
                  <Tooltip cursor={{fill: 'transparent'}} contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                  <Bar dataKey="Eggs" radius={[6, 6, 0, 0]} maxBarSize={60}>
                    <LabelList dataKey="Eggs" position="top" fill="#4b5563" fontWeight="bold" />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* Smart Insights & Alerts */}
          {(result?.insights && result.insights.length > 0) && (
            <div className="bg-white rounded-xl shadow-sm border p-6 space-y-3">
              <h3 className="font-bold text-gray-800 border-b pb-2 flex gap-2 items-center">
                <Lightbulb size={18} className="text-yellow-500"/> Smart Insights
              </h3>
              <ul className="space-y-2">
                {result.insights.map((insight, idx) => {
                  const isNegative = insight.includes('reducing') || insight.includes('too young') || insight.includes('low');
                  return (
                    <li key={idx} className={`text-sm p-3 rounded-lg border flex gap-3 items-start ${isNegative ? 'bg-red-50 border-red-100 text-red-800' : 'bg-yellow-50 border-yellow-100 text-yellow-800'}`}>
                      {isNegative ? <AlertCircle size={16} className="mt-0.5 shrink-0" /> : <Lightbulb size={16} className="mt-0.5 shrink-0" />}
                      <span>{insight}</span>
                    </li>
                  )
                })}
              </ul>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
