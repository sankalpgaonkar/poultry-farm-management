import { useState } from 'react';
import api from '../utils/axios';
import { Stethoscope, AlertTriangle, ShieldCheck, Bug } from 'lucide-react';

export default function HealthIntelligence() {
  const [symptomsInput, setSymptomsInput] = useState('');
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);

  const predefinedSymptoms = [
    'sneezing', 'coughing', 'drop in eggs', 'bloody diarrhea', 'lethargy', 'pale comb',
    'gasping', 'twisted neck', 'weight loss', 'panting', 'watery eyes', 'increased thirst'
  ];

  const handleAnalyze = async () => {
    if (!symptomsInput) return;
    setLoading(true);
    try {
      // split comma-separated symptoms
      const symptomsArray = symptomsInput.split(',').map(s => s.trim()).filter(Boolean);
      
      const res = await api.post('/health/analyze', { symptoms: symptomsArray });
      setResults(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const addSymptom = (s) => {
    setSymptomsInput(prev => prev ? prev + ', ' + s : s);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 border-b pb-4">
        <div className="bg-red-50 p-3 rounded-xl text-red-600">
          <Stethoscope size={28} />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Health Intelligence & Diagnostics</h1>
          <p className="text-sm text-gray-500">Early disease detection and treatment recommendations.</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        
        {/* Input Form */}
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h2 className="font-bold text-lg mb-4 text-gray-800">Symptom Checker</h2>
          
          <label className="block text-sm font-semibold text-gray-700 mb-2">Describe symptoms (comma separated)</label>
          <textarea 
            rows="3"
            value={symptomsInput}
            onChange={(e) => setSymptomsInput(e.target.value)}
            placeholder="e.g., sneezing, lethargy, pale comb..."
            className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-red-500 outline-none resize-none"
          />

          <div className="mt-4">
            <p className="text-xs font-semibold text-gray-500 mb-2">Common Symptoms (Click to add):</p>
            <div className="flex flex-wrap gap-2">
              {predefinedSymptoms.map(s => (
                <button 
                  key={s} 
                  onClick={() => addSymptom(s)}
                  className="bg-gray-100 hover:bg-red-50 hover:text-red-700 text-gray-600 px-3 py-1.5 rounded-full text-sm font-medium transition-colors"
                >
                  + {s}
                </button>
              ))}
            </div>
          </div>

          <button 
            onClick={handleAnalyze} 
            disabled={loading || !symptomsInput}
            className="w-full mt-6 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-bold py-3 rounded-xl transition-colors flex justify-center items-center gap-2"
          >
            {loading ? 'Evaluating...' : <><Bug size={18}/> Analyze Health Risk</>}
          </button>
        </div>

        {/* Results output */}
        <div className="space-y-4">
          {results ? (
            results.length > 0 ? (
              results.map((r, i) => (
                <div key={i} className={`rounded-xl border p-5 ${i===0 ? 'bg-red-50 border-red-200' : 'bg-white'}`}>
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-lg text-gray-900 flex items-center gap-2">
                      {r.riskLevel === 'Critical' ? <AlertTriangle className="text-red-600" size={20}/> : <ShieldCheck className="text-yellow-600" size={20}/>}
                      {r.disease}
                    </h3>
                    <span className="bg-white px-3 py-1 rounded-full border text-xs font-bold text-gray-700">Match: {r.confidence}%</span>
                  </div>
                  <div className="mb-2">
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-md ${r.riskLevel==='Critical' ? 'bg-red-600 text-white' : r.riskLevel==='High' ? 'bg-orange-500 text-white' : 'bg-yellow-400 text-gray-900'}`}>{r.riskLevel} Risk</span>
                  </div>
                  <p className="text-sm text-gray-700 mt-3 font-medium text-gray-800">Action Plan:</p>
                  <p className="text-sm text-gray-600">{r.action}</p>
                </div>
              ))
            ) : (
              <div className="bg-gray-50 p-6 flex items-center justify-center text-gray-500 rounded-xl border">No identifiable diseases matched these symptoms. Provide more detail or consult a vet.</div>
            )
          ) : (
             <div className="h-full bg-gray-50 border border-dashed rounded-xl flex items-center justify-center text-gray-400 p-8 text-center flex-col">
               <ShieldCheck size={48} className="text-gray-300 mb-3" />
               <p>Results will appear here based on symptoms provided.</p>
             </div>
          )}
        </div>
      </div>
    </div>
  );
}
