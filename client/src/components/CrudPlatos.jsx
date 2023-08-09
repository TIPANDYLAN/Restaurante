import React, { useState, useEffect } from "react";
import axios from "axios";
import Modal from "./Modal";
import "../styles/Platos/CrudPlatos.css";
import "../styles/Orden.css";

const CrudPlatos = () => {
  const [platos, setPlatos] = useState([]);
  const [platoSeleccionado, setPlatoSeleccionado] = useState(null);
  const [nombre, setNombre] = useState("");
  const [precio, setPrecio] = useState("");
  const [foto, setFoto] = useState(null);

  const [mostrar, setMostrar] = useState(false);
  const [mostrarSegundoModal, setMostrarSegundoModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);


  useEffect(() => {
    // Hacer la solicitud a la API para obtener los platos
    setIsLoading(true); // Iniciar la carga

    axios
      .get("http://localhost:4000/api/platos")
      .then((response) => {
        setPlatos(response.data);
      })
      .catch((error) => {
        console.error("Error al obtener los platos:", error);
      })
      .finally(() => {
        setIsLoading(false); // Finalizar la carga, tanto en caso de éxito como de error
      });

      const observer = new IntersectionObserver(handleIntersection, {
        root: null,
        rootMargin: "0px",
        threshold: 0.1, // Porcentaje de visibilidad para disparar la carga
      });
  
      // Observar todas las imágenes que encuentres en la página
      const images = document.querySelectorAll(".lazy-load-img");
      images.forEach((img) => {
        observer.observe(img);
      });
  
      return () => {
        observer.disconnect(); // Limpieza al desmontar
      };
  }, []);

  const handleIntersection = (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const img = entry.target;
        const src = img.dataset.src;
        img.src = src;
        img.classList.remove("lazy-load-img");
      }
    });
  };
  const handleActualizarPlato = (id) => {
    // Validar que al menos un campo esté lleno
    if (!nombre.trim() && !precio && !foto) {
      console.error("Debes cambiar al menos un campo");
      return;
    }
  
    // Crear un objeto FormData con los campos a actualizar
    const formData = new FormData();
    if (nombre.trim()) formData.append("Nombre", nombre);
    if (precio) formData.append("Precio", precio.toString());
    if (foto !== null) formData.append("Foto", foto);
  
    // Hacer la solicitud PUT a la API solo si hay cambios en los campos
    axios
      .put(`http://localhost:4000/api/platos/${id}`, formData)
      .then((response) => {
        console.log("Plato actualizado exitosamente");
        // Resto del código para actualizar los platos
      })
      .catch((error) => {
        console.error("Error al actualizar el plato:", error);
      });
  };
  
  


  const handleAgregarPlato = () => {
    // Crear un objeto FormData para enviar la imagen al servidor
    const formData = new FormData();
    formData.append("Nombre", nombre);
    formData.append("Precio", precio);
    formData.append("Foto", foto);

    // Hacer la solicitud POST a la API para crear un nuevo plato
    axios
      .post("http://localhost:4000/api/platos", formData)
      .then((response) => {

        console.log("Plato creado exitosamente");
        // Actualizar la lista de platos después de crear uno nuevo
        setPlatos([...platos, response.data]);
      })
      .catch((error) => {
        console.error("Error al crear el plato:", error);
      });
  };

  const handleEditarPlato = (plato) => {
    setPlatoSeleccionado(plato);
    setNombre(plato.NOMBRE_PL);
    setPrecio(plato.PRECIO_PL);
    setFoto(null); // Clear the image selection when editing
    setMostrar(true);
  };

  const handleEliminarPlato = (id) => {
    axios
      .delete(`http://localhost:4000/api/platos/${id}`)
      .then(() => {
        console.log("Plato eliminado exitosamente");
        // Actualizar la lista de platos después de la eliminación
        setPlatos(platos.filter((plato) => plato.ID_PL !== id));
        setPlatoSeleccionado(null);
      })
      .catch((error) => {
        console.error("Error al eliminar el plato:", error);
      });
  };

  const handleAbrirSegundoModal = () => {
    setMostrarSegundoModal(true);
  };

  const handleCerrarSegundoModal = () => {
    setMostrarSegundoModal(false);
  };

  return (
    
    <div className="Crud">
      {isLoading ? (
      <div className="loading-screen">Cargando...</div>
    ) : (<>
      <button className="AgregarPlato" onClick={() => setMostrarSegundoModal(true)}>Agregar Nuevo Plato</button>
      <h2>Platos disponibles:</h2>
      <ul>
        <div className="Platos">
          {platos.map((plato) => (
            <li key={plato.ID_PL} className="Plato">
              <p className="recipe-title">{plato.NOMBRE_PL}</p>
              <p className="recipe-desc">Precio: {plato.PRECIO_PL} $ </p>

              <img src={`http://localhost:4000${plato.FOTO_PL}`} alt={plato.NOMBRE_PL} />


              <button onClick={() => handleEditarPlato(plato)}>Editar</button>
              <button onClick={() => handleEliminarPlato(plato.ID_PL)}>Eliminar</button>
            </li>
          ))}
        </div>
      </ul>
      {platos.length === 0 && <p>No hay platos disponibles.</p>}

      <Modal isOpen={mostrar} onClose={() => setMostrar(false)}>
        {platoSeleccionado && (
          <div className="SegundoModal">
            <h2>Editar plato:</h2>
            <form>
              <label>Nombre:</label>
              <input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} />

              <label>Precio:</label>
              <input type="number" value={precio} min={0} onChange={(e) => setPrecio(e.target.value)} />

              <label>Foto:</label>
              <input type="file" onChange={(e) => setFoto(e.target.files[0])} />

              <button type="button" onClick={() => handleActualizarPlato(platoSeleccionado.ID_PL)}>
                Actualizar Plato
              </button>
            </form>
          </div>
        )}
      </Modal>
      <div className="modalContainer">
        <Modal isOpen={mostrarSegundoModal} onClose={handleCerrarSegundoModal}>
          <div className="SegundoModal agregarpl">
            <div className="formContainer">
              <form>
                <label>Nombre:</label>
                <input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} />

                <label>Precio:</label>
                <input type="number" value={precio} min={0} onChange={(e) => setPrecio(e.target.value)} />

                <label>Foto:</label>
                <input type="file" accept="image/*" onChange={(e) => setFoto(e.target.files[0])} />

                <button type="button" onClick={handleAgregarPlato}>
                  Agregar Plato
                </button>
              </form>
            </div>
            <div className="imagenContainer">
              <img
                src="https://parrilladanesa.com.mx/wp-content/uploads/2019/04/slider-1-parrilla-danesa-1.jpg
                "
                alt="Imagen"
                style={{ width: "100%", height: "auto" }}
              />
            </div>
          </div>
        </Modal>
      </div></>)}
    </div>
  );
};

export default CrudPlatos;
