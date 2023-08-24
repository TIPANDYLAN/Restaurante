import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "../styles/Cocina.css";

const CocinaCrud = () => {
  const [ordenes, setOrdenes] = useState([]);

  // Dentro del componente CocinaCrud

  useEffect(() => {
    fetchOrdenes().then(() => {
      revistarEstado();
    });
  }, [ordenes]);

const revistarEstado = ()=>{
  const ordenesConPlatosAgrupados = groupPlatosByOrden(ordenes);
  const ordenesFiltradas = ordenesConPlatosAgrupados.filter(
    (orden) => orden.ESTADO_OR !== 'Cancelada'  && orden.ESTADO_OR !== 'Facturada',
  );

  ordenesFiltradas.forEach((orden) => {
    let nuevoEstadoOrden = "";

    const estadosPlatos = orden.platos.map((plato) => plato.NIVEL_ESTADO);
    if (orden.ESTADO_OR ==='Entregado' && estadosPlatos.every((estado) => estado === 2)){
      nuevoEstadoOrden = "Entregado";
    } else if (estadosPlatos.every((estado) => estado === 2)) {
      nuevoEstadoOrden = "Completado";
    } else if (estadosPlatos.every((estado) => estado === 0)) {
      nuevoEstadoOrden = "Por hacer";
    } else if (estadosPlatos.includes(1) || estadosPlatos.includes(2) || estadosPlatos.includes(0)) {
      nuevoEstadoOrden = "En proceso";
    }

    if(nuevoEstadoOrden !== orden.ESTADO_OR){
    axios.put(`http://localhost:4000/api/ordenesEstado/${orden.ID_OR}`, {
        ESTADO_OR: nuevoEstadoOrden,
      });
        console.log("Pedido Actualizado Correctamente");
      }
  });

}
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
          ESTADO_PLATO: orden.ESTADO_PLATO,
          NIVEL_ESTADO: orden.ESTADO_PLATO === "Por Hacer" ? 0 : orden.ESTADO_PLATO === "Realizando" ? 1 : 2,
          PLATOS_REALIZADOS: orden.PLATOS_REALIZADOS,
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
    (orden) => orden.ESTADO_OR !== 'Cancelada' && orden.ESTADO_OR !== 'Entregado' && orden.ESTADO_OR !== 'Facturada'
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
      // Actualizar solo la orden modificada en el estado local
      setOrdenes(prevOrdenes => prevOrdenes.filter(orden => orden.ID_OR !== idOrden));
    } catch (error) {
      console.error('Error al actualizar el estado de la orden:', error);
    }
  };
  
  const handleStateChange = async (idPlato, idOrden, nuevoEstado) => {
    let nuevoEstadoTexto = "";

    const orden = ordenesConPlatosAgrupados.find((orden) => orden.ID_OR === idOrden);
    const plato = orden.platos.find((plato) => plato.ID_PLATO_PEDIDO === idPlato);
    let nuevoRealizado = 0;


    if (nuevoEstado === 0) {
      nuevoEstadoTexto = "Por Hacer";
      nuevoRealizado = plato.PLATOS_REALIZADOS;
    } else if (nuevoEstado === 1) {
      nuevoEstadoTexto = "Realizando";
      nuevoRealizado = plato.PLATOS_REALIZADOS;
    } else if (nuevoEstado === 2) {
      nuevoEstadoTexto = "Terminado";
      nuevoRealizado = plato.CANTIDAD_PLATOS_PEDIDOS;
    }

    const platosExcluyendoActual = ordenesConPlatosAgrupados
    .find((orden) => orden.ID_OR === idOrden)
    ?.platos.filter((plato) => plato.ID_PLATO_PEDIDO !== idPlato) || [];

  // Obtener los estados de los platos excluyendo el plato actual
  const estadosPlatos = platosExcluyendoActual.map((plato) => plato.NIVEL_ESTADO);
  const estadoPedidoActual = nuevoEstado;

  let estadoOrdenNuevo = "";

  if (estadosPlatos.every((estado) => estado === 2) && nuevoEstado===2) {
    estadoOrdenNuevo = "Completado";
  } else if (estadosPlatos.every((estado) => estado === 0) && nuevoEstado===0) {
    estadoOrdenNuevo = "Por hacer";
  } else if (estadosPlatos.includes(1) || estadosPlatos.includes(2) || estadoPedidoActual === 1 || estadoPedidoActual === 2) {
    estadoOrdenNuevo = "En proceso";
  }

  try {
    // Llamada a la API para actualizar el estado del plato
    await axios.put(`http://localhost:4000/api/pedidosEstado/${idPlato}/${idOrden}`, {
      ESTADO_PE: nuevoEstadoTexto,
      CANTREALIZADA_PE: nuevoRealizado,
    });

    // Llamada a la API para actualizar el estado de la orden
    await axios.put(`http://localhost:4000/api/ordenesEstado/${idOrden}`, {
      ESTADO_OR: estadoOrdenNuevo,
    });
      console.log("Pedido Actualizado Correctamente");
      
      // Actualizar las órdenes después de cambiar el estado
      fetchOrdenes();
      if (estadoOrdenNuevo === "Entregado") {
        setOrdenes(prevOrdenes => prevOrdenes.filter(orden => orden.ID_OR !== idOrden));
      }
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
            <div className="Secciones"><p>Nombre plato</p>
            <p style={{marginLeft:"70px"}}>Total</p>
            <p style={{marginRight:"10px"}}>Terminados</p>
            <p style={{marginRight:"45px"}}>Estado</p></div>
              {orden.platos.map((plato) => (
                <div key={plato.ID_PLATO_PEDIDO} className='PlatoOrden'>
                  <p className='nombrePlato'>{plato.NOMBRE_PLATO_PEDIDO}</p>
                  <p className='cantidadPlato'>x{plato.CANTIDAD_PLATOS_PEDIDOS}</p>
                  <p className='platosRealizados'>{plato.PLATOS_REALIZADOS}</p>
                  <div className="PlatoActivo" style={{backgroundColor: plato.ESTADO_PLATO==="Por Hacer" ? "red":"rgba(168, 36, 36,0.550)"}}/>
                  <div className="PlatoActivo" style={{backgroundColor: plato.ESTADO_PLATO==="Realizando" ? "rgb(255, 235, 54)":"rgba(188, 183, 83,0.550)"}}/>
                  <div className="PlatoActivo" style={{backgroundColor: plato.ESTADO_PLATO==="Terminado" ? "#39a742":"rgba(67, 113, 65,0.550)"}}/>
                  <div className="state-arrows">
                    <button
                      className="state-arrow"
                      disabled={plato.NIVEL_ESTADO === 2}
                      onClick={() => handleStateChange(plato.ID_PLATO_PEDIDO,orden.ID_OR,plato.NIVEL_ESTADO + 1,orden.ESTADO_OR)}
                    >
                      &#8594;
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <div className="botonPlato">
            <p style={{color: orden.ESTADO_OR === 'Por hacer' ? 'rgb(168, 37, 37)': orden.ESTADO_OR === 'En proceso' ? 'rgb(241, 175, 52)': 'green'}} className='EstadoOrden'>{orden.ESTADO_OR}</p>
            <button className='CancelarOrden' onClick={() => handleEstadoClick(orden.ID_OR, 'Cancelada')}>Cancelar Orden</button>
            {orden.ESTADO_OR === 'Completado' ? (
              <button className="cancelar-btn" onClick={() => handleEstadoClick(orden.ID_OR, 'Entregado')}>
                Entregado
              </button> 
            ) :  (<></>)}
            </div>
          </div>
        ))}
      </div>
    </>
  );
};


export default CocinaCrud;
