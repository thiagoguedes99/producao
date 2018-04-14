const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const medicoSchema = new Schema({
  name: {
    type: String,
    required: [true, 'Nome é obrigratório']
  },
  img: {
    type: String,
    required: false
  },
  usuario: {
    type: Schema.Types.ObjectId,
    ref: 'Usuario',
    required: true
  },
  hospital: {
    type: Schema.Types.ObjectId,
    ref: 'Hospital',
    required: [true, 'hospital é obrigatório']
  }
});

module.exports = mongoose.model('Medico', medicoSchema);

/* LEMBRETE IMPORTANTE */
// {collection: 'hospitais'} - nome que será usado na collection dentro do banco.
// 'Hospital' - nome da collection para ser usada dentro do código. 