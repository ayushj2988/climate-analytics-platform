import React, { useEffect } from 'react';
import { MapContainer, TileLayer, CircleMarker, Tooltip, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const MapViewUpdater = ({ center, zoom }) => {
  const map = useMap();
  useEffect(() => {
    map.flyTo(center, zoom, { duration: 1.5 });
  }, [center, zoom, map]);
  return null;
};

// FIX: isComparing prop receive kiya yahan
const Map = ({ country, compareCountry, isComparing, metric, year }) => {
  const activeCountry = country || 'Global';
  const activeYear = year || 2020;

  const locations = {
    Global: { center: [20, 0], zoom: 2 },
    India: { center: [20.5937, 78.9629], zoom: 4 },
    USA: { center: [37.0902, -95.7129], zoom: 4 },
    China: { center: [35.8617, 104.1954], zoom: 4 },
  };

  let currentLoc = locations[activeCountry] || locations['Global'];
  
  // FIX: Ab ye strictly check karega ki VS button daba hai ya nahi!
  const showCompare = isComparing && compareCountry && compareCountry !== 'Global' && compareCountry !== activeCountry;
  
  if (showCompare) {
    currentLoc = locations['Global'];
  }

  const intensity = Math.max(0, Math.min(1, (activeYear - 2000) / 50)); 
  const circleRadius = 20 + (intensity * 40);

  const getThemeColors = () => {
    if (metric === 'Temperature') return { fill: '#ef4444', border: '#b91c1c' }; 
    if (metric === 'Rainfall') return { fill: '#3b82f6', border: '#1d4ed8' }; 
    return { fill: '#94a3b8', border: '#475569' }; 
  };
  const colors = getThemeColors();
  const compareColors = { fill: '#a855f7', border: '#7e22ce' };

  return (
    <div className="relative w-full h-full min-h-[400px] rounded-xl overflow-hidden bg-slate-900 z-0">
      <MapContainer center={currentLoc.center} zoom={currentLoc.zoom} scrollWheelZoom={true} className="w-full h-full z-0">
        
        <TileLayer
          attribution='&copy; <a href="https://carto.com/">CartoDB</a>'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />
        
        <MapViewUpdater center={currentLoc.center} zoom={currentLoc.zoom} />

        {activeCountry !== 'Global' && locations[activeCountry] && (
          <CircleMarker 
            center={locations[activeCountry].center} 
            radius={circleRadius}
            pathOptions={{ 
              fillColor: colors.fill, 
              color: colors.border, 
              weight: 2, 
              fillOpacity: 0.4 + (intensity * 0.4) 
            }}
          >
            <Tooltip permanent direction="top" className="bg-slate-800 border-slate-600 text-white shadow-md rounded-md font-bold">
              {activeCountry}: {metric} Risk
            </Tooltip>
          </CircleMarker>
        )}

        {/* FIX: showCompare check lagaya */}
        {showCompare && locations[compareCountry] && (
          <CircleMarker 
            center={locations[compareCountry].center} 
            radius={circleRadius}
            pathOptions={{ 
              fillColor: compareColors.fill, 
              color: compareColors.border, 
              weight: 2, 
              fillOpacity: 0.4 + (intensity * 0.4) 
            }}
          >
            <Tooltip permanent direction="bottom" className="bg-slate-800 border-purple-500 text-purple-200 shadow-md rounded-md font-bold">
              VS {compareCountry}: {metric} Risk
            </Tooltip>
          </CircleMarker>
        )}

      </MapContainer>
    </div>
  );
};

export default Map;