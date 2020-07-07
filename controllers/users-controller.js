const User = require('../models/User');
const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');

exports.createUser = async (req, res) => {

    // revisar si hay errores de validacion
    const errors = validationResult(req);
    if( !errors.isEmpty()){
        return res.status(400).json({ errors: errors.array() });
    }
 
    const { email, password } = req.body;
    
    try {
        // revisar si el usuario ya esta registrado x el email
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({status: 'Error', msg: 'El usuario ya está registrado.'})
        }
        
        // crear usuario con los datos enviados del cliente (peticion)
        user = new User(req.body);
        
        //hashear password
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt)  // al hash le pasamos el password del req.body

        // guardar usuario 
        await user.save();

        //crear token
        const payload = {
            user: {
                id: user.id
            }
        }

        // firmar token
        jwt.sign(payload, process.env.JWT_SECRET, {
            expiresIn: 1500

        }, (error, token) => {
            if(error) throw error;

            res.json({token: token});
        })
        

    } catch (error) {

        if(error.code === 11000){
            res.status(400).json({status: 'Error', msg: 'Duplicate key.'});
            return
        }

        res.status(400).json({ status: 'Error', msg: error.message});
    }
}