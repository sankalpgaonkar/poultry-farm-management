import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../utils/axios';
import { 
  ArrowRight, 
  Lock, 
  Mail, 
  Phone, 
  Egg, 
  CheckCircle2, 
  ShieldCheck, 
  Activity, 
  Zap, 
  Globe,
  Cpu,
  Layers,
  Fingerprint
} from 'lucide-react';

export default function Login() {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const { data } = await api.post('/auth/login', { identifier, password });
      localStorage.setItem('userInfo', JSON.stringify(data));
      if (data.role === 'Farmer') {
        navigate('/farmer');
      } else {
        navigate('/buyer');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Identity verification failed. Invalid credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-slate-50 overflow-hidden relative">
      
      {/* Friendly Background Elements */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,#d1fae5_0%,transparent_50%)] opacity-40"></div>
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-emerald-500/10 blur-[120px] rounded-full translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-emerald-600/10 blur-[100px] rounded-full -translate-x-1/2 translate-y-1/2"></div>
      
      {/* Left Column: Simple Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative p-20 flex-col justify-between border-r border-slate-200 z-10">
        <div className="space-y-6">
           <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-emerald-600 shadow-xl border border-slate-100">
                 <Egg size={28} className="fill-emerald-600" />
              </div>
              <div className="space-y-0.5">
                 <span className="text-2xl font-black text-slate-900 italic tracking-tight leading-none block">POULTRY<span className="text-emerald-600 not-italic">SMART</span></span>
                 <span className="text-sm font-bold text-slate-400 uppercase tracking-wider">Farmer Friendly App</span>
              </div>
           </div>
        </div>

        <div className="space-y-12">
           <div className="space-y-6">
              <div className="inline-flex items-center gap-3 px-4 py-1.5 bg-emerald-500/10 rounded-full border border-emerald-500/20 text-sm font-black uppercase tracking-[0.2em] text-emerald-600">
                 <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
                 Welcome to PoultrySmart
              </div>
              <h1 className="text-8xl font-black text-slate-900 leading-[0.85] tracking-tight uppercase">
                 Farmer <br />
                 <span className="text-emerald-600">Login.</span>
              </h1>
              <p className="text-slate-500 font-bold text-sm leading-relaxed max-w-sm">
                 Login to manage your farm, check egg counts, and sell your poultry easily.
              </p>
           </div>

           <div className="grid grid-cols-2 gap-8 border-t border-slate-200 pt-12">
              <div className="space-y-3">
                 <div className="text-emerald-600"><Globe size={24} /></div>
                 <h4 className="text-slate-900 font-black text-xs uppercase tracking-wider">Market Prices</h4>
                 <p className="text-slate-500 text-sm font-bold uppercase tracking-wider leading-relaxed">Check latest egg and bird rates in your area.</p>
              </div>
              <div className="space-y-3">
                 <div className="text-emerald-600"><ShieldCheck size={24} /></div>
                 <h4 className="text-slate-900 font-black text-xs uppercase tracking-wider">Safe & Secure</h4>
                 <p className="text-slate-500 text-sm font-bold uppercase tracking-wider leading-relaxed">Your farm data is safe with us.</p>
              </div>
           </div>
        </div>

        <div className="flex items-center gap-6">
           <span className="text-sm font-black text-slate-400 uppercase tracking-wider italic">Made for Indian Farmers</span>
        </div>
      </div>

      {/* Right Column: Interaction Interface */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 md:p-16 z-10">
        <div className="w-full max-w-md space-y-16">
          <div className="space-y-6 text-center lg:text-left">
             <div className="lg:hidden flex justify-center mb-10">
                <div className="w-16 h-16 bg-white rounded-3xl flex items-center justify-center text-emerald-600 shadow-xl">
                   <Egg size={40} className="fill-emerald-600" />
                </div>
             </div>
             <h2 className="text-5xl font-black text-slate-900 tracking-tight uppercase leading-[0.9]">Welcome <br /><span className="text-emerald-600">Back.</span></h2>
             <p className="text-slate-400 font-bold text-xs uppercase tracking-wider">Please enter your details to login</p>
          </div>

          {error && (
            <div className="bg-rose-50 border border-rose-200 text-rose-600 p-6 rounded-3xl text-xs font-bold flex items-center gap-4 animate-in slide-in-from-top-4">
               <div className="w-8 h-8 bg-rose-100 rounded-xl flex items-center justify-center font-black">!</div> 
               {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-10">
            <div className="space-y-6">
              <div className="space-y-3">
                <label className="block text-xs font-black text-slate-500 uppercase tracking-wider px-4">Mobile Number / Email</label>
                <div className="relative group">
                  <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-emerald-600 transition-colors">
                    <Mail size={22} />
                  </div>
                  <input
                    type="text"
                    className="w-full bg-white border border-slate-200 px-16 py-6 rounded-[2rem] outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500/30 transition-all font-bold text-slate-900 placeholder:text-slate-300"
                    placeholder="Enter Mobile or Email"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-3">
                <label className="block text-xs font-black text-slate-500 uppercase tracking-wider px-4">Password</label>
                <div className="relative group">
                  <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-emerald-600 transition-colors">
                    <Lock size={22} />
                  </div>
                  <input
                    type="password"
                    className="w-full bg-white border border-slate-200 px-16 py-6 rounded-[2rem] outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500/30 transition-all font-bold text-slate-900 placeholder:text-slate-300"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-between items-center px-4">
              <button type="button" className="text-sm font-black text-slate-400 hover:text-emerald-600 uppercase tracking-wider transition-colors">Forgot Password?</button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full h-20 bg-emerald-600 hover:bg-emerald-500 text-white font-black rounded-[2rem] transition-all shadow-xl shadow-emerald-200 hover:-translate-y-1 active:scale-95 flex items-center justify-center gap-4 text-sm uppercase tracking-wider disabled:opacity-50"
            >
              {loading ? 'Logging in...' : 'Login'} 
              {!loading && <ArrowRight size={20} />}
            </button>
          </form>

          <div className="pt-8 border-t border-slate-100">
             <p className="text-center text-xs font-bold text-slate-500">
               New here? <br />
               <Link to="/signup" className="text-emerald-600 hover:text-emerald-500 font-black uppercase tracking-wider flex items-center justify-center gap-2 mt-2">
                 Create your account <ArrowRight size={14} />
               </Link>
             </p>
          </div>
        </div>
      </div>
      
      {/* Floating Logo Aesthetic */}
      <div className="absolute -bottom-20 -right-20 opacity-[0.03] pointer-events-none rotate-12 scale-[2]">
         <Layers size={400} />
      </div>
    </div>
  );
}
