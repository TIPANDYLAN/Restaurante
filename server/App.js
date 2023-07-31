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
  database: 'Restaurant' // Nombre de la base de datos "Restaurant"
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
  const { Nombre, Precio, Descripcion } = req.body;
  const Foto = fs.readFileSync(
    path.join(__dirname, "./uploads/" + req.file.filename)
  );

  const query = 'INSERT INTO Restaurant.plato (NOMBRE_PL, PRECIO_PL, FOTO_PL, DESCRIPCION_PL) VALUES (?, ?, ?, ?)';

  connection.query(query, [Nombre, Precio, Foto, Descripcion], (error, result) => {
    if (error) {
      console.error('Error al crear el plato:', error);
      res.sendStatus(500);
    } else {
      console.log('Plato creado exitosamente');
      res.json({ ID_PL: result.insertId, NOMBRE_PL: Nombre, PRECIO_PL: Precio, FOTO_PL: Foto, DESCRIPCION_PL: Descripcion });
    }
  });
});

// Actualizar un plato por ID
app.put('/api/platos/:id', (req, res) => {
  const id = req.params.id;
  const { Nombre, Precio, Descripcion } = req.body;
  const Foto = req.file ? req.file.filename : null; // Verificar si se cargó una nueva imagen

  const query = 'UPDATE Restaurant.PLATO SET NOMBRE_PL = ?, PRECIO_PL = ?, FOTO_PL = ?, DESCRIPCION_PL = ? WHERE ID_PL = ?';

  connection.query(query, [Nombre, Precio, Foto, Descripcion, id], (error, result) => {
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

// Resto de las rutas para CRUD de ingredientes...

app.listen(PORT, () => {
  console.log(`La API está en funcionamiento en el puerto ${PORT}`);
});
