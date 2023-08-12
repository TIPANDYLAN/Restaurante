import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUtensils } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import "../styles/Cocina.css";

const CocinaCrud = () => {
  const [ordenes, setOrdenes] = useState([]);

  useEffect(() => {
    fetchOrdenes();
  }, []);


  // Función para agrupar los platos por orden
  const groupPlatosByOrden = (ordenes) => {
    const ordenesConPlatos = {};

    ordenes.forEach((orden) => {
      if (!ordenesConPlatos[orden.ID_OR]) {
        ordenesConPlatos[orden.ID_OR] = {
          ...orden,
          platos: []
        };
      }

      if (orden.ID_PLATO_PEDIDO) {
        ordenesConPlatos[orden.ID_OR].platos.push({
          ID_PLATO_PEDIDO: orden.ID_PLATO_PEDIDO,
          NOMBRE_PLATO_PEDIDO: orden.NOMBRE_PLATO_PEDIDO,
          CANTIDAD_PLATOS_PEDIDOS: orden.CANTIDAD_PLATOS_PEDIDOS,
          ESTADO_PLATO: orden.ESTADO_PLATO
        });
      }
    });

    return Object.values(ordenesConPlatos);
  };

  const fetchOrdenes = async () => {
    try {
      const response = await axios.get('http://localhost:4000/api/ordenescocina');
      if (Array.isArray(response.data)) {
        setOrdenes(response.data);
      } else {
        console.error('La respuesta no es un array:', response.data);
      }
    } catch (error) {
      console.error('Error al obtener las órdenes:', error);
    }
  };

  const ordenesConPlatosAgrupados = groupPlatosByOrden(ordenes);

  const ordenesFiltradas = ordenesConPlatosAgrupados.filter(
    (orden) => orden.ESTADO_OR === 'Por hacer' || orden.ESTADO_OR === 'En proceso' || orden.ESTADO_OR === 'Terminado'
  );
  
  const handleEstadoClick = async (idOrden, nuevoEstado) => {
    if (nuevoEstado === 'Entregado') {
      // Mostrar una confirmación antes de cancelar la orden
      const confirmacion = window.confirm('¿Estás seguro que deseas entregar esta orden?');
      if (!confirmacion) {
        return; // Si el usuario cancela la confirmación, no se cambia el estado
      }
    }

    if (nuevoEstado === 'Cancelada') {
      // Mostrar una confirmación antes de cancelar la orden
      const confirmacion = window.confirm('¿Estás seguro que deseas cancelar esta orden?');
      if (!confirmacion) {
        return; // Si el usuario cancela la confirmación, no se cambia el estado
      }
    }

    try {
      await axios.put(`http://localhost:4000/api/ordenesEstado/${idOrden}`, { ESTADO_OR: nuevoEstado });
      // Actualizar las órdenes después de cambiar el estado
      fetchOrdenes();
    } catch (error) {
      console.error('Error al actualizar el estado de la orden:', error);
    }
  };

  return (
    <>
      <h2 style={{marginLeft: "1rem"}}>Órdenes</h2>
      <div className="ContainerCocina">
        {ordenesFiltradas.map((orden) => (
          <div key={orden.ID_OR} className="OrdenCocina">
            <p className='MesaOrden'>Mesa {orden.NMESA_OR}</p>
            <p className='DescripcionPlato'>{orden.DESCRIPCION_OR || 'Vacío'}</p>
            <div className="PlatosContainer"> {/* Nuevo div para contener los platos */}
              {orden.platos.map((plato) => (
                <div key={plato.ID_PLATO_PEDIDO} className='PlatoOrden'>
                  <p className='nombrePlato'>{plato.NOMBRE_PLATO_PEDIDO}</p>
                  <p className='cantidadPlato'>x{plato.CANTIDAD_PLATOS_PEDIDOS}</p>
                  <div className="PlatoActivo" style={{backgroundColor: plato.ESTADO_PLATO==="Por Hacer" ? "red":"rgba(168, 36, 36,0.550)"}}/>
                  <div className="PlatoActivo" style={{backgroundColor: plato.ESTADO_PLATO==="Realizando" ? "rgb(228, 221, 91)":"rgba(188, 183, 83,0.550)"}}/>
                  <div className="PlatoActivo" style={{backgroundColor: plato.ESTADO_PLATO==="Terminado" ? "rgb(228, 221, 91)":"rgba(67, 113, 65,0.550)"}}/>
                  <button>Entregado</button>
                </div>
              ))}
            </div>
            <div className="botonPlato">
            <p style={{color: orden.ESTADO_OR === 'Por hacer' ? 'rgb(168, 37, 37)': orden.ESTADO_OR === 'En proceso' ? 'rgb(241, 175, 52)': 'green'}} className='EstadoOrden'>{orden.ESTADO_OR}</p>
            <button className='CancelarOrden' onClick={() => handleEstadoClick(orden.ID_OR, 'Cancelada')}>Cancelar Orden</button>
            {orden.ESTADO_OR === 'En proceso' ? (
              <button className="cancelar-btn" onClick={() => handleEstadoClick(orden.ID_OR, 'Terminado')}>
                Marcar como Terminado
              </button>
            ) : orden.ESTADO_OR === 'Por hacer' ? (
              <></>
            ) : (<></>)}
            </div>
          </div>
        ))}
      </div>
    </>
  );
};


export default CocinaCrud;
