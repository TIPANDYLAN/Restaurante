import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "../styles/Caja.css";

import Logo from "../images/Logo.png";
import HistorialFacturas from './HistorialFacturas'; // Importa el componente

const Caja = () => {
  const [ordenes, setOrdenes] = useState([]);
  const [descuentosPorOrden, setDescuentosPorOrden] = useState({});
  const [aplicarDescuentoPorOrden, setAplicarDescuentoPorOrden] = useState({});
  const [ordenesFacturadas, setOrdenesFacturadas] = useState([]);

  useEffect(() => {
    fetchOrdenes();
  }, []);

  const cambiarEstadoFacturado = async (ordenId) => {
    try {
      // Lógica para cambiar el estado a "facturado" en la base de datos
      await axios.put(`http://localhost:4000/api/orden/${ordenId}/facturado`);
      setOrdenesFacturadas((prevOrdenesFacturadas) => [...prevOrdenesFacturadas, ordenId]);
    } catch (error) {
      console.error('Error al cambiar el estado a facturado:', error);
    }
  };




  const groupPlatosByOrden = (ordenes) => {
    const ordenesConPlatos = {};

    ordenes.forEach((orden) => {
      if (!ordenesConPlatos[orden.ID_OR]) {
        ordenesConPlatos[orden.ID_OR] = {
          ...orden,
          platos: [],
          descuento: descuentosPorOrden[orden.ID_OR] || 0,
          aplicarDescuento: aplicarDescuentoPorOrden[orden.ID_OR] || false,
        };
      }

      if (orden.ID_PLATO_PEDIDO) {
        ordenesConPlatos[orden.ID_OR].platos.push({
          ID_PLATO_PEDIDO: orden.ID_PLATO_PEDIDO,
          NOMBRE_PLATO_PEDIDO: orden.NOMBRE_PLATO_PEDIDO,
          CANTIDAD_PLATOS_PEDIDOS: orden.CANTIDAD_PLATOS_PEDIDOS,
          ESTADO_PLATO: orden.ESTADO_PLATO,
          PRECIO_PE: parseFloat(orden.PRECIO_PLATOS),
        });
      }
    }); 

    return Object.values(ordenesConPlatos);
  };

  const fetchOrdenes = async () => {
    try {
      const response = await axios.get('http://localhost:4000/api/factura');
      if (Array.isArray(response.data)) {
        setOrdenes(response.data);
      } else {
        console.error('La respuesta no es un array:', response.data);
      }
    } catch (error) {
      console.error('Error al obtener las órdenes:', error);
    }
  };

  const calcularTotal = (orden) => {
    const totalPlatos = orden.platos.reduce(
      (total, plato) => total + parseFloat(plato.PRECIO_PE),
      0
    );    
  
    const descuento = orden.aplicarDescuento ? (orden.descuento / 100) : 0;
    const totalSinDescuento = totalPlatos + (totalPlatos * 0.12); // Total con IVA
    const totalConDescuento = totalSinDescuento - (totalSinDescuento * descuento);
  
    console.log("Calcular total:" ,totalPlatos);
    return parseFloat(totalConDescuento);
  };  


  const crearYGuardarFactura = async (orden) => {
    try {
      const nuevaFactura = {
        CEDULA_CL: orden.CEDULA_CL,
        NOMBRE_CL: orden.NOMBRE_CL,
        CORREO_CL: orden.CORREO_CL,
        TELEFONO_CL: orden.TELEFONO_CL,
        DIRECCION_CL: orden.DIRECCION_CL,
        TOTAL: calcularTotal(orden),
        FECHA: new Date().toISOString().split('T')[0],
      };

      const response = await axios.post('http://localhost:4000/api/factura', nuevaFactura);

      console.log('Factura creada y guardada:', response.data);

      // Marcar la orden como facturada
      setOrdenesFacturadas((prevOrdenesFacturadas) => [...prevOrdenesFacturadas, orden.ID_OR]);
    } catch (error) {
      console.error('Error al crear y guardar la factura:', error);
    }
  };

  const printFactura = (orden) => {
    const facturaWindow = window.open('', '_blank');
    facturaWindow.document.write('<html><head><title>Factura</title>');
    facturaWindow.document.write('<style>');
    facturaWindow.document.write(`
    body {
      font-family: Arial, sans-serif;
      padding: 20px;
    }
    h2 {
      color: #333;
    }
    p {
      margin: 5px 0;
    }
    table {
      border-collapse: collapse;
      width: 100%;
      margin-top: 10px;
    }
    th, td {
      border: 1px solid #ddd;
      padding: 8px;
      text-align: left;
    }
    th {
      background-color: #f2f2f2;
    }
    .text-right {
      text-align: right;
    }
    img{
      width: auto;
      height: 120px;
      position:absolute;
      right:0;
    }
  `);
    facturaWindow.document.write('</style></head><body>');

    // Contenido de la factura
    facturaWindow.document.write(`<img src="${Logo}" alt="Sin Logo">`);
    facturaWindow.document.write('<h2>Factura</h2>');
    facturaWindow.document.write(`<p>Número de orden: ${orden.ID_OR}</p>`);
    facturaWindow.document.write(`<p>Cliente: ${orden.NOMBRE_CL}</p>`);
    facturaWindow.document.write(`<p>Cédula: ${orden.CEDULA_CL}</p>`);
    facturaWindow.document.write(`<p>Correo: ${orden.CORREO_CL}</p>`);
    facturaWindow.document.write(`<p>Teléfono: ${orden.TELEFONO_CL}</p>`);
    facturaWindow.document.write(`<p>Dirección: ${orden.DIRECCION_CL}</p>`);
    facturaWindow.document.write(`<p>Mesa ${orden.NMESA_OR}</p>`);
    facturaWindow.document.write('<h3>Detalles de la orden y platos</h3>');
    facturaWindow.document.write('<table>');
    facturaWindow.document.write('<tr><th>Plato</th><th>Cantidad</th><th>Precio Unitario</th><th>Total</th></tr>');
    orden.platos.forEach((plato) => {
      facturaWindow.document.write(`
        <tr>
          <td>${plato.NOMBRE_PLATO_PEDIDO}</td>
          <td>${plato.CANTIDAD_PLATOS_PEDIDOS}</td>
          <td>$${parseFloat(plato.PRECIO_PE)}</td>
          <td>$${parseFloat(plato.PRECIO_PE)}</td>
        </tr>
      `);
    });
    facturaWindow.document.write('</table>');
    const totalSinIVA = orden.platos.reduce((sum, plato) => sum + parseFloat(plato.PRECIO_PE), 0.00);
    const iva = parseFloat(totalSinIVA * 0.12);
    const totalConIVA = parseFloat(totalSinIVA + iva).toFixed(2);
    const descuentoAmount = parseFloat(orden.aplicarDescuento ? totalConIVA * (orden.descuento / 100) : 0).toFixed(2);
    facturaWindow.document.write('<p class="text-right">Total (sin IVA): $' + parseFloat(totalSinIVA).toFixed(2) + '</p>');
    facturaWindow.document.write('<p class="text-right">IVA (12%): $' + iva + '</p>');
    facturaWindow.document.write('<p class="text-right">Descuento: $' + descuentoAmount + '</p>');
    facturaWindow.document.write('<p class="text-right">Total (con IVA): $' + parseFloat(totalConIVA - descuentoAmount).toFixed(2) + '</p>');
    facturaWindow.document.write('</body></html>');
    facturaWindow.document.close();
    facturaWindow.print();
  };

  const handleDescuentoChange = (ordenId, newDescuento) => {
    setDescuentosPorOrden((prevDescuentos) => ({
      ...prevDescuentos,
      [ordenId]: newDescuento,
    }));
  };

  const handleAplicarDescuentoChange = (ordenId) => {
    setAplicarDescuentoPorOrden((prevAplicarDescuento) => ({
      ...prevAplicarDescuento,
      [ordenId]: !prevAplicarDescuento[ordenId],
    }));
  };

  const ordenesConPlatosAgrupados = groupPlatosByOrden(ordenes);

  const ordenesFiltradas = ordenesConPlatosAgrupados.filter(
    (orden) => orden.ESTADO_OR === 'Entregado' && !ordenesFacturadas.includes(orden.ID_OR)
  );

  return (
    <>
      <h2 style={{ marginLeft: "1rem" }}>Ordenes a facturar</h2>
      <div className="ContainerCocina">
        {ordenesFiltradas.map((orden) => (
          <div key={orden.ID_OR} className="OrdenCocina">
            <div className="OrdenInfo">
              <h2>Mesa {orden.NMESA_OR}</h2>
              <p>Número de orden: {orden.ID_OR}</p>
              <p>Cliente: {orden.NOMBRE_CL}</p>
            </div>
            <div className="PlatosContainer">
              {orden.platos.map((plato) => (
                <div key={plato.ID_PLATO_PEDIDO} className="PlatoOrden">
                  <p className="nombrePlato">{plato.NOMBRE_PLATO_PEDIDO}</p>
                  <p className="cantidadPlato">x{plato.CANTIDAD_PLATOS_PEDIDOS}</p>
                  <p className="precioPlato">${parseFloat(plato.PRECIO_PE).toFixed(2)}</p>
                </div>
              ))}
            </div>
            <div className="descuentoContainer">
              <label htmlFor={`descuento_${orden.ID_OR}`}>Descuento (%)</label>
              <input
                type="number"
                id={`descuento_${orden.ID_OR}`}
                name={`descuento_${orden.ID_OR}`}
                value={descuentosPorOrden[orden.ID_OR] || ""}
                onChange={(event) => handleDescuentoChange(orden.ID_OR, parseFloat(event.target.value))}
                disabled={!orden.aplicarDescuento}
              />
            </div>
            <label>
              <input
                type="checkbox"
                checked={orden.aplicarDescuento}
                onChange={() => handleAplicarDescuentoChange(orden.ID_OR)}
              />
              Aplicar descuento
            </label>
            <p className="precioTotal">
              Total: ${((1 - (descuentosPorOrden[orden.ID_OR] || 0) / 100) * orden.platos.reduce((sum, plato) => sum + parseFloat(plato.PRECIO_PE), 0)).toFixed(2)}
            </p>
            <div className="botonFactura">
              <button className="button-fac" onClick={() => printFactura(orden)}>
                Imprimir Factura
              </button>
              {!ordenesFacturadas.includes(orden.ID_OR) && (
                <button className="button-fac" onClick={() => {cambiarEstadoFacturado(orden.ID_OR); crearYGuardarFactura(orden)}}>
                  Finalizar
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
      <HistorialFacturas/>
    </>
  );
};

export default Caja;
