import { Link } from 'react-router-dom';
import { Activity, ShieldCheck, TrendingUp, Cpu } from 'lucide-react';

export default function Home() {
  return (
    <div className="max-w-7xl mx-auto space-y-16 py-12">
      {/* Hero Section */}
      <section className="text-center space-y-6">
        <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 tracking-tight">
          Smarter Poultry <span className="text-brand-600">Management</span>
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          An intelligent platform merging farm management, IoT simulations, and AI egg predictions to maximize your yield and profits.
        </p>
        <div className="flex justify-center gap-4 pt-4">
          <Link to="/signup" className="bg-brand-600 text-white px-8 py-3 rounded-full font-semibold text-lg hover:bg-brand-700 transition-all shadow-lg hover:shadow-xl">
            Get Started
          </Link>
          <Link to="/login" className="bg-white text-gray-800 border-2 border-gray-200 px-8 py-3 rounded-full font-semibold text-lg hover:border-gray-300 transition-all">
            Login
          </Link>
        </div>
      </section>

      {/* Features Grid */}
      <section className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
        {[
          { icon: Activity, title: 'Smart Analytics', desc: 'Track production, mortality, and feed consumption in real-time.' },
          { icon: Cpu, title: 'AI Predictions', desc: 'Leverage machine learning surrogate models for yield forecasting.' },
          { icon: TrendingUp, title: 'Direct Marketplace', desc: 'Connect directly with buyers, set your own prices, and increase margin.' },
          { icon: ShieldCheck, title: 'Health Alerts', desc: 'Early warning system for disease and unfavorable temperature patterns.' },
        ].map((feat, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="bg-brand-50 w-12 h-12 rounded-xl flex items-center justify-center text-brand-600 mb-4">
              <feat.icon size={24} />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">{feat.title}</h3>
            <p className="text-gray-600 text-sm leading-relaxed">{feat.desc}</p>
          </div>
        ))}
      </section>
    </div>
  );
}
