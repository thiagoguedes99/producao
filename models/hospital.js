const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const hospitalSchema = new Schema({
  name: {type: String, required: [true, 'Nome é obrigratório']},
  img: {type: String, required: false},
  usuario: {type: Schema.Types.ObjectId, ref: 'Usuario'},
}, {collection: 'hospitais'});

module.exports = mongoose.model('Hospital', hospitalSchema);

/* LEMBRETE IMPORTANTE */
// {collection: 'hospitais'} - nome que será usado na collection dentro do banco.
// 'Hospital' - nome da collection para ser usada dentro do código. 