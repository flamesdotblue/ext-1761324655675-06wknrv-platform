import { useMemo, useState } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Leaf, TrendingDown, AlertTriangle } from 'lucide-react';

const DIET_FACTORS = {
  Vegan: 1.5,
  Vegetarian: 2.0,
  'Light Meat': 3.0,
  'Medium Meat': 4.0,
  'Heavy Meat': 5.0,
};

const COLORS = ['#34d399', '#60a5fa', '#f59e0b', '#a78bfa', '#f87171'];

export default function CarbonCalculator() {
  const [inputs, setInputs] = useState({
    carKmPerYear: 8000,
    airHoursPerYear: 10,
    monthlyElectricityKWh: 150,
    dietType: 'Medium Meat',
    wasteKgPerMonth: 30,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputs((prev) => ({ ...prev, [name]: name === 'dietType' ? value : Number(value) }));
  };

  const results = useMemo(() => {
    const car = (inputs.carKmPerYear || 0) * 0.0002; // t CO2e/yr
    const air = (inputs.airHoursPerYear || 0) * 0.09;
    const electricity = (inputs.monthlyElectricityKWh || 0) * 12 * 0.0007;
    const diet = DIET_FACTORS[inputs.dietType] ?? 0;
    const waste = (inputs.wasteKgPerMonth || 0) * 12 * 0.0012;
    const total = car + air + electricity + diet + waste;

    const breakdown = [
      { name: 'Transportation (Car)', value: car },
      { name: 'Transportation (Air)', value: air },
      { name: 'Household Energy', value: electricity },
      { name: 'Diet', value: diet },
      { name: 'Waste', value: waste },
    ];

    return { car, air, electricity, diet, waste, total, breakdown };
  }, [inputs]);

  const globalAverage = 4.7;
  const delta = results.total - globalAverage;
  const rating = results.total <= 2 ? 'Low' : results.total <= 5 ? 'Moderate' : results.total <= 8 ? 'High' : 'Very High';
  const ratingColor = rating === 'Low' ? 'text-emerald-400' : rating === 'Moderate' ? 'text-yellow-400' : rating === 'High' ? 'text-orange-400' : 'text-red-400';

  const recommendations = useMemo(() => {
    const recs = [];
    if (results.car > 1) recs.push('Consider carpooling, public transit, or switching to an EV or hybrid.');
    if (results.air > 1) recs.push('Bundle trips, choose trains for regional travel, and offset unavoidable flights.');
    if (results.electricity > 1) recs.push('Improve home efficiency: LED lighting, efficient AC, and solar where possible.');
    if (results.diet > 3) recs.push('Shift toward plant-forward meals several days a week.');
    if (results.waste > 0.5) recs.push('Increase recycling/composting and avoid single-use items.');
    if (recs.length === 0) recs.push('Great job! Maintain habits and inspire others.');
    return recs;
  }, [results]);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight">Carbon Footprint Calculator</h2>
        <div className="inline-flex items-center gap-2 text-sm text-neutral-300">
          <Leaf size={16} className="text-emerald-400" /> Powered by transparent factors
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <div className="rounded-xl border border-white/10 bg-white/5 p-5">
            <h3 className="font-semibold mb-4">Transportation</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <label className="text-sm">
                <span className="text-neutral-300">Car travel (km/year)</span>
                <input
                  type="number"
                  min="0"
                  name="carKmPerYear"
                  value={inputs.carKmPerYear}
                  onChange={handleChange}
                  className="mt-1 w-full bg-neutral-900 border border-white/10 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </label>
              <label className="text-sm">
                <span className="text-neutral-300">Air travel (hours/year)</span>
                <input
                  type="number"
                  min="0"
                  name="airHoursPerYear"
                  value={inputs.airHoursPerYear}
                  onChange={handleChange}
                  className="mt-1 w-full bg-neutral-900 border border-white/10 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </label>
            </div>
          </div>

          <div className="rounded-xl border border-white/10 bg-white/5 p-5">
            <h3 className="font-semibold mb-4">Household Energy</h3>
            <label className="text-sm block">
              <span className="text-neutral-300">Electricity (kWh/month)</span>
              <input
                type="number"
                min="0"
                name="monthlyElectricityKWh"
                value={inputs.monthlyElectricityKWh}
                onChange={handleChange}
                className="mt-1 w-full bg-neutral-900 border border-white/10 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </label>
          </div>

          <div className="rounded-xl border border-white/10 bg-white/5 p-5">
            <h3 className="font-semibold mb-4">Diet</h3>
            <label className="text-sm block">
              <span className="text-neutral-300">Diet type</span>
              <select
                name="dietType"
                value={inputs.dietType}
                onChange={handleChange}
                className="mt-1 w-full bg-neutral-900 border border-white/10 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                {Object.keys(DIET_FACTORS).map((k) => (
                  <option key={k} value={k}>{k}</option>
                ))}
              </select>
            </label>
          </div>

          <div className="rounded-xl border border-white/10 bg-white/5 p-5">
            <h3 className="font-semibold mb-4">Waste Management</h3>
            <label className="text-sm block">
              <span className="text-neutral-300">Waste produced (kg/month)</span>
              <input
                type="number"
                min="0"
                name="wasteKgPerMonth"
                value={inputs.wasteKgPerMonth}
                onChange={handleChange}
                className="mt-1 w-full bg-neutral-900 border border-white/10 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </label>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-xl border border-white/10 bg-white/5 p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">Results</h3>
              <span className={`text-sm font-medium ${
                results.total <= 2
                  ? 'text-emerald-400'
                  : results.total <= 5
                  ? 'text-yellow-400'
                  : results.total <= 8
                  ? 'text-orange-400'
                  : 'text-red-400'
              }`}>
                {rating} impact
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
              <div>
                <div className="text-4xl font-extrabold tracking-tight">{results.total.toFixed(2)} <span className="text-lg font-semibold text-neutral-300">t CO₂e/yr</span></div>
                <div className="mt-2 text-sm text-neutral-300">Global average: {globalAverage} t CO₂e/yr</div>
                <div className={`mt-1 inline-flex items-center gap-2 text-sm ${delta <= 0 ? 'text-emerald-400' : 'text-orange-300'}`}>
                  {delta <= 0 ? <TrendingDown size={16} /> : <AlertTriangle size={16} />}
                  {delta <= 0 ? `You are ${(Math.abs(delta)).toFixed(2)} t below average` : `You are ${delta.toFixed(2)} t above average`}
                </div>
                <ul className="mt-4 space-y-2 text-sm text-neutral-300 list-disc pl-5">
                  <li>Car: {results.car.toFixed(2)} t</li>
                  <li>Air travel: {results.air.toFixed(2)} t</li>
                  <li>Energy: {results.electricity.toFixed(2)} t</li>
                  <li>Diet: {results.diet.toFixed(2)} t</li>
                  <li>Waste: {results.waste.toFixed(2)} t</li>
                </ul>
              </div>

              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={results.breakdown}
                      dataKey="value"
                      nameKey="name"
                      outerRadius={100}
                      innerRadius={50}
                      paddingAngle={2}
                    >
                      {results.breakdown.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => `${Number(value).toFixed(2)} t`} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-white/10 bg-white/5 p-5">
            <h3 className="font-semibold mb-3">Personalized recommendations</h3>
            <ul className="space-y-2 text-sm text-neutral-300 list-disc pl-5">
              {recommendations.map((r, i) => (
                <li key={i}>{r}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
