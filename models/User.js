const {Schema, model, Types} = require('mongoose');

const schema = new Schema({
  username: {type: String, required: true, unique: true},
  passwordHash: {type: String, required: true},
  wallet: {type: Types.ObjectId, ref: 'Wallet'},
  avatarUrl: {type: String, default: '/uploads/default_user.jpg'},
  isSkin: {type: Boolean, default: false},
  lang: {type: String, default: 'uk'}
}, {
  timestamps: true
})

module.exports = model('User', schema);

