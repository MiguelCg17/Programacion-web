const express = require('express');
const cors = require('cors');
const mysql = require('mysql');

const app = express();
app.use(cors());

// Configuración de la conexión a la base de datos
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '', // Cambia esto según tu configuración
  database: 'formularioweb' // Cambia según el nombre de tu base de datos
});

// Conexión a la base de datos
db.connect(err => {
  if (err) {
    console.error('Error conectando a la base de datos:', err);
    return;
  }
  console.log('Conexión a la base de datos exitosa');
});

// Ruta para obtener los usuarios
app.get('/usuarios', (req, res) => {
  db.query('SELECT id_Usuario, Nombre, Apellido FROM usuario', (err, results) => {
    if (err) {
      console.error('Error ejecutando la consulta:', err);
      res.status(500).send('Error en el servidor');
      return;
    }

    // Imprimir los resultados en la terminal
    console.log('Resultados de la consulta:', results);

    // Enviar los resultados como respuesta JSON
    res.json(results);
  });
});

// Configuración del puerto
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
