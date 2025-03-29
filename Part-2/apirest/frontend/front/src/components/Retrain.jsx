import React, { useState } from "react";
import axios from "axios";

function Retrain() {
  const [noticias, setNoticias] = useState([]);
  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [label, setLabel] = useState("");
  const [resultado, setResultado] = useState(null);
  const [loading, setLoading] = useState(false);

  const agregarNoticia = () => {
    if (titulo && descripcion && label !== "") {
      setNoticias([...noticias, { titulo, descripcion, label: parseInt(label) }]);
      setTitulo("");
      setDescripcion("");
      setLabel("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (noticias.length === 0) return;
    setLoading(true);
    setResultado(null);

    try {
      const response = await axios.post("http://127.0.0.1:8000/reentrenar", noticias);
      setResultado(response.data);
    } catch (error) {
      console.error("Error al reentrenar el modelo", error);
      setResultado({ msg: "Error al reentrenar el modelo" });
    }
    
    setLoading(false);
  };

  return (
    <div className="bg-white shadow-lg p-6 rounded-lg w-full max-w-md">
      <h2 className="text-xl font-semibold mb-4 text-gray-700">Reentrenar Modelo</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="text"
          placeholder="Título"
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
          className="p-2 border rounded-lg"
        />
        <textarea
          placeholder="Descripción"
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
          className="p-2 border rounded-lg"
        />
        <select
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          className="p-2 border rounded-lg"
        >
          <option value="">Selecciona una etiqueta</option>
          <option value="0">Falsa</option>
          <option value="1">Verdadera</option>
        </select>
        <button
          type="button"
          className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700"
          onClick={agregarNoticia}
        >
          Agregar Noticia
        </button>
        <button
          type="submit"
          className="bg-green-600 text-white p-2 rounded-lg hover:bg-green-700"
          disabled={loading}
        >
          {loading ? "Reentrenando..." : "Enviar Datos"}
        </button>
      </form>
      <ul className="mt-4 list-disc pl-5">
        {noticias.map((noticia, index) => (
          <li key={index} className="text-sm">
            <strong>{noticia.titulo}</strong> - {noticia.label === 1 ? "Verdadera" : "Falsa"}
          </li>
        ))}
      </ul>
      {resultado && (
        <div className="mt-4 p-4 bg-gray-200 rounded-lg">
          <h3 className="text-lg font-semibold">Resultado:</h3>
          <p><strong>Mensaje:</strong> {resultado.msg}</p>
          {resultado.precision && (
            <>
              <p><strong>Precisión:</strong> {resultado.precision}</p>
              <p><strong>Recall:</strong> {resultado.recall}</p>
              <p><strong>F1 Score:</strong> {resultado.f1_score}</p>
              <p><strong>Muestras usadas:</strong> {resultado.samples_used}</p>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default Retrain;
