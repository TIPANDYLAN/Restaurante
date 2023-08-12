import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/Orden.css";
import Modal from "./Modal";

import Lupa from "../images/search-icon.png";

const Orden = () => {
  const [platos, setPlatos] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [orden, setOrden] = useState([]);
  const [totalOrden, setTotalOrden] = useState(0);
  const [platosAEliminar, setPlatosAEliminar] = useState(0);
  const [platoIdAEliminar, setPlatoIdAEliminar] = useState(null);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [clienteData, setClienteData] = useState({
    CEDULA_CLI: "",
    NOMBRE_CLI: "",
    DIRECCION_CLI: "",
    TELEFONO_CLI: "",
    CORREO_CLI: "",
    PERSONALIZA: true,
  });
  const [clienteSubido, setCLienteSubido] = useState(false);
  const [OpcionCliente, setOpcionCliente] = useState(false);
  const [generarOrden, setGenerarOrden] = useState(false);
  const [ordenes, setOrdenes] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [IDordenActual, setIDOrdenActual] = useState(0);
  const [platoAgregado, setPlatoAgregado] = useState(false);



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
    axios
      .get("http://localhost:4000/api/clientes")
      .then((response) => {
        setClientes(response.data);
        console.log("Datos de clientes:", response.data);
      })
      .catch((error) => {
        console.error("Error al obtener los clientes:", error);
      });
  }, []);

  useEffect(() => {
    axios
      .get("http://localhost:4000/api/ordenes")
      .then((response) => {
        setOrdenes(response.data);
        console.log("Datos de ordenes:", response.data);
      })
      .catch((error) => {
        console.error("Error al obtener las ordenes:", error);
      });
  }, []);

  useEffect(() => {
    setTotalOrden((prevTotal) => {
      const total = orden.reduce((acc, plato) => acc + plato.PRECIO_PL * plato.cantidad, 0);
      return total;
    });
  }, [orden]);


  const actualizarCedulaOrden = (cedulaCliente) => {
    setOrden((prevOrden) =>
      prevOrden.map((plato) => ({
        ...plato,
        CEDULA_CL: cedulaCliente,
      }))
    );
  };

  const handleAgregarPlato = (platoId) => {
    const platoSeleccionado = platos.find((plato) => plato.ID_PL === platoId);
    if (platoSeleccionado) {
      setPlatoAgregado(true); // Marcar que se ha agregado al menos un plato

      // Verificar si el plato ya está en la orden
      const platoEnOrden = orden.find((item) => item.ID_PL === platoId);

      if (platoEnOrden) {
        setOrden((prevOrden) =>
          prevOrden.map((item) =>
            item.ID_PL === platoId
              ? { ...item, cantidad: item.cantidad + 1, total: (item.cantidad + 1) * item.PRECIO_PL }
              : item
          )
        );
      } else {
        setOrden((prevOrden) => [
          ...prevOrden,
          { ...platoSeleccionado, cantidad: 1, total: platoSeleccionado.PRECIO_PL },
        ]);
      }
    }
  };


  const handleEliminarPlato = (platoId) => {
    const platoAEliminar = orden.find((plato) => plato.ID_PL === platoId);
    if (platoAEliminar) {
      if (platoAEliminar.cantidad > 1) {
        setOrden((prevOrden) =>
          prevOrden.map((item) =>
            item.ID_PL === platoId ? { ...item, cantidad: item.cantidad - 1, total: (item.cantidad - 1) * item.PRECIO_PL } : item
          )
        );
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

  useEffect(() => {
    if (orden.length > 0) {
      setOrden((prevOrden) => prevOrden.filter((item) => item.cantidad > 0));
    }
  }, [orden]);

  // Función para manejar el cambio de inputs del formulario de cliente
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // Validar que el valor ingresado sea un número
    if (name === "CEDULA_CLI" && isNaN(value)) {
      return;
    }

    setSearchQuery(value);
    setClienteData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const filteredClients = clientes.filter((cliente) =>
    cliente.CEDULA_CL.toString().includes(searchQuery) || cliente.NOMBRE_CL === "CONSUMIDOR FINAL"
  );


  // Función para manejar el cambio del checkbox del formulario de cliente
  const handleCheckboxChange = (e) => {
    const { checked } = e.target;

    if (clienteData.PERSONALIZA && !checked) {
      localStorage.setItem("clienteData", JSON.stringify(clienteData));
    }

    // If unchecked, reset the values to their defaults
    if (!checked) {
      setClienteData({
        CEDULA_CLI: "",
        NOMBRE_CLI: "",
        DIRECCION_CLI: "",
        TELEFONO_CLI: "",
        CORREO_CLI: "",
        PERSONALIZA: checked,
      });
    } else {
      const storedClienteData = localStorage.getItem("clienteData");
      if (storedClienteData) {
        setClienteData(JSON.parse(storedClienteData));
      } else {
        setClienteData((prevData) => ({
          CEDULA_CLI: "",
          NOMBRE_CLI: "",
          DIRECCION_CLI: "",
          TELEFONO_CLI: "",
          CORREO_CLI: "",
          PERSONALIZA: checked,
        }));
      }
    }
  };


  // useEffect para actualizar los valores al desactivar el checkbox
  useEffect(() => {
    if (!clienteData.PERSONALIZA) {
      setClienteData((prevData) => ({
        ...prevData,
        CEDULA_CLI: "9999999999",
        NOMBRE_CLI: "CONSUMIDOR FINAL",
        DIRECCION_CLI: "",
        CORREO_CLI: "",
        TELEFONO_CLI: "",
      }));
    }
  }, [clienteData.PERSONALIZA]);

  const handleSeleccionarCliente = (cliente) => {
    setClienteData({
      CEDULA_CLI: cliente.CEDULA_CL,
      NOMBRE_CLI: cliente.NOMBRE_CL,
      DIRECCION_CLI: cliente.DIRECCION_CL,
      TELEFONO_CLI: cliente.TELEFONO_CL,
      CORREO_CLI: cliente.CORREO_CL,
      PERSONALIZA: true,
    });
    setMostrarModal(false); // Cerrar el modal después de seleccionar el cliente
    setCLienteSubido(true); // Marcar que se ha seleccionado un cliente

    // Actualizar la cédula en la orden actual
    actualizarCedulaOrden(cliente.CEDULA_CL);
  };


  const verificarCedulaExistente = (cedula) => {
    // Realizar la solicitud para obtener los datos del cliente por su cédula
    return axios
      .get(`http://localhost:4000/api/clientes/${cedula}`)
      .then((response) => response.data)
      .catch((error) => {
        console.error("Error al obtener los datos del cliente:", error);
        return null;
      });
  };

  const handleAgregarCliente = async (event) => {
    event.preventDefault(); // Evitar comportamiento por defecto del formulario

    const confirmation = window.confirm("¿Desea agregar el cliente?");
    if (!confirmation) {
      return;
    }

    try {
      const existingClientData = await verificarCedulaExistente(clienteData.CEDULA_CLI);
      const dataToSend = {
        CEDULA_CLI: clienteData.CEDULA_CLI,
        NOMBRE_CLI: clienteData.NOMBRE_CLI,
        DIRECCION_CLI: clienteData.DIRECCION_CLI,
        TELEFONO_CLI: clienteData.TELEFONO_CLI,
        CORREO_CLI: clienteData.CORREO_CLI,
        PERSONALIZA: clienteData.PERSONALIZA,
      };
      console.log(dataToSend)
      if (existingClientData) {
        dataToSend.NOMBRE_CLI = dataToSend.NOMBRE_CLI || existingClientData.NOMBRE_CLI;
        dataToSend.DIRECCION_CLI = dataToSend.DIRECCION_CLI || existingClientData.DIRECCION_CLI;
        dataToSend.TELEFONO_CLI = dataToSend.TELEFONO_CLI || existingClientData.TELEFONO_CLI;
        dataToSend.CORREO_CLI = dataToSend.CORREO_CLI || existingClientData.CORREO_CLI;
      }
      console.log(dataToSend)
      await axios.post("http://localhost:4000/api/clientes", dataToSend);

      setMostrarModal(false);
      setCLienteSubido(true);
      actualizarCedulaOrden(clienteData.CEDULA_CLI);
    } catch (error) {
      console.error("Error al agregar el cliente:", error);
      alert("Hubo un error al agregar el cliente");
      setCLienteSubido(false);
    }
  };

  const verificarClienteConsumidorFinal = async () => {
    try {
      const existingClientData = await verificarCedulaExistente("9999999999");
      if (!existingClientData) {
        // Si no existe el cliente, agrégalo
        await axios.post("http://localhost:4000/api/clientes", {
          CEDULA_CLI: "9999999999",
          NOMBRE_CLI: "CONSUMIDOR FINAL",
          DIRECCION_CLI: "",
          TELEFONO_CLI: "",
          CORREO_CLI: "",
          PERSONALIZA: true,
        });
      }
    } catch (error) {
      console.error("Error al verificar el cliente 'CONSUMIDOR FINAL':", error);
    }
  };

  useEffect(() => {
    verificarClienteConsumidorFinal();
  }, []);

  const handleCrearOrden = () => {
    // Crear una nueva orden con el estado activo y la fecha actual
    axios
      .post("http://localhost:4000/api/ordenes", {
        ESTADO_OR: "Por Hacer",
        FECHA_OR: new Date().toISOString().slice(0, 10), // Fecha actual en formato 'YYYY-MM-DD'
      })
      .then((response) => {
        // Actualizar el estado con la nueva orden creada
        const orderId = response.data.ID_OR;
        setIDOrdenActual(orderId);
        setGenerarOrden(true);
        setOrden((prevOrden) => []);
        setClienteData((prevData) => ({
          CEDULA_CLI: "",
          NOMBRE_CLI: "",
          DIRECCION_CLI: "",
          TELEFONO_CLI: "",
          CORREO_CLI: "",
          PERSONALIZA: true,
        }));
        setCLienteSubido(false);

        // Guardar el ID de la nueva orden para utilizarlo luego
        // Puedes usar este ID para realizar operaciones adicionales relacionadas con esta orden
        // Por ejemplo, agregar los platos seleccionados a esta orden en una tabla de detalles de orden.
        console.log("ID de la nueva orden creada:", orderId);
      })
      .catch((error) => {
        console.error("Error al crear la orden:", error);
      });
  };


  const enviarPedidos = () => {
    // Iterate through each plato in the orden and send the pedido data to the server
    orden.forEach((pedido) => {
      const dataToSend = {
        ID_OR: IDordenActual,
        ID_PL: pedido.ID_PL,
        PRECIO_PE: pedido.total,
        CANTXPLA_PE: pedido.cantidad,
        ESTADO_PE: "Por Hacer",
      };

      // Send the pedido data for this plato to the server
      axios
        .post("http://localhost:4000/api/pedidos", dataToSend)
        .then((response) => {
          console.log("Pedido subido con éxito!!!");
          console.log(response);
        })
        .catch((error) => {
          console.error("Error al agregar el pedido:", error);
        });
    });

    const Mesa = document.getElementById("Mesa");
    const NumMesa = parseInt(Mesa.value) || null;
    const Observaciones = document.getElementById("Observaciones");
    const Observacion = Observaciones.value;
    let CedulaCliente = clienteData.CEDULA_CLI;

    if (CedulaCliente === "") {
      CedulaCliente = "9999999999"
    }

    const dataToUpdate = {
      CEDULA_CL: CedulaCliente,
      NMESA_OR: NumMesa,
      DESCRIPCION_OR: Observacion,
      ESTADO_OR: "Por hacer",
    };

    axios
      .put(`http://localhost:4000/api/ordenes/${IDordenActual}`, dataToUpdate)
      .then((response) => {
        console.log("Datos de la orden actualizados con éxito!!!");
        console.log(response);
        limpiarOrden();
      })
      .catch((error) => {
        console.error("Error al actualizar los datos de la orden:", error);
      });
  };

  const CancelarOrden = () => {
    const dataToUpdate = {
      ID_OR: IDordenActual,
      ESTADO_OR: "Cancelada",
    };

    axios
      .put(`http://localhost:4000/api/ordenes/${IDordenActual}`, dataToUpdate)
      .then((response) => {
        console.log("Datos de la orden actualizados con éxito!!!");
        console.log(response);
      })
      .catch((error) => {
        console.error("Error al actualizar los datos de la orden:", error);
      });

  }

  const limpiarOrden = () => {
    setGenerarOrden(false);
    setOrden([]);
    setClienteData({
      CEDULA_CLI: "",
      NOMBRE_CLI: "",
      DIRECCION_CLI: "",
      TELEFONO_CLI: "",
      CORREO_CLI: "",
      PERSONALIZA: true,
    });
    setCLienteSubido(false);
    setPlatosAEliminar(0);
    setPlatoIdAEliminar(null);
    setSearchQuery("");
    setIDOrdenActual(0);
  };

  // Dentro de tu componente, antes del return
  const platosHabilitados = platos.filter((plato) => plato.ESTADO_PL === 1);

  const platosPorCategoria = {};

  platosHabilitados.forEach((plato) => {
    const categoria = plato.CATEGORIA_PL;
    if (!platosPorCategoria[categoria]) {
      platosPorCategoria[categoria] = [];
    }
    platosPorCategoria[categoria].push(plato);
  });


  return (
    <>
      <div className="Inicio">
        <div className="platos-container">
          {Object.keys(platosPorCategoria).map((categoria) => (
            <div key={categoria}>
              <h2>{categoria}</h2>
              <ul>
                {platosPorCategoria[categoria].map((plato) => (
                  <li key={plato.ID_PL}>
                    <img src={`http://localhost:4000${plato.FOTO_PL}`} alt={plato.NOMBRE_PL} />
                    <div className="recipe-content">
                      <h1 className="recipe-title"> {plato.NOMBRE_PL}</h1>
                      <p className="recipe-desc" id="descripcion">{plato.DESCRIPCION_PL}</p>
                      <br></br>
                      <br></br>
                      <div className="gridAbajo">
                        <p className="recipe-desco">{plato.PRECIO_PL}$ </p>
                        <button className="recipe-desc" onClick={() => handleAgregarPlato(plato.ID_PL)}>Agregar</button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="orden-container">
          <div className="FixOrden">
            <h2>Orden</h2>
            <br></br>
            {generarOrden ? (
              <>
                <div className="Platos-en-Orden">
                  <div className="Cliente">
                    {clienteSubido ? (<p>Cliente: {clienteData.NOMBRE_CLI}</p>) : (<button className="AddCliente" onClick={() => setMostrarModal(true)}>Agregar Cliente</button>)}
                  </div>
                  <div className="grid-orden">
                    {orden.map((plato) => (
                      <div key={plato.ID_PL} className="orden-item">
                        <p className="recipe-desc2">{plato.NOMBRE_PL}</p>
                        <p className="recipe-desc">{plato.PRECIO_PL}$</p>
                        <p className="recipe-desc">x{plato.cantidad}</p>
                        <button className="recipe-desc" onClick={() => handleEliminarPlato(plato.ID_PL)}>
                          Eliminar
                        </button>
                      </div>
                    ))}
                  </div>
                  {orden.length === 0 && <p>No hay platos en la orden</p>}
                  {platosAEliminar > 0 && (
                    <div className="eliminar-platos">
                      <p>
                        ¿Cuántos platos de {orden.find((plato) => plato.ID_PL === platoIdAEliminar)?.NOMBRE_PL} deseas eliminar?
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
                  <input type="text" id="Mesa" placeholder="Agregar mesa..." />
                  <input type="text" id="Observaciones" placeholder="Observaciones" />
                  {orden.length > 0 && (
                    <button onClick={enviarPedidos}>Enviar Orden</button>
                  )}
                  <button onClick={() => {
                    CancelarOrden();
                    limpiarOrden();
                  }}>Cancelar</button>
                </div>
              </>
            ) : (
              <>
                <div className="tipoOrdenContainer">
                  <div className="tipoOrden">
                    <button onClick={handleCrearOrden}>Nueva Orden</button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <Modal isOpen={mostrarModal} onClose={() => setMostrarModal(false)}>
        <div className="OpcionesCliente">
          <div className="AgregarCliente" onClick={() => setOpcionCliente(false)}>
            Nuevo Cliente
          </div>
          <div className="BuscarCliente" onClick={() => setOpcionCliente(true)}>
            Buscar Cliente
          </div>
        </div>

        {/* Formulario para agregar o buscar cliente */}
        <form className="formularioCliente" onSubmit={handleAgregarCliente}>
          <div className="modalCliente">
            {OpcionCliente ? (
              <>
                <button className="imgBoton">
                  <img src={Lupa} style={{ width: "15px" }} alt="Buscar" />
                </button>
                <input
                  type="text"
                  placeholder="Buscar por cédula..."
                  className="Buscar"
                  value={searchQuery}
                  onChange={handleInputChange}
                />
                <ul>
                  {filteredClients.map((cliente) => (
                    cliente.NOMBRE_CL !== "CONSUMIDOR FINAL" && (
                      <li
                        key={cliente.CEDULA_CL}
                        className="tarjetaCliente"
                        onClick={() => handleSeleccionarCliente(cliente)}
                      >
                        <p className="nombreCliente">{cliente.NOMBRE_CL}</p>
                        <p className="cedulaCliente">{cliente.CEDULA_CL}</p>
                        <p className="direccionCliente">{cliente.DIRECCION_CL}</p>
                        <p className="correoCliente">{cliente.CORREO_CL}</p>
                        <p className="telefonoCliente">{cliente.TELEFONO_CL}</p>
                      </li>
                    )
                  ))}
                </ul>
              </>
            ) : (
              <>
                <div className="CrudCliente">
                  <div className="Proporciona">
                    <p>Personalizar Datos:</p>
                    <input className="check"
                      type="checkbox"
                      checked={clienteData.PERSONALIZA}
                      id="ProporcionaCheckbox"
                      onChange={handleCheckboxChange}
                    />
                  </div>
                  <p>Cedula: </p>
                  <input
                    type="text"
                    name="CEDULA_CLI"
                    value={clienteData.CEDULA_CLI}
                    onChange={handleInputChange}
                    maxLength="10"
                    disabled={!clienteData.PERSONALIZA}
                    placeholder={clienteData.PERSONALIZA ? "" : "9999999999"}
                  />
                  <p>Nombre: </p>
                  <input
                    type="text"
                    name="NOMBRE_CLI"
                    value={clienteData.NOMBRE_CLI}
                    onChange={handleInputChange}
                    placeholder={clienteData.PERSONALIZA ? "" : "CONSUMIDOR FINAL"}
                  />
                  {clienteData.PERSONALIZA && (
                    <>
                      <p>Direccion:</p>
                      <input
                        type="text"
                        name="DIRECCION_CLI"
                        value={clienteData.DIRECCION_CLI}
                        onChange={handleInputChange}
                      />
                      <p>Correo Electrónico:</p>
                      <input
                        type="text"
                        name="CORREO_CLI"
                        value={clienteData.CORREO_CLI}
                        onChange={handleInputChange}
                      />
                      <p>Telefono:</p>
                      <input
                        type="text"
                        name="TELEFONO_CLI"
                        value={clienteData.TELEFONO_CLI}
                        onChange={handleInputChange}
                      />
                    </>
                  )}
                </div>
                <button type="submit" className="AgregarPlato">
                  Agregar Usuario
                </button>
              </>
            )}
          </div>
        </form>
      </Modal>
    </>
  );
};

export default Orden;
