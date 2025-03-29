import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Predictor from "./components/Predictor";
import Retrain from "./components/Retrain";

function App() {
  const [view, setView] = useState("predictor");

  return (
    <div className="container text-center mt-5">
      <h1 className="mb-4 text-primary">Fake News Detector</h1>
      <div className="btn-group mb-4" role="group">
        <button 
          className={`btn ${view === "predictor" ? "btn-primary" : "btn-outline-primary"}`}
          onClick={() => setView("predictor")}
        >
          Predecir Noticias
        </button>
        <button 
          className={`btn ${view === "reentrenar" ? "btn-success" : "btn-outline-success"}`}
          onClick={() => setView("reentrenar")}
        >
          Reentrenar Modelo
        </button>
      </div>
      <div className="card p-4 shadow-lg">
        {view === "predictor" ? <Predictor /> : <Retrain />}
      </div>
    </div>
  );
}

export default App;
