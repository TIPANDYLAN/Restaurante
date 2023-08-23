const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const bodyParser = require("body-parser");
const app = express();
const PORT = 4000;
app.use(express.json({ limit: "10mb" }));

app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Configuración de Multer para manejar la carga de imágenes
const diskstorage = multer.diskStorage({
  destination: path.join(__dirname, "./uploads"),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + "-" + file.originalname);
  },
});

const fileUpload = multer({
  storage: diskstorage,
}).single("Foto");

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "password",
  database: "Restaurant",
});

connection.connect((error) => {
  if (error) {
    console.error("Error al conectar a la base de datos:", error);
  } else {
    console.log("Conexión exitosa a la base de datos");
  }
});


//Crud Ingredientes
//================================================================
// Crear un nuevo ingrediente
app.post("/ingredientes", (req, res) => {
  const { nombre, descripcion, precio } = req.body;

  const query = "INSERT INTO INGREDIENTES (NOMBRE_I, DESCRIPCION_I, PRECIO_I) VALUES (?, ?, ?)";
  
  connection.query(query, [nombre, descripcion, precio], (error, results) => {
    if (error) {
      console.error("Error al crear el ingrediente:", error);
      res.status(500).json({ error: "Error al crear el ingrediente." });
    } else {
      console.log("Ingrediente creado exitosamente.");
      res.status(201).json({ message: "Ingrediente creado exitosamente." });
    }
  });
});




// Obtener todos los ingredientes
app.get("/ingredientes", (req, res) => {
  const query = "SELECT * FROM Restaurant.INGREDIENTES";
  
  connection.query(query, (error, results) => {
    if (error) {
      res.status(500).json({ error: "Error al obtener los ingredientes." });
    } else {
      res.status(200).json(results);
    }
  });
});

// Obtener un ingrediente por su ID
app.get("/ingredientes/:id", (req, res) => {
  const { id } = req.params;
  const query = "SELECT * FROM Restaurant.INGREDIENTES WHERE ID_I = ?";
  
  connection.query(query, [id], (error, results) => {
    if (error) {
      res.status(500).json({ error: "Error al obtener el ingrediente." });
    } else {
      if (results.length === 0) {
        res.status(404).json({ message: "Ingrediente no encontrado." });
      } else {
        res.status(200).json(results[0]);
      }
    }
  });
});

// Actualizar un ingrediente por su ID
app.put("/ingredientes/:id", (req, res) => {
  const { id } = req.params;
  const { nombre, descripcion, precio } = req.body;
  
  const query = "UPDATE Restaurant.INGREDIENTES SET NOMBRE_I = ?, DESCRIPCION_I = ?, PRECIO_I = ? WHERE ID_I = ?";
  
  connection.query(query, [nombre, descripcion, precio, id], (error, results) => {
    if (error) {
      res.status(500).json({ error: "Error al actualizar el ingrediente." });
    } else {
      res.status(200).json({ message: "Ingrediente actualizado exitosamente." });
    }
  });
});

// Eliminar un ingrediente por su ID
app.delete("/ingredientes/:id", (req, res) => {
  const { id } = req.params;
  const query = "DELETE FROM Restaurant.INGREDIENTES WHERE ID_I = ?";
  
  connection.query(query, [id], (error, results) => {
    if (error) {
      res.status(500).json({ error: "Error al eliminar el ingrediente." });
    } else {
      res.status(200).json({ message: "Ingrediente eliminado exitosamente." });
    }
  });
});

app.get("/ingredientes/nombre/:nombre", (req, res) => {
  const { nombre } = req.params;
  const query = "SELECT ID_I FROM INGREDIENTES WHERE NOMBRE_I = ?";

  connection.query(query, [nombre], (error, results) => {
    if (error) {
      res
        .status(500)
        .json({ error: "Error al obtener el ID del ingrediente." });
    } else {
      if (results.length > 0) {
        const idIngrediente = results[0].ID_I;
        res.status(200).json({ id: idIngrediente });
      } else {
        res.status(404).json({ error: "Ingrediente no encontrado." });
      }
    }
  });
});

//================================================================
//RECETA
//================================================================

// Crear una nueva receta
app.post("/recetas", (req, res) => {
  const { id_i, id_pl, peso_re, descripcion_re, nombre_re } = req.body;

  const query = "INSERT INTO RECETA (ID_I, ID_PL, PESO_RE, DESCRIPCION_RE, NOMBRE_RE) VALUES (?, ?, ?, ?, ?)";
  
  connection.query(query, [id_i, id_pl, peso_re, descripcion_re, nombre_re], (error, results) => {
    if (error) {
      console.error("Error al crear la receta:", error);
      res.status(500).json({ error: "Error al crear la receta." });
    } else {
      console.log("Receta creada exitosamente.");
      res.status(201).json({ message: "Receta creada exitosamente." });
    }
  });
});

