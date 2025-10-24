import Spline from '@splinetool/react-spline';
import { motion } from 'framer-motion';

export default function Hero({ onGetStarted }) {
  return (
    <section className="relative h-[72vh] min-h-[520px] w-full overflow-hidden">
      <div className="absolute inset-0">
        <Spline scene="https://prod.spline.design/M2rj0DQ6tP7dSzSz/scene.splinecode" style={{ width: '100%', height: '100%' }} />
      </div>

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/10 via-black/50 to-neutral-950" />

      <div className="relative z-10 h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center">
        <div className="max-w-2xl">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl sm:text-5xl font-extrabold tracking-tight"
          >
            Track, understand, and reduce your carbon footprint
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="mt-4 text-neutral-300 text-lg"
          >
            EcoTrack combines a powerful footprint calculator, real-time air quality monitoring, and an interactive emissions map for India.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mt-8 flex flex-col sm:flex-row items-center gap-3"
          >
            <button
              onClick={onGetStarted}
              className="px-5 py-3 rounded-md bg-emerald-500 text-black font-medium hover:bg-emerald-400 transition-colors"
            >
              Calculate my footprint
            </button>
            <a
              href="#india-map"
              className="px-5 py-3 rounded-md border border-white/20 text-white hover:bg-white/10 transition-colors"
            >
              Explore emissions map
            </a>
          </motion.div>

          <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-3 text-sm text-neutral-300">
            <div className="rounded-lg border border-white/10 bg-white/5 p-3">
              <p className="text-white font-semibold">4.7 t CO₂e/yr</p>
              <p className="text-neutral-400">Global average</p>
            </div>
            <div className="rounded-lg border border-white/10 bg-white/5 p-3">
              <p className="text-white font-semibold">2.0 t Target</p>
              <p className="text-neutral-400">Paris Agreement</p>
            </div>
            <div className="rounded-lg border border-white/10 bg-white/5 p-3">
              <p className="text-white font-semibold">Live AQI</p>
              <p className="text-neutral-400">Health guidance</p>
            </div>
            <div className="rounded-lg border border-white/10 bg-white/5 p-3">
              <p className="text-white font-semibold">India-wide</p>
              <p className="text-neutral-400">City emissions</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
