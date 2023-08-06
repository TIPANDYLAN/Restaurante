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
    PERSONALIZA: true,
  });
  const [clienteSubido, setCLienteSubido] = useState(false);
  const [OpcionCliente, setOpcionCliente] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");


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
    const total = orden.reduce((acc, plato) => acc + plato.PRECIO_PL * plato.cantidad, 0);
    setTotalOrden(total);
  }, [orden]);

  const handleAgregarPlato = (platoId) => {
    // Check if a customer exists before adding plates to the order

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
  cliente.CEDULA_CL.toString().includes(searchQuery)
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
      PERSONALIZA: true,
    });
    setMostrarModal(false); // Cerrar el modal después de seleccionar el cliente
    setCLienteSubido(true); // Marcar que se ha seleccionado un cliente
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

const handleAgregarCliente = () => {
  // Prepare the data to be sent to the server
  const confirmation = window.confirm("¿Desea agregar el cliente?");
  if (confirmation) {
  const dataToSend = {
    CEDULA_CLI: clienteData.CEDULA_CLI,
    NOMBRE_CLI: clienteData.NOMBRE_CLI,
    // Only send the dirección and teléfono if PERSONALIZA is true
    ...(clienteData.PERSONALIZA
      ? {
          DIRECCION_CLI: clienteData.DIRECCION_CLI,
          TELEFONO_CLI: clienteData.TELEFONO_CLI,
        }
      : {
          // If PERSONALIZA is false, set the dirección and teléfono to their default values
          DIRECCION_CLI: clienteData.DIRECCION_CLI || "", // Use an empty string if DIRECCION_CLI is falsy
          TELEFONO_CLI: clienteData.TELEFONO_CLI || "",   // Use an empty string if TELEFONO_CLI is falsy
        }),
    PERSONALIZA: clienteData.PERSONALIZA,
  };

  // Only send the dirección and teléfono if PERSONALIZA is true and they have values
  if (clienteData.PERSONALIZA) {
    dataToSend.DIRECCION_CLI = clienteData.DIRECCION_CLI;
    dataToSend.TELEFONO_CLI = clienteData.TELEFONO_CLI;
  }

  // Verificar si la cédula ya existe en la base de datos
  verificarCedulaExistente(clienteData.CEDULA_CLI).then((existingClientData) => {
    if (existingClientData) {
      // Si la cédula ya existe, utilizamos los datos existentes del cliente
      dataToSend.NOMBRE_CLI = dataToSend.NOMBRE_CLI || existingClientData.NOMBRE_CLI;
      dataToSend.DIRECCION_CLI = dataToSend.DIRECCION_CLI || existingClientData.DIRECCION_CLI;
      dataToSend.TELEFONO_CLI = dataToSend.TELEFONO_CLI || existingClientData.TELEFONO_CLI;

      // Realizar la solicitud para agregar el cliente con los datos existentes y los nuevos datos
      axios
        .post("http://localhost:4000/api/clientes", dataToSend)
        .then((response) => {
          setMostrarModal(false); // Cerrar el modal después de agregar el cliente
          setClienteData((prevData) => ({
            ...prevData,
            NOMBRE_CLI: dataToSend.NOMBRE_CLI,
          }));
          setCLienteSubido(true);
        })
        .catch((error) => {
          console.error("Error al agregar el cliente:", error);
          alert("Hubo un error al agregar el cliente");
          setCLienteSubido(false);
        });
    } else {
      // Si la cédula no existe, entonces procedemos a crear un nuevo cliente
      axios
        .post("http://localhost:4000/api/clientes", dataToSend)
        .then((response) => {
          setMostrarModal(false); // Cerrar el modal después de agregar el cliente
          setCLienteSubido(true);
        })
        .catch((error) => {
          console.error("Error al agregar el cliente:", error);
          alert("Hubo un error al agregar el cliente");
          setCLienteSubido(false);
        });
    }
  });
}
};



  return (
    <>
      <div className="Inicio">
        <div className="platos-container">
          <ul>
            {platos.map((plato) => (
              <li key={plato.ID_PL}>
                <img src={`http://localhost:4000/${plato.ID_PL}-kandela.png`} alt={plato.NOMBRE_PL} />
                <div className="recipe-content">
                  <h1 className="recipe-title"> {plato.NOMBRE_PL}</h1>
                  <p className="recipe-desc" id="descripcion">{plato.DESCRIPCION_PL}</p>
                  <br></br>
                  <br></br>
                  <div className="gridAbajo">
                    <p className="recipe-desco" >{plato.PRECIO_PL}$ </p>
                    <button className="recipe-desc" onClick={() => handleAgregarPlato(plato.ID_PL)}>Agregar</button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
        <div className="orden-container">
          <h2>Orden</h2>
          <br></br>
          <div className="Cliente">
            {clienteSubido ? (<p>Cliente: {clienteData.NOMBRE_CLI}</p>):(<button className="AddCliente" onClick={() => setMostrarModal(true)}>Agregar Cliente</button>  ) }
          </div>
          <div className="Platos-en-Orden">
            <div className="grid-orden">
              {orden.map((plato) => (
                <div key={plato.ID_PL} className="orden-item">
                  <p className="recipe-desc2" >{plato.NOMBRE_PL}</p>
                  <p className="recipe-desc" >{plato.PRECIO_PL}$</p>
                  <p className="recipe-desc" >x{plato.cantidad}</p>
                  <button className="recipe-desc" onClick={() => handleEliminarPlato(plato.ID_PL)}>Eliminar</button>
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
          </div>
          <div className="total-orden">
            <h3>Total de la Orden: ${totalOrden}</h3>
          </div>
        </div>
      </div>

      {/* Modal para agregar cliente */}
      <Modal isOpen={mostrarModal} onClose={() => setMostrarModal(false)}>
        <div className="OpcionesCliente">
          <div className="AgregarCliente" onClick={() => setOpcionCliente(false)}>
              Nuevo Cliente
          </div>
          <div className="BuscarCliente" onClick={() => setOpcionCliente(true)}>
              Buscar Cliente
          </div>
        </div>
        {OpcionCliente ? (<div className="modalCliente">
        <button className="imgBoton"><img src={Lupa} style={{width:"15px"}} /></button>
          <input type="text"
            placeholder="Buscar por cédula..."
            className="Buscar"
            value={searchQuery}
            onChange={handleInputChange}/>
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
                  <p className="telefonoCliente">{cliente.TELEFONO_CL}</p>
                </li>
              )
            ))}
          </ul>
          </div>) 
          : (<div className="CrudCliente">
          <div className="Proporciona">
            <p>Personalizar Datos:</p>
            <input
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
              disabled={!clienteData.PERSONALIZA}
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
                <p>Telefono:</p>
                <input
                  type="text"
                  name="TELEFONO_CLI"
                  value={clienteData.TELEFONO_CLI}
                  onChange={handleInputChange}
                />
              </>
            )}
         <button onClick={handleAgregarCliente}>Agregar Usuario</button>
        </div>)}
        
      </Modal>
    </>
  );
};

export default Orden;
