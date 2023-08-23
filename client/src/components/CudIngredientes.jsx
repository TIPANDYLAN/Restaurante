import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/CrudIngredientes.css"

function CrudIngredientes() {
  const [ingredientes, setIngredientes] = useState([]);
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [precio, setPrecio] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [mostrarFormulario, setMostrarFormulario] = useState(false); // Nuevo estado

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

  const toggleFormulario = () => {
    setMostrarFormulario(!mostrarFormulario);
    resetForm(); // Resetear el formulario cuando se cambie la visibilidad
  };

  return (
    <div>
      <h1>CRUD de Ingredientes</h1>
      <div>
        <h2>Crear/Editar Ingrediente</h2>
        <input
          type="text"
          placeholder="Nombre"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
        />
        <input
          type="text"
          placeholder="Descripción"
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
        />
        <input
          type="text"
          placeholder="Precio"
          value={precio}
          onChange={(e) => setPrecio(e.target.value)}
        />
        {editingId ? (
          <button onClick={actualizarIngrediente}>Actualizar</button>
        ) : (
          <button onClick={crearIngrediente}>Crear</button>
        )}
        <button onClick={resetForm}>Cancelar</button>
      </div>
      <div>
        <h2>Lista de Ingredientes</h2>
        <ul>
          {ingredientes.map((ingrediente) => (
            <li key={ingrediente.ID_I}>
              {ingrediente.NOMBRE_I} - {ingrediente.DESCRIPCION_I} -{" "}
              {ingrediente.PRECIO_I}
              <button onClick={() => editarIngrediente(ingrediente.ID_I)}>
                Editar
              </button>
              <button onClick={() => eliminarIngrediente(ingrediente.ID_I)}>
                Eliminar
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default CrudIngredientes;