//Leer todas las recetas
app.get("/recetas", (req, res) => {
  const query = "SELECT * FROM RECETA";

  connection.query(query, (error, results) => {
    if (error) {
      console.error("Error al obtener las recetas:", error);
      res.status(500).json({ error: "Error al obtener las recetas." });
    } else {
      res.status(200).json(results);
    }
  });
});

// Leer una receta por ID
app.get("/recetas/:id", (req, res) => {
  const recetaId = req.params.id;
  const query = "SELECT * FROM RECETA WHERE ID_RE = ?";
  
  connection.query(query, [recetaId], (error, results) => {
    if (error) {
      console.error("Error al obtener la receta:", error);
      res.status(500).json({ error: "Error al obtener la receta." });
    } else {
      if (results.length === 0) {
        res.status(404).json({ message: "Receta no encontrada." });
      } else {
        res.status(200).json(results[0]);
      }
    }
  });
});

// Actualizar una receta por ID
app.put("/recetas/:id", (req, res) => {
  const recetaId = req.params.id;
  const { id_i, id_pl, peso_re, descripcion_re, nombre_re } = req.body;

  const query = "UPDATE RECETA SET ID_I = ?, ID_PL = ?, PESO_RE = ?, DESCRIPCION_RE = ?, NOMBRE_RE = ? WHERE ID_RE = ?";
  
  connection.query(query, [id_i, id_pl, peso_re, descripcion_re, nombre_re, recetaId], (error, results) => {
    if (error) {
      console.error("Error al actualizar la receta:", error);
      res.status(500).json({ error: "Error al actualizar la receta." });
    } else {
      console.log("Receta actualizada exitosamente.");
      res.status(200).json({ message: "Receta actualizada exitosamente." });
    }
  });
});


// Eliminar una receta por ID
app.delete("/recetas/:id", (req, res) => {
  const recetaId = req.params.id;
  const query = "DELETE FROM RECETA WHERE ID_RE = ?";
  
  connection.query(query, [recetaId], (error, results) => {
    if (error) {
      console.error("Error al eliminar la receta:", error);
      res.status(500).json({ error: "Error al eliminar la receta." });
    } else {
      console.log("Receta eliminada exitosamente.");
      res.status(200).json({ message: "Receta eliminada exitosamente." });
    }
  });
});



//================================================================


// Obtener todos los platos
app.get("/api/platos", (req, res) => {
  const query = "SELECT * FROM Restaurant.PLATO";

  connection.query(query, (error, rows) => {
    if (error) {
      console.error("Error al obtener los platos:", error);
      res.sendStatus(500);
    } else {
      res.send(rows);
    }
  });
});

// Crear un nuevo plato
app.post("/api/platos", fileUpload, (req, res) => {
  const { Nombre, Categoria, Precio } = req.body;
  const FotoPath = req.file ? `/uploads/${req.file.filename}` : null;

  const query =
    "INSERT INTO Restaurant.plato (NOMBRE_PL, CATEGORIA_PL, PRECIO_PL, FOTO_PL) VALUES (?, ?, ?, ?)";

  connection.query(
    query,
    [Nombre, Categoria, Precio, FotoPath],
    (error, result) => {
      if (error) {
        console.error("Error al crear el plato:", error);
        res.sendStatus(500);
      } else {
        console.log("Plato creado exitosamente");
        res.json({
          ID_PL: result.insertId,
          NOMBRE_PL: Nombre,
          CATEGORIA_PL: Categoria,
          PRECIO_PL: Precio,
          FOTO_PL: FotoPath,
        });
      }
    }
  );
});

// Actualizar los datos de un plato por ID
app.put("/api/platos/:id", fileUpload, (req, res) => {
  const id = req.params.id;
  const { Nombre, Categoria, Precio } = req.body;
  const FotoPath = req.file ? `/uploads/${req.file.filename}` : null;

  const query =
    "UPDATE Restaurant.PLATO SET NOMBRE_PL = ?, CATEGORIA_PL = ?, PRECIO_PL = ?, FOTO_PL = ? WHERE ID_PL = ?";

  connection.query(
    query,
    [Nombre, Categoria, Precio, FotoPath, id],
    (error, result) => {
      if (error) {
        console.error("Error al actualizar el plato:", error);
        res.sendStatus(500);
      } else {
        console.log("Plato actualizado exitosamente");
        res.sendStatus(200);
      }
    }
  );
});

