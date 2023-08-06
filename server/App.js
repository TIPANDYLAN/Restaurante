const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require("fs");
const bodyParser = require("body-parser");
const app = express();
const PORT = 4000;

app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "dbuploads")));

// Configuración de Multer para manejar la carga de imágenes
const diskstorage = multer.diskStorage({
  destination: path.join(__dirname, "./uploads"),
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-kandela-" + file.originalname);
  },
});

const fileUpload = multer({
  storage: diskstorage,
}).single("Foto");

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'password',
  database: 'Restaurant'
});

connection.connect((error) => {
  if (error) {
    console.error('Error al conectar a la base de datos:', error);
  } else {
    console.log('Conexión exitosa a la base de datos');
  }
});

// Obtener todos los platos
app.get('/api/platos', (req, res) => {
  const query = 'SELECT * FROM Restaurant.PLATO';

  connection.query(query, (error, rows) => {
    if (error) {
      console.error('Error al obtener los platos:', error);
      res.sendStatus(500);
    } else {
      rows.map((img) => {
        if (img.FOTO_PL) {
          const imagePath = path.join(__dirname, "dbuploads", img.ID_PL + "-kandela.png");
          fs.writeFile(imagePath, img.FOTO_PL, "binary", (writeError) => {
            if (writeError) {
              console.error('Error al guardar la imagen:', writeError);
            }
          });
        }
      });
      res.send(rows);
    }
  });
});

// Crear un nuevo plato
app.post('/api/platos', fileUpload, (req, res) => {
  const { Nombre, Categoria, Precio, Descripcion } = req.body;
  const Foto = fs.readFileSync(
    path.join(__dirname, "./uploads/" + req.file.filename)
  );

  const query = 'INSERT INTO Restaurant.plato (NOMBRE_PL, CATEGORIA_PL, PRECIO_PL, FOTO_PL, DESCRIPCION_PL) VALUES (?, ?, ?, ?, ?)';

  connection.query(query, [Nombre, Categoria, Precio, Foto, Descripcion], (error, result) => {
    if (error) {
      console.error('Error al crear el plato:', error);
      res.sendStatus(500);
    } else {
      console.log('Plato creado exitosamente');
      res.json({ ID_PL: result.insertId, NOMBRE_PL: Nombre, CATEGORIA_PL: Categoria, PRECIO_PL: Precio, FOTO_PL: Foto, DESCRIPCION_PL: Descripcion });
    }
  });
});

app.put('/api/platos/:id', fileUpload, (req, res) => {
  const id = req.params.id;
  const { Nombre, Categoria, Precio, Descripcion } = req.body;
  const Foto = req.file ? fs.readFileSync(path.join(__dirname, "./uploads/" + req.file.filename)) : null;

  const query = 'UPDATE Restaurant.PLATO SET NOMBRE_PL = ?, CATEGORIA_PL = ?, PRECIO_PL = ?, FOTO_PL = ?, DESCRIPCION_PL = ? WHERE ID_PL = ?';

  connection.query(query, [Nombre, Categoria, Precio, Foto, Descripcion, id], (error, result) => {
    if (error) {
      console.error('Error al actualizar el plato:', error);
      res.sendStatus(500);
    } else {
      console.log('Plato actualizado exitosamente');
      res.sendStatus(200);
    }
  });
});

// Eliminar un plato por ID
app.delete('/api/platos/:id', (req, res) => {
  const id = req.params.id;
  const query = 'DELETE FROM Restaurant.plato WHERE ID_PL = ?';

  connection.query(query, id, (error, result) => {
    if (error) {
      console.error('Error al eliminar el plato:', error);
      res.sendStatus(500);
    } else {
      console.log('Plato eliminado exitosamente');
      res.sendStatus(200);
    }
  });
});

// CRUD de "Orden"

// Obtener todas las órdenes
app.get('/api/ordenes', (req, res) => {
  const query = 'SELECT * FROM ORDEN';

  connection.query(query, (error, rows) => {
    if (error) {
      console.error('Error al obtener las órdenes:', error);
      res.sendStatus(500);
    } else {
      res.send(rows);
    }
  });
});

