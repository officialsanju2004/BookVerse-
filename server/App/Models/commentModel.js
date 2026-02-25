let mongoose = require("mongoose");
let commentSchema= mongoose.Schema({
  name:{
    type:String,
     requireed: true,

  },
    comment : {
    type:String,
    requireed: true,
  },
    date: {
    type: Date,
    default: Date.now
  }
});



let commentModel=mongoose.model("comment",commentSchema)
module.exports=commentModel;