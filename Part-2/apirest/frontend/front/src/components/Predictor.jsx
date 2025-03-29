import { useState } from "react";
import axios from "axios";

export default function Predictor() {
  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [resultado, setResultado] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResultado(null);

    try {
      const response = await axios.post("http://localhost:8000/predecir", [
        { titulo, descripcion },
      ]);
      setResultado(response.data[0]);
    } catch (err) {
      setError("Error al predecir. Intente de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-4 bg-white shadow-lg rounded-lg">
      <h2 className="text-xl font-bold mb-4">Predicción de Fake News</h2>
      <form onSubmit={handleSubmit}>
        <label className="block mb-2">
          Título:
          <input
            type="text"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </label>
        <label className="block mb-2">
          Descripción:
          <textarea
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            className="w-full p-2 border rounded"
            required
          ></textarea>
        </label>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
          disabled={loading}
        >
          {loading ? "Analizando..." : "Predecir"}
        </button>
      </form>

      {error && <p className="text-red-500 mt-2">{error}</p>}
      {resultado && (
        <div className="mt-4 p-4 border rounded">
          <p className="font-bold">Resultado:</p>
          <p>Predicción: {resultado.prediction === 1 ? "Fake News" : "Real News"}</p>
          <p>Probabilidad: {(resultado.probability * 100).toFixed(2)}%</p>
        </div>
      )}
    </div>
  );
}
