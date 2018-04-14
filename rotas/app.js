const express = require('express');

const app = express();

app.get('/', (req, res) => {
  res.status(200).json(
    {
      ok: true,
      mensage: 'pedido realizado'
    }
  );
});

module.exports = app;