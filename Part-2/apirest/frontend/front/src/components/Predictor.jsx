import React, { useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

function Predictor() {
  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [resultado, setResultado] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResultado(null);
    try {
      const response = await axios.post("http://localhost:8000/predecir", [
        { titulo, descripcion },
      ]);
      setResultado(response.data[0]);
    } catch (error) {
      console.error("Error en la predicción", error);
    }
    setLoading(false);
  };

  return (
    <div className="container mt-4">
      <div className="card shadow-lg">
        <div className="card-body">
          <h2 className="card-title text-center mb-4">Detector de Fake News</h2>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Título de la noticia"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              className="form-control mb-3"
            />
            <textarea
              placeholder="Descripción de la noticia"
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              className="form-control mb-3"
              rows="4"
            ></textarea>
            <button type="submit" className="btn btn-primary w-100" disabled={loading}>
              {loading ? "Analizando..." : "Predecir"
            }</button>
          </form>

          {resultado && (
            <div className="alert alert-info mt-4">
              <h5>Resultado:</h5>
              <p><strong>Predicción:</strong> {resultado.prediction === 0 ? "Fake News" : "Real News"}</p>
              <p><strong>Probabilidad:</strong> {(resultado.probability * 100).toFixed(2)}%</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Predictor;
