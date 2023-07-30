import React, { useState, useEffect } from "react";
import axios from "axios";

const CrudPlatos = () => {
  const [platos, setPlatos] = useState([]);
  const [platoSeleccionado, setPlatoSeleccionado] = useState(null);
  const [nombre, setNombre] = useState("");
  const [precio, setPrecio] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [foto, setFoto] = useState(null);

  useEffect(() => {
    // Hacer la solicitud a la API para obtener los platos
    axios
      .get("http://localhost:4000/api/platos")
      .then((response) => {
        setPlatos(response.data);
      })
      .catch((error) => {
        console.error("Error al obtener los platos:", error);
      });
  }, []);

  const handleActualizarPlato = (id) => {
    // Validar que los campos no estén vacíos
    if (!nombre || !precio || !descripcion) {
      console.error("Todos los campos son requeridos");
      return;
    }

    // Crear un objeto FormData para enviar los datos actualizados del plato al servidor
    const formData = new FormData();
    formData.append("Nombre", nombre);
    formData.append("Precio", precio);
    formData.append("Descripcion", descripcion);
    formData.append("Foto", foto);

    // Hacer la solicitud PUT a la API para actualizar el plato por su ID
    axios
      .put(`http://localhost:4000/api/platos/${id}`, formData)
      .then(() => {
        console.log("Plato actualizado exitosamente");
        // Actualizar la lista de platos después de la actualización
        setPlatos(platos.map((plato) => (plato.ID_PL === id ? { ...plato, ...formData } : plato)));
        setPlatoSeleccionado(null);
      })
      .catch((error) => {
        console.error("Error al actualizar el plato:", error);
      });
  };

  const handleEditarPlato = (plato) => {
    setPlatoSeleccionado(plato);
    setNombre(plato.NOMBRE_PL);
    setPrecio(plato.PRECIO_PL);
    setDescripcion(plato.DESCRIPCION_PL);
  };

  const handleEliminarPlato = (id) => {
    axios
      .delete(`http://localhost:4000/api/platos/${id}`)
      .then(() => {
        console.log("Plato eliminado exitosamente");
        // Actualizar la lista de platos después de la eliminación
        setPlatos(platos.filter((plato) => plato.ID_PL !== id));
        setPlatoSeleccionado(null);
      })
      .catch((error) => {
        console.error("Error al eliminar el plato:", error);
      });
  };

  return (
    <>
      <h2>Platos disponibles:</h2>
      <ul>
        {platos.map((plato) => (
          <li key={plato.ID_PL}>
            <p>Nombre: {plato.NOMBRE_PL}</p>
            <p>Precio: {plato.PRECIO_PL}</p>
            <p>Descripción: {plato.DESCRIPCION_PL}</p>
            <img src={`http://localhost:4000/uploads/${plato.FOTO_PL}`} alt={plato.NOMBRE_PL} />
            <button onClick={() => handleEditarPlato(plato)}>Editar</button>
            <button onClick={() => handleEliminarPlato(plato.ID_PL)}>Eliminar</button>
          </li>
        ))}
      </ul>

      {platoSeleccionado && (
        <div>
          <h2>Editar plato:</h2>
          <form>
            <label>Nombre:</label>
            <input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} />
            <br />
            <label>Precio:</label>
            <input type="number" value={precio} onChange={(e) => setPrecio(e.target.value)} />
            <br />
            <label>Descripción:</label>
            <textarea value={descripcion} onChange={(e) => setDescripcion(e.target.value)} />
            <br />
            <label>Foto:</label>
            <input type="file" onChange={(e) => setFoto(e.target.files[0])} />
            <br />
            <button type="button" onClick={() => handleActualizarPlato(platoSeleccionado.ID_PL)}>
              Actualizar Plato
            </button>
          </form>
        </div>
      )}
    </>
  );
};

export default CrudPlatos;
