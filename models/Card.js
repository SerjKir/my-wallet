const {Schema, model, Types} = require('mongoose');

const schema = new Schema({
  name: {type: String, required: true, default: 'Картка'},
  wallet: {type: Types.ObjectId, required: true, ref: 'Wallet'},
  amount: {type: Number, required: true, default: '0'},
  currency: {type: String, required: true, default: 'UAH'},
  number: {type: String, required: true, unique: true},
  expDate: {type: String, required: true},
  cvv: {type: String, required: true},
  holder: {type: String},
  scheme: {type: String},
  type: {type: String}
}, {
  timestamps: true
})

module.exports = model('Card', schema);