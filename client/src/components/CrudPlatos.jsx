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
    if (!nombre.trim() || (typeof precio !== "number" || isNaN(precio)) || !descripcion.trim()) {
      console.error("Todos los campos son requeridos");
      return;
    }
  
    // Crear un objeto FormData solo con los campos que han sido modificados
    const formData = new FormData();
    formData.append("ID_PL", id);
    if (nombre !== platoSeleccionado.NOMBRE_PL) {
      formData.append("Nombre", nombre);
    }
    if (precio !== platoSeleccionado.PRECIO_PL) {
      formData.append("Precio", precio.toString());
    }
    if (descripcion !== platoSeleccionado.DESCRIPCION_PL) {
      formData.append("Descripcion", descripcion);
    }
    if (foto !== null) {
      formData.append("Foto", foto);
    }
  
    // Hacer la solicitud PUT a la API solo si hay cambios
    if (formData.get("Nombre") || formData.get("Precio") || formData.get("Descripcion") || formData.get("Foto")) {
      // Resto del código para la solicitud PUT
    } else {
      console.log("No se han realizado cambios en el plato");
      setPlatoSeleccionado(null);
    }
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
            <img src={`http://localhost:4000/${plato.ID_PL}-kandela.png`} alt={plato.NOMBRE_PL} />
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
            <input type="number" value={precio} onChange={(e) => setPrecio(parseFloat(e.target.value))} />
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
