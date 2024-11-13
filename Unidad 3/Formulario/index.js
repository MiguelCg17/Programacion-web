const express = require('express');
const path =require('path');
const app = express();


app.use(express.json());
app.use(express.text());
app.use(express.urlencoded( { extended:true } ));

 app.post('/formulario', (req, res) => {
  console.log(req.body);
  res.send(`Hola ${req.body.nombre}`);
 });

 
app.listen(8082, () => {
  console.log('Servidor Express escuchando en el puerto 8082');
});
