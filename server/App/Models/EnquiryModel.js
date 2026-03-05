let mongoose = require("mongoose");
let userEnquirySchema = mongoose.Schema({
  name: {
    type:String,
    required: true,
  },
  email: {
    type:String,
    required: true,
    unique: true,
  },
  subject: {
    type:String,
    required: true,
  },
  message: {
    type:String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now
  }
});



let enquiryModel=mongoose.model("enquiry",userEnquirySchema)
module.exports=enquiryModel;





