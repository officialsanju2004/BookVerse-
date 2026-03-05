// routes/adminAuth.js
const express = require("express");
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");
const adminLoginModel = require("../../../../AdminLogInModel");

require('dotenv').config();
const loginRouter = express.Router();
const adminLoginRouter=express.Router();
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "bably1937@gmail.com",

    pass: "fjup jvkd olzl osyz", //app password
  },
});


const SECRET_KEY = "MY_SECRET_KEY"; 

// ✅ Admin Login
loginRouter.post("/login", async(req, res) => {
 
  const { username, password } = req.body;

  const admin=await adminLoginModel.findOne({username:username});
  
  if(!admin){
    return res.status(404).json({success:false,mess:"Admin details not found"});
  }

  if (admin.username===username && admin.password===password) {
    
    const token = jwt.sign({ role: "admin" }, SECRET_KEY, { expiresIn: "1h" });
    return res.json({ success: true, mess:"LoginSucess",token })
     
  } else {
    return res.status(401).json({ success: false, message: "Invalid credentials" });
  }
  
});


adminLoginRouter.post("/admin-insert",  async(req, res) => {
  let {username,password} = req.body; //data from api

  let adminLoginData = new adminLoginModel({
   username,password
   
  });
 adminLoginData.save()
    .then(() => {
      res.send({ status: 1, mess: "Data Saved Sucessfully!" });
    })
    .catch((err) => {
      res.send({ status: 0, mess: "Error While saving Data!", error: err });
    });
});



adminLoginRouter.post("/forgot-password", async (req, res) => {
  try {
    const { username } = req.body;
    const admin=await adminLoginModel.findOne({username:username});
  
  if(!admin){
    return res.status(404).json({success:false,mess:"Admin details not found"});
  }
    const otp = Math.floor(1000 + Math.random() * 9000);

    global.resetOtpData={
      otp,
   
      username:admin.username
    }
    await transporter.sendMail({
      from: "bably1937@gmail.com",
      to:admin.username,
      subject: "Password Reset OTP",
      text: `Your OTP is ${otp}`,
    });
    res.json({ message: "OTP sent to your registered email" });
   
  } catch (err) {
    console.error("Forgot password error:", err);
    res.status(500).json({ message: "Server error while sending OTP"});
  }
});
adminLoginRouter.post("/reset-password", async (req, res) => {
  try {
    const { username, otp, newPassword } = req.body;
    const admin=await adminLoginModel.findOne({username:username});
  if(!admin){
    return res.status(404).json({success:false,mess:"Admin details not found"});
  }
  if(!global.resetOtpData||global.resetOtpData.username!==username||global.resetOtpData.otp!==parseInt(otp)){
    return res.status(400).json({message:"invalid or expired otp"})
  }
admin.password=newPassword;
await admin.save();
    global.resetOtpData=null;
    res.json({ message: "Password reset successfully" });
  } catch (err) {
    console.error("Reset password error:", err);
    res.status(500).json({ message: "Server error while resetting password" });
  }
});




adminLoginRouter.post("/admin-update", async (req, res) => {
  try {
    const {
      currentUsername,
      newUsername,
      currentPassword,
      newPassword,
    } = req.body;

    // 1️⃣ Find admin by current username
    const admin = await adminLoginModel.findOne({ username: currentUsername });
    if (!admin) {
      return res.status(404).json({ success: false, message: "Admin not found" });
    }

    // 2️⃣ Check if current password matches
    if (admin.password !== currentPassword) {
      return res.status(401).json({ success: false, message: "Incorrect current password" });
    }

    // 3️⃣ Update username & password
    admin.username = newUsername || admin.username;
    admin.password = newPassword || admin.password;

    await admin.save();

    return res.json({
      success: true,
      message: "Admin credentials updated successfully",
      updatedData: { username: admin.username, password: admin.password },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

  
module.exports = {loginRouter,adminLoginRouter,SECRET_KEY };