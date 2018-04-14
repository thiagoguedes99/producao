const fs = require('fs')

const express = require('express');
const fileUpload = require('express-fileupload');

const Hospital = require('../models/hospital');
const Usuario = require('../models/usuario');
const Medico = require('../models/medico');

const app = express();

app.use(fileUpload());

app.put('/:tipo/:id', async (req, res) => {

  // os tipos da collections vai ser validado no 'JOI()'
  const tipoCollection = req.params.tipo;
  const id = req.params.id;

  if (req.files) {
    console.log('tem foto aqui!!!!!!!!!!!!!!!!!!!!!!!!!!!')
    console.log(req.files)
  }

  if (!req.files) {
    res.status(400).json(
      {
        ok: false,
        mensage: 'manda o arquivo porra'
      }
    ); 
  }

  // pegando o arquivo
  const arquivo = req.files.imagem;

  const tipo = arquivo.name.split('.');
  const extensao = tipo[tipo.length -1];

  const tiposExtensao = ['png', 'jpg', 'gif', 'jpeg'];

  if (!tiposExtensao.includes(extensao)) {
    res.status(400).json(
      {
        ok: false,
        mensage: 'extenão errada porra só pode ' + tiposExtensao.join(',')
      }
    ); 
  }

  // criando o nome do arquivo = (id + randon + tipo)
  const nomeArquivo = `${id}-${new Date().getMilliseconds()}.${extensao}`;

  // move o arquivo para uma pasta
  const path = `./uploads/${tipoCollection}/${nomeArquivo}`;

  // arquivo.mv(path, err => {
    
  //   if (err) {
  //     return res.status(500).json(
  //       {
  //         ok: false,
  //         mensage: 'erro para gravar foto',
  //         erro: err
  //       }
  //     );
  //   }

  //   res.status(200).json(
  //     {
  //       ok: true,
  //       mensage: 'gravou'
  //     }
  //   );
  // });

  try {
    await arquivo.mv(path);


    if (tipoCollection === 'usuario') {
      const usu = await Usuario.findById(id);
      
      const antigo = './uploads/usuario/'+ usu.img;

      // deleta foto antiga
      if (fs.existsSync(antigo)) {
        fs.unlink(antigo);
      }

      usu.img = nomeArquivo;

      console.log('dddddd')
      // usuarios.update(
      // {
      //  _id: ObjectId("5aa5541452f6f1c435e5970d")
      // },
      // {
      //  '$set': {
      //           img: '5aa5541452f6f1c435e5970d-477.jpeg'
      //          }
      //  }
      // )
      await usu.save();

      // SERIA MAIS OU MENOS ASSIM
      // await Usuario.update({_id: ObjectId("5aa5541452f6f1c435e5970d")}, usu)

      return res.status(200).json(
        {
          ok: true,
          usuario: usu
        }
      );
    }

    if (tipoCollection === 'medico') {
      
    }

    if (tipoCollection === 'hospital') {
      
    }
    
  } catch (error) {
    return res.status(500).json(
      {
        ok: false,
        mensage: 'erro para gravar foto',
        erro: error
      }
    );    
  }

  
});

module.exports = app;