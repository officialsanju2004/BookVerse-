let express=require("express");
const { userData, userInsert, userDelete } = require("../controllers/web/UserDataFolder");


let userRoutes=express.Router();
userRoutes.get("/userInfo-view", userData);
userRoutes.post("/userInfo-insert",userInsert);
userRoutes.delete("/userInfo-delete/:id",userDelete);



module.exports={userRoutes};

