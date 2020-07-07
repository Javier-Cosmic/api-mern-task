const express = require('express');
const connection = require('./config/db');

// crear servidor
const app = express();

//crear conexion con mongo db
connection();

// habilitar express.json
app.use(express.json({extended: true}));

// puerto
const PORT = process.env.PORT || 4000;

//importar rutas
app.use('/api/user', require('./routes/users-route'));
app.use('/api/auth', require('./routes/auth-route'));
app.use('/api/projects', require('./routes/project-route'));

// ruta principal
app.get('/', (req, res) => {
    res.send('Hola Mundo')
})


app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});