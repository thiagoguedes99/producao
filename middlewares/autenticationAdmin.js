var jwt = require('jsonwebtoken');

exports.authAdmin = function (req, res, next) {

    const usuario = req.usuario;
    const id = req.params.id;

    if (req.usuario.role === 'ADMIN_ROLE' || usuario.id === id) {
        next();
    } else {
      return res.status(401).json({
        ok: false,
        message: 'token errado não é ADMIN_ROLE',
        error: err
      });        
    }
}
