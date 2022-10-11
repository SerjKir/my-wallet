const {Schema, model, Types} = require('mongoose');

const schema = new Schema({
  owner: {type: Types.ObjectId, required: true, ref: 'User'},
  balance: {type: Array, default: []},
  cash: {type: Array, default: []},
  cards: [{type: Types.ObjectId, ref: 'Card'}],
}, {
  timestamps: true
})

module.exports = model('Wallet', schema);

