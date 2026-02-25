let mongoose = require("mongoose");

let subscriberDataSchema = mongoose.Schema({
 
  email: {
    type: String,
    required: true,
    unique: true,
  }
});

let subscriberModel = mongoose.model("subscriberdata", subscriberDataSchema);

module.exports = subscriberModel;
