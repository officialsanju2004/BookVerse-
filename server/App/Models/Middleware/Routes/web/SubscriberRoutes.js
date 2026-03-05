let express=require('express');
const { subscriberDataInsert, subscriberDataView, subscriberDelete } = require('../controllers/web/subscriberDataFolder');
let subscriberRoutes=express.Router(); 
subscriberRoutes.post("/subscriber-insert",subscriberDataInsert)
subscriberRoutes.get("/subscriber-view", subscriberDataView);
subscriberRoutes.delete("/subscriber-delete/:id",subscriberDelete);


module.exports= {subscriberRoutes};