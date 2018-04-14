const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');

const Usuarios = require('../models/usuario');
const auth = require('../middlewares/autentication').verificaToken;

const app = express();

const GOOGLE_CLIENT_ID = '741096697265-phubr9ktscv968auhldt8k9sh8s7c73r.apps.googleusercontent.com';
const GOOGLE_SECRET = '1mUcJP4oZVOmMHbqfCBvai12';



app.post('/', (req, res) => {
console.log(req.body.email);
  Usuarios.findOne( { email: req.body.email } , (err, usuario) => {

    if (err) {
      return res.status(500).json({
        ok: false,
        mensage: 'error ao buscar usuário',
        error: err
      });
    }

    if (!usuario) {
      return res.status(400).json({
        ok: false,
        mensage: 'erro de credencial - email'
      });
    }

    if (!bcrypt.compareSync(req.body.password, usuario.password)) {
      return res.status(400).json({
        ok: false,
        mensage: 'erro de credencial - password'
      });
    }

    // criar token - payload = o usuário com os dados que será criptografado em token
    const token = jwt.sign({ usuario: usuario}, '@chave-secreta_do_token', {expiresIn: 14400}); // 4 horas
    // fim criar token

    // necessário para retirar a propriedade 'password' do objeto usuário.
    const usuarioFinal = {
      id: usuario._id,
      name: usuario.name,
      email: usuario.email,
      role: usuario.role
    }

    return res.status(200).json({
      ok: true,
      usuario: usuarioFinal,
      token,
      menu: getMenu(usuario.role)
    });

  });
});

app.post('/google', (req, res) => {
  const client = new OAuth2Client(GOOGLE_CLIENT_ID, GOOGLE_SECRET);

  const token = req.body.token;
  console.log('meu token');
  console.log(token);

  async function verify() {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: GOOGLE_CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload();
    const userid = payload['sub'];
    // If request specified a G Suite domain:
    //const domain = payload['hd'];

    console.log('payload');
    console.log(payload);
    Usuarios.findOne({ email: payload.email }, (err, usuario) => {
      if (err) {
        return res.status(500).json({
          ok: true,
          mensage: 'erro na busca do usuario',
          errors: err
        });
      }

      if (usuario) {
        if (usuario.google === false) {
          return res.status(400).json({
            ok: true,
            mensage: 'deve usar autenticação normal'
          });
        } else {
          // criar token - payload = o usuário com os dados que será criptografado em token
          const token = jwt.sign({ usuario: usuario}, '@chave-secreta_do_token', {expiresIn: 14400}); // 4 horas
          // fim criar token

          // necessário para retirar a propriedade 'password' do objeto usuário.
          const usuarioFinal = {
            id: usuario._id,
            name: usuario.name,
            email: usuario.email,
            img: usuario.img,
            google: usuario.google,
            role: usuario.role,
            menu: getMenu(usuario.role)
          }

          return res.status(200).json({
            ok: true,
            usuario: usuarioFinal,
            token
          });

        }  
      } else {

        const usuarioGoogle = new Usuarios({
          name: payload.name,
          email: payload.email,
          password: 'google',
          img: payload.picture,
          google: true
        });

        usuarioGoogle.save((err, userDB) => {

          if (err) {
            
          }

          console.log('vai criar token');
          // criar token - payload = o usuário com os dados que será criptografado em token
          const token = jwt.sign({ usuario: userDB}, '@chave-secreta_do_token', {expiresIn: 14400}); // 4 horas
          // fim criar token

          console.log('vai criar obj');
          // necessário para retirar a propriedade 'password' do objeto usuário.
          const usuarioFinal = {
            id: userDB._id,
            name: userDB.name,
            email:userDB.email,
            img: userDB.img,
            role: userDB.role,
            menu: getMenu(userDB.role)
          }

          console.log('vai mandar 200');
          return res.status(200).json({
            ok: true,
            usuario: usuarioFinal,
            token
          });
        });

      }
    });
  }
  verify().catch(
    console.error,
    // res.status(400).json({
    //   ok: false,
    //   mensage: 'deu merda no login do google'
    // }),
    // console.error
  );

});

function getMenu(role) {
  console.log('entrou no role')
  console.log(role)
  const menu = [
    {
      titulo: 'Principal',
      icone: 'mdi mdi-gauge',
      submenu: [
        {titulo: 'Dashboard', url: '/dashboard'},
        {titulo: 'ProgressBar', url: '/progress'},
        {titulo: 'Graficas', url: '/graficas1'},
        {titulo: 'promessas', url: '/promessas'},
        {titulo: 'rxjs', url: '/rxjs'},
      ]
    },
    {
      titulo: 'mantenimientos',
      icone: 'mdi mdi-folder-lock-open',
      submenu: [
        // {titulo: 'Usuários', url: '/usuarios'},
        {titulo: 'Hospitais', url: '/hospitais'},
        {titulo: 'Médicos.', url: '/medicos'},
      ]
    }
  ]

  if (role === 'ADMIN_ROLE') {
    menu[1].submenu.unshift({titulo: 'Usuários', url: '/usuarios'});
  }

  return menu;
};

app.get('/novotoken', auth, (req, res) => {
  const token = jwt.sign({ usuario: req.usuario }, '@chave-secreta_do_token', {expiresIn: 14400}); // 4 horas

  return res.status(200).json({
    ok: true,
    token
  });
});


module.exports = app;