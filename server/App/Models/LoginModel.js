let mongoose = require("mongoose");

let loginDataSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
 password: {
  type: String,
  required: function () {
    return this.authProvider === "local";
  },
  select: false
},

  googleId: {
    type: String
  },

  authProvider: {
    type: String,
    enum: ["local", "google"],
    default: "local"
  },

 
});

let loginModel = mongoose.model("logindata", loginDataSchema);

module.exports = loginModel;
