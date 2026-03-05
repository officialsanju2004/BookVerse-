let express=require("express");
const { ClubOtpInsert, ClubOtpView, ClubotpDelete } = require("../controllers/web/ClubEmailOtp");

let ClubOtpRoutes=express.Router();
ClubOtpRoutes.post("/clubotp-insert",ClubOtpInsert);
ClubOtpRoutes.get("/clubotp-view",ClubOtpView);
ClubOtpRoutes.delete("/clubotp-delete/:id",ClubotpDelete);
module.exports={ClubOtpRoutes};