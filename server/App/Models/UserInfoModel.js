let mongoose = require("mongoose");

let UserDataSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  favoriteGenre: {
    type: String,
    required: true,
  },
});

let UserModel = mongoose.model("Userdata", UserDataSchema);

module.exports = UserModel;