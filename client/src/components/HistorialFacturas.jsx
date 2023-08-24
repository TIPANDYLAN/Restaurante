import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { format } from 'date-fns';

import "../styles/Caja.css";

const HistorialFacturas = () => {
  const [facturasOriginal, setFacturasOriginal] = useState([]);
  const [facturas, setFacturas] = useState([]);
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');

  useEffect(() => {
    fetchFacturas();
  }, []);

  const handleFilterClick = () => {
    if (!fechaInicio || !fechaFin) {
      setFacturas(facturasOriginal);
      return;
    }

    const fechaInicioObj = new Date(fechaInicio);
    fechaInicioObj.setHours(0, 0, 0, 0);
  
    const fechaFinObj = new Date(fechaFin);
    fechaFinObj.setHours(23, 59, 59, 999);
    fechaFinObj.setDate(fechaFinObj.getDate() + 1);
  
    const facturasFiltradas = facturasOriginal.filter(factura => {
      const fechaFactura = new Date(factura.FECHA);
      return fechaFactura > fechaInicioObj && fechaFactura < fechaFinObj;
    });
  
    setFacturas(facturasFiltradas);
  };

  const handleClearFilterClick = () => {
    setFechaInicio('');
    setFechaFin('');
    setFacturas(facturasOriginal);
  };

  const fetchFacturas = async () => {
    try {
      const response = await axios.get('http://localhost:4000/api/factura/historial');
      if (Array.isArray(response.data)) {
        setFacturasOriginal(response.data);
        setFacturas(response.data);
      } else {
        console.error('La respuesta no es un array:', response.data);
      }
    } catch (error) {
      console.error('Error al obtener el historial de facturas:', error);
    }
  };

  return (
    <div className="historial-container">
      <h2 className="historial-heading">Historial de Facturas</h2>
      <div className="filtro-container">
        <p>Desde: </p>
        <input
          type="date"
          value={fechaInicio}
          max={fechaFin}
          onChange={e => setFechaInicio(e.target.value)}
        />
        <p>Hasta: </p>
        <input
          type="date"
          value={fechaFin}
          min={fechaInicio} // Establece la fecha mínima para evitar fechas anteriores a la de inicio
          onChange={e => setFechaFin(e.target.value)}
        />
        <button onClick={handleFilterClick}>Filtrar</button>
        <button onClick={handleClearFilterClick}>Mostrar Todas</button>
      </div>
      <table className="historial-table">
        <thead>
          <tr>
            <th className="table-header">Fecha</th>
            <th className="table-header">Cliente</th>
            <th className="table-header">Total</th>
          </tr>
        </thead>
        <tbody>
          {facturas.map((factura) => (
            <tr key={factura.ID_FACTURA} className="table-row">
              <td>{format(new Date(factura.FECHA), "dd/MM/yyyy")}</td>
              <td>{factura.NOMBRE_CL}</td>
              <td>${factura.TOTAL}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default HistorialFacturas;
