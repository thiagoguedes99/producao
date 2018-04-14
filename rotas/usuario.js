const express = require('express');
var bcrypt = require('bcryptjs');

const auth = require('../middlewares/autentication').verificaToken;
const authAdmin = require('../middlewares/autenticationAdmin').authAdmin;

const app = express();

const Usuarios = require('../models/usuario');


app.get('/', async (req, res) => {

  // ===========================================================
  // Usuarios.find({}, (err, usuarios) => {
  //   if (err) {
  //     return res.status(500).json(
  //       {
  //         ok: true,
  //         mensage: 'erro na busca de usuarios',
  //         errors: err
  //       }
  //     );  
  //   }
  // ===========================================================  

  // ===========================================================  
  // Usuarios.find({}, 'name email img role')
  //     .exec( (err, usuarios) => {
  //   if (err) {
  //   return res.status(500).json(
  //     {
  //       ok: true,
  //       mensage: 'erro na busca de usuarios',
  //       errors: err
  //     }
  //   );  
  // }
  // ===========================================================
  
  // ===========================================================  
  // Usuarios.find({}, 'name email img role', (err, usuarios) => {
  //   if (err) {
  //     return res.status(500).json(
  //       {
  //         ok: true,
  //         mensage: 'erro na busca de usuarios',
  //         errors: err
  //       }
  //     );  
  //   }

  //   res.status(200).json({
  //    ok: true,
  //     usuarios
  //   });
  // });
  // ===========================================================
    

  try {
    // const pagina = ((req.query.pagina) * 5) || 0;

    // const qtd = req.query.qtd || 0; /* VALIDAÇÃO SERÁ FEITA NO 'JOI()' */
    const qtd = Number(req.query.qtd) || 0;

    const usuarios = await Usuarios.find({}, 'name email img role google')
                                    .skip(qtd)
                                    .limit(2);

    const total = await Usuarios.count({});

    res.status(200).json({
      ok: false,
      total,
      usuarios
    });

    // res.status(200).json(usuarios);

  } catch (error) {
    res.status(500).json(
    {
      ok: true,
      mensage: 'erro na busca de usuarios',
      errors: error
    })

    // res.sendStatus(500);
  }

});

// app.post('/', auth, (req, res) => {
app.post('/', (req, res) => {

  const body = req.body;

  console.log(body);

  const usuario = new Usuarios({
    name: body.name,
    email: body.email,
    password: bcrypt.hashSync(body.password, 10),
    img: body.img,
    role: body.role,
  });

  console.log(usuario);

  usuario.save((err, newUsuario) => {
    if (err) {
      return res.status(400).json(
        {
          ok: true,
          mensage: 'erro para gravar o usuario',
          errors: err
        }
      );  
    }

    res.status(200).json({
      ok: true,
      newUsuario
    });
  });

  
});

app.put('/:id', [auth, authAdmin], (req, res) => {

  // res.status(200).json({
  //   ok: true,
  //   id: req.params.id
  // });

  Usuarios.findById(req.params.id, (err, findusuario) => {
    if (err) {
      return res.status(500).json(
        {
          ok: false,
          mensage: 'erro para buscar o usuario',
          errors: err
        }
      );  
    }

    if (!findusuario) {
      return res.status(400).json(
        {
          ok: false,
          mensage: `usuario com ${req.params.id} não existe`,
          errors: {message: 'não existe'}
        }
      );  
    }

    findusuario.name = req.body.name;
    findusuario.email = req.body.email;
    findusuario.role = req.body.role;

    findusuario.save((err, newUsuario) => {
      if (err) {
        return res.status(400).json(
          {
            ok: true,
            mensage: 'erro para gravar o usuario',
            errors: err
          }
        );  
      }
  
      res.status(200).json({
        ok: true,
        newUsuario
      });
    });
  });

});

app.delete('/:id', auth, (req, res) => {
  Usuarios.findByIdAndRemove(req.params.id, (err, deletado) => {

    if (err) {
      return res.status(500).json({
        ok: false,
        mensage: 'error para deletar o usuário',
        error: err
      });
    }

    res.status(200).json({
      ok: true,
      deletado
    });
  });
});


module.exports = app;