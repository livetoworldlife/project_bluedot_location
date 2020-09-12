// 130- creating user model
const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, minlength: 6 },
  image: { type: String, required: true },
  places: [{ type: mongoose.Types.ObjectId, required: true, ref: 'Place' }]       //134-Adding relation between places and user
});

userSchema.plugin(uniqueValidator); // for unique email we need third party package

module.exports = mongoose.model('User', userSchema);


