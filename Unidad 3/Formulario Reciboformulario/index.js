const express = require('express');
const multer = require('multer');
const cors = require('cors');
const path = require('path');
const PDFDocument = require('pdfkit');
const fs = require('fs');

const app = express();

// Middleware para habilitar CORS
app.use(cors());

// Configuración de almacenamiento para archivos subidos
const folder = path.join(__dirname, '/archivos/');
if (!fs.existsSync(folder)) {
    fs.mkdirSync(folder);
}

const storage = multer.diskStorage({
    destination: folder,
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}_${file.originalname}`);
    },
});

const upload = multer({ storage });

// Middleware para parsear datos del formulario
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Crear la carpeta "pdfgenerados" si no existe
const pdfFolder = path.join(__dirname, '/pdfgenerados/');
if (!fs.existsSync(pdfFolder)) {
    fs.mkdirSync(pdfFolder);
}

// Ruta para procesar el formulario
app.post('/formulario', upload.fields([{ name: 'archivo' }, { name: 'imagen' }]), (req, res) => {
    const { nombre, apellido, email, telefono } = req.body;
    const imagen = req.files?.imagen?.[0]?.path; // Ruta de la imagen cargada

    // Crear un nuevo documento PDF
    const doc = new PDFDocument();
    const pdfPath = path.join(pdfFolder, `${nombre}_${apellido}_${Date.now()}.pdf`);
    const writeStream = fs.createWriteStream(pdfPath);

    // Generar contenido del PDF
    doc.pipe(writeStream);
    doc.fontSize(16).text('Datos del Formulario', { align: 'center' });
    doc.text(`\nNombre: ${nombre}`);
    doc.text(`Apellido: ${apellido}`);
    doc.text(`Correo Electrónico: ${email}`);
    doc.text(`Teléfono: ${telefono}`);

    // Agregar la imagen al PDF (si existe)
    if (imagen) {
        try {
            doc.addPage(); // Opcional: agregar una nueva página para la imagen
            doc.image(imagen, {
                fit: [500, 400], // Ajustar el tamaño máximo de la imagen
                align: 'center',
                valign: 'center',
            });
            doc.text('\nImagen cargada:', { align: 'center' });
        } catch (error) {
            console.error('Error al agregar la imagen al PDF:', error);
        }
    }

    doc.end();

    // Manejo de finalización y errores
    writeStream.on('finish', () => {
        res.status(200).json({ message: 'PDF generado exitosamente', pdfPath });
    });

    writeStream.on('error', (err) => {
        console.error('Error al generar el PDF:', err);
        res.status(500).json({ message: 'Error al generar el PDF' });
    });
});

// Iniciar el servidor
app.listen(8082, () => {
    console.log('Servidor Express escuchando en el puerto 8082');
});

