let express=require("express");

const { loginDataInsert, loginDelete, loginList, googleLogin } = require("../controllers/web/loginDataFolder");
let loginRoutes=express.Router();
loginRoutes.post("/login-insert",loginDataInsert);
loginRoutes.delete("/login-delete/:id",loginDelete);
loginRoutes.get("/login-view", loginList);
loginRoutes.post('/google',googleLogin);
module.exports={loginRoutes};