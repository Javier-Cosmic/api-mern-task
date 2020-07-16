const express = require('express');
const connection = require('./config/db');
const cors = require('cors');

// crear servidor
const app = express();

//crear conexion con mongo db
connection();

//habilitar cors como funcion
app.use(cors());

// habilitar express.json
app.use(express.json({extended: true}));

// puerto
const port = process.env.PORT || 4000;

//importar rutas
app.use('/api/user', require('./routes/users-route'));
app.use('/api/auth', require('./routes/auth-route'));
app.use('/api/projects', require('./routes/project-route'));
app.use('/api/tasks', require('./routes/task-route'));

// ruta principal
app.get('/', (req, res) => {
    res.send('Hola Mundo')
})


app.listen(port, '0.0.0.0', () => {
    console.log(`Servidor corriendo en el puerto ${port}`);
});