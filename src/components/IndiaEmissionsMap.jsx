import { useEffect, useMemo, useState } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup, Marker } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const CITY_DATA = [
  // North
  { city: 'Delhi', state: 'Delhi', lat: 28.6139, lon: 77.2090, emissionsMt: 65, populationM: 19.0, sources: ['Transport', 'Industry', 'Power'] },
  { city: 'Chandigarh', state: 'Chandigarh', lat: 30.7333, lon: 76.7794, emissionsMt: 3, populationM: 1.1, sources: ['Transport', 'Residential'] },
  { city: 'Lucknow', state: 'Uttar Pradesh', lat: 26.8467, lon: 80.9462, emissionsMt: 12, populationM: 3.6, sources: ['Transport', 'Residential'] },
  { city: 'Jaipur', state: 'Rajasthan', lat: 26.9124, lon: 75.7873, emissionsMt: 10, populationM: 3.1, sources: ['Transport', 'Industry'] },
  { city: 'Amritsar', state: 'Punjab', lat: 31.6340, lon: 74.8723, emissionsMt: 5, populationM: 1.4, sources: ['Transport', 'Residential'] },
  // South
  { city: 'Bengaluru', state: 'Karnataka', lat: 12.9716, lon: 77.5946, emissionsMt: 25, populationM: 12.3, sources: ['Transport', 'IT/Commercial', 'Residential'] },
  { city: 'Chennai', state: 'Tamil Nadu', lat: 13.0827, lon: 80.2707, emissionsMt: 22, populationM: 10.9, sources: ['Transport', 'Industry'] },
  { city: 'Hyderabad', state: 'Telangana', lat: 17.3850, lon: 78.4867, emissionsMt: 20, populationM: 10.5, sources: ['Transport', 'Residential'] },
  { city: 'Kochi', state: 'Kerala', lat: 9.9312, lon: 76.2673, emissionsMt: 4, populationM: 0.7, sources: ['Transport', 'Port'] },
  { city: 'Coimbatore', state: 'Tamil Nadu', lat: 11.0168, lon: 76.9558, emissionsMt: 6, populationM: 2.8, sources: ['Industry', 'Transport'] },
  { city: 'Visakhapatnam', state: 'Andhra Pradesh', lat: 17.6868, lon: 83.2185, emissionsMt: 7, populationM: 2.4, sources: ['Port', 'Industry'] },
  // West
  { city: 'Mumbai', state: 'Maharashtra', lat: 19.0760, lon: 72.8777, emissionsMt: 55, populationM: 20.0, sources: ['Transport', 'Industry', 'Power'] },
  { city: 'Pune', state: 'Maharashtra', lat: 18.5204, lon: 73.8567, emissionsMt: 12, populationM: 6.6, sources: ['Transport', 'IT/Commercial'] },
  { city: 'Ahmedabad', state: 'Gujarat', lat: 23.0225, lon: 72.5714, emissionsMt: 18, populationM: 8.2, sources: ['Industry', 'Transport'] },
  { city: 'Surat', state: 'Gujarat', lat: 21.1702, lon: 72.8311, emissionsMt: 16, populationM: 7.1, sources: ['Industry', 'Textiles'] },
  { city: 'Nagpur', state: 'Maharashtra', lat: 21.1458, lon: 79.0882, emissionsMt: 7, populationM: 2.9, sources: ['Transport', 'Residential'] },
  // East
  { city: 'Kolkata', state: 'West Bengal', lat: 22.5726, lon: 88.3639, emissionsMt: 28, populationM: 14.8, sources: ['Transport', 'Industry', 'Power'] },
  { city: 'Patna', state: 'Bihar', lat: 25.5941, lon: 85.1376, emissionsMt: 6, populationM: 2.6, sources: ['Transport', 'Residential'] },
  { city: 'Bhubaneswar', state: 'Odisha', lat: 20.2961, lon: 85.8245, emissionsMt: 5, populationM: 1.1, sources: ['Industry', 'Transport'] },
  { city: 'Ranchi', state: 'Jharkhand', lat: 23.3441, lon: 85.3096, emissionsMt: 4, populationM: 1.5, sources: ['Transport', 'Residential'] },
  // Northeast
  { city: 'Guwahati', state: 'Assam', lat: 26.1445, lon: 91.7362, emissionsMt: 4, populationM: 1.1, sources: ['Transport', 'Residential'] },
  { city: 'Shillong', state: 'Meghalaya', lat: 25.5788, lon: 91.8933, emissionsMt: 1.5, populationM: 0.15, sources: ['Residential', 'Transport'] },
  // Central
  { city: 'Indore', state: 'Madhya Pradesh', lat: 22.7196, lon: 75.8577, emissionsMt: 7, populationM: 3.0, sources: ['Transport', 'Commercial'] },
  { city: 'Bhopal', state: 'Madhya Pradesh', lat: 23.2599, lon: 77.4126, emissionsMt: 6, populationM: 2.8, sources: ['Residential', 'Transport'] },
  { city: 'Raipur', state: 'Chhattisgarh', lat: 21.2514, lon: 81.6296, emissionsMt: 6, populationM: 1.1, sources: ['Industry', 'Power'] },
];

