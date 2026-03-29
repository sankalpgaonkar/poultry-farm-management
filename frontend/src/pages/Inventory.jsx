import { useState, useEffect } from 'react';
import api from '../utils/axios';
import { Package, Plus, AlertCircle, Trash2 } from 'lucide-react';

export default function Inventory() {
  const [items, setItems] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ itemName: '', category: 'Feed', quantity: '', unit: 'kg', lowStockThreshold: '', dailyConsumptionRate: '' });

  const fetchInventory = async () => {
    try {
      const res = await api.get('/inventory');
      setItems(res.data.items);
      setAlerts(res.data.alerts);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        quantity: Number(formData.quantity) || 0,
        lowStockThreshold: Number(formData.lowStockThreshold) || 10,
        dailyConsumptionRate: Number(formData.dailyConsumptionRate) || 0
      };

      await api.post('/inventory', payload);
      setShowModal(false);
      setFormData({ itemName: '', category: 'Feed', quantity: '', unit: 'kg', lowStockThreshold: '', dailyConsumptionRate: '' });
      fetchInventory();
    } catch (err) {
      console.error(err);
    }
  };

  const deleteItem = async (id) => {
    if(!window.confirm('Delete this item?')) return;
    try {
      await api.delete(`/inventory/${id}`);
      fetchInventory();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center border-b pb-4">
        <div className="flex items-center gap-3">
          <div className="bg-indigo-50 p-3 rounded-xl text-indigo-600">
            <Package size={28} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Inventory Management</h1>
            <p className="text-sm text-gray-500">Track feed, medicine, and predict depletion.</p>
          </div>
        </div>
        <button onClick={() => setShowModal(true)} className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 font-bold rounded-lg flex items-center gap-2 transition-colors">
          <Plus size={18} /> Add Stock
        </button>
      </div>

      {alerts.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <h3 className="font-bold text-red-800 text-sm mb-2 flex items-center gap-2">
            <AlertCircle size={16}/> Low Stock Alerts
          </h3>
          <ul className="text-sm text-red-700 list-disc pl-5 space-y-1">
            {alerts.map((a, i) => <li key={i}>{a}</li>)}
          </ul>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 text-gray-600">
            <tr>
              <th className="px-6 py-4 font-bold">Item Name</th>
              <th className="px-6 py-4 font-bold">Category</th>
              <th className="px-6 py-4 font-bold">Current Stock</th>
              <th className="px-6 py-4 font-bold">Est. Days Left</th>
              <th className="px-6 py-4 font-bold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {items.map(item => {
              const daysLeft = item.dailyConsumptionRate > 0 ? Math.floor(item.quantity / item.dailyConsumptionRate) : 'N/A';
              const isLow = item.quantity <= item.lowStockThreshold;
              return (
                <tr key={item._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium">{item.itemName}</td>
                  <td className="px-6 py-4"><span className="bg-gray-100 px-2 py-1 rounded text-xs">{item.category}</span></td>
                  <td className={`px-6 py-4 font-bold flex items-center gap-2 ${isLow ? 'text-red-600' : 'text-gray-900'}`}>
                    {item.quantity} {item.unit}
                    {isLow && <AlertCircle size={14} />}
                  </td>
                  <td className="px-6 py-4 text-gray-500">{daysLeft}</td>
                  <td className="px-6 py-4 text-right">
                    <button onClick={() => deleteItem(item._id)} className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors"><Trash2 size={16}/></button>
                  </td>
                </tr>
              )
            })}
            {items.length === 0 && (
              <tr><td colSpan="5" className="text-center py-8 text-gray-500">Your inventory is empty. Add items to start tracking.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
            <h2 className="text-xl font-bold mb-4">Add Inventory Item</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Item Name</label>
                <input required type="text" value={formData.itemName} onChange={e=>setFormData({...formData, itemName: e.target.value})} className="w-full border p-2 rounded outline-none focus:ring-2 focus:ring-indigo-500" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Category</label>
                  <select value={formData.category} onChange={e=>setFormData({...formData, category: e.target.value})} className="w-full border p-2 rounded outline-none focus:ring-2 focus:ring-indigo-500">
                    <option value="Feed">Feed</option>
                    <option value="Medicine">Medicine</option>
                    <option value="Equipment">Equipment</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Unit (kg, L, etc)</label>
                  <input required type="text" value={formData.unit} onChange={e=>setFormData({...formData, unit: e.target.value})} className="w-full border p-2 rounded outline-none focus:ring-2 focus:ring-indigo-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Quantity</label>
                  <input required type="number" value={formData.quantity} onChange={e=>setFormData({...formData, quantity: e.target.value})} className="w-full border p-2 rounded outline-none focus:ring-2 focus:ring-indigo-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Low Stock Thresh.</label>
                  <input required type="number" value={formData.lowStockThreshold} onChange={e=>setFormData({...formData, lowStockThreshold: e.target.value})} className="w-full border p-2 rounded outline-none focus:ring-2 focus:ring-indigo-500" />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium mb-1">Daily Consumption Rate</label>
                  <input type="number" step="0.1" value={formData.dailyConsumptionRate} onChange={e=>setFormData({...formData, dailyConsumptionRate: e.target.value})} className="w-full border p-2 rounded outline-none focus:ring-2 focus:ring-indigo-500" />
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-bold hover:bg-indigo-700">Save Item</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
