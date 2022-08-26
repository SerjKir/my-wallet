const {Schema, model, Types} = require('mongoose');

const schema = new Schema({
  name: {type: String, required: true, unique: true},
  passwordHash: {type: String, required: true},
  balance: {type: Array, default: []},
  cash: {type: Array, default: []},
  cards: [{type: Types.ObjectId, ref: 'Card'}],
  avatarUrl: {type: String, default: '/uploads/default_user.jpg'}
}, {
  timestamps: true
})

module.exports = model('User', schema)

