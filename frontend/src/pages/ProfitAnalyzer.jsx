import { useState } from 'react';
import axios from 'axios';
import { Calculator, DollarSign, TrendingDown, TrendingUp } from 'lucide-react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

export default function ProfitAnalyzer() {
  const [formData, setFormData] = useState({
    birdsCount: '',
    dailyFeedKg: '',
    feedCostPerKg: '',
    dailyEggProduction: '',
    eggSalePrice: '',
    laborCostDaily: '',
    utilitiesCostDaily: ''
  });

  const [result, setResult] = useState(null);
  
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const calculate = async (e) => {
    e.preventDefault();
    try {
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
      
      const payload = {
        birdsCount: Number(formData.birdsCount) || 0,
        dailyFeedKg: Number(formData.dailyFeedKg) || 0,
        feedCostPerKg: Number(formData.feedCostPerKg) || 0,
        dailyEggProduction: Number(formData.dailyEggProduction) || 0,
        eggSalePrice: Number(formData.eggSalePrice) || 0,
        laborCostDaily: Number(formData.laborCostDaily) || 0,
        utilitiesCostDaily: Number(formData.utilitiesCostDaily) || 0
      };

      const res = await axios.post('http://localhost:5000/api/finance/calculate', payload, config);
      setResult(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const COLORS = ['#ef4444', '#f59e0b', '#3b82f6'];
  const getPieData = () => {
    if (!result) return [];
    return [
      { name: 'Feed Cost', value: formData.dailyFeedKg * formData.feedCostPerKg },
      { name: 'Labor Cost', value: formData.laborCostDaily },
      { name: 'Utilities', value: formData.utilitiesCostDaily }
    ];
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 border-b pb-4">
        <div className="bg-green-50 p-3 rounded-xl text-green-600">
          <Calculator size={28} />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Profit & Cost Analyzer</h1>
          <p className="text-sm text-gray-500">Calculate exact ROI, break-even points, and view profit optimizations.</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        
        {/* Form */}
        <div className="bg-white p-6 shadow-sm border rounded-xl">
          <h2 className="font-bold text-lg mb-4 text-gray-800">Daily Variables</h2>
          <form onSubmit={calculate} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-gray-600">Total Birds</label>
                <input type="number" name="birdsCount" value={formData.birdsCount} onChange={handleChange} className="w-full border rounded p-2 focus:ring-green-500 outline-none" />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-600">Daily Egg Prod.</label>
                <input type="number" name="dailyEggProduction" value={formData.dailyEggProduction} onChange={handleChange} className="w-full border rounded p-2 focus:ring-green-500 outline-none" />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-600">Daily Feed (kg)</label>
                <input type="number" step="0.1" name="dailyFeedKg" value={formData.dailyFeedKg} onChange={handleChange} className="w-full border rounded p-2 focus:ring-green-500 outline-none" />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-600">Feed Cost (₹/kg)</label>
                <input type="number" step="0.01" name="feedCostPerKg" value={formData.feedCostPerKg} onChange={handleChange} className="w-full border rounded p-2 focus:ring-green-500 outline-none" />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-600">Egg Sale Price (₹/egg)</label>
                <input type="number" step="0.01" name="eggSalePrice" value={formData.eggSalePrice} onChange={handleChange} className="w-full border rounded p-2 focus:ring-green-500 outline-none" />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-600">Labor (₹/day)</label>
                <input type="number" step="0.1" name="laborCostDaily" value={formData.laborCostDaily} onChange={handleChange} className="w-full border rounded p-2 focus:ring-green-500 outline-none" />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-600">Utilities (₹/day)</label>
                <input type="number" step="0.1" name="utilitiesCostDaily" value={formData.utilitiesCostDaily} onChange={handleChange} className="w-full border rounded p-2 focus:ring-green-500 outline-none" />
              </div>
            </div>
            <button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-lg mt-4 transition-colors">Calculate Finances</button>
          </form>
        </div>

        {/* Output */}
        {result ? (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 border rounded-xl p-4">
                <p className="text-sm font-semibold text-gray-500">Daily Revenue</p>
                <p className="text-2xl font-bold text-gray-900">₹{result.breakdown.totalDailyRevenue}</p>
              </div>
              <div className="bg-gray-50 border rounded-xl p-4">
                <p className="text-sm font-semibold text-gray-500">Daily Expenses</p>
                <p className="text-2xl font-bold text-gray-900">₹{result.breakdown.totalDailyCost}</p>
              </div>
              <div className={`col-span-2 border rounded-xl p-5 text-white ${Number(result.breakdown.dailyProfit) >= 0 ? 'bg-green-600' : 'bg-red-600'}`}>
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm font-semibold opacity-90">Net Daily Profit</p>
                    <p className="text-4xl font-black">₹{result.breakdown.dailyProfit}</p>
                  </div>
                  {Number(result.breakdown.dailyProfit) >= 0 ? <TrendingUp size={48} className="opacity-50"/> : <TrendingDown size={48} className="opacity-50"/>}
                </div>
              </div>
            </div>

            <div className="bg-white border rounded-xl p-5 flex gap-4">
              <div className="flex-1">
                <h3 className="font-bold text-gray-800 text-sm mb-3">Cost Breakdown</h3>
                <div className="h-32">
                   <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={getPieData()} innerRadius={30} outerRadius={50} paddingAngle={5} dataKey="value">
                        {getPieData().map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
              <div className="flex-1 flex flex-col justify-center space-y-3">
                <div className="flex justify-between border-b pb-1">
                  <span className="text-xs text-gray-500">Cost per Egg</span>
                  <span className="font-bold text-sm">₹{result.breakdown.costPerEgg}</span>
                </div>
                <div className="flex justify-between border-b pb-1">
                  <span className="text-xs text-gray-500">Break-even (Eggs/day)</span>
                  <span className="font-bold text-sm">{result.breakdown.breakEvenEggs}</span>
                </div>
              </div>
            </div>

            {/* Suggestions */}
            {result.suggestions.length > 0 && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                <h3 className="font-bold text-yellow-800 text-sm mb-2 flex items-center gap-2">
                  <DollarSign size={16}/> Financial Diagnostics
                </h3>
                <ul className="text-sm text-yellow-700 list-disc pl-5 space-y-1">
                  {result.suggestions.map((s, i) => <li key={i}>{s}</li>)}
                </ul>
              </div>
            )}
          </div>
        ) : (
          <div className="h-full bg-gray-50 border border-dashed rounded-xl flex items-center justify-center text-gray-400 p-8 text-center flex-col">
            <DollarSign size={48} className="text-gray-300 mb-3" />
            <p>Run the calculation to view your profitability dashboard.</p>
          </div>
        )}

      </div>
    </div>
  );
}
