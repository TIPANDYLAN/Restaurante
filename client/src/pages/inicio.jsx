import { Header } from "../components/header.jsx";
import React, { useState, useEffect } from "react";
import  CrudPlatos  from "../components/CrudPlatos.jsx";
import "../styles/Inicio.css";
import axios from "axios";

const Inicio = () => {
  const [platos, setPlatos] = useState([]);

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

  return (
    <>
      <Header titulo={"Menú de Platillos"} Buscar={true} />
      <div className="grid-container">
        <div className="platos-container">
          <CrudPlatos />
          <h2>Platos disponibles:</h2>
          
          <ul>
            {platos.map((plato) => (
              <li key={plato.ID_PL}>
                <p>Nombre: {plato.NOMBRE_PL}</p>
                <p>Precio: {plato.PRECIO_PL}</p>
                <p>Descripción: {plato.DESCRIPCION_PL}</p>
                <img src={`http://localhost:4000/uploads/${plato.FOTO_PL}`} alt={plato.NOMBRE_PL} />
              </li>
            ))}
          </ul>
        </div>
        <div className="order-container">
          <h2>Orden</h2>
          <p>No hay orden</p>
        </div>
      </div>
    </>
  );
};

export default Inicio;
