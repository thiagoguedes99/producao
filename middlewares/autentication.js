var jwt = require('jsonwebtoken');

exports.verificaToken = function (req, res, next) {
  jwt.verify(req.query.token, '@chave-secreta_do_token', (err, decoded) => {
    if (err) {
      return res.status(401).json({
        ok: false,
        message: 'token errado',
        error: err
      });   
    }

    req.usuario = decoded.usuario;
    next();
  });
}
