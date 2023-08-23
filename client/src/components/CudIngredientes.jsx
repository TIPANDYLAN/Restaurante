import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/CrudIngredientes.css"

function CrudIngredientes() {
  const [ingredientes, setIngredientes] = useState([]);
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [precio, setPrecio] = useState("");
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchIngredientes();
  }, []);

  const fetchIngredientes = async () => {
    try {
      const response = await axios.get("http://localhost:4000/ingredientes");
      setIngredientes(response.data);
    } catch (error) {
      console.error("Error al obtener ingredientes:", error);
    }
  };

  const crearIngrediente = async () => {
    try {
      await axios.post("http://localhost:4000/ingredientes", {
        nombre,
        descripcion,
        precio,
      });
      fetchIngredientes();
      resetForm();
    } catch (error) {
      console.error("Error al crear ingrediente:", error);
    }
  };

  const editarIngrediente = (id) => {
    const ingrediente = ingredientes.find((ing) => ing.ID_I === id);
    setEditingId(id);
    setNombre(ingrediente.NOMBRE_I);
    setDescripcion(ingrediente.DESCRIPCION_I);
    setPrecio(ingrediente.PRECIO_I);
  };

  const actualizarIngrediente = async () => {
    try {
      await axios.put(`http://localhost:4000/ingredientes/${editingId}`, {
        nombre,
        descripcion,
        precio,
      });
      fetchIngredientes();
      resetForm();
      setEditingId(null);
    } catch (error) {
      console.error("Error al actualizar ingrediente:", error);
    }
  };

  const eliminarIngrediente = async (id) => {
    try {
      await axios.delete(`http://localhost:4000/ingredientes/${id}`);
      fetchIngredientes();
    } catch (error) {
      console.error("Error al eliminar ingrediente:", error);
    }
  };

  const resetForm = () => {
    setNombre("");
    setDescripcion("");
    setPrecio("");
    setEditingId(null);
  };

  return (
    <div>
      <h1>INGREDIENTES</h1>
      <div>
        <h2>Agregar | Editar</h2>
        <input
          className="input-field"
          type="text"
          placeholder="Nombre"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
        />
        <input
          className="input-field"
          type="text"
          placeholder="Descripción"
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
        />
        <input
          className="input-field"
          type="text"
          placeholder="Precio"
          value={precio}
          onChange={(e) => setPrecio(e.target.value)}
        />
        {editingId ? (
          <button className="AgregarPlatoI"  onClick={actualizarIngrediente}>Actualizar</button>
        ) : (
          <button className="AgregarPlatoI" onClick={crearIngrediente}>Crear</button>
        )}
        <button className="EliminarPlato" onClick={resetForm}>Cancelar</button>
      </div>
      <div>
      <h2>Lista de Ingredientes</h2>
  <ul>
    {ingredientes.map((ingrediente) => (
      <li key={ingrediente.ID_I} className="ingredient-item">
        <div className="ingredient-details">
          <div className="ingredient-column">
            <span className="ingredient-name">Nombre: {ingrediente.NOMBRE_I}</span>
          </div>
          <div className="ingredient-column">
            <span className="ingredient-description"> Descripcion: {ingrediente.DESCRIPCION_I}</span>
          </div>
          <div className="ingredient-column">
            <span className="ingredient-price">Precio: ${ingrediente.PRECIO_I}</span>
          </div>
          <div className="ingredient-buttons">
            <button className="AgregarPlatoI" onClick={() => editarIngrediente(ingrediente.ID_I)}>
              Editar
            </button>
            <button className="EliminarPlato" onClick={() => eliminarIngrediente(ingrediente.ID_I)}>
              Eliminar
            </button>
          </div>
        </div>
      </li>
    ))}
  </ul>
      </div>
    </div>
  );
}

export default CrudIngredientes;
