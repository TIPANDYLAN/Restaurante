import React, { useState, useEffect } from 'react';
import axios from 'axios';

const HistorialFacturas = () => {
  const [facturas, setFacturas] = useState([]);

  useEffect(() => {
    fetchFacturas();
  }, []);

  const fetchFacturas = async () => {
    try {
      const response = await axios.get('http://localhost:4000/api/factura/historial'); // Cambia la URL según tu API
      if (Array.isArray(response.data)) {
        setFacturas(response.data);
      } else {
        console.error('La respuesta no es un array:', response.data);
      }
    } catch (error) {
      console.error('Error al obtener el historial de facturas:', error);
    }
  };

  return (
    <div>
      <h2>Historial de Facturas</h2>
      <table>
        <thead>
          <tr>
            <th>Fecha</th>
            <th>Cliente</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          {facturas.map((factura) => (
            <tr key={factura.ID_FACTURA}>
              <td>{factura.FECHA}</td>
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
