import React from 'react';

const Filters = ({ 
  selectedCountry, setSelectedCountry, 
  selectedMetric, setSelectedMetric, 
  selectedYear, setSelectedYear,
  isComparing, setIsComparing,
  compareCountry, setCompareCountry
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-end w-full">
      
      {/* REGION SELECTOR (Wider to accommodate compare mode) */}
      <div className="md:col-span-5">
        <label className="block text-sm font-medium text-slate-300 mb-2">Region Analysis</label>
        <div className="flex items-center space-x-2">
          <select
            value={selectedCountry}
            onChange={(e) => setSelectedCountry(e.target.value)}
            className="w-full bg-slate-700 border border-slate-600 text-white rounded-lg focus:ring-2 focus:ring-blue-500 p-2.5 outline-none"
          >
            <option value="Global">Global</option>
            <option value="India">India</option>
            <option value="USA">USA</option>
            <option value="China">China</option>
          </select>

          {/* THE VS BUTTON */}
          <button 
            onClick={() => setIsComparing(!isComparing)}
            className={`px-3 py-2.5 rounded-lg font-bold text-sm transition-all border ${
              isComparing 
                ? 'bg-blue-600 text-white border-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]' 
                : 'bg-slate-800 text-slate-400 border-slate-600 hover:bg-slate-700'
            }`}
          >
            VS
          </button>

          {/* SECOND COUNTRY (Only shows if VS is active) */}
          {isComparing && (
            <select
              value={compareCountry}
              onChange={(e) => setCompareCountry(e.target.value)}
              className="w-full bg-slate-700 border border-blue-500 text-white rounded-lg focus:ring-2 focus:ring-blue-500 p-2.5 outline-none animate-pulse-once"
            >
              <option value="Global">Global</option>
              <option value="India">India</option>
              <option value="USA">USA</option>
              <option value="China">China</option>
            </select>
          )}
        </div>
      </div>

      {/* METRIC SELECTOR */}
      <div className="md:col-span-3">
        <label className="block text-sm font-medium text-slate-300 mb-2">Key Metric</label>
        <select
          value={selectedMetric}
          onChange={(e) => setSelectedMetric(e.target.value)}
          className="w-full bg-slate-700 border border-slate-600 text-white rounded-lg focus:ring-2 focus:ring-blue-500 p-2.5 outline-none"
        >
          <option value="Temperature">Temperature</option>
          <option value="CO2 Emissions">CO2 Emissions</option>
          <option value="Rainfall">Rainfall</option>
        </select>
      </div>

      {/* TIMELINE SLIDER */}
      <div className="md:col-span-4 flex flex-col justify-end h-full py-1">
        <label className="flex justify-between text-sm font-medium text-slate-300 mb-2">
          <span>Timeline</span>
          <span className={`font-bold ${selectedYear > 2030 ? 'text-red-400' : 'text-blue-400'}`}>
            {selectedYear}
          </span>
        </label>
        <input
          type="range" min="2000" max="2050" 
          value={selectedYear}
          onChange={(e) => setSelectedYear(parseInt(e.target.value))}
          className="w-full h-2 bg-slate-600 rounded-lg appearance-none cursor-pointer accent-blue-500"
        />
      </div>

    </div>
  );
};

export default Filters;