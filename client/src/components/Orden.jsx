import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/Orden.css";
import Modal from "./Modal";
import HorizontalMenu from "./MenuHorizontal";
import ComboBox from "./ComboBox";

import Lupa from "../images/search-icon.png";
import { fetchData } from "../js/fetchDataUrl";

const Orden = () => {
  const [platos, setPlatos] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [orden, setOrden] = useState([]);
  const [settings, setSettings] = useState([]);
  const [ordenActual, setOrdenActual] = useState([]);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [clienteData, setClienteData] = useState({
    CEDULA_CLI: "",
    NOMBRE_CLI: "",
    DIRECCION_CLI: "",
    TELEFONO_CLI: "",
    CORREO_CLI: "",
    PERSONALIZA: true,
  });
  const [mesa, setMesa] = useState(0);
  const [clienteSubido, setCLienteSubido] = useState(false);
  const [OpcionCliente, setOpcionCliente] = useState(false);
  const [generarOrden, setGenerarOrden] = useState(false);
  const [editarOrden, setEditarOrden] = useState(false);
  const [ordenes, setOrdenes] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [IDordenActual, setIDOrdenActual] = useState(0);
  const [platoAgregado, setPlatoAgregado] = useState(false);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState("Parrilladas");
  const [modalEditar, setModalEditar] = useState(false);
  const [ordenesFiltradas, setOrdenesFiltradas] = useState([]);
  const [ordenesActuales, setOrdenesActuales] = useState([]);
  const [ordenesCargadas, setOrdenesCargadas] = useState(false);
  const [cantidadActual, setCantidadActual] = useState(0);
  const [cantidadPlatos, setCantidadPlatos] = useState([]);

  useEffect(() => {
    fetchData('platos')
      .then(data => setPlatos(data))
      .catch(error => {
        console.error('Error fetching platos:', error);
      });
  }, []);

  useEffect(() => {
    fetchData('settings')
      .then(data => setSettings(data))
      .catch(error => {
        console.error('Error fetching settings:', error);
      });
    fetchOrdenesActuales();
    obtenerOrdenes();
    FiltrarOrdenes();
    ObtenerClientes();
    verificarClienteConsumidorFinal();
  }, []);

  const ObtenerClientes = async () => {
    try {
      axios
        .get("http://localhost:4000/api/clientes")
        .then((response) => {
          setClientes(response.data);
        })
    } catch (error) {
      console.error("Error al obtener los clientes:", error);
    }
  }
  const obtenerOrdenes = async () => {
    axios
      .get("http://localhost:4000/api/ordenes")
      .then((response) => {
        setOrdenes(response.data);
      })
      .catch((error) => {
        console.error("Error al obtener las ordenes:", error);
      });
  }

  const FiltrarOrdenes = async () => {
    try {
      axios
        .get("http://localhost:4000/api/ordenes")
        .then((response) => {
          const ordenesSinCanceladasOFacturadas = response.data.filter(
            (orden) => orden.ESTADO_OR !== "Cancelada" && orden.ESTADO_OR !== "Facturada"
          );
          setOrdenesFiltradas(ordenesSinCanceladasOFacturadas);
          setOrdenesCargadas(true);
        })
    } catch (error) {
      console.error("Error al obtener las ordenes:", error);
    }
  }

  const fetchOrdenesActuales = async () => {
    try {
      const response = await axios.get('http://localhost:4000/api/ordenescocina');
      if (Array.isArray(response.data)) {
        setOrdenesActuales(response.data);
      } else {
        console.error('La respuesta no es un array:', response.data);
      }
    } catch (error) {
      console.error('Error al obtener las órdenes:', error);
    }
  };

  useEffect(() => {
    setTotalOrden((prevTotal) => {
      const total = orden.reduce((acc, plato) => acc + plato.PRECIO_PL * plato.cantidad + parseFloat(settings[0].PRECIO_EXTRA_SE * (plato.aDomicilio ? plato.aDomicilio : 0)), 0);
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
                ? { ...item, cantidad: item.cantidad + 1, total: (item.cantidad + 1) * item.PRECIO_PL + parseFloat(settings[0].PRECIO_EXTRA_SE * item.aDomicilio).toFixed(2) }
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


  const handleCantidadPlato = (platoId, ordenId, estado) => {
    let updateData = {};
    let updateOrden = {};
    const platoEnOrden = orden.find((item) => item.ID_PL === platoId);
    const platoEnOrdenActual = ordenActual.find((item) => item.ID_PLATO_PEDIDO === platoId);

    if (estado === "Aumentar") {
      if (platoEnOrden) {
        setOrden((prevOrden) =>
          prevOrden.map((item) =>
            item.ID_PL === platoId
              ? { ...item, cantidad: item.cantidad + 1, total: (item.cantidad + 1) * item.PRECIO_PL + (settings[0].PRECIO_EXTRA_SE * (item.aDomicilio ? item.aDomicilio : 0)) }
              : item
          )
        );
      } else if (platoEnOrdenActual) {
        setOrdenActual((prevOrdenActual) =>
          prevOrdenActual.map((item) =>
            item.ID_PLATO_PEDIDO === platoId
              ? {
                ...item,
                PRECIO_PLATOS: item.PRECIO_PLATO * (item.CANTIDAD_PLATOS_PEDIDOS + 1),
                CANTIDAD_PLATOS_PEDIDOS: item.CANTIDAD_PLATOS_PEDIDOS + 1,
                ESTADO_PLATO: "Por Hacer",
                REDUCIR_PLATOS: false,
              }
              : item
          )
        );
        updateData = {
          PRECIO_PE: platoEnOrdenActual.PRECIO_PLATO * (platoEnOrdenActual.CANTIDAD_PLATOS_PEDIDOS + 1),
          PARA_LLEVAR: platoEnOrdenActual.PARA_LLEVAR,
          CANTXPLA_PE: platoEnOrdenActual.CANTIDAD_PLATOS_PEDIDOS + 1,
          ESTADO_PE: "Por Hacer",
        };
        updateOrden = {
          ESTADO_OR: "Por hacer"
        }
        axios.put(`http://localhost:4000/api/pedidosCantidad/${platoId}/${ordenId}`, updateData)
          .then((response) => {
            console.log("Pedido updated successfully:", response.data);
            // You can also update the UI or state here if needed
          })
          .catch((error) => {
            console.error("Error updating pedido:", error);
            // Handle error here if needed
          });
        axios.put(`http://localhost:4000/api/ordenesEstado/${ordenId}`, updateOrden)
          .then((response) => {
            console.log("Orden updated successfully:", response.data);
            // You can also update the UI or state here if needed
          })
          .catch((error) => {
            console.error("Error updating pedido:", error);
            // Handle error here if needed
          });
      }
    } else {
      if (platoEnOrden) {
        if (platoEnOrden.cantidad > 1) {
          setOrden((prevOrden) =>
            prevOrden.map((item) =>
              item.ID_PL === platoId
                ? {
                  ...item, cantidad: item.cantidad - 1,
                  aDomicilio: item.aDomicilio - 1 === item.cantidad - 1 ? item.aDomicilio - 1 : item.aDomicilio,
                  total: (item.cantidad - 1) * item.PRECIO_PL + parseFloat(settings[0].PRECIO_EXTRA_SE * (item.aDomicilio - 1 === item.cantidad - 1 ? item.aDomicilio - 1 : item.aDomicilio)).toFixed(2)
                }
                : item
            )
          );
        } else {
          setOrden((prevOrden) => prevOrden.filter((item) => item.ID_PL !== platoId));
        }
      } else if (platoEnOrdenActual) {
        const platosAntiguos = cantidadPlatos.find((item) => item.ID_PLATO_PEDIDO === platoId);
        const numeroPlatosAntiguos = platosAntiguos.CANTIDAD_PLATOS_PEDIDOS;
        const siNuevoPlato = platosAntiguos.NUEVOPLATO;

        if (numeroPlatosAntiguos !== platoEnOrdenActual.CANTIDAD_PLATOS_PEDIDOS) {
          if (platoEnOrdenActual.CANTIDAD_PLATOS_PEDIDOS > 1) {
            setOrdenActual((prevOrdenActual) =>
              prevOrdenActual.map((item) =>
                item.ID_PLATO_PEDIDO === platoId
                  ? {
                    ...item,
                    PRECIO_PLATOS: item.PRECIO_PLATO * (item.CANTIDAD_PLATOS_PEDIDOS - 1) + (settings[0].PRECIO_EXTRA_SE * (item.PARA_LLEVAR - 1 === item.CANTIDAD_PLATOS_PEDIDOS - 1 ? item.PARA_LLEVAR - 1 : item.PARA_LLEVAR)),
                    PARA_LLEVAR: item.PARA_LLEVAR - 1 === item.CANTIDAD_PLATOS_PEDIDOS - 1 ? item.PARA_LLEVAR - 1 : item.PARA_LLEVAR,
                    CANTIDAD_PLATOS_PEDIDOS: item.CANTIDAD_PLATOS_PEDIDOS - 1,
                    ESTADO_PLATO: !item.REDUCIR_PLATOS ? "Terminado" : "Por Hacer",
                  }
                  : item
              )
            );
            updateData = {
              PRECIO_PE: parseFloat(platoEnOrdenActual.PRECIO_PLATO) * parseFloat(platoEnOrdenActual.CANTIDAD_PLATOS_PEDIDOS - 1) + parseFloat(settings[0].PRECIO_EXTRA_SE * (platoEnOrdenActual.PARA_LLEVAR - 1 === platoEnOrdenActual.CANTIDAD_PLATOS_PEDIDOS - 1 ? platoEnOrdenActual.PARA_LLEVAR - 1 : platoEnOrdenActual.PARA_LLEVAR)),
              PARA_LLEVAR: platoEnOrdenActual.PARA_LLEVAR - 1 === platoEnOrdenActual.CANTIDAD_PLATOS_PEDIDOS - 1 ? platoEnOrdenActual.PARA_LLEVAR - 1 : platoEnOrdenActual.PARA_LLEVAR,
              CANTXPLA_PE: platoEnOrdenActual.CANTIDAD_PLATOS_PEDIDOS - 1,
              ESTADO_PE: !platoEnOrdenActual.REDUCIR_PLATOS ? "Terminado" : "Por Hacer",
            };

            updateOrden = {
              ESTADO_OR: !platoEnOrdenActual.REDUCIR_PLATOS ? "" : platoEnOrdenActual.ESTADO_OR
            }
            axios.put(`http://localhost:4000/api/pedidosCantidad/${platoId}/${ordenId}`, updateData)
              .then((response) => {
                console.log("Pedido updated successfully:", response.data);
                // You can also update the UI or state here if needed
              })
              .catch((error) => {
                console.error("Error updating pedido:", error);
                // Handle error here if needed
              });
          }
          else {
            setOrdenActual((prevOrdenActual) => prevOrdenActual.filter((item) => item.ID_PLATO_PEDIDO !== platoId));
            axios.delete(`http://localhost:4000/api/pedidos/${platoId}/${ordenId}`)
              .then((response) => {
                console.log("Pedido updated successfully:", response.data);
                // You can also update the UI or state here if needed
              })
              .catch((error) => {
                console.error("Error updating pedido:", error);
                // Handle error here if needed
              });
          }

          if (numeroPlatosAntiguos + 1 === platoEnOrdenActual.CANTIDAD_PLATOS_PEDIDOS && !siNuevoPlato) {
            setOrdenActual((prevOrdenActual) =>
              prevOrdenActual.map((item) =>
                item.ID_PLATO_PEDIDO === platoId
                  ? {
                    ...item,
                    REDUCIR_PLATOS: true,
                  }
                  : item
              )
            );
          }
        }
        else {
          console.log("ANTESDEELIMINAR: ", cantidadPlatos)
          setCantidadPlatos((prevCantidadPlatos) => prevCantidadPlatos.filter((item) => item.ID_PLATO_PEDIDO !== platoId));
          setOrdenActual((prevOrdenActual) => prevOrdenActual.filter((item) => item.ID_PLATO_PEDIDO !== platoId));
          axios.delete(`http://localhost:4000/api/pedidos/${platoId}/${ordenId}`)
            .then((response) => {
              console.log("Pedido updated successfully:", response.data);
              // You can also update the UI or state here if needed
            })
            .catch((error) => {
              console.error("Error updating pedido:", error);
              // Handle error here if needed
            });
        }
      }
    }
  };

  const calculateTotalOrden = () => {
    const total = orden.reduce((acc, plato) => acc + plato.PRECIO_PL * plato.cantidad + (settings[0].PRECIO_EXTRA_SE * plato.aDomicilio), 0);
    return total;
  };

  const [totalOrden, setTotalOrden] = useState(calculateTotalOrden());

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
      ObtenerClientes();
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


  const enviarPedidos = async () => {
    // Iterate through each plato in the orden and send the pedido data to the server
    orden.forEach((pedido) => {
      const dataToSend = {
        ID_OR: IDordenActual,
        ID_PL: pedido.ID_PL,
        PRECIO_PE: pedido.total,
        CANTXPLA_PE: pedido.cantidad,
        ESTADO_PE: "Por Hacer",
        CANTREALIZADA_PE: 0,
        PARALLEVAR_PE: pedido.aDomicilio,
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

    const NumMesa = mesa
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

    try {
      await axios
        .put(`http://localhost:4000/api/ordenes/${IDordenActual}`, dataToUpdate)
        .then((response) => {
          console.log("Datos de la orden actualizados con éxito!!!");
          console.log(response);
          obtenerOrdenes();
          fetchOrdenesActuales();
          FiltrarOrdenes();
          limpiarOrden();
        })
    } catch (error) {
      console.error("Error al actualizar los datos de la orden:", error);
    }
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

  const categorias = Object.keys(platosPorCategoria);

  const platosFiltrados = platosHabilitados.filter((plato) => plato.CATEGORIA_PL === categoriaSeleccionada);

  const handleEditarOrden = () => {
    setModalEditar(true);
  };

  const ObtenerOrden = (idOrden) => {
    // First, find the selected order in your current orders
    const ordenEscogida = ordenesActuales.find((orden) => orden.ID_OR === idOrden);

    if (ordenEscogida) {
      // Make a GET request to fetch the orders and their associated items (pedidos)
      axios
        .get(`http://localhost:4000/api/ordenescocina/${idOrden}`)
        .then((response) => {
          // Assuming response.data is an array of pedidos
          const pedidosConCampoExtra = response.data.map((plato) => ({
            ...plato,
            REDUCIR_PLATOS: true,
          }
          ));
          setOrdenActual(pedidosConCampoExtra);
          setModalEditar(false);
          setEditarOrden(true);
          setCLienteSubido(true);
          // Calculate the total quantity of platos
          const putcantidadPlatos = response.data.map((plato) => ({
            ID_PLATO_PEDIDO: plato.ID_PLATO_PEDIDO,
            CANTIDAD_PLATOS_PEDIDOS: plato.CANTIDAD_PLATOS_PEDIDOS,
          }));
          setCantidadPlatos(putcantidadPlatos);
        })
        .catch((error) => {
          console.error('Error al obtener los pedidos:', error);
        });
    } else {
      console.error('Orden no encontrada');
    }
  };


  const ordenesActualesInvertidas = [...ordenesFiltradas].reverse();
  const totalOrdenActual = ordenActual.reduce((total, plato) => {
    const subtotal = plato.PRECIO_PLATO * plato.CANTIDAD_PLATOS_PEDIDOS + (settings[0].PRECIO_EXTRA_SE * plato.PARA_LLEVAR);
    return total + subtotal;
  }, 0);

  useEffect(() => {
    setCantidadActual(totalOrdenActual);
  }, [totalOrdenActual])

  const CancelarEditar = () => {
    setEditarOrden(false);
    setOrdenActual([]);
    setClienteData({
      CEDULA_CLI: "",
      NOMBRE_CLI: "",
      DIRECCION_CLI: "",
      TELEFONO_CLI: "",
      CORREO_CLI: "",
      PERSONALIZA: true,
    });
    setCLienteSubido(false);
    setSearchQuery("");
    setIDOrdenActual(0);
    setCantidadActual(0);
  }

  const handleEditarPlatos = (idPlato) => {
    let updateData = {};
    const platoSeleccionado = platos.find((plato) => plato.ID_PL === idPlato);
    if (platoSeleccionado) {
      const platoEnOrden = ordenActual.find((item) => item.ID_PLATO_PEDIDO === idPlato);

      if (platoEnOrden) {
        // Si el plato ya está en la orden, actualiza su cantidad y total
        setOrdenActual((prevOrdenActual) =>
          prevOrdenActual.map((item) =>
            item.ID_PLATO_PEDIDO === idPlato
              ? {
                ...item,
                CANTIDAD_PLATOS_PEDIDOS: item.CANTIDAD_PLATOS_PEDIDOS + 1,
                REDUCIR_PLATOS: false,
              }
              : item,
          )
        );
        updateData = {
          ID_PL: platoEnOrden.ID_PLATO_PEDIDO,
          ID_OR: platoEnOrden.ID_OR,
          PRECIO_PE: platoEnOrden.PRECIO_PLATO * (platoEnOrden.CANTIDAD_PLATOS_PEDIDOS + 1) + (settings[0].PRECIO_EXTRA_SE * platoEnOrden.PARA_LLEVAR),
          CANTXPLA_PE: platoEnOrden.CANTIDAD_PLATOS_PEDIDOS + 1,
          ESTADO_PE: "Por Hacer",
          CANTREALIZADA_PE: platoEnOrden.PLATOS_REALIZADOS,
          PARA_LLEVAR: platoEnOrden.PARA_LLEVAR,
        }
      } else {
        // Si el plato no está en la orden, agrégalo con cantidad 1 y calcula su total
        const nuevoPlato = {
          ID_OR: ordenActual[0].ID_OR,
          DESCRIPCION_OR: ordenActual[0].DESCRIPCION_OR,
          ESTADO_OR: ordenActual.every((plato) => plato.ESTADO_PLATO === "Por Hacer") ? "Por Hacer" : "Realizando",
          NMESA_OR: ordenActual[0].NMESA_OR,
          CEDULA_CL: ordenActual[0].CEDULA_CL,
          NOMBRE_CL: ordenActual[0].NOMBRE_CL,
          ID_PLATO_PEDIDO: idPlato,
          NOMBRE_PLATO_PEDIDO: platoSeleccionado.NOMBRE_PL,
          PRECIO_PLATO: platoSeleccionado.PRECIO_PL,
          PRECIO_PLATOS: platoSeleccionado.PRECIO_PL,
          CANTIDAD_PLATOS_PEDIDOS: 1,
          ESTADO_PLATO: "Por Hacer",
          PLATOS_REALIZADOS: 0,
          PARA_LLEVAR: 0,
        };
        setOrdenActual((prevOrdenActual) => [...prevOrdenActual, nuevoPlato]);
        setCantidadPlatos((prevCantidadPlatos) => [
          ...prevCantidadPlatos,
          {
            ID_PLATO_PEDIDO: nuevoPlato.ID_PLATO_PEDIDO,
            CANTIDAD_PLATOS_PEDIDOS: nuevoPlato.CANTIDAD_PLATOS_PEDIDOS,
            NUEVOPLATO: true,
          }
        ]);

        console.log("RevisarCantidad", cantidadPlatos);
        updateData = {
          ID_PL: nuevoPlato.ID_PLATO_PEDIDO,
          ID_OR: nuevoPlato.ID_OR,
          PRECIO_PE: nuevoPlato.PRECIO_PLATO * nuevoPlato.CANTIDAD_PLATOS_PEDIDOS,
          CANTXPLA_PE: nuevoPlato.CANTIDAD_PLATOS_PEDIDOS,
          ESTADO_PE: nuevoPlato.ESTADO_PLATO,
          CANTREALIZADA_PE: nuevoPlato.PLATOS_REALIZADOS,
          PARALLEVAR_PE: nuevoPlato.PARA_LLEVAR,
        }
      }
      axios.post(`http://localhost:4000/api/pedidosNuevos`, updateData)
        .then((response) => {
          console.log("Pedido updated successfully:", response.data);
          // You can also update the UI or state here if needed
        })
        .catch((error) => {
          console.error("Error updating pedido:", error);
          // Handle error here if needed
        });

    }
  };

  const handleMesaSelection = (selectedValue) => {
    setMesa(selectedValue);
  };

  const handleDomicilioSelection = (selectedValue, idPlato, idOrden) => {
    let updateData = {};

    const platoEnOrden = orden.find((item) => item.ID_PL === idPlato);

    const platoSeleccionado = platos.find((plato) => plato.ID_PL === idPlato);
    if (platoSeleccionado) {
      const platoEnOrdenActual = ordenActual.find((item) => item.ID_PLATO_PEDIDO === idPlato);

      if (platoEnOrdenActual) {
        // Si el plato ya está en la orden, actualiza su cantidad y total
        setOrdenActual((prevOrdenActual) =>
          prevOrdenActual.map((item) =>
            item.ID_PLATO_PEDIDO === idPlato
              ? {
                ...item,
                PRECIO_PLATOS: platoEnOrdenActual.PRECIO_PLATO * (platoEnOrdenActual.CANTIDAD_PLATOS_PEDIDOS) + (settings[0].PRECIO_EXTRA_SE * selectedValue),
                PARA_LLEVAR: selectedValue,
              }
              : item,
          )
        );
        updateData = {
          PRECIO_PE: platoEnOrdenActual.PRECIO_PLATO * (platoEnOrdenActual.CANTIDAD_PLATOS_PEDIDOS) + (settings[0].PRECIO_EXTRA_SE * selectedValue),
          PARA_LLEVAR: selectedValue,
        }
        axios.put(`http://localhost:4000/api/domicilio/${idPlato}/${idOrden}`, updateData)
          .then((response) => {
            console.log("Pedido updated successfully:", response.data);
            // You can also update the UI or state here if needed
          })
          .catch((error) => {
            console.error("Error updating pedido:", error);
            // Handle error here if needed
          });
      } else if (platoEnOrden) {
        setOrden((prevOrden) =>
          prevOrden.map((item) =>
            item.ID_PL === idPlato
              ? { ...item, total: (item.cantidad) * item.PRECIO_PL + (settings[0].PRECIO_EXTRA_SE * selectedValue), aDomicilio: selectedValue }
              : item
          )
        );
      }

    }
  };

  return (
    <>
      <div className="Inicio">
        <div className="platos-container">
          <HorizontalMenu options={categorias} onSelectCategoria={setCategoriaSeleccionada} categoriaActual={categoriaSeleccionada} />
          {categorias.map((categoria) => (
            <div key={categoria}>
              {categoria === categoriaSeleccionada && (<>
                <ul>
                  {platosFiltrados.map((plato) => (
                    <li key={plato.ID_PL}>
                      <img src={`http://localhost:4000${plato.FOTO_PL}`} alt={plato.NOMBRE_PL} />
                      <div className="recipe-content">
                        <h1 className="recipe-title">{plato.NOMBRE_PL}</h1>
                        <p className="recipe-desc" id="descripcion">{plato.DESCRIPCION_PL}</p>
                        <br></br>
                        <br></br>
                        <div className="gridAbajo">
                          <p className="recipe-desco">{plato.PRECIO_PL}$ </p>
                          <button className="recipe-desc" onClick={() => {
                            if (generarOrden) {
                              handleAgregarPlato(plato.ID_PL)
                            }
                            else if (editarOrden) {
                              handleEditarPlatos(plato.ID_PL)
                            }
                          }
                          }>Agregar</button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul></>
              )}
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
                        <p className="recipe-desc">x{plato.cantidad}</p>
                        <p className="recipe-desc">{parseFloat(plato.total).toFixed(2)}$</p>
                        <div className="MoverCantidad">
                          <button className="aumentar" onClick={() => handleCantidadPlato(plato.ID_PL, 0, "Aumentar")}>
                            ▲
                          </button>
                          <button className="reducir" onClick={() => handleCantidadPlato(plato.ID_PL, 0, "Reducir")}>
                            ▼
                          </button>
                        </div>
                        <div className="Domicilio">
                          <p>Para llevar:</p>
                          <ComboBox mode='domicilio' opcionActual={plato.aDomicilio} cantidadPlatos={plato.cantidad} idOrden={plato.ID_OR} idPlato={plato.ID_PL} initialText={"0"} onSelectChange={handleDomicilioSelection} />
                        </div>
                      </div>
                    ))}
                    {orden.length === 0 && <div className="centrarVertical" ><p>No hay platos en la orden</p></div>}
                  </div>
                  <div className="total-orden">
                    <h3>Total de la Orden: ${parseFloat(totalOrden).toFixed(2)}</h3>
                  </div>
                    <ComboBox mode='mesas' initialText={"Seleccione una mesa"} onSelectChange={handleMesaSelection} />
                  <br></br>
                  <input type="text" id="Observaciones" placeholder="Observaciones" />
                  {orden.length > 0 && (
                    <button className="botoncito" onClick={enviarPedidos}>Enviar Orden</button>
                  )}
                  <button className="botoncito2" onClick={() => {
                    CancelarOrden();
                    limpiarOrden();
                  }}>Cancelar</button>
                </div>
              </>
            ) : editarOrden ? (<>
              <div className="Platos-en-Orden">
                <div className="Cliente">
                  {clienteSubido ? (<p>Cliente: {ordenActual[0].NOMBRE_CL}</p>) : (<button className="AddCliente" onClick={() => setMostrarModal(true)}>Agregar Cliente</button>)}
                </div>
                <div className="grid-orden">
                  {ordenActual.map((plato) => (
                    <div key={plato.ID_PLATO_PEDIDO} className="orden-item">
                      <p className="recipe-desc2">{plato.NOMBRE_PLATO_PEDIDO}</p>
                      <p className="recipe-desc">x{plato.CANTIDAD_PLATOS_PEDIDOS}</p>
                      <p className="recipe-desc">{parseFloat(plato.PRECIO_PLATOS).toFixed(2)}$</p>
                      <div className="MoverCantidad">
                        <button className="aumentar" onClick={() => handleCantidadPlato(plato.ID_PLATO_PEDIDO, plato.ID_OR, "Aumentar")}>
                          ▲
                        </button>
                        <button className="reducir" disabled={plato.REDUCIR_PLATOS} onClick={() => handleCantidadPlato(plato.ID_PLATO_PEDIDO, plato.ID_OR, "Reducir")}>
                          ▼
                        </button>
                      </div>
                      {
                        <div className="Domicilio">
                          <p>Para llevar:</p>
                          <ComboBox mode='domicilio' opcionActual={plato.PARA_LLEVAR} cantidadPlatos={plato.CANTIDAD_PLATOS_PEDIDOS} idOrden={plato.ID_OR} idPlato={plato.ID_PLATO_PEDIDO} initialText={"0"} onSelectChange={handleDomicilioSelection} />
                        </div>
                      }
                    </div>
                  ))}
                </div>
                {ordenActual.length > 0 && (
                  <>
                    <div className="total-orden">
                      <h3>Total de la Orden: ${parseFloat(cantidadActual).toFixed(2)}</h3>
                    </div>
                    <input
                      type="text"
                      id="descripcionPlato"
                      value={ordenActual[0].DESCRIPCION_OR}
                      placeholder="Observaciones"
                      onChange={(e) => {
                        const newValue = e.target.value;
                        setOrdenActual(prevOrdenActual => {
                          const newOrdenActual = [...prevOrdenActual];
                          newOrdenActual[0].DESCRIPCION_OR = newValue;
                          return newOrdenActual;
                        });
                      }}
                    />
                    <ComboBox mode='mesas' initialText={"Seleccione una mesa"} onSelectChange={handleMesaSelection} opcionActual={ordenActual[0].NMESA_OR} />
                  </>
                )}
                {orden.length > 0 && (
                  <button onClick={enviarPedidos}>Enviar Orden</button>
                )}
                <button onClick={() => {
                  CancelarEditar();
                }}>Cerrar Editar</button>
              </div>
            </>) : (
              <>
                <div className="tipoOrdenContainer">
                  <div className="tipoOrden">
                    <button onClick={handleCrearOrden}>Nueva Orden</button>
                    <button onClick={handleEditarOrden}>Editar Orden</button>
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
      <Modal isOpen={modalEditar} onClose={() => setModalEditar(false)}>
        <h2 className="OrdenesDisponibles">Órdenes Disponibles</h2>
        <div className="EditarOrdenes ModalEditarOrdenes">
          {ordenesCargadas ? (
            <ul className="eachOrden">
              {ordenesActualesInvertidas.map((orden) => (
                <li
                  key={orden.ID_OR}
                  className="tarjetaEditarOrdenes"
                  onClick={() => ObtenerOrden(orden.ID_OR)}
                >
                  <p>Mesa {orden.NMESA_OR}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p>Cargando órdenes...</p>
          )}

        </div>
      </Modal>
    </>
  );
};

export default Orden;
