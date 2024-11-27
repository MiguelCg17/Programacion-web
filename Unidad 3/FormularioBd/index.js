const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

// Configuración de la conexión a MySQL
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'formularioweb',
});

db.connect((err) => {
    if (err) {
        console.error('Error al conectar a la base de datos:', err);
        return;
    }
    console.log('Conectado a la base de datos');
});

// Ruta para obtener un usuario por ID
app.get('/Usuario', (req, res) => {
    const idUsuario = req.query.idUsuario;

    if (!idUsuario) {
        return res.status(400).json({ error: 'El ID del usuario es requerido' });
    }

    const query = 'SELECT * FROM usuario WHERE id_Usuario = ?'; 
    db.query(query, [idUsuario], (err, results) => {
        if (err) {
            console.error('Error al realizar la consulta:', err);
            return res.status(500).json({ error: 'Error al consultar la base de datos' });
        }

        if (results.length === 0) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        res.json(results[0]); // Enviar el primer resultado como respuesta
    });
});

// Ruta para generar un PDF con los datos del usuario
app.get('/GenerarPDF', (req, res) => {
    const idUsuario = req.query.idUsuario;

    if (!idUsuario) {
        return res.status(400).json({ error: 'El ID del usuario es requerido' });
    }

    const query = 'SELECT * FROM usuario WHERE id_Usuario = ?';
    db.query(query, [idUsuario], (err, results) => {
        if (err) {
            console.error('Error al realizar la consulta:', err);
            return res.status(500).json({ error: 'Error al consultar la base de datos' });
        }

        if (results.length === 0) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        const usuario = results[0];

        // Crear el PDF
        const doc = new PDFDocument();
        const pdfPath = path.join(__dirname, `Usuario_${usuario.id_Usuario}.pdf`);

        const stream = fs.createWriteStream(pdfPath);
        doc.pipe(stream);

        // Contenido del PDF
        doc.fontSize(16).text('Información del Usuario', { align: 'center' });
        doc.moveDown();
        doc.text(`ID: ${usuario.id_Usuario}`);
        doc.text(`Nombre: ${usuario.Nombre}`);
        doc.text(`Apellido: ${usuario.Apellido}`);
        doc.end();

        // Enviar el PDF generado al cliente
        stream.on('finish', () => {
            res.download(pdfPath, `Usuario_${usuario.id_Usuario}.pdf`, (err) => {
                if (err) {
                    console.error('Error al enviar el PDF:', err);
                }
                // Eliminar el archivo después de enviarlo
                fs.unlinkSync(pdfPath);
            });
        });
    });
});

// Iniciar el servidor
app.listen(8082, () => {
    console.log('Servidor escuchando en el puerto 8082');
});
