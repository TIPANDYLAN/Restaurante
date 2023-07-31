import React, { useState, useEffect } from "react";
import axios from "axios";
import Modal from "./Modal";
import "../styles/Platos/CrudPlatos.css";

const CrudPlatos = () => {
  const [platos, setPlatos] = useState([]);
  const [platoSeleccionado, setPlatoSeleccionado] = useState(null);
  const [nombre, setNombre] = useState("");
  const [precio, setPrecio] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [foto, setFoto] = useState(null);

  const [mostrar, setMostrar] = useState(false);

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
    formData.append("Nombre", nombre);
    formData.append("Precio", precio.toString());
    formData.append("Descripcion", descripcion);
    formData.append("Foto", foto);
  
    // Hacer la solicitud PUT a la API solo si hay cambios
    if (
      nombre !== platoSeleccionado.NOMBRE_PL ||
      precio !== platoSeleccionado.PRECIO_PL ||
      descripcion !== platoSeleccionado.DESCRIPCION_PL ||
      foto !== null
    ) {
      axios
        .put(`http://localhost:4000/api/platos/${id}`, formData)
        .then((response) => {
          console.log("Plato actualizado exitosamente");
          // Resto del código para actualizar los platos
        })
        .catch((error) => {
          console.error("Error al actualizar el plato:", error);
        });
    } else {
      console.log("No se han realizado cambios en el plato");
      setPlatoSeleccionado(null);
      setMostrar(false);
    }
  };
  

  const handleAgregarPlato = () => {
    // Crear un objeto FormData para enviar la imagen al servidor
    const formData = new FormData();
    formData.append("Nombre", nombre);
    formData.append("Precio", precio);
    formData.append("Descripcion", descripcion);
    formData.append("Foto", foto);

    // Hacer la solicitud POST a la API para crear un nuevo plato
    axios
      .post("http://localhost:4000/api/platos", formData)
      .then((response) => {

        console.log("Plato creado exitosamente");
        // Actualizar la lista de platos después de crear uno nuevo
        setPlatos([...platos, response.data]);
      })
      .catch((error) => {
        console.error("Error al crear el plato:", error);
      });
  };

  const handleEditarPlato = (plato) => {
    setPlatoSeleccionado(plato);
    setNombre(plato.NOMBRE_PL);
    setPrecio(plato.PRECIO_PL);
    setDescripcion(plato.DESCRIPCION_PL);
    setFoto(null); // Clear the image selection when editing
    setMostrar(true);
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
    <div className="Crud">
      <h2>Platos disponibles:</h2>
      <ul>
        <div className="Platos">
        {platos.map((plato) => (
          <li key={plato.ID_PL} className="Plato">
            <p className="NombrePlato">{plato.NOMBRE_PL}</p>
            <p>Precio: {plato.PRECIO_PL}</p>
            <p>Descripción: {plato.DESCRIPCION_PL}</p>
            <img src={`http://localhost:4000/${plato.ID_PL}-kandela.png`} alt={plato.NOMBRE_PL} />
            <button onClick={() => handleEditarPlato(plato)}>Editar</button>
            <button onClick={() => handleEliminarPlato(plato.ID_PL)}>Eliminar</button>
          </li>
        ))}
        </div>
      </ul>
      <h2>Agregar nuevo plato:</h2>
      
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
        <button type="button" onClick={handleAgregarPlato}>
          Agregar Plato
        </button>
      </form>
      {platos.length === 0 && <p>No hay platos disponibles.</p>}

      <Modal isOpen={mostrar} onClose={() => setMostrar(false)}>
        {platoSeleccionado && (
          <div className="Editar">
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
      </Modal>
    </div>
  );
};

export default CrudPlatos;
