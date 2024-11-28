const express = require('express');
const cors = require('cors');
const mysql = require('mysql');

const app = express();
const PORT = 8081;


app.use(cors());
app.use(express.json());


const dbConfig = {
    host: 'localhost',
    user: 'root',       
    password: '',        
    database: 'formularioweb', 
};


const connection = mysql.createConnection(dbConfig);


connection.connect((error) => {
    if (error) {
        console.error('Error al conectar con la base de datos:', error);
        process.exit(1); 
    } else {
        console.log('Conexión exitosa con la base de datos.');
    }
});


app.get('/datos', (req, res) => {
    const query = 'SELECT * FROM usuario'; 

    connection.query(query, (error, results) => {
        if (error) {
            console.error('Error al ejecutar la consulta:', error);
            res.status(500).json({ error: 'Error al obtener los datos.' });
        } else {
            res.json(results); 
        }
    });
});

// Iniciar el servidor.
app.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
