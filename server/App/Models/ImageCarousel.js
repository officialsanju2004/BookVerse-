let mongoose = require("mongoose");
let ImageCarouselSchema = mongoose.Schema({  
image:{
    type:String,
    required:true,
    
  }
});



let ImageCarouselModel=mongoose.model("ImageCarousel",ImageCarouselSchema);
module.exports=ImageCarouselModel;





