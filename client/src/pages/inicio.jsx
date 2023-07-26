import React, { useState, useEffect } from "react";
import axios from "axios";
import { Header } from "../components/header.jsx";
import "../styles/Inicio.css";

const Inicio = () => {
  const [platos, setPlatos] = useState([]);

  useEffect(() => {
    // Hacer la solicitud a la API para obtener los platos
    axios.get("http://localhost:4000/api/platos")
      .then((response) => {
        setPlatos(response.data);
      })
      .catch((error) => {
        console.error("Error al obtener los platos:", error);
      });
  }, []); // El arreglo vacío [] como segundo argumento asegura que el efecto solo se ejecute una vez al montar el componente

  return (
    <>
      <Header titulo={"Menú de Platillos"} Buscar={true} />
      <div>
        <h2>Platos disponibles:</h2>
        <ul>
          {platos.map((plato) => (
            <li key={plato.ID}>
              <p>Nombre: {plato.Nombre}</p>
              <p>Precio: {plato.Precio}</p>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};

export default Inicio;
