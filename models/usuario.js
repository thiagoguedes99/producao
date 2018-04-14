const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const Schema = mongoose.Schema;

const rolesValidos = {
  values: ['ADMIN_ROLE', 'USER_ROLE'],
  message: '{VALUE} não é role permitido'
};

const usuarioSchema = new Schema({
  name: {type: String, required: [true, 'Nome é obrigratório']},
  email: {type: String, unique: true, required: [true, 'email é obrigratório']},
  password: {type: String, required: [true, 'password é obrigratório']},
  img: {type: String, required: false},
  role: {type: String, required: true, default: 'USER_ROLE', enum: rolesValidos},
  google: { type: Boolean, required: false, default: false }
});

usuarioSchema.plugin(uniqueValidator, {message: '{PATH} é único'})
module.exports = mongoose.model('Usuario', usuarioSchema);
