//123-creating the place schema
const mongoose = require('mongoose');

const Schema = mongoose.Schema;


const placeSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String, required: true }, // image url so string
  address: { type: String, required: true },
  location: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
  },
  creator: { type: mongoose.Types.ObjectId, required: true, ref: 'User' }       //134-Adding relation between places and user
});

// model return a constructor function two arguments, model-collection Upper name and schema   
module.exports = mongoose.model('Place', placeSchema);