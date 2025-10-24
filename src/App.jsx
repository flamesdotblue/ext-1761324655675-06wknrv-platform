import { useState } from 'react';
import { Leaf, Gauge, Map, Activity } from 'lucide-react';
import Hero from './components/Hero';
import CarbonCalculator from './components/CarbonCalculator';
import AirQualityMonitor from './components/AirQualityMonitor';
import IndiaEmissionsMap from './components/IndiaEmissionsMap';

export default function App() {
  const [activeTab, setActiveTab] = useState('calculator');

  const tabs = [
    { key: 'calculator', label: 'Footprint Calculator', icon: Gauge },
    { key: 'air', label: 'Air Quality', icon: Activity },
    { key: 'map', label: 'India Emissions Map', icon: Map },
  ];

  return (
    <div className="min-h-screen bg-neutral-950 text-white">
      <header className="sticky top-0 z-40 backdrop-blur bg-neutral-950/60 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg bg-emerald-500/20 grid place-items-center">
              <Leaf className="text-emerald-400" size={18} />
            </div>
            <div className="leading-tight">
              <p className="font-semibold tracking-tight">EcoTrack</p>
              <p className="text-xs text-neutral-400">Carbon Footprint & Air Quality</p>
            </div>
          </div>
          <nav className="hidden md:flex items-center gap-2">
            {tabs.map((t) => (
              <button
                key={t.key}
                onClick={() => setActiveTab(t.key)}
                className={`inline-flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors ${
                  activeTab === t.key
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    : 'text-neutral-300 hover:text-white hover:bg-white/5 border border-white/10'
                }`}
              >
                <t.icon size={16} />
                {t.label}
              </button>
            ))}
          </nav>
        </div>
      </header>

      <main>
        <Hero onGetStarted={() => setActiveTab('calculator')} />

        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex md:hidden mb-6 overflow-x-auto no-scrollbar gap-2">
            {tabs.map((t) => (
              <button
                key={t.key}
                onClick={() => setActiveTab(t.key)}
                className={`whitespace-nowrap inline-flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors ${
                  activeTab === t.key
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    : 'text-neutral-300 hover:text-white hover:bg-white/5 border border-white/10'
                }`}
              >
                <t.icon size={16} />
                {t.label}
              </button>
            ))}
          </div>

          {activeTab === 'calculator' && <CarbonCalculator />}
          {activeTab === 'air' && <AirQualityMonitor />}
          {activeTab === 'map' && <IndiaEmissionsMap />}
        </section>

        <footer className="border-t border-white/10 py-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-sm text-neutral-400 flex flex-col md:flex-row items-center justify-between gap-4">
            <p>
              © {new Date().getFullYear()} EcoTrack. Empowering sustainable choices.
            </p>
            <div className="flex gap-4">
              <a href="#" className="hover:text-white">Privacy</a>
              <a href="#" className="hover:text-white">Terms</a>
              <a href="#" className="hover:text-white">Contact</a>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
