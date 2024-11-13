const express = require('express');
const path =require('path');
const app = express();

console.log(__dirname);
console.log(__filename);

app.set('view engine','pug');
app.set('views',path.join(__dirname,'views'))

app.use(express.json());
app.use(express.text());
 
app.get('/administrativos',(req,res)=>{
  console.log(req.query)
  // res.send('Servidores contestando a peticiones GET')
   res.render('admin');
  })
 
app.get('/maestros',(req,res)=>{
      console.log(req.body)
       res.send('Servidores contestando a peticiones GET')
      })


app.get('/Estudiantes/carrera',(req,res)=>{
console.log(req.params.carrera)
console.log(req.query.control)
res.send('Servidores contestando a peticiones GET')
})

app.get('/', (req, res) => {
  res.send('Hola Mundo');  // Envía "Hola Mundo" como respuesta
});
 
app.listen(8082, () => {
  console.log('Servidor Express escuchando en el puerto 8082');
});
