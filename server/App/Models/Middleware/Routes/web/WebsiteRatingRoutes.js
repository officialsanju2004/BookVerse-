let express=require("express");
const { websiteratingData, websiteratingInsert } = require("../controllers/web/WebsiteRatingFolder");


let websiteratingRoutes=express.Router();
websiteratingRoutes.get("/websiterating-view", websiteratingData);
websiteratingRoutes.post("/websiterating-insert",websiteratingInsert);



module.exports={websiteratingRoutes};