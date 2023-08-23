import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUtensils } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import "../styles/Caja.css";

import Logo from "../images/Logo.png";

const Caja = () => {
  const [ordenes, setOrdenes] = useState([]);

  useEffect(() => {
    fetchOrdenes();
  }, []);

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
          ESTADO_PLATO: orden.ESTADO_PLATO,
          PRECIO_PE: parseFloat(orden.PRECIO_PE),
          PARA_LLEVAR: orden.PARA_LLEVAR,
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

  const ordenesConPlatosAgrupados = groupPlatosByOrden(ordenes);

  const ordenesFiltradas = ordenesConPlatosAgrupados.filter(
    (orden) => orden.ESTADO_OR === 'Entregado'
  );

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
          <td>$${plato.PRECIO_PE.toFixed(2)}</td>
          <td>$${(plato.PRECIO_PE * plato.CANTIDAD_PLATOS_PEDIDOS).toFixed(2)}</td>
        </tr>
      `);
    });
    facturaWindow.document.write('</table>');
    const totalSinIVA = orden.platos.reduce((sum, plato) => sum + (plato.PRECIO_PE * plato.CANTIDAD_PLATOS_PEDIDOS), 0);
    const iva = totalSinIVA * 0.12;
    const totalConIVA = totalSinIVA + iva;
    facturaWindow.document.write('<p class="text-right">Total (sin IVA): $' + totalSinIVA.toFixed(2) + '</p>');
    facturaWindow.document.write('<p class="text-right">IVA (12%): $' + iva.toFixed(2) + '</p>');
    facturaWindow.document.write('<p class="text-right">Total (con IVA): $' + totalConIVA.toFixed(2) + '</p>');
    facturaWindow.document.write('</body></html>');
    facturaWindow.document.close();
    facturaWindow.print();
  };
  
  return (
    <>
      <h2 style={{ marginLeft: "1rem" }}>Ordenes a facturar</h2>
      <div className="ContainerCocina">
        {ordenesFiltradas.map((orden) => (
          <div key={orden.ID_OR} className="OrdenCocina">
            {/* Mostrar número de orden y cliente */}
            <div className="OrdenInfo">
              <h2>Mesa {orden.NMESA_OR}</h2>
              <p>Número de orden: {orden.ID_OR}</p>
              <p>Cliente: {orden.NOMBRE_CL}</p>
            </div>
            
            {/* Mostrar detalles de la orden y platos */}
            <div className="PlatosContainer">
              <div className="PlatoOrden">
                <p className="nombrePlato">Nombre:</p>
                <p className="cantidadPlato">Aqui</p>
                <p className="domicilio">Llevar</p>
                <p className="precioPlato">Total:</p>
              </div>
              {orden.platos.map((plato) => (
                <div key={plato.ID_PLATO_PEDIDO} className="PlatoOrden">
                  <p className="nombrePlato">{plato.NOMBRE_PLATO_PEDIDO}</p>
                  <p className="cantidadPlato">x{plato.CANTIDAD_PLATOS_PEDIDOS - plato.PARA_LLEVAR}</p>
                  <p className="domicilio">x{plato.PARA_LLEVAR}</p>
                  <p className="precioPlato">${(plato.PRECIO_PE * plato.CANTIDAD_PLATOS_PEDIDOS).toFixed(2)}</p>
                </div>
              ))}
            </div>
            
            {/* Mostrar precio total */}
            <p className="precioTotal">Total: ${orden.platos.reduce((sum, plato) => sum + (plato.PRECIO_PE * plato.CANTIDAD_PLATOS_PEDIDOS), 0).toFixed(2)}</p>
            
            {/* Botón de impresión */}
            <div className="botonFactura">
              <button className="button-fac"onClick={() => printFactura(orden)}>Imprimir Factura</button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default Caja;