// Actualizar solo el estado del plato
app.put("/api/platos/:id/estado", (req, res) => {
  const id = req.params.id;
  const { Estado } = req.body;

  const query = "UPDATE Restaurant.PLATO SET ESTADO_PL = ? WHERE ID_PL = ?";

  connection.query(query, [Estado, id], (error, result) => {
    if (error) {
      console.error("Error al actualizar el estado del plato:", error);
      res.sendStatus(500);
    } else {
      console.log("Estado del plato actualizado exitosamente");
      res.sendStatus(200);
    }
  });
});

// Eliminar un plato por ID
app.delete("/api/platos/:id", (req, res) => {
  const id = req.params.id;
  const query = "DELETE FROM Restaurant.PLATO WHERE ID_PL = ?";

  connection.query(query, [id], (error, result) => {
    if (error) {
      console.error("Error al eliminar el plato:", error);
      res.sendStatus(500);
    } else {
      console.log("Plato eliminado exitosamente");
      res.sendStatus(200);
    }
  });
});

// CRUD de "Orden"

// Obtener todas las órdenes
app.get("/api/ordenes", (req, res) => {
  const query = "SELECT * FROM ORDEN";

  connection.query(query, (error, rows) => {
    if (error) {
      console.error("Error al obtener las órdenes:", error);
      res.sendStatus(500);
    } else {
      res.send(rows);
    }
  });
});

// Obtener datos de una orden por su ID
app.get("/api/ordenes/:id", (req, res) => {
  const idOrden = req.params.id;

  const query = "SELECT * FROM ORDEN WHERE ID_OR = ?";

  connection.query(query, [idOrden], (error, rows) => {
    if (error) {
      console.error("Error al obtener los datos de la orden:", error);
      res.sendStatus(500);
    } else {
      if (rows.length > 0) {
        // Si se encontró una orden con el ID especificado, envía los datos de la orden
        res.status(200).json(rows[0]);
      } else {
        // Si no se encontró ninguna orden con el ID especificado, envía una respuesta vacía
        res.status(204).end();
      }
    }
  });
});

// Crear una nueva orden
app.post("/api/ordenes", (req, res) => {
  const { CEDULA_CL, ID_EMP, FECHA_OR, NMESA_OR, DESCRIPCION_OR, ESTADO_OR } =
    req.body;

  // Verificar si ya existe una orden para esta mesa (NumMesa)
  const selectQuery =
    "SELECT * FROM ORDEN WHERE NMESA_OR = ? AND ESTADO_OR = ?";
  connection.query(selectQuery, [NMESA_OR, "En proceso"], (error, results) => {
    if (error) {
      console.error("Error al verificar la orden existente:", error);
      res.sendStatus(500);
      return;
    }

    if (results.length > 0) {
      // Actualizar la orden existente
      const orderId = results[0].ID_OR;
      const updateQuery =
        "UPDATE ORDEN SET CEDULA_CL = ?, FECHA_OR = ?, DESCRIPCION_OR = ? WHERE ID_OR = ?";
      connection.query(
        updateQuery,
        [CEDULA_CL, FECHA_OR, DESCRIPCION_OR, orderId],
        (error, result) => {
          if (error) {
            console.error("Error al actualizar la orden:", error);
            res.sendStatus(500);
          } else {
            console.log("Orden actualizada exitosamente");
            res.json({
              ID_OR: orderId,
              CEDULA_CL,
              ID_EMP,
              FECHA_OR,
              NMESA_OR,
              DESCRIPCION_OR,
              ESTADO_OR,
            });
          }
        }
      );
    } else {
      // Crear una nueva orden
      const insertQuery =
        "INSERT INTO ORDEN (CEDULA_CL, ID_EMP, FECHA_OR, NMESA_OR, DESCRIPCION_OR, ESTADO_OR) VALUES (?, ?, ?, ?, ?, ?)";
      connection.query(
        insertQuery,
        [CEDULA_CL, ID_EMP, FECHA_OR, NMESA_OR, DESCRIPCION_OR, ESTADO_OR],
        (error, result) => {
          if (error) {
            console.error("Error al crear la orden:", error);
            res.sendStatus(500);
          } else {
            console.log("Orden creada exitosamente");
            res.json({
              ID_OR: result.insertId,
              CEDULA_CL,
              ID_EMP,
              FECHA_OR,
              NMESA_OR,
              DESCRIPCION_OR,
              ESTADO_OR,
            });
          }
        }
      );
    }
  });
});

