let express=require("express");
const { commentDataInsert, commentView } = require("../controllers/web/commentDataFolder");
let commentRoutes=express.Router();
commentRoutes.post("/comment-insert",commentDataInsert);
commentRoutes.get("/comment-view",commentView);

module.exports={commentRoutes};

