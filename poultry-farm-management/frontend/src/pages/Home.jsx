import { Link } from 'react-router-dom';
import { 
  Activity, 
  ShieldCheck, 
  TrendingUp, 
  Cpu, 
  ArrowRight, 
  Globe, 
  Zap, 
  CheckCircle2, 
  Users
} from 'lucide-react';
import { POULTRY_IMAGES } from '../utils/imageConstants';

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Premium Hero Section */}
      <section className="relative h-[90vh] flex items-center overflow-hidden">
        {/* Background Layer */}
        <div className="absolute inset-0 z-0">
          <img 
            src={POULTRY_IMAGES.HERO.FARM_VIEW} 
            alt="Poultry Farm" 
            className="w-full h-full object-cover scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
        </div>

        {/* Content Layer */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 w-full">
          <div className="max-w-3xl space-y-8 animate-in fade-in slide-in-from-left-8 duration-1000">
            <div className="inline-flex items-center gap-3 px-5 py-3 bg-emerald-500/20 backdrop-blur-md rounded-full border border-emerald-400/30">
               <Zap size={18} className="text-emerald-400 fill-emerald-400" />
               <span className="text-sm font-black uppercase tracking-wider text-emerald-100">Modern Poultry Farming</span>
            </div>
            
            <h1 className="text-6xl md:text-8xl font-black text-white leading-tight tracking-tight">
              Smart <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-emerald-300">Poultry</span> App.
            </h1>
            
            <p className="text-lg md:text-xl text-gray-300 font-medium leading-relaxed max-w-xl">
              Use the power of AI to predict egg production, monitor your farm in real-time, and sell directly to buyers in the market.
            </p>

            <div className="flex flex-wrap gap-4 pt-4">
              <Link 
                to="/signup" 
                className="group flex items-center gap-2 bg-emerald-600 text-white px-10 py-5 rounded-[2rem] font-black text-lg hover:bg-emerald-500 transition-all shadow-2xl shadow-emerald-600/20 hover:-translate-y-1 active:scale-95"
              >
                Get Started <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link 
                to="/login" 
                className="bg-white/10 backdrop-blur-xl text-white border border-white/20 px-10 py-5 rounded-[2rem] font-black text-lg hover:bg-white hover:text-black transition-all hover:-translate-y-1 active:scale-95"
              >
                Login
              </Link>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 text-white/40">
           <span className="text-xs font-black uppercase tracking-wider">Learn More</span>
           <div className="w-px h-12 bg-gradient-to-b from-white/40 to-transparent" />
        </div>
      </section>

      {/* Trust Section */}
      <section className="bg-gray-50 py-12 border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-6 flex flex-wrap justify-center items-center gap-12 opacity-80 grayscale-0 transition-all">
           <div className="text-2xl font-black text-gray-900 uppercase">MADE FOR INDIAN FARMERS</div>
           <div className="h-6 w-px bg-gray-300 hidden md:block" />
           <div className="text-2xl font-bold text-gray-700 uppercase tracking-tight">Verified by Agriculture Experts</div>
           <div className="h-6 w-px bg-gray-300 hidden md:block" />
           <div className="text-2xl font-bold text-gray-700 uppercase tracking-tight">Trusted in 100+ Districts</div>
        </div>
      </section>

      {/* Smart Features */}
      <section className="max-w-7xl mx-auto px-6 py-24 space-y-16">
        <div className="text-center space-y-6 max-w-3xl mx-auto">
          <h2 className="text-sm font-black text-emerald-600 uppercase tracking-[0.2em]">Smart Features</h2>
          <p className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight leading-tight">
            Manage your farm easily. <br />
            <span className="text-gray-400 font-medium">No complex steps needed.</span>
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { 
              icon: Activity, 
              title: 'Live Farm Monitor', 
              desc: 'Check your birds and farm status anytime from your phone.',
              color: 'bg-blue-500'
            },
            { 
              icon: Cpu, 
              title: 'Egg Predictor', 
              desc: 'AI helper that tells you exactly how many eggs you will get.',
              color: 'bg-emerald-600'
            },
            { 
              icon: Globe, 
              title: 'Direct Market', 
              desc: 'Sell your birds and eggs directly to buyers. More profit for you.',
              color: 'bg-orange-500'
            },
            { 
              icon: ShieldCheck, 
              title: 'Bird Health', 
              desc: 'Get smart alerts and tips to keep your birds healthy and safe.',
              color: 'bg-indigo-600'
            },
          ].map((feat, i) => (
            <div key={i} className="group bg-white p-8 rounded-[2rem] border border-gray-100 hover:border-emerald-200 hover:shadow-2xl hover:shadow-emerald-100/50 transition-all duration-500 flex flex-col items-center text-center">
              <div className={`${feat.color} w-20 h-20 rounded-[2rem] flex items-center justify-center text-white mb-8 shadow-2xl group-hover:scale-110 transition-transform`}>
                <feat.icon size={32} />
              </div>
              <h3 className="text-2xl font-black text-gray-900 mb-4 tracking-tight">{feat.title}</h3>
              <p className="text-gray-500 font-medium leading-relaxed">{feat.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Visual Showcase */}
      <section className="max-w-7xl mx-auto px-6 pb-32">
        <div className="bg-slate-900 rounded-[2.5rem] overflow-hidden flex flex-col lg:flex-row shadow-3xl shadow-emerald-900/10">
           <div className="lg:w-1/2 h-96 lg:h-auto overflow-hidden">
             <img src={POULTRY_IMAGES.HERO.CHICKS_GROUP} alt="Precision" className="w-full h-full object-cover hover:scale-110 transition-transform duration-1000" />
           </div>
           <div className="lg:w-1/2 p-12 md:p-20 flex flex-col justify-center space-y-12">
             <div className="space-y-6">
                <h3 className="text-4xl md:text-5xl font-black text-white tracking-tight leading-[0.95]">
                  Helping Indian <br /> Farmers Grow.
                </h3>
                <p className="text-gray-400 font-medium text-lg leading-relaxed">
                  We help every farmer—big or small—to manage their farm easily. From bird health to profit tracking, we have all the tools you need to succeed.
                </p>
             </div>

             <div className="grid grid-cols-2 gap-10 border-t border-white/10 pt-12">
                <div className="space-y-3">
                   <div className="text-4xl font-black text-emerald-400 tracking-tight">8.4 Lakh+</div>
                   <p className="text-sm font-black text-gray-400 uppercase tracking-wider">Active Birds</p>
                </div>
                <div className="space-y-3">
                   <div className="text-4xl font-black text-white tracking-tight">₹1.2 Cr+</div>
                   <p className="text-sm font-black text-gray-400 uppercase tracking-wider">Trade Volume</p>
                </div>
                <div className="space-y-3 border-t border-white/10 pt-8">
                   <div className="text-4xl font-black text-white tracking-tight">15%</div>
                   <p className="text-sm font-black text-gray-400 uppercase tracking-wider">Profit Increase</p>
                </div>
                <div className="space-y-3 border-t border-white/10 pt-8">
                   <div className="text-4xl font-black text-emerald-400 tracking-tight">Smart</div>
                   <p className="text-sm font-black text-gray-400 uppercase tracking-wider">App for You</p>
                </div>
             </div>
           </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-emerald-600 py-32 px-6">
        <div className="max-w-5xl mx-auto text-center space-y-12">
           <h2 className="text-5xl md:text-7xl font-black text-white tracking-tight leading-[0.9]">
             Ready to grow your <br /> poultry farm?
           </h2>
           <p className="text-emerald-50 text-xl font-medium max-w-2xl mx-auto leading-relaxed">
             Join 5,000+ farmers who use PoultrySmart to make more profit and manage their farms better every day.
           </p>
           <div className="flex flex-col md:flex-row justify-center gap-6">
              <Link to="/signup" className="bg-white text-emerald-600 px-12 py-6 rounded-[2.5rem] font-black text-xl hover:scale-105 transition-all shadow-2xl">Create Free Account</Link>
              <button className="flex items-center justify-center gap-3 text-white font-bold text-xl hover:text-emerald-100 transition-colors">
                 <Users size={24} /> Talk to Us
              </button>
           </div>
           
           <div className="flex justify-center flex-wrap gap-8 pt-12 border-t border-white/20">
              <div className="flex items-center gap-2 text-white/60 text-sm font-bold">
                 <CheckCircle2 size={18} /> Free to Start
              </div>
              <div className="flex items-center gap-2 text-white/60 text-sm font-bold">
                 <CheckCircle2 size={18} /> Easy to Use
              </div>
              <div className="flex items-center gap-2 text-white/60 text-sm font-bold">
                 <CheckCircle2 size={18} /> 24/7 Farmer Help
              </div>
           </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white py-20 px-6 border-t border-gray-100">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-5 gap-12">
           <div className="col-span-full md:col-span-2 space-y-6">
              <div className="text-2xl font-black text-gray-900 tracking-tight italic">PoultrySmart.</div>
              <p className="text-gray-500 font-medium leading-relaxed max-w-xs text-sm">
                The best app for modern poultry farms in India. Built with love for our farming community.
              </p>
           </div>
           <div className="space-y-4">
              <h4 className="font-black text-gray-900 text-sm uppercase tracking-wider">App</h4>
              <ul className="space-y-2 text-sm text-gray-500 font-medium">
                 <li><Link to="/farmer/listings" className="hover:text-emerald-600 transition-colors">Marketplace</Link></li>
                 <li><Link to="/farmer/predict" className="hover:text-emerald-600 transition-colors">AI Predictor</Link></li>
                 <li><Link to="/farmer/health" className="hover:text-emerald-600 transition-colors">Bird Health</Link></li>
              </ul>
           </div>
           <div className="space-y-4">
              <h4 className="font-black text-gray-900 text-sm uppercase tracking-wider">Company</h4>
              <ul className="space-y-2 text-sm text-gray-500 font-medium">
                 <li><a href="#" className="hover:text-emerald-600 transition-colors">About Us</a></li>
                 <li><a href="#" className="hover:text-emerald-600 transition-colors">Contact</a></li>
              </ul>
           </div>
           <div className="space-y-4">
              <h4 className="font-black text-gray-900 text-sm uppercase tracking-wider">Legal</h4>
              <ul className="space-y-2 text-sm text-gray-500 font-medium">
                 <li><a href="#" className="hover:text-emerald-600 transition-colors">Privacy</a></li>
                 <li><a href="#" className="hover:text-emerald-600 transition-colors">Terms</a></li>
              </ul>
           </div>
        </div>
        <div className="max-w-7xl mx-auto mt-20 pt-8 border-t border-gray-100 flex justify-between items-center text-xs font-black text-gray-400 uppercase tracking-wider">
           <span>© 2024 POULTRYSMART INDIA.</span>
        </div>
      </footer>
    </div>
  );
}
