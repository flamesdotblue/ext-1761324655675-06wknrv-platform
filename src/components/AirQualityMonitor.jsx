import { useEffect, useMemo, useState } from 'react';
import { MapPin, Crosshair, AlertCircle } from 'lucide-react';

function aqiCategory(aqi) {
  if (aqi == null) return { label: 'Unknown', color: 'text-neutral-300', bg: 'bg-white/5' };
  if (aqi <= 50) return { label: 'Good', color: 'text-emerald-400', bg: 'bg-emerald-500/10' };
  if (aqi <= 100) return { label: 'Moderate', color: 'text-yellow-400', bg: 'bg-yellow-500/10' };
  if (aqi <= 150) return { label: 'Unhealthy for Sensitive Groups', color: 'text-orange-400', bg: 'bg-orange-500/10' };
  if (aqi <= 200) return { label: 'Unhealthy', color: 'text-red-400', bg: 'bg-red-500/10' };
  if (aqi <= 300) return { label: 'Very Unhealthy', color: 'text-purple-400', bg: 'bg-purple-500/10' };
  return { label: 'Hazardous', color: 'text-fuchsia-400', bg: 'bg-fuchsia-500/10' };
}

export default function AirQualityMonitor() {
  const [coords, setCoords] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  const fetchAQ = async (latitude, longitude) => {
    try {
      setLoading(true);
      setError(null);
      const params = new URLSearchParams({
        latitude: String(latitude),
        longitude: String(longitude),
        hourly: 'pm10,pm2_5,carbon_monoxide,ozone,nitrogen_dioxide,sulphur_dioxide,us_aqi',
      });
      const res = await fetch(`https://air-quality-api.open-meteo.com/v1/air-quality?${params.toString()}`);
      if (!res.ok) throw new Error('Failed to load air quality');
      const json = await res.json();
      const h = json.hourly || {};
      const lastIndex = (h.time && h.time.length ? h.time.length - 1 : 0);
      const reading = {
        time: h.time ? h.time[lastIndex] : null,
        pm10: h.pm10 ? h.pm10[lastIndex] : null,
        pm2_5: h.pm2_5 ? h.pm2_5[lastIndex] : null,
        carbon_monoxide: h.carbon_monoxide ? h.carbon_monoxide[lastIndex] : null,
        ozone: h.ozone ? h.ozone[lastIndex] : null,
        nitrogen_dioxide: h.nitrogen_dioxide ? h.nitrogen_dioxide[lastIndex] : null,
        sulphur_dioxide: h.sulphur_dioxide ? h.sulphur_dioxide[lastIndex] : null,
        us_aqi: h.us_aqi ? h.us_aqi[lastIndex] : null,
      };
      setData({ coords: { latitude, longitude }, reading });
    } catch (e) {
      setError(e.message || 'Error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!coords) return;
    fetchAQ(coords.latitude, coords.longitude);
  }, [coords]);

  const advisory = useMemo(() => {
    const aqi = data?.reading?.us_aqi ?? null;
    const cat = aqiCategory(aqi);
    const message = !aqi
      ? 'Unable to determine AQI for your location.'
      : aqi <= 50
      ? 'Air quality is good. Open windows and enjoy outdoor activities.'
      : aqi <= 100
      ? 'Moderate air quality. Sensitive individuals should monitor symptoms.'
      : aqi <= 150
      ? 'Limit prolonged outdoor exertion if sensitive.'
      : aqi <= 200
      ? 'Unhealthy air. Reduce outdoor activity; wear a mask if needed.'
      : aqi <= 300
      ? 'Very unhealthy. Avoid outdoor activity; air purifier recommended.'
      : 'Hazardous. Stay indoors with filtration; follow local guidance.';
    return { ...cat, message };
  }, [data]);

  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold">Air Quality Monitor</h3>
        <button
          onClick={() => {
            if (!navigator.geolocation) {
              setError('Geolocation not supported');
              return;
            }
            setError(null);
            setLoading(true);
            navigator.geolocation.getCurrentPosition(
              (pos) => {
                const { latitude, longitude } = pos.coords;
                setCoords({ latitude, longitude });
                setLoading(false);
              },
              (err) => {
                setError(err.message || 'Location access denied');
                setLoading(false);
              },
              { enableHighAccuracy: true, timeout: 10000 }
            );
          }}
          className="inline-flex items-center gap-2 px-3 py-2 rounded-md border border-white/10 text-sm hover:bg-white/10"
        >
          <Crosshair size={16} /> Detect my location
        </button>
      </div>

      {!coords && (
        <div className="text-sm text-neutral-300 flex items-center gap-2">
          <MapPin size={16} className="text-emerald-400" />
          Allow location access to view real-time AQI and pollutant levels.
        </div>
      )}

      {loading && (
        <div className="mt-4 animate-pulse text-neutral-400 text-sm">Fetching air quality data...</div>
      )}

      {error && (
        <div className="mt-4 text-sm text-red-300 flex items-center gap-2">
          <AlertCircle size={16} /> {error}
        </div>
      )}

      {data && (
        <div className="mt-4 grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="col-span-1 space-y-3">
            <div className="rounded-lg border border-white/10 bg-white/5 p-4">
              <div className="text-sm text-neutral-300">US AQI</div>
              <div className="mt-1 text-4xl font-extrabold tracking-tight">{data.reading.us_aqi ?? '—'}</div>
              <div className={`mt-2 inline-flex items-center gap-2 text-sm font-medium ${advisory.color} ${advisory.bg} px-2 py-1 rounded`}>{aqiCategory(data.reading.us_aqi).label}</div>
              <div className="mt-3 text-sm text-neutral-300">{advisory.message}</div>
              <div className="mt-3 text-xs text-neutral-400">Lat {data.coords.latitude.toFixed(3)}, Lng {data.coords.longitude.toFixed(3)} • {data.reading.time ? new Date(data.reading.time).toLocaleString() : '—'}</div>
            </div>
          </div>

          <div className="col-span-2 grid grid-cols-2 md:grid-cols-3 gap-3">
            {[
              { k: 'pm2_5', label: 'PM2.5', unit: 'µg/m³' },
              { k: 'pm10', label: 'PM10', unit: 'µg/m³' },
              { k: 'ozone', label: 'O₃', unit: 'µg/m³' },
              { k: 'nitrogen_dioxide', label: 'NO₂', unit: 'µg/m³' },
              { k: 'carbon_monoxide', label: 'CO', unit: 'µg/m³' },
              { k: 'sulphur_dioxide', label: 'SO₂', unit: 'µg/m³' },
            ].map((p) => (
              <div key={p.k} className="rounded-lg border border-white/10 bg-white/5 p-4">
                <div className="text-sm text-neutral-300">{p.label}</div>
                <div className="mt-1 text-2xl font-bold">{data.reading[p.k] != null ? data.reading[p.k].toFixed(1) : '—'}</div>
                <div className="text-xs text-neutral-400">{p.unit}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-6 text-xs text-neutral-400">
        AQI scale: 0-50 Good • 51-100 Moderate • 101-150 Unhealthy for Sensitive Groups • 151-200 Unhealthy • 201-300 Very Unhealthy • 300+ Hazardous
      </div>
    </div>
  );
}
