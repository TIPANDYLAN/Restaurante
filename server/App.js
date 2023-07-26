const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const app = express();
const PORT = 4000;

app.use(cors());
app.use(express.json());

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'password',
  database: 'kandela' // Nombre de la base de datos "kandela"
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
  const query = 'SELECT * FROM kandela.plato';

  connection.query(query, (error, results) => {
    if (error) {
      console.error('Error al obtener los platos:', error);
      res.sendStatus(500);
    } else {
      res.json(results);
    }
  });
});

// Crear un nuevo plato
app.post('/api/platos', (req, res) => {
  const { Nombre, Precio } = req.body;
  const query = 'INSERT INTO kandela.plato (Nombre, Precio) VALUES (?, ?)';

  connection.query(query, [Nombre, Precio], (error, result) => {
    if (error) {
      console.error('Error al crear el plato:', error);
      res.sendStatus(500);
    } else {
      console.log('Plato creado exitosamente');
      res.sendStatus(200);
    }
  });
});

// Actualizar un plato por ID
app.put('/api/platos/:id', (req, res) => {
  const id = req.params.id;
  const { Nombre, Precio } = req.body;
  const query = 'UPDATE kandela.plato SET Nombre = ?, Precio = ? WHERE ID = ?';

  connection.query(query, [Nombre, Precio, id], (error, result) => {
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
  const query = 'DELETE FROM kandela.plato WHERE ID = ?';

  connection.query(query, [id], (error, result) => {
    if (error) {
      console.error('Error al eliminar el plato:', error);
      res.sendStatus(500);
    } else {
      console.log('Plato eliminado exitosamente');
      res.sendStatus(200);
    }
  });
});

app.listen(PORT, () => {
  console.log(`La API está en funcionamiento en el puerto ${PORT}`);
});