app.put("/api/ordenes/:id", (req, res) => {
  const idOrden = req.params.id;
  const { CEDULA_CL, NMESA_OR, DESCRIPCION_OR, ESTADO_OR } = req.body;

  const query =
    "UPDATE ORDEN SET CEDULA_CL = ?, NMESA_OR = ?, DESCRIPCION_OR = ?, ESTADO_OR = ? WHERE ID_OR = ?";

  connection.query(
    query,
    [CEDULA_CL, NMESA_OR, DESCRIPCION_OR, ESTADO_OR, idOrden],
    (error, result) => {
      if (error) {
        console.error("Error al actualizar la orden:", error);
        res.sendStatus(500);
      } else {
        console.log("Orden actualizada exitosamente");
        res.sendStatus(200);
      }
    }
  );
});

app.put("/api/ordenesEstado/:id", (req, res) => {
  const idOrden = req.params.id;
  const { ESTADO_OR } = req.body;

  const query = "UPDATE ORDEN SET ESTADO_OR = ? WHERE ID_OR = ?";

  connection.query(query, [ESTADO_OR, idOrden], (error, result) => {
    if (error) {
      console.error("Error al actualizar la orden:", error);
      res.sendStatus(500);
    } else {
      console.log("Orden actualizada exitosamente");
      res.sendStatus(200);
    }
  });
});

app.post("/api/pedidos", (req, res) => {
  const { ID_PL, ID_OR, PRECIO_PE, CANTXPLA_PE, ESTADO_PE, CANTREALIZADA_PE, PARALLEVAR_PE } = req.body;

  const query =
    "INSERT INTO PEDIDO (ID_PL, ID_OR, PRECIO_PE, CANTXPLA_PE, ESTADO_PE, CANTREALIZADA_PE, PARALLEVAR_PE) VALUES (?, ?, ?, ?, ?, ?, ?)";

  connection.query(
    query,
    [ID_PL, ID_OR, PRECIO_PE, CANTXPLA_PE, ESTADO_PE, CANTREALIZADA_PE, PARALLEVAR_PE],
    (error, result) => {
      if (error) {
        console.error("Error al crear el pedido:", error);
        res.sendStatus(500);
      } else {
        console.log("Pedido creado exitosamente");
        res.json({
          ID_PL,
          ID_OR,
          PRECIO_PE,
          CANTXPLA_PE,
          ESTADO_PE,
        });
      }
    }
  );
});

app.get("/api/pedidos", (req, res) => {
  const query = "SELECT * FROM PEDIDO";

  connection.query(query, (error, rows) => {
    if (error) {
      console.error("Error al obtener los pedidos:", error);
      res.sendStatus(500);
    } else {
      res.send(rows);
    }
  });
});

app.post("/api/pedidosNuevos", (req, res) => {
  const { ID_PL, ID_OR, PRECIO_PE, CANTXPLA_PE, ESTADO_PE, CANTREALIZADA_PE, PARALLEVAR_PE } = req.body;

  // Check if a pedido with the given ID_PL and ID_OR already exists
  const selectQuery = "SELECT * FROM PEDIDO WHERE ID_PL = ? AND ID_OR = ?";
  connection.query(selectQuery, [ID_PL, ID_OR], (error, results) => {
    if (error) {
      console.error("Error verifying existing pedido:", error);
      res.sendStatus(500);
      return;
    }

    if (results.length > 0) {
      // Update the existing pedido
      const updateQuery =
        "UPDATE PEDIDO SET PRECIO_PE = ?, CANTXPLA_PE = ?, ESTADO_PE = ?, PARALLEVAR_PE = ? WHERE ID_PL = ? AND ID_OR = ?";
      connection.query(
        updateQuery,
        [PRECIO_PE, CANTXPLA_PE, ESTADO_PE, PARALLEVAR_PE, ID_PL, ID_OR],
        (error, result) => {
          if (error) {
            console.error("Error updating pedido:", error);
            res.sendStatus(500);
          } else {
            console.log("Pedido updated successfully");
            res.json({
              ID_PL,
              ID_OR,
              PRECIO_PE,
              CANTXPLA_PE,
              ESTADO_PE,
              PARALLEVAR_PE,
            });
          }
        }
      );
    } else {
      // Create a new pedido
      const insertQuery =
        "INSERT INTO PEDIDO (ID_PL, ID_OR, PRECIO_PE, CANTXPLA_PE, ESTADO_PE, CANTREALIZADA_PE, PARALLEVAR_PE) VALUES (?, ?, ?, ?, ?, ?, ?)";
      connection.query(
        insertQuery,
        [ID_PL, ID_OR, PRECIO_PE, CANTXPLA_PE, ESTADO_PE, CANTREALIZADA_PE, PARALLEVAR_PE],
        (error, result) => {
          if (error) {
            console.error("Error creating pedido:", error);
            res.sendStatus(500);
          } else {
            console.log("Pedido created successfully");
            res.json({
              ID_PL,
              ID_OR,
              PRECIO_PE,
              CANTXPLA_PE,
              ESTADO_PE,
              CANTREALIZADA_PE,
              PARALLEVAR_PE,
            });
          }
        }
      );
    }
  });
});


