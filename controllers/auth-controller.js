const User = require('../models/User');
const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');

exports.authUser = async (req, res) => {

    // revisar si hay errores de validacion
    const errors = validationResult(req);
    if( !errors.isEmpty()){
        return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
        // revisar si el usuario esta registrado
        let user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ status: 'Error', msg: 'El usuario no existe.'})
        }

        // comparar password
        const passOk = await bcrypt.compare(password, user.password);

        // si el password no es correcto
        if(!passOk){
            return res.status(400).json({status: 'Ok', msg: 'Password incorrecto.'})
        }

        //si el password es correcto
        const payload = {
            user: {
                id: user.id
            }
        };

        jwt.sign(payload, process.env.JWT_SECRET, {
            expiresIn: 1500

        }, (error, token) => {
            if (error) throw error;

            // mensaje de confirmacion
            res.json({ token });
        })


    } catch (error) {
        console.log(error);
    }
}