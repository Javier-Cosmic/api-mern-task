const mongoose = require('mongoose');
require('dotenv').config({ path: '.env'});

const connection = async () => {
    try {
        
        await mongoose.connect(process.env.DB_MONGO, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false,
            useCreateIndex: true
        })
        console.log('Mongo DB conectado')

    } catch (error) {
        console.log(error);
        process.exit(1);  // si hay un error detendra la base de datos
    }
}

module.exports = connection;