app.get("/api/pedidos/:id", (req, res) => {
  const idOrden = req.params.id;
  const query = "SELECT * FROM PEDIDO WHERE ID_OR = ?";

  connection.query(query, [idOrden], (error, rows) => {
    if (error) {
      console.error("Error al obtener los pedidos:", error);
      res.sendStatus(500);
    } else {
      res.send(rows);
    }
  });
});

app.get("/api/ordenes/:id", (req, res) => {
  const idOrden = req.params.id;

  const query = "SELECT * FROM ORDEN WHERE ID_OR = ?";

  connection.query(query, [idOrden], (error, rows) => {
    if (error) {
      console.error("Error al obtener la orden:", error);
      res.sendStatus(500);
    } else {
      if (rows.length > 0) {
        res.status(200).json(rows[0]);
      } else {
        res.status(204).end();
      }
    }
  });
});

app.put("/api/pedidos/:id", (req, res) => {
  const idPedido = req.params.id;
  const { ID_PL, ID_OR, PRECIO_PE, CANTXPLA_PE, ESTADO_PE } = req.body;

  const query =
    "UPDATE PEDIDO SET ID_PL = ?, ID_OR = ?, PRECIO_PE = ?, CANTXPLA_PE = ?, ESTADO_PE = ? WHERE ID_PL = ?";

  connection.query(
    query,
    [ID_PL, ID_OR, PRECIO_PE, CANTXPLA_PE, ESTADO_PE, idPedido],
    (error, result) => {
      if (error) {
        console.error("Error al actualizar el pedido:", error);
        res.sendStatus(500);
      } else {
        console.log("Pedido actualizado exitosamente");
        res.sendStatus(200);
      }
    }
  );
});

app.put("/api/pedidosEstado/:id1/:id2", (req, res) => {
  const idPlato = req.params.id1;
  const idOrden = req.params.id2;
  const { ESTADO_PE, CANTREALIZADA_PE } = req.body;

  const query =
    "UPDATE PEDIDO SET ESTADO_PE = ?, CANTREALIZADA_PE = ? WHERE ID_PL = ? AND ID_OR = ?";

  connection.query(
    query,
    [ESTADO_PE, CANTREALIZADA_PE, idPlato, idOrden],
    (error, result) => {
      if (error) {
        console.error("Error al actualizar el pedido:", error);
        res.sendStatus(500);
      } else {
        console.log("Pedido actualizado exitosamente");
        res.sendStatus(200);
      }
    }
  );
});

app.delete("/api/pedidos/:id/:id2", (req, res) => {
  const idPedido = req.params.id;
  const idOrden = req.params.id2;

  const query = "DELETE FROM PEDIDO WHERE ID_PL = ? AND ID_OR = ?";

  connection.query(query, [idPedido, idOrden], (error, result) => {
    if (error) {
      console.error("Error al eliminar el pedido:", error);
      res.sendStatus(500);
    } else {
      console.log("Pedido eliminado exitosamente");
      res.sendStatus(200);
    }
  });
});

// Obtener todas las órdenes con información de los platos pedidos
app.get("/api/ordenescocina", (req, res) => {
  const query = `
    SELECT
      O.ID_OR,
      O.DESCRIPCION_OR,
      O.ESTADO_OR,
      NMESA_OR,
      P.ID_PL AS ID_PLATO_PEDIDO,
      P.NOMBRE_PL AS NOMBRE_PLATO_PEDIDO,
      PE.CANTXPLA_PE AS CANTIDAD_PLATOS_PEDIDOS,
      PE.ESTADO_PE AS ESTADO_PLATO,
      PE.CANTREALIZADA_PE AS PLATOS_REALIZADOS
    FROM ORDEN O
    JOIN PEDIDO PE ON O.ID_OR = PE.ID_OR
    JOIN PLATO P ON PE.ID_PL = P.ID_PL
  `;

  connection.query(query, (error, rows) => {
    if (error) {
      console.error(
        "Error al obtener las órdenes con información de platos:",
        error
      );
      res.sendStatus(500);
    } else {
      res.send(rows);
    }
  });
});

