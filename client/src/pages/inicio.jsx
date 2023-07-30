import React, { useState, useEffect } from "react";
import axios from "axios";
import { Header } from "../components/header.jsx";
import "../styles/Inicio.css";

const Inicio = () => {
  const [platos, setPlatos] = useState([]);
  const [nombre, setNombre] = useState("");
  const [precio, setPrecio] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [foto, setFoto] = useState(null);

  useEffect(() => {
    // Hacer la solicitud a la API para obtener los platos
    axios.get("http://localhost:4000/api/platos")
      .then((response) => {
        setPlatos(response.data);
      })
      .catch((error) => {
        console.error("Error al obtener los platos:", error);
      });
  }, []);

  const handleAgregarPlato = () => {
    // Crear un objeto FormData para enviar la imagen al servidor
    const formData = new FormData();
    formData.append("Nombre", nombre);
    formData.append("Precio", precio);
    formData.append("Descripcion", descripcion);
    formData.append("Foto", foto);

    // Hacer la solicitud POST a la API para crear un nuevo plato
    axios.post("http://localhost:4000/api/platos", formData)
      .then((response) => {
        console.log("Plato creado exitosamente");
        // Actualizar la lista de platos después de crear uno nuevo
        setPlatos([...platos, response.data]);
      })
      .catch((error) => {
        console.error("Error al crear el plato:", error);
      });
  };

  return (
    <>
      <Header titulo={"Menú de Platillos"} Buscar={true} />
      <div>
        <h2>Platos disponibles:</h2>
        <ul>
          {platos.map((plato) => (
            <li key={plato.ID_PL}>
              <p>Nombre: {plato.NOMBRE_PL}</p>
              <p>Precio: {plato.PRECIO_PL}</p>
              <p>Descripción: {plato.DESCRIPCION_PL}</p>
              <img src={`http://localhost:4000/images/${plato.FOTO_PL}`} alt={plato.NOMBRE_PL} />
            </li>
          ))}
        </ul>
      </div>
      <div>
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
          <button type="button" onClick={handleAgregarPlato}>Agregar Plato</button>
        </form>
      </div>
    </>
  );
};

export default Inicio;
