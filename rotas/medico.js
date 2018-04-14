const express = require('express');

const auth = require('../middlewares/autentication').verificaToken;

const app = express();

const Medico = require('../models/medico');


app.get('/', async (req, res) => {

  try {
    const qtd = Number(req.query.qtd) || 0;

    const medicos = await Medico.find({})
                                .skip(qtd)
                                .limit(1)
                                .populate('usuario', 'name email')
                                .populate('hospital');

    const total = await Usuarios.count({});
                                

    res.status(200).json({
      ok: false,
      medicos,
      total
    });

    // res.status(200).json(usuarios);

  } catch (error) {
    res.status(500).json(
    {
      ok: true,
      mensage: 'erro na busca de hospitais',
      errors: error
    })

    // res.sendStatus(500);
  }

});

app.post('/', auth, (req, res) => {

  const body = req.body;

  console.log('body');
  console.log(body);
  console.log('req.usuario');
  console.log(req.usuario);

  const medico = new Medico({
    name: body.name,
    usuario: req.usuario._id,
    hospital: body.hospital,
  });

  medico.save((err, newMedicos) => {
    if (err) {
      return res.status(400).json(
        {
          ok: true,
          mensage: 'erro para gravar o medico',
          errors: err
        }
      );  
    }

    res.status(201).json({
      ok: true,
      newMedicos
    });
  });

  
});

app.put('/:id', auth, (req, res) => {

  // res.status(200).json({
  //   ok: true,
  //   id: req.params.id
  // });

  Medico.findById(req.params.id, (err, findMedicos) => {
    if (err) {
      return res.status(500).json(
        {
          ok: false,
          mensage: 'erro para buscar o hospitais',
          errors: err
        }
      );  
    }

    if (!findMedicos) {
      return res.status(400).json(
        {
          ok: false,
          mensage: `usuario com ${req.params.id} não existe`,
          errors: {message: 'não existe'}
        }
      );  
    }

    findMedicos.name = req.body.name;
    findMedicos.usuario = req.usuario._id;
    findMedicos.hospital = req.hospital._id;

    findMedicos.save((err, newMedicos) => {
      if (err) {
        return res.status(400).json(
          {
            ok: true,
            mensage: 'erro para gravar o hospitais',
            errors: err
          }
        );  
      }
  
      res.status(200).json({
        ok: true,
        newMedicos
      });
    });
  });

});

app.delete('/:id', auth, (req, res) => {
  Medico.findByIdAndRemove(req.params.id, (err, deletado) => {

    if (err) {
      return res.status(500).json({
        ok: false,
        mensage: 'error para deletar o hospital',
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