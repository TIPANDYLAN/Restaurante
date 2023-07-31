import React, { useState } from "react";

const Ingredientes = ({ ingredientes, setIngredientes }) => {
  const [nombreIngrediente, setNombreIngrediente] = useState("");
  const [descripcionIngrediente, setDescripcionIngrediente] = useState("");
  const [precioIngrediente, setPrecioIngrediente] = useState("");

  const handleAgregarIngrediente = () => {
    const nuevoIngrediente = {
      ID_I: ingredientes.length + 1,
      NOMBRE_I: nombreIngrediente,
      DESCRIPCION_I: descripcionIngrediente,
      PRECIO_I: parseFloat(precioIngrediente),
    };

    setIngredientes([...ingredientes, nuevoIngrediente]);
    setNombreIngrediente("");
    setDescripcionIngrediente("");
    setPrecioIngrediente("");
  };

  return (
    <div>
      <h3>Agregar Ingrediente:</h3>
      <form>
        <label>Nombre:</label>
        <input
          type="text"
          value={nombreIngrediente}
          onChange={(e) => setNombreIngrediente(e.target.value)}
        />
        <br />
        <label>Descripción:</label>
        <textarea
          value={descripcionIngrediente}
          onChange={(e) => setDescripcionIngrediente(e.target.value)}
        />
        <br />
        <label>Precio:</label>
        <input
          type="number"
          value={precioIngrediente}
          onChange={(e) => setPrecioIngrediente(e.target.value)}
        />
        <br />
        <button type="button" onClick={handleAgregarIngrediente}>
          Agregar Ingrediente
        </button>
      </form>
    </div>
  );
};

export default Ingredientes;
