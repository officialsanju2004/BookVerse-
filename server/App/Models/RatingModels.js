
const mongoose = require('mongoose');

const ratingSchema = new mongoose.Schema({

  stars: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  review: String,
  author: {
    type: String,
    required: true
  },
 
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Rating', ratingSchema);