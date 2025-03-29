// Predictor.js
import React, { useState } from "react";
import axios from "axios";

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
    <div className="bg-white p-8 rounded-2xl shadow-lg max-w-md w-full text-center">
      <h1 className="text-2xl font-bold mb-4 text-gray-800">Detector de Fake News</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Título de la noticia"
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg focus:ring focus:ring-blue-300"
        />
        <textarea
          placeholder="Descripción de la noticia"
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg focus:ring focus:ring-blue-300"
          rows="4"
        ></textarea>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition"
          disabled={loading}
        >
          {loading ? "Analizando..." : "Predecir"}
        </button>
      </form>
      {resultado && (
        <div className="mt-4 p-4 rounded-lg bg-gray-100">
          <h2 className="text-lg font-semibold">Resultado:</h2>
          <p className="text-gray-800">Predicción: {resultado.prediction === 0 ? "Fake News" : "Real News"}</p>
          <p className="text-gray-600">Probabilidad: {(resultado.probability * 100).toFixed(2)}%</p>
        </div>
      )}
    </div>
  );
}

export default Predictor;
