

const nodemailer = require("nodemailer");
const ClubOtpModel = require("../../../../ClubOtpModel");


const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "bably1937@gmail.com",

    pass: "fjup jvkd olzl osyz", //app password
  },
});
const ClubOtpInsert=(async (req, res) => {
  let { otpGen,email } = req.body; 
  
  let otpData = new ClubOtpModel({
     otpGen,email
   
  });
  if(!email){
    return res.status(400).json({status :0,mess:"Email required"});
  }
  
   const existingOtp=await ClubOtpModel.findOne({email});
   if(existingOtp){
    existingOtp.otpGen=otpGen;
    await existingOtp.save();
   }
  
     
      const mailOptions = {
          from: "godsanju21@gmail.com",
          to: otpData.email,
          subject: `Email Verification for BookVerse Club SignUp form `,
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
let ClubOtpView= async (req, res) => {
      let otp = await ClubOtpModel.find();
      res.status(200).json({ status: 1, mess: "otpList", otpList :otp});

    };
      let ClubotpDelete= async (req, res) => {
        let otpId = req.params.id;
        let otpdelete = await ClubOtpModel.deleteOne({ _id: otpId });
        res.send({ status: 1, mess: "otp deleted" });
      };
module.exports={ClubOtpInsert,ClubOtpView,ClubotpDelete};