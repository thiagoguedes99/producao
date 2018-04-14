const path = require('path');

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser')

const app = express();

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  next();
});

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// rotas importadas
const appRoutes = require('./rotas/app');
const usuarioRoutes = require('./rotas/usuario');
const loginRoutes = require('./rotas/login');
const hospitalRoutes = require('./rotas/hospital');
const medicoRoutes = require('./rotas/medico');
const buscaTotalRoutes = require('./rotas/buscaTotal');
const uploadRoutes = require('./rotas/upload');
const imagensRoutes = require('./rotas/download');




mongoose.Promise = global.Promise;
mongoose.set('debug', true);
// mongoose.connect(.........)
mongoose.connection.openUri('mongodb://localhost:27017/hospitalDB', (err, res) => {
  if (err) throw err;

  console.log('mongodb: \x1b[32m%s\x1b[0m','conectado');
});

// deixar imagens livres no browser
// ==========================================================
// var serveIndex = require('serve-index');
// app.use(express.static(__dirname + '/'))
// app.use('/uploads', serveIndex(__dirname + '/uploads'));
// ==========================================================

// rotas
// app.use('/', appRoutes);
app.use('/', express.static('client', {redirect: false}));

app.use('/usuario', usuarioRoutes);
app.use('/login', loginRoutes);
app.use('/hospital', hospitalRoutes);
app.use('/medico', medicoRoutes);
app.use('/busca', buscaTotalRoutes);
app.use('/upload', uploadRoutes);
app.use('/imagem', imagensRoutes);

app.get('*', function(req, res, next) {
  res.sendFile(path.resolve('client/index.html'));
});

app.listen(3000, () => {
  console.log('Express server rodando port 3000: \x1b[32m%s\x1b[0m','online') 
  // \x1b[32m - deixa as letras em verde.
  // %s - é a variável 'online'.
  // \x1b[0m - faz o resert de cores para o padrão (branco).
});


// client ID
// 741096697265-phubr9ktscv968auhldt8k9sh8s7c73r.apps.googleusercontent.com

// client secret
// 1mUcJP4oZVOmMHbqfCBvai12