import React, { useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

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
    <div className="container mt-4">
      <div className="card shadow-lg">
        <div className="card-body">
          <h2 className="card-title text-center mb-4">Reentrenar Modelo</h2>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Título"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              className="form-control mb-3"
            />
            <textarea
              placeholder="Descripción"
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              className="form-control mb-3"
            />
            <select
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              className="form-control mb-3"
            >
              <option value="">Selecciona una etiqueta</option>
              <option value="0">Falsa</option>
              <option value="1">Verdadera</option>
            </select>
            <button type="button" className="btn btn-primary w-100 mb-2" onClick={agregarNoticia}>
              Agregar Noticia
            </button>
            <button type="submit" className="btn btn-success w-100" disabled={loading}>
              {loading ? "Reentrenando..." : "Enviar Datos"}
            </button>
          </form>

          <ul className="mt-4 list-group">
            {noticias.map((noticia, index) => (
              <li key={index} className="list-group-item">
                <strong>{noticia.titulo}</strong> - {noticia.label === 1 ? "Verdadera" : "Falsa"}
              </li>
            ))}
          </ul>

          {resultado && (
            <div className="alert alert-info mt-4">
              <h5>Resultado:</h5>
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
      </div>
    </div>
  );
}

export default Retrain;
