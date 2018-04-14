const express = require('express');

const Hospital = require('../models/hospital');
const Usuario = require('../models/usuario');
const Medico = require('../models/medico');

const app = express();

app.get('/:busca', async (req, res) => {

    const regex = RegExp(req.params.busca, 'i');

    // const achado = await Hospital.find({name: /SUL/i});

    try {
      const usuario = await getUsuario(regex);
      const hospital = await getHospital(regex);
      const medico = await getMedico(regex);

      res.status(200).json(
        {
          ok: true,
          usuario,
          hospital,
          medico
        }
      );
      
    } catch (error) { }
});

app.get('/collection/:name/:busca', async (req, res) => {

  // ESTA VALIDAÇÃO DO NOME DA COLLECTION SERÁ FEITA COM O 'JOI'
  let nome = req.params.name;
  let dados;

  // é o mesmo que ' /valor/i ', é adicionado 2 barras
  const regex = RegExp(req.params.busca, 'i');

  switch (nome) {
    case 'usuario':
      // nome = getUsuario(regex);
      dados = await getUsuario(regex);
    break;

    case 'hospital':
      // nome = getHospital(regex);
      dados = await getHospital(regex);
    break;

    case 'medico':
      // nome = getMedico(regex);    
      dados = await getMedico(regex);    
    break; 

    default:
      break;
  }

  res.status(200).json(
    {
      ok: true,
      [nome]: dados
    }
  );
});






async function getHospital(regex) {
  try {
    return await Hospital.find({ name: regex });
  } catch (error) {
    throw error;
  }
}

async function getUsuario(regex) {
  try {
    // usuarios.find({ '$or': [ { name: /a/i }, { email: /a/i } ] }, { fields: {} })
    // usuarios.find({ '$or': [ { name: /a/i }, { email: /a/i } ] }, { fields: { name: 1, email: 1, role: 1, img: 1 } })
    return await Usuario.find({}, 'name email role img').or([{ name: regex }, { email: regex }]);
  } catch (error) {
    throw error;
  }
}

async function getMedico(regex) {
  try {
    return await Medico.find({ name: regex });
  } catch (error) {
    throw error;
  }
}

module.exports = app;