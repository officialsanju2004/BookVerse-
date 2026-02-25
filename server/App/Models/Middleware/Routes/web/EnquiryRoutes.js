let express=require("express");
const { enquiryInsert, enquiryView, enquiryDelete } = require("../controllers/web/UserEnquiryFolder");


let enquiryRoutes=express.Router();
enquiryRoutes.post("/enquiry-insert",enquiryInsert);
enquiryRoutes.get("/enquiry-view", enquiryView);
enquiryRoutes.delete("/enquiry-delete/:id",enquiryDelete);
module.exports={enquiryRoutes};