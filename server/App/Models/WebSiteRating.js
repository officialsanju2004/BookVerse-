const mongoose = require('mongoose');

const websiteRatingSchema = new mongoose.Schema({

  stars: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  author:{
    type:String,
  },
  reviewText:{
    type:String
  }
});

module.exports = mongoose.model('WebsiteRating', websiteRatingSchema);