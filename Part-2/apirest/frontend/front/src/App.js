import React, { useState } from "react";
import Predictor from "./components/Predictor";
import Retrain from "./components/Retrain";

function App() {
  const [view, setView] = useState("predictor");

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <h1 className="text-3xl font-bold mb-4 text-gray-800">Fake News Detector</h1>
      <div className="flex gap-4 mb-6">
        <button 
          className={`px-4 py-2 rounded-lg ${view === "predictor" ? "bg-blue-600 text-white" : "bg-gray-300"}`}
          onClick={() => setView("predictor")}
        >
          Predecir Noticias
        </button>
        <button 
          className={`px-4 py-2 rounded-lg ${view === "reentrenar" ? "bg-green-600 text-white" : "bg-gray-300"}`}
          onClick={() => setView("reentrenar")}
        >
          Reentrenar Modelo
        </button>
      </div>
      
      {view === "predictor" ? <Predictor /> : <Retrain />}
    </div>
  );
}

export default App;
