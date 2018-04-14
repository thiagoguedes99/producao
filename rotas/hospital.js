const express = require('express');

const auth = require('../middlewares/autentication').verificaToken;

const app = express();

const Hospital = require('../models/hospital');


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
    const hospitais = await Hospital.find({})
                                    .populate('usuario', 'name email');

    res.status(200).json({
      ok: false,
      hospitais
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

app.get('/:id', (req, res) => {
  var id = req.params.id;
  
  Hospital.findById(id)
          .populate('usuario', 'name img email')
  .exec((err, hospital) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        mensaje: 'Error al buscar hospital',
        errors: err
      });
    }

    if (!hospital) {
      return res.status(400).json({
        ok: false,mensaje: 'El hospital con el id ' + id + 'no existe',
        errors: { message: 'No existe un hospitalcon ese ID' }
      });
    }

    res.status(200).json({
      ok: true,
      hospital: hospital
    });
  })
})

app.post('/', auth, (req, res) => {

  const body = req.body;

  const hospital = new Hospital({
    name: body.name,
    usuario: req.usuario._id
  });

//   console.log(usuario);

  hospital.save((err, newHospitais) => {
    if (err) {
      return res.status(400).json(
        {
          ok: true,
          mensage: 'erro para gravar o hospital',
          errors: err
        }
      );  
    }

    res.status(201).json({
      ok: true,
      newHospitais
    });
  });

  
});

app.put('/:id', auth, (req, res) => {

  // res.status(200).json({
  //   ok: true,
  //   id: req.params.id
  // });

  Hospital.findById(req.params.id, (err, findHospitais) => {
    if (err) {
      return res.status(500).json(
        {
          ok: false,
          mensage: 'erro para buscar o hospitais',
          errors: err
        }
      );  
    }

    if (!findHospitais) {
      return res.status(400).json(
        {
          ok: false,
          mensage: `usuario com ${req.params.id} não existe`,
          errors: {message: 'não existe'}
        }
      );  
    }

    findHospitais.name = req.body.name;
    findHospitais.usuario = req.usuario._id;

    findHospitais.save((err, newHospitais) => {
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
        newHospitais
      });
    });
  });

});

app.delete('/:id', auth, (req, res) => {
  Hospital.findByIdAndRemove(req.params.id, (err, deletado) => {

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