let mongoose = require("mongoose");

let ClubOtpSchema = mongoose.Schema({

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

let ClubOtpModel = mongoose.model("ClubOtpData", ClubOtpSchema);
module.exports = ClubOtpModel;