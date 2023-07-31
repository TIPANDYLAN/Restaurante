import React, { useState } from "react";
import Axios from "axios";
import "../styles/Platos/EditarPlatos.css";

const EditarPlato = ({ platoSeleccionado, setPlatoSeleccionado }) => {
  const [nombre, setNombre] = useState(platoSeleccionado.NOMBRE_PL);
  const [precio, setPrecio] = useState(parseFloat(platoSeleccionado.PRECIO_PL));
  const [foto, setFoto] = useState(null);

  const handleCancelarEdicion = () => {
    setPlatoSeleccionado(null);
  };

  const handleActualizarPlato = (idPlato, nombrePlato, precioPlato, fotoPlato) => {
    const formData = new FormData();
    formData.append("ID_PL", idPlato);
    formData.append("Nombre", nombrePlato);
    formData.append("Precio", precioPlato.toString());
    formData.append("Descripcion", platoSeleccionado.DESCRIPCION_PL); // Keep the original description
    formData.append("Foto", fotoPlato);

    Axios.put(`http://localhost:3001/api/platos/${idPlato}`, formData)
      .then((response) => {
        console.log("Plato actualizado con éxito!");
        setPlatoSeleccionado(null);
      })
      .catch((error) => {
        console.error("Error al actualizar el plato:", error);
      });
  };

  const handleActualizar = () => {
    // Validar que los campos no estén vacíos
    if (!nombre.trim() || (typeof precio !== "number" || isNaN(precio))) {
      console.error("El nombre y el precio son campos requeridos");
      return;
    }

    handleActualizarPlato(
      platoSeleccionado.ID_PL,
      nombre,
      precio,
      foto !== null ? foto : platoSeleccionado.FOTO_PL
    );
  };

  return (
    <div className="Editar">
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
  );
};

export default EditarPlato;
