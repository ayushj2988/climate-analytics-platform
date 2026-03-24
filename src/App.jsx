import React from 'react';
import Dashboard from "./pages/Dashboard"; // Ya jahan bhi tumhara Dashboard hai

const App = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 p-4 font-sans text-slate-100">
      <Dashboard />
    </div>
  );
};

export default App;