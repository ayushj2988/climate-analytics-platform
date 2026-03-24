import React, { useEffect, useState, useRef } from "react";
import { ComposedChart, Area, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts";
import Papa from "papaparse";
import html2canvas from "html2canvas";

const Chart = ({ country, metric, year, co2Reduction, tempReduction, setInsightText }) => {
  const activeCountry = country || "India";
  const activeMetric = metric || "CO2 Emissions";
  
  const [chartData, setChartData] = useState([]);
  const [usingFallback, setUsingFallback] = useState(false);
  const chartRef = useRef(null);

// Naya state debounce ke liye
  const [debouncedCo2Reduction, setDebouncedCo2Reduction] = useState(co2Reduction);
  const [debouncedTempReduction, setDebouncedTempReduction] = useState(tempReduction);

// DEBOUNCE EFFECT: Slider hilaane par 500ms wait karega
// DEBOUNCE EFFECT: Slider rukne ke 2 second baad hi API call jayegi
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedCo2Reduction(co2Reduction);
      setDebouncedTempReduction(tempReduction);
    }, 2000); // <--- ISKO 2000 (2 Seconds) KAR DIYA

    return () => {
      clearTimeout(handler);
    };
  }, [co2Reduction, tempReduction]);

  useEffect(() => {
    let file = activeMetric === "CO2 Emissions" ? "/data/emissions.csv" : "/data/temperature.csv";
    
    Papa.parse(file, {
      download: true,
      header: true,
      skipEmptyLines: true,
      complete: async (res) => {
        let rawBaseData = res.data
          .filter(row => row.Country && row.Country.toLowerCase() === activeCountry.toLowerCase())
          .map(row => ({
            year: parseInt(row.Year),
            value: Number(row.Value || row.Temperature || 0),
          }))
          .sort((a, b) => a.year - b.year);

        if (rawBaseData.length === 0) {
          const defaultBase = activeMetric === 'Temperature' ? 24 : 1500;
          rawBaseData = Array.from({ length: 6 }, (_, i) => ({
            year: 2000 + (i * 5),
            value: defaultBase + (i * 0.2)
          }));
          setUsingFallback(true);
        } else {
          setUsingFallback(false);
        }

        const formattedBaseData = rawBaseData.map(d => ({
          year: d.year,
          historical: d.value
        }));

        const response = await fetch('http://127.0.0.1:5000/predict', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              country: activeCountry,
              co2Reduction: debouncedCo2Reduction || 0,
              tempReduction: debouncedTempReduction || 0,
              needsAI: setInsightText ? true : false   // <--- NAYI LINE: Agar insight box hai tabhi AI maango
            })
          });

        const lastKnownData = rawBaseData[rawBaseData.length - 1];
        let currentFutureValue = lastKnownData ? lastKnownData.value : 0;
        const futureData = [];

        try {
          // --- Yahan ab DEBOUNCED values bheji hain ---
          const response = await fetch('http://127.0.0.1:5000/predict', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              country: activeCountry,
              co2Reduction: debouncedCo2Reduction || 0,
              tempReduction: debouncedTempReduction || 0
            })
          });
          
          const mlData = await response.json();

          if (mlData.status === "success") {
            let targetAnomaly = mlData.predicted_temperature_anomaly;
            
            // --- GENERATIVE AI TEXT DIRECTLY APPLIED ---
            if (setInsightText && mlData.ai_generated_insight) {
              setInsightText(mlData.ai_generated_insight);
            }
            
            futureData.push({
              year: lastKnownData.year,
              historical: lastKnownData.value,
              prediction: lastKnownData.value,
              range: [lastKnownData.value, lastKnownData.value]
            });

            let accumulatedVariance = 0;

            for (let y = 2030; y <= 2050; y += 5) {
              let baseTrend = activeMetric === 'Temperature' ? 0.25 : (activeMetric === 'CO2 Emissions' ? 150 : -30);
              let adjustedTrend = baseTrend * (targetAnomaly > 0.5 ? targetAnomaly : 1);
              let noise = adjustedTrend * (Math.random() * 0.6 - 0.3); 
              
              currentFutureValue += (adjustedTrend + noise);

              const varianceStep = activeMetric === 'Temperature' ? 0.2 : (activeMetric === 'CO2 Emissions' ? 100 : 50);
              accumulatedVariance += varianceStep * (1 + (Math.random() * 0.2 - 0.1));

              futureData.push({
                year: y,
                prediction: Number(currentFutureValue.toFixed(2)),
                range: [
                  Number((currentFutureValue - accumulatedVariance).toFixed(2)),
                  Number((currentFutureValue + accumulatedVariance).toFixed(2))
                ],
                isPrediction: true
              });
            }
          }
        } catch (error) {
          console.error("Backend connect nahi hua.", error);
        }

        setChartData([...formattedBaseData, ...futureData]);
      }
    });
  // Dependency array mein ab debounced values hongi
  }, [activeCountry, activeMetric, debouncedCo2Reduction, debouncedTempReduction]);

  const exportToCSV = () => {
    if (chartData.length === 0) return;
    const headers = "Year,Historical_Value,AI_Prediction,Prediction_Min,Prediction_Max\n";
    const rows = chartData.map(d => {
      const hist = d.historical || "";
      const pred = d.prediction || "";
      const min = d.range ? d.range[0] : "";
      const max = d.range ? d.range[1] : "";
      return `${d.year},${hist},${pred},${min},${max}`;
    }).join("\n");
    
    const blob = new Blob([headers + rows], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `${activeCountry}_${activeMetric}_AI_Forecast.csv`;
    link.click();
  };

  const exportToPNG = () => {
    if (chartRef.current) {
      html2canvas(chartRef.current, { backgroundColor: '#1e293b' }).then((canvas) => {
        const link = document.createElement("a");
        link.download = `${activeCountry}_${activeMetric}_Chart.png`;
        link.href = canvas.toDataURL("image/png");
        link.click();
      });
    }
  };

  const color = activeMetric === "Temperature" ? "#ef4444" : activeMetric === "Rainfall" ? "#3b82f6" : "#475569";

  return (
    <div className="w-full h-full flex flex-col">
      <div className="mb-4 flex justify-between items-start">
        <div>
          <h3 className="text-xl font-bold text-white">{activeMetric} Trend & Forecast: {activeCountry}</h3>
          <div className="flex items-center space-x-3 mt-1">
            <span className="flex items-center text-xs text-slate-400"><div className="w-3 h-1 bg-red-500 mr-1.5" style={{backgroundColor: color}}></div> Historical</span>
            <span className="flex items-center text-xs text-slate-400"><div className="w-3 h-0.5 border-t border-dashed border-red-500 mr-1.5" style={{borderColor: color}}></div> AI Prediction</span>
          </div>
        </div>
        
        <div className="flex space-x-2">
          <button onClick={exportToCSV} className="text-xs font-semibold bg-slate-700 hover:bg-slate-600 text-slate-200 py-1.5 px-3 rounded-md border border-slate-600 transition-colors shadow-sm">
            Export CSV
          </button>
          <button onClick={exportToPNG} className="text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white py-1.5 px-3 rounded-md border border-blue-500 transition-colors shadow-sm">
            Save PNG
          </button>
        </div>
      </div>

      <div className="w-full h-[350px] p-2" ref={chartRef}>
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={chartData} margin={{ top: 20, right: 20, left: 10, bottom: 20 }}>
            <defs>
              <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={color} stopOpacity={0.4}/>
                <stop offset="95%" stopColor={color} stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" />
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#080d13" />
            
            {/* 👇 NAYI LINE: Ye Timeline slider ke sath chart par ek vertical line banayegi 👇 */}
            <ReferenceLine x={year} stroke="#cbd5e1" strokeWidth={2} strokeDasharray="4 4" label={{ position: 'top', value: year, fill: '#cbd5e1', fontSize: 12, fontWeight: 'bold' }} />
            
            <XAxis dataKey="year" tick={{fill: '#94a3b8', fontSize: 12}} tickLine={false} axisLine={false} tickMargin={10} />
            <XAxis dataKey="year" tick={{fill: '#94a3b8', fontSize: 12}} tickLine={false} axisLine={false} tickMargin={10} />
            <YAxis tick={{fill: '#94a3b8', fontSize: 12}} tickLine={false} axisLine={false} domain={['auto', 'auto']} tickMargin={15} />
            <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderRadius: '8px', border: '1px solid #334155', color: '#f8fafc' }} itemStyle={{ color: '#e2e8f0' }} />
            
            <Area type="monotone" dataKey="historical" stroke={color} fillOpacity={1} fill="url(#colorUv)" strokeWidth={3} />
            <Area type="monotone" dataKey="range" stroke="none" fill={color} fillOpacity={0.15} />
            <Line type="natural" dataKey="prediction" stroke={color} strokeWidth={3} strokeDasharray="6 6" dot={false} activeDot={{ r: 6, fill: color, stroke: '#1e293b', strokeWidth: 2 }} />
            
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Chart;