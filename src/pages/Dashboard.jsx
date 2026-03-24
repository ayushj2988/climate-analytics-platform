import { useState } from "react";
import Filters from "../components/Filters";
import Map from "../components/Map";
import Chart from "../components/Chart";
import ScenarioPanel from "../components/ScenarioPanel";

export default function Dashboard() {
  const [selectedCountry, setSelectedCountry] = useState("India");
  const [selectedMetric, setSelectedMetric] = useState("CO2 Emissions");
  const [selectedYear, setSelectedYear] = useState(2020);
  
  // NEW: Compare Mode States
  const [isComparing, setIsComparing] = useState(false);
  const [compareCountry, setCompareCountry] = useState("USA");
  
  const [co2Reduction, setCo2Reduction] = useState(0);
  const [tempReduction, setTempReduction] = useState(0);
  const [insightText, setInsightText] = useState("Analyzing current climate trajectory...");

  return (
    <div className="flex flex-col w-full max-w-7xl mx-auto space-y-6">
      <div className="mb-2">
        <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400 flex items-center">
          Climate Analytics Engine
          {isComparing && <span className="ml-3 px-2 py-0.5 bg-blue-600 text-white text-xs font-bold rounded uppercase tracking-widest align-middle">VS Mode</span>}
        </h1>
        <p className="text-slate-400 text-sm mt-1">Powered by Random Forest Predictive Modeling</p>
      </div>

      <section className="w-full bg-slate-800 rounded-xl shadow-lg border border-slate-700/50 p-5">
        <Filters 
          selectedCountry={selectedCountry} setSelectedCountry={setSelectedCountry} 
          selectedMetric={selectedMetric} setSelectedMetric={setSelectedMetric} 
          selectedYear={selectedYear} setSelectedYear={setSelectedYear} 
          isComparing={isComparing} setIsComparing={setIsComparing}
          compareCountry={compareCountry} setCompareCountry={setCompareCountry}
        />
      </section>

      {/* DYNAMIC LAYOUT: Normal Mode vs Compare Mode */}
      {!isComparing ? (
        /* --- NORMAL 3-COLUMN LAYOUT --- */
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-slate-800 rounded-xl shadow-lg border border-slate-700/50 p-4 h-[450px]">
            <Map 
  country={selectedCountry} 
  compareCountry={compareCountry} 
  isComparing={isComparing} 
  metric={selectedMetric} 
  year={selectedYear} 
/>
          </div>
          
          <div className="lg:col-span-1 bg-slate-800 rounded-xl shadow-lg border border-slate-700/50 p-5 h-[450px]">
            <Chart country={selectedCountry} metric={selectedMetric} year={selectedYear} co2Reduction={co2Reduction} tempReduction={tempReduction} setInsightText={setInsightText} />
          </div>

          <div className="h-[450px] flex flex-col bg-slate-800 rounded-xl shadow-lg border border-slate-700/50 overflow-hidden">
            <ScenarioPanel co2Reduction={co2Reduction} setCo2Reduction={setCo2Reduction} tempReduction={tempReduction} setTempReduction={setTempReduction} insightText={insightText} />
          </div>
        </section>
      ) : (
        /* --- COMPARE MODE (2x2 GRID) --- */
        <div className="space-y-6">
          {/* Row 1: The Two Charts Side-by-Side */}
          <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-slate-800 rounded-xl shadow-lg border border-blue-500/50 p-5 h-[450px] relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-blue-500"></div>
              <Chart country={selectedCountry} metric={selectedMetric} year={selectedYear} co2Reduction={co2Reduction} tempReduction={tempReduction} setInsightText={setInsightText} />
            </div>
            
            <div className="bg-slate-800 rounded-xl shadow-lg border border-purple-500/50 p-5 h-[450px] relative overflow-hidden">
              <div className="absolute top-0 right-0 w-1 h-full bg-purple-500"></div>
              {/* Note: Doosre chart mein setInsightText nahi bheja taaki AI 2 baar call na ho */}
              <Chart country={compareCountry} metric={selectedMetric} year={selectedYear} co2Reduction={co2Reduction} tempReduction={tempReduction} />
            </div>
          </section>

          {/* Row 2: Map & Sliders below the charts */}
          <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* FIX: p-4 hata diya aur overflow-hidden laga diya */}
            <div className="bg-slate-800 rounded-xl shadow-lg border border-slate-700/50 overflow-hidden h-[400px]">
              <Map 
  country={selectedCountry} 
  compareCountry={compareCountry} 
  isComparing={isComparing} 
  metric={selectedMetric} 
  year={selectedYear} 
/>
            </div>

            <div className="h-[400px] flex flex-col bg-slate-800 rounded-xl shadow-lg border border-slate-700/50 overflow-hidden">
              <ScenarioPanel co2Reduction={co2Reduction} setCo2Reduction={setCo2Reduction} tempReduction={tempReduction} setTempReduction={setTempReduction} insightText={insightText} />
            </div>

          </section>
        </div>
      )}
    </div>
  );
}