import React from 'react';

// NAYA: insightText prop receive kiya
const ScenarioPanel = ({ co2Reduction, setCo2Reduction, tempReduction, setTempReduction, insightText }) => {
  return (
    <div className="bg-slate-800 text-white rounded-xl shadow-md p-5 w-full h-full flex flex-col">
      <h3 className="text-lg font-bold mb-1">AI Prediction Parameters</h3>
      <p className="text-xs text-slate-400 mb-6">Adjust policy variables to simulate future climate outcomes (2025-2050).</p>

      <div className="space-y-6">
        {/* CO2 Policy Slider */}
        <div>
          <div className="flex justify-between text-sm font-medium mb-2">
            <span>Target CO2 Emission Cut</span>
            <span className={co2Reduction > 0 ? "text-green-400 font-bold" : "text-slate-300"}>
              {co2Reduction > 0 ? `-${co2Reduction}%` : '0%'}
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={co2Reduction}
            onChange={(e) => setCo2Reduction(parseInt(e.target.value))}
            className="w-full h-2 bg-slate-600 rounded-lg appearance-none cursor-pointer accent-green-500"
          />
        </div>

        {/* Global Temp Policy Slider */}
        <div>
          <div className="flex justify-between text-sm font-medium mb-2">
            <span>Target Temp Reduction vs Baseline</span>
            <span className={tempReduction > 0 ? "text-blue-400 font-bold" : "text-slate-300"}>
              {tempReduction > 0 ? `-${(tempReduction / 10).toFixed(1)}°C` : '0.0°C'}
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="30"
            value={tempReduction}
            onChange={(e) => setTempReduction(parseInt(e.target.value))}
            className="w-full h-2 bg-slate-600 rounded-lg appearance-none cursor-pointer accent-blue-500"
          />
        </div>
      </div>

{/* AI INSIGHT BOX */}
      <div className="mt-4 p-4 bg-slate-900/50 border border-slate-700/50 rounded-xl flex flex-col">
        <h4 className="text-xs font-bold text-blue-400 tracking-widest uppercase mb-2 flex items-center">
          <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd"></path></svg>
          Automated AI Insight
        </h4>
        
        {/* FIX: overflow-y-auto aur max-h-24 lagaya taaki scroll ho sake */}
        <div className="overflow-y-auto max-h-28 pr-2 scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-transparent">
          <p className="text-sm text-slate-300 leading-relaxed">
            {insightText}
          </p>
        </div>
      </div>
      
    </div>
  );
};

export default ScenarioPanel;