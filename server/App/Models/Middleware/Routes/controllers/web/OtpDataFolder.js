const otpModel = require("../../../../OtpSignUpModel");

const nodemailer = require("nodemailer");


const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "bably1937@gmail.com",

    pass: "fjup jvkd olzl osyz", //app password
  },
});
const OtpInsert=(async (req, res) => {
  let { otpGen,email } = req.body; 
  
  let otpData = new otpModel({
     otpGen,email
   
  });
  if(!email){
    return res.status(400).json({status :0,mess:"Email required"});
  }
  
   const existingOtp=await otpModel.findOne({email});
   if(existingOtp){
    existingOtp.otpGen=otpGen;
    await existingOtp.save();
   }
  
     
      const mailOptions = {
          from: "godsanju21@gmail.com",
          to: otpData.email,
          subject: `Email Verification for BookVerse SignUp`,
          text: `Hello ${otpData.email},\n\nYour OTP for Email verification is : ${otpData.otpGen}\n\nPlease Fill this otp to the otp input textbox!.`,
        };

        setImmediate(() => {
          transporter
            .sendMail(mailOptions)
            .then(() => console.log("OTP sent to :", otpData.email))
            .catch((err) => {
              console.error("OTP email error:", err);
            });
        })
    otpData.save()
    .then(() => {
      res.send({ status: 1, mess: "Otp Saved Sucessfully!" , otpGen:otpData.otp});
      
    })
    .catch((err) => {
      res.send({ status: 0, mess: "Error While saving otp!", error: err });
    });
    
});
let OtpView= async (req, res) => {
      let otp = await otpModel.find();
      res.status(200).json({ status: 1, mess: "otpList", otpList :otp});

    };
      let otpDelete= async (req, res) => {
        let otpId = req.params.id;
        let otpdelete = await otpModel.deleteOne({ _id: otpId });
        res.send({ status: 1, mess: "otp deleted" });
      };
module.exports={OtpInsert,OtpView,otpDelete};