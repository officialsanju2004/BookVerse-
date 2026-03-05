
const nodemailer = require("nodemailer");
const ClubOtpModel = require("../../../../ClubOtpModel");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,  // ✅ env variable use karo
    pass: process.env.EMAIL_PASS,  // ✅ env variable use karo
  },
});

const ClubOtpInsert = async (req, res) => {
  let { otpGen, email } = req.body;

  if (!email) {
    return res.status(400).json({ status: 0, mess: "Email required" });
  }

  try {
    // Upsert - existing update karo ya naya banao
    let otpData = await ClubOtpModel.findOneAndUpdate(
      { email },
      { otpGen },
      { upsert: true, new: true }
    );

    const mailOptions = {
      from: process.env.EMAIL_USER,  // ✅ SAME as auth.user hona chahiye!
      to: email,
      subject: `Email Verification for BookVerse Club SignUp`,
      text: `Hello ${email},\n\nYour OTP for Email verification is: ${otpGen}\n\nPlease fill this OTP in the input box!`,
    };

    transporter.sendMail(mailOptions)
      .then(() => console.log("OTP sent to:", email))
      .catch((err) => console.error("OTP email error:", err));

    res.send({ status: 1, mess: "OTP Saved Successfully!" });

  } catch (err) {
    res.send({ status: 0, mess: "Error while saving OTP!", error: err });
  }
};
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

