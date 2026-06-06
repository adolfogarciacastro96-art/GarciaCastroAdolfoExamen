const { createServer } = require('node:http');
const fs = require('fs');
const path = require('path');

const hostname = '0.0.0.0';
const port = 3001;

const server = createServer((req, res) => {

    let archivo = req.url;

    if (archivo === '/') {
        archivo = '/index.html';
    }

    const ruta = path.join(__dirname, archivo);

    let tipo = 'text/html';

    if (archivo.endsWith('.css')) {
        tipo = 'text/css';
    }

    if (archivo.endsWith('.js')) {
        tipo = 'application/javascript';
    }

    fs.readFile(ruta, (err, data) => {
        if (err) {
            res.statusCode = 404;
            res.end('Archivo no encontrado');
        } else {
            res.statusCode = 200;
            res.setHeader('Content-Type', tipo);
            res.end(data);
        }
    });

});

server.listen(port, hostname, () => {
    console.log(`Servidor ejecutándose en http://${hostname}:${port}`);
});