app.put("/api/pedidosCantidad/:idPlato/:idOrden", (req, res) => {
  const idPlato = req.params.idPlato;
  const idOrden = req.params.idOrden;
  const { PRECIO_PE,PARA_LLEVAR ,CANTXPLA_PE ,ESTADO_PE } = req.body;

  const updateQuery = "UPDATE PEDIDO SET PRECIO_PE = ?, PARALLEVAR_PE = ? ,CANTXPLA_PE = ?, ESTADO_PE = ? WHERE ID_PL = ? AND ID_OR = ?";
  connection.query(updateQuery, [PRECIO_PE, PARA_LLEVAR ,CANTXPLA_PE, ESTADO_PE,idPlato, idOrden], (error, result) => {
    if (error) {
      console.error("Error updating pedido:", error);
      res.sendStatus(500);
    } else {
      console.log("Pedido updated successfully");
      res.json({ message: "Pedido updated successfully" });
    }
  });
});


app.get("/api/ordenescocina/:idOrden", (req, res) => {
  const idOrden = req.params.idOrden;

  const query = `
    SELECT
      O.ID_OR,
      O.DESCRIPCION_OR,
      O.ESTADO_OR,
      O.NMESA_OR,
      C.CEDULA_CL,
      C.NOMBRE_CL,
      P.ID_PL AS ID_PLATO_PEDIDO,
      P.NOMBRE_PL AS NOMBRE_PLATO_PEDIDO,
      P.PRECIO_PL AS PRECIO_PLATO,
      P.CATEGORIA_PL AS CATEGORIA_PLATO,
      PE.CANTXPLA_PE AS CANTIDAD_PLATOS_PEDIDOS,
      PE.ESTADO_PE AS ESTADO_PLATO,
      PE.CANTREALIZADA_PE AS PLATOS_REALIZADOS,
      PE.PRECIO_PE AS PRECIO_PLATOS,  
      PE.PARALLEVAR_PE AS PARA_LLEVAR
    FROM ORDEN O
    JOIN PEDIDO PE ON O.ID_OR = PE.ID_OR
    JOIN PLATO P ON PE.ID_PL = P.ID_PL
    JOIN CLIENTE C ON O.CEDULA_CL = C.CEDULA_CL
    WHERE O.ID_OR = ?
  `;

  app.put("/api/ordenescocina/:idOrden/update-plato", (req, res) => {
    const idOrden = req.params.idOrden;
    const updatedPlatoData = req.body;
  
    // Update the database with the updated order details
    const updateQuery = `
      UPDATE PEDIDO
      SET CANTXPLA_PE = ?,
          ESTADO_PE = ?
      WHERE ID_OR = ? AND ID_PL = ?
    `;
  
    const { CANTIDAD_PLATOS_PEDIDOS, ESTADO_PLATO, ID_PLATO_PEDIDO } = updatedPlatoData;
  
    connection.query(
      updateQuery,
      [CANTIDAD_PLATOS_PEDIDOS, ESTADO_PLATO, idOrden, ID_PLATO_PEDIDO],
      (error, result) => {
        if (error) {
          console.error("Error updating order details:", error);
          res.sendStatus(500);
        } else {
          res.send({ message: "Order details updated successfully" });
        }
      }
    );
  });
  

  connection.query(query, [idOrden], (error, rows) => {
    if (error) {
      console.error("Error al obtener la orden con información de platos y cliente:", error);
      res.sendStatus(500);
    } else {
      res.send(rows);
    }
  });
});

app.put('/api/domicilio/:idPlato/:idOrden', (req, res) => {
  const idPlato = req.params.idPlato;
  const idOrden = req.params.idOrden;
  const { PRECIO_PE, PARA_LLEVAR } = req.body;

  const updateQuery = `
    UPDATE PEDIDO
    SET PRECIO_PE = ?, PARALLEVAR_PE = ?
    WHERE ID_PL = ? AND ID_OR = ?
  `;

  connection.query(
    updateQuery,
    [PRECIO_PE, PARA_LLEVAR, idPlato, idOrden],
    (error, result) => {
      if (error) {
        console.error('Error al actualizar el pedido:', error);
        res.status(500).json({ error: 'Error al actualizar el pedido' });
      } else {
        console.log('Pedido actualizado exitosamente');
        res.status(200).json({ message: 'Pedido actualizado exitosamente' });
      }
    }
  );
});

// Agregar un nuevo ingrediente
app.post("/api/ingredientes", (req, res) => {
  const { NOMBRE_I, DESCRIPCION_I, PRECIO_I } = req.body;

  const query =
    "INSERT INTO Restaurant.ingredientes (NOMBRE_I, DESCRIPCION_I, PRECIO_I) VALUES (?, ?, ?)";

  connection.query(
    query,
    [NOMBRE_I, DESCRIPCION_I, PRECIO_I],
    (error, result) => {
      if (error) {
        console.error("Error al agregar el ingrediente:", error);
        res.sendStatus(500);
      } else {
        console.log("Ingrediente agregado exitosamente");
        res.json({ ID_I: result.insertId, NOMBRE_I, DESCRIPCION_I, PRECIO_I });
      }
    }
  );
});

