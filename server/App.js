const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const multer = require("multer");
const path = require("path");

const app = express();
const PORT = 4000;

app.use(cors());
app.use(express.json());

// Configuración de Multer para manejar la carga de imágenes
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname)
    );
  },
});

const upload = multer({ storage: storage });

//Conexion a la base de datos
const connection = mysql.createConnection({
  host: "127.0.0.1",
  user: "root",
  password: "root",
  database: "Restaurant", // Nombre de la base de datos "Restaurant"
});

connection.connect((error) => {
  if (error) {
    console.error("Error al conectar a la base de datos:", error);
  } else {
    console.log("Conexión exitosa a la base de datos");
  }
});

// Obtener todos los platos
app.get("/api/platos", (req, res) => {
  const query = "SELECT * FROM Restaurant.PLATO";

  connection.query(query, (error, results) => {
    if (error) {
      console.error("Error al obtener los platos:", error);
      res.sendStatus(500);
    } else {
      res.json(results);
    }
  });
});

// Crear un nuevo plato
app.post("/api/platos", upload.single("Foto"), (req, res) => {
  const { Nombre, Precio, Descripcion } = req.body;
  const Foto = req.file.filename;

  const query =
    "INSERT INTO Restaurant.PLATO (NOMBRE_PL, PRECIO_PL, FOTO_PL, DESCRIPCION_PL) VALUES (?, ?, ?, ?)";

  connection.query(
    query,
    [Nombre, Precio, Foto, Descripcion],
    (error, result) => {
      if (error) {
        console.error("Error al crear el plato:", error);
        res.sendStatus(500);
      } else {
        console.log("Plato creado exitosamente");
        res.json({
          ID_PL: result.insertId,
          NOMBRE_PL: Nombre,
          PRECIO_PL: Precio,
          FOTO_PL: Foto,
          DESCRIPCION_PL: Descripcion,
        });
      }
    }
  );
});

// Actualizar un plato por ID
app.put("/api/platos/:id", (req, res) => {
  const id = req.params.id;
  const { Nombre, Precio } = req.body;
  const query =
    "UPDATE Restaurant.PLATO SET NOMBRE_PL = ?, PRECIO_PL = ? WHERE ID_PL = ?";

  connection.query(query, [Nombre, Precio, id], (error, result) => {
    if (error) {
      console.error("Error al actualizar el plato:", error);
      res.sendStatus(500);
    } else {
      console.log("Plato actualizado exitosamente");
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

app.listen(PORT, () => {
  console.log(`La API está en funcionamiento en el puerto ${PORT}`);
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

  connection.query(
    "SELECT * FROM EMPLEADO WHERE USUARIO_EMP = ? AND CONTRASENA_EMP = ?",
    [USUARIO_EMP, CONTRASENA_EMP],
    (err, result) => {
      if (err) {
        res.send({ err: err });
      }

      if (result.length > 0) {
        res.send(result);
      } else {
        res.send({ message: "Usuario o contraseña incorrecta!" });
      }
    }
  );
});
