import { useState, useEffect } from 'react';
import axios from 'axios';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { AlertCircle, ThermometerSun, Leaf, Activity } from 'lucide-react';

export default function DashboardOverview() {
  const [logs, setLogs] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [farms, setFarms] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
        
        const resAlerts = await axios.get('http://localhost:5000/api/ai/alerts', config);
        setAlerts(resAlerts.data);
        
        const resFarms = await axios.get('http://localhost:5000/api/farms', config);
        setFarms(resFarms.data);

        const resLogs = await axios.get('http://localhost:5000/api/logs', config);
        setLogs(resLogs.data.reverse()); // Keep chronological for charts
      } catch (err) {
        console.error('Failed to fetch dashboard data', err);
      }
    };
    fetchData();
  }, []);

  const totalChickens = farms.reduce((acc, f) => acc + f.totalChickens, 0);
  const todaysEggs = logs.length > 0 ? logs[logs.length - 1].totalEggs : 0;

  const chartData = logs.slice(-14).map(log => ({
    date: new Date(log.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
    eggs: log.totalEggs,
    temp: log.temperature
  }));

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
      
      {/* Top Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Chickens', value: totalChickens, icon: Activity },
          { label: 'Today\'s Eggs', value: todaysEggs, icon: Leaf },
          { label: 'Active Farms', value: farms.length, icon: ThermometerSun },
          { label: 'Pending Alerts', value: alerts.length, icon: AlertCircle, color: 'text-orange-600' },
        ].map((stat, i) => (
          <div key={i} className="p-4 border rounded-xl bg-gray-50 flex items-center gap-4">
            <div className={`p-3 bg-white rounded-lg shadow-sm ${stat.color || 'text-brand-600'}`}>
              <stat.icon size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">{stat.label}</p>
              <h3 className="text-2xl font-bold text-gray-900">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Chart */}
        <div className="lg:col-span-2 border rounded-xl p-5 shadow-sm">
          <h2 className="text-lg font-bold text-gray-800 mb-4">Egg Production Trends (Last 14 Days)</h2>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorEggs" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6B7280' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6B7280' }} />
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  cursor={{ stroke: '#94a3b8', strokeWidth: 1, strokeDasharray: '4 4' }}
                />
                <Area type="monotone" dataKey="eggs" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorEggs)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Smart Alerts */}
        <div className="border rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-800">Smart Alerts</h2>
            <span className="bg-orange-100 text-orange-700 text-xs font-bold px-2 py-1 rounded-full">{alerts.length} New</span>
          </div>
          <div className="space-y-3">
            {alerts.length === 0 ? (
              <p className="text-gray-500 text-sm">No new alerts at this time.</p>
            ) : (
              alerts.map((alert, i) => (
                <div key={i} className="flex gap-3 p-3 bg-orange-50 rounded-lg border border-orange-100">
                  <AlertCircle className="text-orange-500 shrink-0 mt-0.5" size={18} />
                  <div>
                    <h4 className="text-sm font-semibold text-orange-800">{alert.type} Alert</h4>
                    <p className="text-xs text-orange-700 mt-1 leading-snug">{alert.message}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
