const express = require('express');
const path = require('path');
const multer = require('multer');
const app = express();

const folder = path.join(__dirname, 'archivos');
const upload = multer({ dest: folder });

app.use(express.json());
app.use(express.text());
app.use(upload.single('archivo')); // Procesa un archivo con el campo 'archivo'

app.post('/formulario', (req, res) => {
  console.log(req.body);
  res.send(`Archivo recibido ${req.body.nombre}`);
});

app.listen(8082, () => {
  console.log('Servidor Express escuchando en el puerto 8082');
});