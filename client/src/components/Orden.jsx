import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/Orden.css";

const Orden = () => {
  const [platos, setPlatos] = useState([]);
  const [orden, setOrden] = useState([]);
  const [totalOrden, setTotalOrden] = useState(0);
  const [platosAEliminar, setPlatosAEliminar] = useState(0);
  const [platoIdAEliminar, setPlatoIdAEliminar] = useState(null);

  useEffect(() => {
    axios
      .get("http://localhost:4000/api/platos")
      .then((response) => {
        setPlatos(response.data);
      })
      .catch((error) => {
        console.error("Error al obtener los platos:", error);
      });
  }, []);

  useEffect(() => {
    const total = orden.reduce((acc, plato) => acc + plato.PRECIO_PL * plato.cantidad, 0);
    setTotalOrden(total);
  }, [orden]);

  const handleAgregarPlato = (platoId) => {
    const platoSeleccionado = platos.find((plato) => plato.ID_PL === platoId);
    if (platoSeleccionado) {
      if (orden.some((item) => item.ID_PL === platoId)) {
        setOrden((prevOrden) =>
          prevOrden.map((item) =>
            item.ID_PL === platoId ? { ...item, cantidad: item.cantidad + 1 } : item
          )
        );
      } else {
        setOrden((prevOrden) => [...prevOrden, { ...platoSeleccionado, cantidad: 1 }]);
      }
    }
  };

  const handleEliminarPlato = (platoId) => {
    const platoAEliminar = orden.find((plato) => plato.ID_PL === platoId);
    if (platoAEliminar) {
      if (platoAEliminar.cantidad > 1) {
        setPlatosAEliminar(platoAEliminar.cantidad);
        setPlatoIdAEliminar(platoId);
      } else {
        setOrden((prevOrden) => prevOrden.filter((item) => item.ID_PL !== platoId));
      }
    }
  };

  const confirmarEliminarPlatos = () => {
    setOrden((prevOrden) =>
      prevOrden.map((item) =>
        item.ID_PL === platoIdAEliminar ? { ...item, cantidad: item.cantidad - platosAEliminar } : item
      )
    );
    setPlatosAEliminar(0);
    setPlatoIdAEliminar(null);
  };

  return (
    <>
      <div className="Inicio">
        <div className="platos-container">
          <h2>Platos disponibles</h2>
          <ul>
            {platos.map((plato) => (
              <li key={plato.ID_PL}>
                <img src={`http://localhost:4000/${plato.ID_PL}-kandela.png`} alt={plato.NOMBRE_PL} />
                <div className="recipe-content">
                  <h1 className="recipe-title"> {plato.NOMBRE_PL}</h1>
                  <p  className="recipe-desc" >Precio: {plato.PRECIO_PL} $ </p>
                  <p className="recipe-desc">Descripción: {plato.DESCRIPCION_PL}</p> 
                  <p className="recipe-metadata">
                    <span className="recipe-rating">★★★★<span>☆</span></span>
                    <span className="recipe-votes">(12 votes)</span>
                  </p>
                  <br></br>
                  <br></br>
                  <button  className="recipe-desc" onClick={() => handleAgregarPlato(plato.ID_PL)}>Agregar a la Orden</button>
                  
                </div>
              </li>
            ))}
          </ul>
        </div>
      <div className="orden-container">
        <h2>Orden</h2>
        <br></br>
        <div className="grid-orden">
          {orden.map((plato) => (
            <div key={plato.ID_PL} className="orden-item">
              <p className="recipe-desc2" >{plato.NOMBRE_PL}</p>
              <p className="recipe-desc" >Precio: {plato.PRECIO_PL}</p>
              <p className="recipe-desc" >Cantidad: {plato.cantidad}</p>
              <button className="recipe-desc"  onClick={() => handleEliminarPlato(plato.ID_PL)}>Eliminar</button>
            </div>
          ))}
        </div>
        {orden.length === 0 && <p>No hay platos en la orden</p>}
        {platosAEliminar > 0 && (
          <div className="eliminar-platos">
            <p>
              ¿Cuántos platos de {orden.find((plato) => plato.ID_PL === platoIdAEliminar)?.NOMBRE_PL} deseas
              eliminar?
            </p>
            <input
              type="number"
              min="1"
              max={Math.min(platosAEliminar, 100)}
              value={platosAEliminar}
              onChange={(e) => setPlatosAEliminar(parseInt(e.target.value))}
            />
            <button onClick={confirmarEliminarPlatos}>Confirmar Eliminar</button>
          </div>
        )}
        <div className="total-orden">
          <h3>Total de la Orden: ${totalOrden}</h3>
        </div>
      </div>
    </div >
    </>
  );
};

export default Orden;
