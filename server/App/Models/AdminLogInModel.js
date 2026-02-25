let mongoose = require("mongoose");

let adminLoginDataSchema = mongoose.Schema({
  
 username: {
   unique: true,
  type: String,
    required: true,
   
  },
  password: {
    type: String,
    required: true,
  }

 
});

let adminLoginModel = mongoose.model("Adminlogindata", adminLoginDataSchema);

module.exports = adminLoginModel;
