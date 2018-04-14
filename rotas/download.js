const express = require('express');
const fs = require('fs');

const app = express();

app.get('/:tipo/:id', (req, res) => {

    const tipo = req.params.tipo;
    const id = req.params.id;   

    let path = `./uploads/${tipo}/${id}`;

    fs.exists(path, existe => {
      if (!existe) {
        path = `./assets/img/no-img.jpg`;
      }

      res.sendfile(path);
    });
});

module.exports = app;