const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();

// Middleware para manejar datos JSON y datos de formularios
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Middleware para servir archivos estáticos
app.use(express.static(path.join(__dirname, '..', 'Frontend')));

// Ruta para servir el formulario de inicio de sesión (GET /login)
app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'Frontend', 'login.html'));
});

// Ruta para procesar el inicio de sesión (POST /login)
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

// Ruta para la página de administrador
app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'Frontend', 'admin.html'));
});

// Ruta para la página de usuario normal
app.get('/usuario', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'Frontend', 'usuario.html'));
});

// Ruta para obtener todos los animales (GET /animales)
app.get('/animales', (req, res) => {
    const filePath = path.join(__dirname, 'Data', 'animales.json');
    fs.readFile(filePath, 'utf-8', (err, data) => {
        if (err) {
            console.error('Error al leer el archivo:', err);
            return res.status(500).send('Error al leer los datos.');
        }
        res.json(JSON.parse(data || '[]'));
    });
});

// Ruta para agregar un nuevo animal (POST /animales)
app.post('/animales', (req, res) => {
    const nuevoAnimal = req.body;
    const filePath = path.join(__dirname, 'Data', 'animales.json');

    fs.readFile(filePath, 'utf-8', (err, data) => {
        if (err) {
            console.error('Error al leer el archivo:', err);
            return res.status(500).send('Error al leer los datos.');
        }

        const animales = JSON.parse(data || '[]');
        animales.push(nuevoAnimal);

        fs.writeFile(filePath, JSON.stringify(animales, null, 2), (err) => {
            if (err) {
                console.error('Error al escribir el archivo:', err);
                return res.status(500).send('Error al guardar los datos.');
            }

            res.status(200).send('Animal agregado correctamente.');
        });
    });
});

// Ruta para eliminar un animal por nombre (DELETE /animales/:nombre)
app.delete('/animales/:nombre', (req, res) => {
    const nombreAnimal = req.params.nombre;
    const filePath = path.join(__dirname, 'Data', 'animales.json');

    fs.readFile(filePath, 'utf-8', (err, data) => {
        if (err) {
            console.error('Error al leer el archivo:', err);
            return res.status(500).send('Error al leer los datos.');
        }

        let animales = JSON.parse(data || '[]');
        animales = animales.filter(animal => animal.nombre.toLowerCase() !== nombreAnimal.toLowerCase());

        fs.writeFile(filePath, JSON.stringify(animales, null, 2), (err) => {
            if (err) {
                console.error('Error al escribir el archivo:', err);
                return res.status(500).send('Error al guardar los datos.');
            }

            res.status(200).send(`Animal ${nombreAnimal} eliminado correctamente.`);
        });
    });
});

// Ruta para obtener los detalles de un animal por su nombre (GET /animales/:nombre)
app.get('/animales/:nombre', (req, res) => {
    const nombreAnimal = req.params.nombre.toLowerCase();
    const filePath = path.join(__dirname, 'Data', 'animales.json');

    fs.readFile(filePath, 'utf-8', (err, data) => {
        if (err) {
            console.error('Error al leer el archivo:', err);
            return res.status(500).send('Error al leer los datos.');
        }

        const animales = JSON.parse(data || '[]');
        const animal = animales.find(a => a.nombre.toLowerCase() === nombreAnimal);

        if (!animal) {
            return res.status(404).send(`No se encontró un animal con el nombre "${req.params.nombre}".`);
        }

        res.json(animal);
    });
});

// Inicia el servidor en el puerto 3000
app.listen(3000, () => {
    console.log('Servidor corriendo en http://localhost:3000');
});