function colorForEmissions(mt) {
  if (mt <= 5) return '#34d399';
  if (mt <= 10) return '#facc15';
  if (mt <= 20) return '#f59e0b';
  if (mt <= 40) return '#fb923c';
  return '#ef4444';
}

export default function IndiaEmissionsMap() {
  const [userPos, setUserPos] = useState(null);

  useEffect(() => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => setUserPos({ lat: pos.coords.latitude, lon: pos.coords.longitude }),
      () => {}
    );
  }, []);

  const stats = useMemo(() => {
    const totalCities = CITY_DATA.length;
    const combined = CITY_DATA.reduce((s, c) => s + c.emissionsMt, 0);
    const population = CITY_DATA.reduce((s, c) => s + c.populationM, 0);
    const avgPerCapita = combined / (population * 1e6) * 1e6 / totalCities; // illustrative
    const top10 = [...CITY_DATA].sort((a, b) => b.emissionsMt - a.emissionsMt).slice(0, 10);
    return { totalCities, combined, avgPerCapita, top10 };
  }, []);

  return (
    <div id="india-map" className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold">India Emissions Map</h3>
        <div className="text-sm text-neutral-300">Cities tracked: {stats.totalCities} • Combined emissions: {stats.combined} Mt/year</div>
      </div>

      <div className="h-[520px] w-full overflow-hidden rounded-xl border border-white/10">
        <MapContainer center={[22.5, 79]} zoom={5} scrollWheelZoom={true} style={{ height: '100%', width: '100%' }}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {CITY_DATA.map((c) => (
            <CircleMarker
              key={`${c.city}-${c.state}`}
              center={[c.lat, c.lon]}
              radius={Math.max(6, Math.min(26, c.emissionsMt))}
              pathOptions={{ color: colorForEmissions(c.emissionsMt), fillColor: colorForEmissions(c.emissionsMt), fillOpacity: 0.6 }}
            >
              <Popup>
                <div className="text-sm">
                  <div className="font-semibold">{c.city}, {c.state}</div>
                  <div>Total CO₂: {c.emissionsMt} Mt/year</div>
                  <div>Population: {c.populationM} M</div>
                  <div>Per capita (illustrative): {(c.emissionsMt * 1e6 / (c.populationM * 1e6)).toFixed(2)} t/yr</div>
                  <div className="mt-1">Main sources: {c.sources.join(', ')}</div>
                </div>
              </Popup>
            </CircleMarker>
          ))}

          {userPos && (
            <Marker position={[userPos.lat, userPos.lon]} />
          )}
        </MapContainer>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="rounded-lg border border-white/10 bg-white/5 p-4">
          <div className="text-sm text-neutral-300">Average per capita (illustrative)</div>
          <div className="mt-1 text-2xl font-bold">{stats.avgPerCapita.toFixed(2)} t/yr</div>
        </div>
        <div className="rounded-lg border border-white/10 bg-white/5 p-4">
          <div className="text-sm text-neutral-300">Top emitting cities</div>
          <div className="mt-2 flex flex-wrap gap-2">
            {stats.top10.map((c) => (
              <span key={c.city} className="text-xs bg-white/10 border border-white/10 rounded px-2 py-1">{c.city}: {c.emissionsMt} Mt</span>
            ))}
          </div>
        </div>
        <div className="rounded-lg border border-white/10 bg-white/5 p-4">
          <div className="text-sm text-neutral-300">Legend</div>
          <div className="mt-2 grid grid-cols-2 gap-2 text-xs">
            <span className="inline-flex items-center gap-2"><span className="h-3 w-3 rounded-full" style={{ background: '#34d399' }} /> Low</span>
            <span className="inline-flex items-center gap-2"><span className="h-3 w-3 rounded-full" style={{ background: '#facc15' }} /> Medium</span>
            <span className="inline-flex items-center gap-2"><span className="h-3 w-3 rounded-full" style={{ background: '#f59e0b' }} /> High</span>
            <span className="inline-flex items-center gap-2"><span className="h-3 w-3 rounded-full" style={{ background: '#ef4444' }} /> Very High</span>
          </div>
        </div>
      </div>
    </div>
  );
}
