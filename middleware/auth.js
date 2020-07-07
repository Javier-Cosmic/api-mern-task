const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
    //leer el token del header
    const token = req.header('x-auth-token');

    // si no hay token
    if(!token){
        return res.status(401).json({ status: 'Error', msg: 'No hay token, permiso denegado.'})
    }

    //validar token
    try {
        const encryption = jwt.verify(token, process.env.JWT_SECRET);
        req.user = encryption.user;   // --> accedemos al payload user y accedemos al usuario y lo enviamos x req.user.id
        next();

    } catch (error) {
        res.status(401).json({ status: 'Error', msg: 'Token no valido.'})
    }
}