let mongoose = require("mongoose");

let productListSchema = mongoose.Schema({
 
  title: {
    type: String,
    required: true,
    unique: true,
  },
  author: {
    type: String,
    required: true,
  },
  price:{
    type:Number,
    required:true,
   
  },
  ratings: {
    type:Number,
    required: true,
  },
  image:{
    type:String,
    required:true,
    
  },
  description: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  }
,
  isbn: {
    type: String,
    required: true,
    unique: true
  },
  publisher: {
    type: String,
    required: true
  },
  dimensions: {
    type: String,
    required: true
  },
  pages: {
    type: Number,
    required: true
  },
  publicationDate: {
    type: Date,
    required: true
  },
  stock :{
    type:Number,
    required:true,
    default:0
  }
});


  





let productModel = mongoose.model("BookList", productListSchema);


module.exports = productModel;
