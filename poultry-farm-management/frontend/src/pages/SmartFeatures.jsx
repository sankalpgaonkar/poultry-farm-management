import { useState, useEffect } from 'react';
import api from '../utils/axios';
import { Target, MapPin, Landmark, FileText, CheckCircle } from 'lucide-react';

export default function SmartFeatures() {
  const [schemes, setSchemes] = useState([]);
  const [buyers, setBuyers] = useState([]);
  const [report, setReport] = useState(null);

  useEffect(() => {
    const fetchSmartData = async () => {
      try {
        const [schRes, buyRes, repRes] = await Promise.all([
          api.get('/smart/schemes'),
          api.get('/smart/buyer-matches'),
          api.get('/smart/daily-report')
        ]);
        
        setSchemes(schRes.data);
        setBuyers(buyRes.data);
        setReport(repRes.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchSmartData();
  }, []);

  return (
    <div className="space-y-8">
      
      {/* Daily AI Report */}
      <section>
        <h2 className="text-2xl font-bold flex items-center gap-2 mb-5 text-gray-800">
          <FileText className="text-blue-500" /> AI Daily Farm Report
        </h2>
        {report ? (
          <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
            <div className="relative z-10 grid md:grid-cols-3 gap-6">
              <div className="md:col-span-2">
                <p className="text-sm font-semibold opacity-80 uppercase tracking-widest mb-1">{report.date}</p>
                <p className="text-lg leading-relaxed mb-4">{report.summary}</p>
                <div className="bg-white/10 rounded-xl p-4">
                  <h4 className="font-bold text-sm mb-2 opacity-90">Recommended Actions Today</h4>
                  <ul className="space-y-1 text-sm list-disc pl-4">
                    {report.actionItems.map((ai, i) => <li key={i}>{ai}</li>)}
                  </ul>
                </div>
              </div>
              <div className="flex flex-col items-center justify-center border-l border-white/20 pl-6">
                <div className="text-6xl font-black">{report.efficiencyScore}</div>
                <div className="text-sm font-bold opacity-80 mt-1 uppercase text-center">Efficiency<br/>Score</div>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white p-6 rounded-xl shadow-sm border animate-pulse h-32"></div>
        )}
      </section>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Logistics & Buyer Matching */}
        <section>
          <h2 className="text-2xl font-bold flex items-center gap-2 mb-5 text-gray-800">
            <Target className="text-orange-500" /> Buyer & Logistics Match
          </h2>
          <div className="bg-white rounded-xl shadow-sm border p-5 space-y-4">
            <p className="text-sm text-gray-500 mb-2">Based on your active listings, here are the most optimal local buyers and route estimates.</p>
            {buyers.map(b => (
              <div key={b.id} className="border border-gray-100 rounded-lg p-4 bg-orange-50/30 hover:bg-orange-50 transition-colors">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-gray-900">{b.name}</h3>
                    <p className="text-xs text-gray-500 flex items-center gap-1 mt-1"><MapPin size={12}/> {b.distanceMiles} miles away</p>
                  </div>
                  <div className="text-right">
                    <span className="bg-green-100 text-green-800 font-bold px-2 py-1 rounded text-xs">{b.matchScore}% Match</span>
                  </div>
                </div>
                <div className="mt-3 flex justify-between text-sm font-semibold text-gray-700 bg-white p-2 rounded border">
                  <span>Needs: {b.neededQuantity} units</span>
                  <span>Offers: ₹{b.offeredPrice.toFixed(2)}/unit</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Government Schemes */}
        <section>
          <h2 className="text-2xl font-bold flex items-center gap-2 mb-5 text-gray-800">
            <Landmark className="text-emerald-500" /> Government Schemes
          </h2>
          <div className="bg-white rounded-xl shadow-sm border p-5 space-y-4">
            <p className="text-sm text-gray-500 mb-2">Available poultry subsidies and grants in your region.</p>
            {schemes.map(s => (
              <div key={s.id} className="border-b last:border-0 pb-4 last:pb-0">
                <h3 className="font-bold text-gray-900 flex justify-between">
                  {s.title}
                  <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded font-medium h-fit">{s.region}</span>
                </h3>
                <p className="text-sm text-gray-600 mt-1 mb-2">{s.description}</p>
                <div className="flex flex-wrap gap-2">
                  {s.benefits.map((ben, i) => (
                    <span key={i} className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded flex items-center gap-1">
                      <CheckCircle size={10} /> {ben}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
