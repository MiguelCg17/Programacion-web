const express = require('express');
const path = require('path');
const mysql = require('mysql2');
const pdf = require('pdfkit'); 
const fs = require('fs');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Conexión a la base de datos MySQL
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'zoologico',
});

db.connect(err => {
    if (err) {
        console.error('Error al conectar con la base de datos:', err.message);
        process.exit(1);
    }
    console.log('Se conecto Correctamente a la base de datos.');
});

app.use(express.static(path.join(__dirname, '..', 'Frontend')));

// Ruta para servir el formulario de inicio de sesión
app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'Frontend', 'login.html'));
});

app.post('/login', (req, res) => {
    const { username, password } = req.body;

    if (username === 'admin' && password === 'admin123') {
        res.redirect('/admin');
    } else if (username === 'usuario' && password === 'usuario123') {
        res.redirect('/usuario');
    } else {
        res.status(401).send('Credenciales incorrectas. Intente nuevamente.');
    }
});

app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'Frontend', 'admin.html'));
});

app.get('/usuario', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'Frontend', 'usuario.html'));
});

app.get('/animales', (req, res) => {
    const query = 'SELECT * FROM animal';
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error al obtener los datos:', err.message);
            return res.status(500).send('Error al obtener los datos.');
        }
        res.json(results);
    });
});

app.post('/animales', (req, res) => {
    const { Nombre, Especie, Edad, Habitat, dieta, Estado_Conservacion, Pais_Origen, Descripcion } = req.body;

    const query = `INSERT INTO animal (Nombre, Especie, Edad, Habitat, dieta, Estado_Conservacion, Pais_Origen, Descripcion)
                   VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
    db.query(query, [Nombre, Especie, Edad, Habitat, dieta, Estado_Conservacion, Pais_Origen, Descripcion], (err, result) => {
        if (err) {
            console.error('Error al insertar los datos:', err.message);
            return res.status(500).send('Error al insertar los datos.');
        }
        res.status(200).send('Animal agregado correctamente.');
    });
});

app.delete('/animales/:nombre', (req, res) => {
    const nombreAnimal = req.params.nombre;
    const query = 'DELETE FROM animal WHERE Nombre = ?';
    db.query(query, [nombreAnimal], (err, result) => {
        if (err) {
            console.error('Error al eliminar el animal:', err.message);
            return res.status(500).send('Error al eliminar el animal.');
        }
        res.status(200).send(`Animal ${nombreAnimal} eliminado correctamente.`);
    });
});

app.get('/animales/:nombre', (req, res) => {
    const nombreAnimal = req.params.nombre;
    const query = 'SELECT * FROM animal WHERE Nombre = ?';
    db.query(query, [nombreAnimal], (err, results) => {
        if (err) {
            console.error('Error al obtener el animal:', err.message);
            return res.status(500).send('Error al obtener el animal.');
        }

        if (results.length === 0) {
            return res.status(404).send(`No se encontró un animal con el nombre "${nombreAnimal}".`);
        }

        res.json(results[0]);
    });
});

//  ruta para generar PDF
app.get('/generar-pdf/:nombre', (req, res) => {
    const nombreAnimal = req.params.nombre;
    const query = 'SELECT * FROM animal WHERE Nombre = ?';
    db.query(query, [nombreAnimal], (err, results) => {
        if (err) {
            console.error('Error al obtener el animal para PDF:', err.message);
            return res.status(500).send('Error al obtener el animal para PDF.');
        }

        if (results.length === 0) {
            return res.status(404).send(`No se encontró un animal con el nombre "${nombreAnimal}".`);
        }

        const animal = results[0];
        const doc = new pdf();
        const filePath = path.join(__dirname, '..', 'Frontend', 'animal.pdf');

        doc.pipe(fs.createWriteStream(filePath));
        doc.pipe(res);

        doc.fontSize(16).text(`Información del Animal: ${animal.Nombre}`, { align: 'center' });
        doc.moveDown();
        doc.text(`Especie: ${animal.Especie}`);
        doc.text(`Edad: ${animal.Edad} años`);
        doc.text(`Hábitat: ${animal.Habitat}`);
        doc.text(`Dieta: ${animal.dieta}`);
        doc.text(`Estado de Conservación: ${animal.Estado_Conservacion}`);
        doc.text(`País de Origen: ${animal.Pais_Origen}`);
        doc.text(`Descripción: ${animal.Descripcion}`);
        doc.end();
    });
});

app.listen(3000, () => {
    console.log('Servidor corriendo en http://localhost:3000');
});
