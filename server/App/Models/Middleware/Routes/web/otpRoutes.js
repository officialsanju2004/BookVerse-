let express=require("express");
const { OtpInsert, OtpView, otpDelete } = require("../controllers/web/OtpDataFolder");
let otpRoutes=express.Router();
otpRoutes.post("/otp-insert",OtpInsert);
otpRoutes.get("/otp-view",OtpView);
otpRoutes.delete("/otp-delete/:id",otpDelete);
module.exports={otpRoutes};