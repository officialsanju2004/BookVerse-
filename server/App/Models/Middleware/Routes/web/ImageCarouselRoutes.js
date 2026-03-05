let express=require("express");
const { ImageCarouselInsert, ImageCarouselView, imageCarouselDelete } = require("../controllers/web/ImageCarouselFolder");

let ImageCarouselRoutes=express.Router();
ImageCarouselRoutes.post("/ImageCarousel-insert",ImageCarouselInsert);
ImageCarouselRoutes.get("/ImageCarousel-view",ImageCarouselView);
ImageCarouselRoutes.delete("/ImageCarousel-view/:id",imageCarouselDelete);
module.exports={ImageCarouselRoutes};