// Obtener todos los clientes
app.get("/api/clientes", (req, res) => {
  const query = "SELECT * FROM cliente";

  connection.query(query, (error, rows) => {
    if (error) {
      console.error("Error al obtener los clientes:", error);
      res.sendStatus(500);
    } else {
      res.send(rows);
    }
  });
});

// Obtener datos de un cliente por cédula
app.get("/api/clientes/:cedula", (req, res) => {
  const cedula = req.params.cedula;

  const query = "SELECT * FROM cliente WHERE CEDULA_CL = ?";

  connection.query(query, [cedula], (error, rows) => {
    if (error) {
      console.error("Error al obtener los datos del cliente:", error);
      res.sendStatus(500);
    } else {
      if (rows.length > 0) {
        // Si se encontró un cliente con la cédula especificada, envía los datos del cliente
        res.status(200).json(rows[0]);
      } else {
        // Si no se encontró ningún cliente con la cédula especificada, envía una respuesta vacía
        res.status(204).end();
      }
    }
  });
});

// Crear un nuevo cliente o actualizar si la cédula ya existe
app.post("/api/clientes", (req, res) => {
  const {
    CEDULA_CLI,
    NOMBRE_CLI,
    CORREO_CLI,
    DIRECCION_CLI,
    TELEFONO_CLI,
    NO_PROPORCIONA,
  } = req.body;
  console.log(
    CEDULA_CLI,
    NOMBRE_CLI,
    CORREO_CLI,
    DIRECCION_CLI,
    TELEFONO_CLI,
    NO_PROPORCIONA
  );

  // Validar que se ingresen los datos requeridos (cedula y nombre) si NO_PROPORCIONA es false
  if (!NO_PROPORCIONA && (!CEDULA_CLI || !NOMBRE_CLI)) {
    return res
      .status(400)
      .json({ error: "La cédula y el nombre del cliente son obligatorios" });
  }

  // Consultar si el cliente ya existe por cédula
  const queryBuscarCliente = "SELECT * FROM cliente WHERE CEDULA_CL = ?";
  connection.query(queryBuscarCliente, [CEDULA_CLI], (error, result) => {
    if (error) {
      console.error("Error al buscar el cliente:", error);
      return res.sendStatus(500);
    }

    if (result.length > 0) {
      // Si el cliente ya existe, actualizar sus datos si NO_PROPORCIONA es false
      if (!NO_PROPORCIONA) {
        const queryActualizarCliente =
          "UPDATE cliente SET NOMBRE_CL = ?, CORREO_CL = ?,DIRECCION_CL = ?, TELEFONO_CL = ? WHERE CEDULA_CL = ?";
        connection.query(
          queryActualizarCliente,
          [NOMBRE_CLI, CORREO_CLI, DIRECCION_CLI, TELEFONO_CLI, CEDULA_CLI],
          (error, result) => {
            if (error) {
              console.error("Error al actualizar el cliente:", error);
              res.sendStatus(500);
            } else {
              console.log("Cliente actualizado exitosamente");
              res.sendStatus(200);
            }
          }
        );
      } else {
        // Si NO_PROPORCIONA es true, no se hacen cambios en el cliente existente
        console.log("Cliente existente, no se realizaron cambios");
        res.sendStatus(200);
      }
    } else {
      // Si el cliente no existe, crearlo
      let query;
      if (NO_PROPORCIONA) {
        query = "INSERT INTO cliente (CEDULA_CL, NOMBRE_CL) VALUES (?, ?)";
      } else {
        query =
          "INSERT INTO cliente (CEDULA_CL, NOMBRE_CL, CORREO_CL, DIRECCION_CL, TELEFONO_CL) VALUES (? ,? ,?, ?, ?)";
      }

      connection.query(
        query,
        [CEDULA_CLI, NOMBRE_CLI, CORREO_CLI, DIRECCION_CLI, TELEFONO_CLI],
        (error, result) => {
          if (error) {
            console.error("Error al crear el cliente:", error);
            res.sendStatus(500);
          } else {
            console.log("Cliente creado exitosamenteS");
            res.sendStatus(200);
          }
        }
      );
    }
  });
});

//EMPLEADO
app.get("/api/get", (req, res) => {
  const sqlSelect = "SELECT * FROM EMPLEADO";
  connection.query(sqlSelect, (err, rows, results) => {
    res.send(rows);
  });
});

