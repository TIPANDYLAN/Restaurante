import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Cocina = () => {
  const [ordenes, setOrdenes] = useState([]);

  useEffect(() => {
    // Obtener las órdenes desde el servidor cuando el componente se monte
    fetchOrdenes();
  }, []);

  const fetchOrdenes = async () => {
    try {
      const response = await axios.get('http://localhost:4000/api/ordenes');
      setOrdenes(response.data);
    } catch (error) {
      console.error('Error al obtener las órdenes:', error);
    }
  };

  const handleEstadoClick = async (idOrden, nuevoEstado) => {
    if (nuevoEstado === 'Cancelado') {
      // Mostrar una confirmación antes de cancelar la orden
      const confirmacion = window.confirm('¿Estás seguro que deseas entregar esta orden?');
      if (!confirmacion) {
        return; // Si el usuario cancela la confirmación, no se cambia el estado
      }
    }

    try {
      await axios.put(`http://localhost:4000/api/ordenes/${idOrden}`, { ESTADO_OR: nuevoEstado });
      // Actualizar las órdenes después de cambiar el estado
      fetchOrdenes();
    } catch (error) {
      console.error('Error al actualizar el estado de la orden:', error);
    }
  };

  return (
    <div className="ordenes-container">
      <h2>Órdenes</h2>
      {ordenes.map((orden) => {
        // Solo mostrar las órdenes que no estén canceladas
        if (orden.ESTADO_OR !== 'Cancelado') {
          return (
            <div key={orden.ID_OR} className="orden-item">
              <p>Orden ID: {orden.ID_OR}</p>
              <p>Fecha: {orden.FECHA_OR}</p>
              <p>Descripción: {orden.DESCRIPCION_OR}</p>
              <p>Estado: {orden.ESTADO_OR}</p>
              {orden.ESTADO_OR === 'En proceso' ? (
                <button className="cancelar-btn" onClick={() => handleEstadoClick(orden.ID_OR, 'Cancelado')}>
                  Marcar como Entregado
                </button>
              ) : (
                <button className="en-proceso-btn" onClick={() => handleEstadoClick(orden.ID_OR, 'En proceso')}>
                  Marcar como en proceso
                </button>
              )}
            </div>
          );
        }
        return null; // Si la orden está cancelada, no se muestra en el interfaz
      })}
    </div>
  );
};

export default Cocina;
