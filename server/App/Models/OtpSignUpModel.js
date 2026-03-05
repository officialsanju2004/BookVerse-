let mongoose = require("mongoose");

let OtpSchema = mongoose.Schema({

otpGen:{
     required: true,
    type:String
},
email: {
    type: String,
    required: true,
    unique: true,
  }
});

let otpModel = mongoose.model("otpdata", OtpSchema);
module.exports = otpModel;