// Obtener datos de una orden por su ID
app.get('/api/ordenes/:id', (req, res) => {
  const idOrden = req.params.id;

  const query = 'SELECT * FROM ORDEN WHERE ID_OR = ?';

  connection.query(query, [idOrden], (error, rows) => {
    if (error) {
      console.error('Error al obtener los datos de la orden:', error);
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
app.post('/api/ordenes', (req, res) => {
  const { CEDULA_CL, ID_EMP, FECHA_OR, NMESA_OR, DESCRIPCION_OR, ESTADO_OR } = req.body;

  // Verificar si ya existe una orden para esta mesa (NumMesa)
  const selectQuery = 'SELECT * FROM ORDEN WHERE NMESA_OR = ? AND ESTADO_OR = ?';
  connection.query(selectQuery, [NMESA_OR, 'En proceso'], (error, results) => {
    if (error) {
      console.error('Error al verificar la orden existente:', error);
      res.sendStatus(500);
      return;
    }

    if (results.length > 0) {
      // Actualizar la orden existente
      const orderId = results[0].ID_OR;
      const updateQuery = 'UPDATE ORDEN SET CEDULA_CL = ?, FECHA_OR = ?, DESCRIPCION_OR = ? WHERE ID_OR = ?';
      connection.query(updateQuery, [CEDULA_CL, FECHA_OR, DESCRIPCION_OR, orderId], (error, result) => {
        if (error) {
          console.error('Error al actualizar la orden:', error);
          res.sendStatus(500);
        } else {
          console.log('Orden actualizada exitosamente');
          res.json({ ID_OR: orderId, CEDULA_CL, ID_EMP, FECHA_OR, NMESA_OR, DESCRIPCION_OR, ESTADO_OR });
        }
      });
    } else {
      // Crear una nueva orden
      const insertQuery = 'INSERT INTO ORDEN (CEDULA_CL, ID_EMP, FECHA_OR, NMESA_OR, DESCRIPCION_OR, ESTADO_OR) VALUES (?, ?, ?, ?, ?, ?)';
      connection.query(insertQuery, [CEDULA_CL, ID_EMP, FECHA_OR, NMESA_OR, DESCRIPCION_OR, ESTADO_OR], (error, result) => {
        if (error) {
          console.error('Error al crear la orden:', error);
          res.sendStatus(500);
        } else {
          console.log('Orden creada exitosamente');
          res.json({ ID_OR: result.insertId, CEDULA_CL, ID_EMP, FECHA_OR, NMESA_OR, DESCRIPCION_OR, ESTADO_OR });
        }
      });
    }
  });
});



app.put('/api/ordenes/:id', (req, res) => {
  const idOrden = req.params.id;
  const { CEDULA_CL, NMESA_OR, DESCRIPCION_OR, ESTADO_OR } = req.body;

  const query = 'UPDATE ORDEN SET CEDULA_CL = ?, NMESA_OR = ?, DESCRIPCION_OR = ?, ESTADO_OR = ? WHERE ID_OR = ?';

  connection.query(query, [CEDULA_CL, NMESA_OR, DESCRIPCION_OR, ESTADO_OR, idOrden], (error, result) => {
    if (error) {
      console.error('Error al actualizar la orden:', error);
      res.sendStatus(500);
    } else {
      console.log('Orden actualizada exitosamente');
      res.sendStatus(200);
    }
  });
});

app.post('/api/pedidos', (req, res) => {
  const { ID_PL, ID_OR, PRECIO_PE, CANTXPLA_PE, ESTADO_PE } = req.body;

  const query = 'INSERT INTO PEDIDO (ID_PL, ID_OR, PRECIO_PE, CANTXPLA_PE, ESTADO_PE) VALUES (?, ?, ?, ?, ?)';

  connection.query(query, [ID_PL, ID_OR, PRECIO_PE, CANTXPLA_PE, ESTADO_PE], (error, result) => {
    if (error) {
      console.error('Error al crear el pedido:', error);
      res.sendStatus(500);
    } else {
      console.log('Pedido creado exitosamente');
      res.json({
        ID_PL,
        ID_OR,
        PRECIO_PE,
        CANTXPLA_PE,
        ESTADO_PE,
      });
    }
  });
});

app.get('/api/pedidos', (req, res) => {
  const query = 'SELECT * FROM PEDIDO';

  connection.query(query, (error, rows) => {
    if (error) {
      console.error('Error al obtener los pedidos:', error);
      res.sendStatus(500);
    } else {
      res.send(rows);
    }
  });
});
app.get('/api/pedidos/:id', (req, res) => {
  const idPedido = req.params.id;

  const query = 'SELECT * FROM PEDIDO WHERE ID_PL = ?';

  connection.query(query, [idPedido], (error, rows) => {
    if (error) {
      console.error('Error al obtener el pedido:', error);
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
app.put('/api/pedidos/:id', (req, res) => {
  const idPedido = req.params.id;
  const { ID_PL, ID_OR, PRECIO_PE, CANTXPLA_PE, ESTADO_PE } = req.body;

  const query = 'UPDATE PEDIDO SET ID_PL = ?, ID_OR = ?, PRECIO_PE = ?, CANTXPLA_PE = ?, ESTADO_PE = ? WHERE ID_PL = ?';

  connection.query(query, [ID_PL, ID_OR, PRECIO_PE, CANTXPLA_PE, ESTADO_PE, idPedido], (error, result) => {
    if (error) {
      console.error('Error al actualizar el pedido:', error);
      res.sendStatus(500);
    } else {
      console.log('Pedido actualizado exitosamente');
      res.sendStatus(200);
    }
  });
});

app.delete('/api/pedidos/:id', (req, res) => {
  const idPedido = req.params.id;

  const query = 'DELETE FROM PEDIDO WHERE ID_PL = ?';

  connection.query(query, idPedido, (error, result) => {
    if (error) {
      console.error('Error al eliminar el pedido:', error);
      res.sendStatus(500);
    } else {
      console.log('Pedido eliminado exitosamente');
      res.sendStatus(200);
    }
  });
});


// Agregar un nuevo ingrediente
app.post('/api/ingredientes', (req, res) => {
  const { NOMBRE_I, DESCRIPCION_I, PRECIO_I } = req.body;

  const query = 'INSERT INTO Restaurant.ingredientes (NOMBRE_I, DESCRIPCION_I, PRECIO_I) VALUES (?, ?, ?)';

  connection.query(query, [NOMBRE_I, DESCRIPCION_I, PRECIO_I], (error, result) => {
    if (error) {
      console.error('Error al agregar el ingrediente:', error);
      res.sendStatus(500);
    } else {
      console.log('Ingrediente agregado exitosamente');
      res.json({ ID_I: result.insertId, NOMBRE_I, DESCRIPCION_I, PRECIO_I });
    }
  });
});

// Obtener todos los clientes
app.get('/api/clientes', (req, res) => {
  const query = 'SELECT * FROM cliente';

  connection.query(query, (error, rows) => {
    if (error) {
      console.error('Error al obtener los clientes:', error);
      res.sendStatus(500);
    } else {
      res.send(rows);
    }
  });
});

// Obtener datos de un cliente por cédula
app.get('/api/clientes/:cedula', (req, res) => {
  const cedula = req.params.cedula;

  const query = 'SELECT * FROM cliente WHERE CEDULA_CL = ?';

  connection.query(query, [cedula], (error, rows) => {
    if (error) {
      console.error('Error al obtener los datos del cliente:', error);
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
app.post('/api/clientes', (req, res) => {
  const { CEDULA_CLI, NOMBRE_CLI, DIRECCION_CLI, TELEFONO_CLI, NO_PROPORCIONA } = req.body;

  // Validar que se ingresen los datos requeridos (cedula y nombre) si NO_PROPORCIONA es false
  if (!NO_PROPORCIONA && (!CEDULA_CLI || !NOMBRE_CLI)) {
    return res.status(400).json({ error: 'La cédula y el nombre del cliente son obligatorios' });
  }

  // Consultar si el cliente ya existe por cédula
  const queryBuscarCliente = 'SELECT * FROM cliente WHERE CEDULA_CL = ?';
  connection.query(queryBuscarCliente, [CEDULA_CLI], (error, result) => {
    if (error) {
      console.error('Error al buscar el cliente:', error);
      return res.sendStatus(500);
    }

    if (result.length > 0) {
      // Si el cliente ya existe, actualizar sus datos si NO_PROPORCIONA es false
      if (!NO_PROPORCIONA) {
        const queryActualizarCliente = 'UPDATE cliente SET NOMBRE_CL = ?, DIRECCION_CL = ?, TELEFONO_CL = ? WHERE CEDULA_CL = ?';
        connection.query(queryActualizarCliente, [NOMBRE_CLI, DIRECCION_CLI, TELEFONO_CLI, CEDULA_CLI], (error, result) => {
          if (error) {
            console.error('Error al actualizar el cliente:', error);
            res.sendStatus(500);
          } else {
            console.log('Cliente actualizado exitosamente');
            res.sendStatus(200);
          }
        });
      } else {
        // Si NO_PROPORCIONA es true, no se hacen cambios en el cliente existente
        console.log('Cliente existente, no se realizaron cambios');
        res.sendStatus(200);
      }
    } else {
      // Si el cliente no existe, crearlo
      let query;
      if (NO_PROPORCIONA) {
        query = 'INSERT INTO cliente (CEDULA_CL, NOMBRE_CL) VALUES (?, ?)';
      } else {
        query = 'INSERT INTO cliente (CEDULA_CL, NOMBRE_CL, DIRECCION_CL, TELEFONO_CL) VALUES (?, ?, ?, ?)';
      }

      connection.query(query, [CEDULA_CLI, NOMBRE_CLI, DIRECCION_CLI, TELEFONO_CLI], (error, result) => {
        if (error) {
          console.error('Error al crear el cliente:', error);
          res.sendStatus(500);
        } else {
          console.log('Cliente creado exitosamente');
          res.sendStatus(200);
        }
      });
    }
  });
});


app.listen(PORT, () => {
  console.log(`Servidor en ejecución en http://localhost:${PORT}`);
});
