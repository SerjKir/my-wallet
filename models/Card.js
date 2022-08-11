const { Schema, model, Types} = require('mongoose');

const schema = new Schema({
  name: {type: String, required: true, default: 'Картка'},
  owner: {type: Types.ObjectId, required: true, ref: 'User'},
  amount: {type: Number, required: true, default: '0'},
  currency: {type: String, required: true, default: 'UAH'},
  number: {type: Number, required: true, unique: true},
  expDate: {type: String, required: true},
  cvv: {type: Number, required: true},
  holder: {type: String},
  scheme: {type: String},
  type: {type: String}
})

module.exports = model('Card', schema);