app.post("/api/login", (req, res) => {
  const USUARIO_EMP = req.body.USUARIO_EMP;
  const CONTRASENA_EMP = req.body.CONTRASENA_EMP;
  const CARGO_EMP = req.body.CARGO_EMP;

  connection.query(
    "SELECT * FROM EMPLEADO WHERE USUARIO_EMP = ? AND CONTRASENA_EMP = ?",
    [USUARIO_EMP, CONTRASENA_EMP],
    (err, result) => {
      if (err) {
        res.send({ err: err });
      }

      if (result.length > 0) {
        const user = result[0];
        res.send(user); // Enviar el objeto de usuario completo, incluido el campo de cargo
      } else {
        res.send({ message: "Usuario o contraseña incorrecta!" });
      }
    }
  );
});

app.listen(PORT, () => {
  console.log(`Servidor en ejecución en http://localhost:${PORT}`);
});

app.get("/api/factura", (req, res) => {
  const query = `
  SELECT
    O.ID_OR,
    O.DESCRIPCION_OR,
    O.ESTADO_OR,
    O.NMESA_OR,
    C.CEDULA_CL,
    C.NOMBRE_CL,
    C.CORREO_CL,
    C.TELEFONO_CL,
    C.DIRECCION_CL,
    P.ID_PL AS ID_PLATO_PEDIDO,
    P.NOMBRE_PL AS NOMBRE_PLATO_PEDIDO,
    P.PRECIO_PL AS PRECIO_PE,
    PE.CANTXPLA_PE AS CANTIDAD_PLATOS_PEDIDOS,
    PE.ESTADO_PE AS ESTADO_PLATO,
    PE.PARALLEVAR_PE AS PARA_LLEVAR
  FROM ORDEN O
  JOIN PEDIDO PE ON O.ID_OR = PE.ID_OR
  JOIN PLATO P ON PE.ID_PL = P.ID_PL
  JOIN CLIENTE C ON O.CEDULA_CL = C.CEDULA_CL
`;

  connection.query(query, (error, rows) => {
    if (error) {
      console.error(
        "Error al obtener las órdenes con información de platos y clientes:",
        error
      );
      res.sendStatus(500);
    } else {
      res.send(rows);
    }
  });
});

app.get("/api/settings", (req, res) => {
  const sqlSelect = "SELECT * FROM SETTINGS";
  connection.query(sqlSelect, (err, rows, results) => {
    res.send(rows);
  });
});

app.get("/api/ingredientes", (req, res) => {
  const sqlSelect = "SELECT * FROM INGREDIENTES";
  connection.query(sqlSelect, (err, rows, results) => {
    res.send(rows);
  });
});



// Crear una nueva factura
app.post("/api/factura", (req, res) => {
  const {
    ID_ORDEN,
    CEDULA_CL,
    NOMBRE_CL,
    CORREO_CL,
    TELEFONO_CL,
    DIRECCION_CL,
    TOTAL,
    FECHA
  } = req.body;

  const query =
    "INSERT INTO factura (ID_ORDEN, CEDULA_CL, NOMBRE_CL, CORREO_CL, TELEFONO_CL, DIRECCION_CL, TOTAL, FECHA) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";

  connection.query(
    query,
    [
      ID_ORDEN,
      CEDULA_CL,
      NOMBRE_CL,
      CORREO_CL,
      TELEFONO_CL,
      DIRECCION_CL,
      TOTAL,
      FECHA
    ],
    (error, result) => {
      if (error) {
        console.error("Error al crear la factura:", error);
        res.sendStatus(500);
      } else {
        console.log("Factura creada exitosamente");
        res.json({
          ID_FACTURA: result.insertId,
          ID_ORDEN,
          CEDULA_CL,
          NOMBRE_CL,
          CORREO_CL,
          TELEFONO_CL,
          DIRECCION_CL,
          TOTAL,
          FECHA
        });
      }
    }
  );
});


// Obtener historial de facturas
app.get("/api/factura/historial", (req, res) => {
  const query = "SELECT * FROM FACTURA";

  connection.query(query, (error, rows) => {
    if (error) {
      console.error("Error al obtener el historial de facturas:", error);
      res.sendStatus(500);
    } else {
      res.send(rows);
    }
  });
});

// Ejemplo de una nueva ruta para cambiar el estado a facturado
app.put("/api/orden/:id/facturado", (req, res) => {
  const orderId = req.params.id;

  const query = "UPDATE ORDEN SET ESTADO_OR = 'Facturado' WHERE ID_OR = ?";

  connection.query(query, [orderId], (error, result) => {
    if (error) {
      console.error("Error al cambiar el estado a facturado:", error);
      res.sendStatus(500);
    } else {
      res.sendStatus(200);
    }
  });
});

