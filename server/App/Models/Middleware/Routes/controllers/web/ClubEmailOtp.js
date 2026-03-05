const nodemailer = require("nodemailer");
const ClubOtpModel = require("../../../../ClubOtpModel");

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS, // App Password use kar
  },
});

const ClubOtpInsert = async (req, res) => {
  let { otpGen, email } = req.body;
  
  // Validation
  if (!email) {
    return res.status(400).json({ status: 0, mess: "Email required" });
  }
  if (!otpGen) {
    return res.status(400).json({ status: 0, mess: "OTP required" });
  }
  
  try {
    // Database mein save ya update kar
    const existingOtp = await ClubOtpModel.findOne({ email });
    
    if (existingOtp) {
      existingOtp.otpGen = otpGen;
      await existingOtp.save();
      console.log("OTP updated in DB for:", email);
    } else {
      const otpData = new ClubOtpModel({ otpGen, email });
      await otpData.save();
      console.log("OTP saved in DB for:", email);
    }
    
    // Email bhej
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: `Email Verification for BookVerse Club SignUp form`,
      text: `Hello ${email},\n\nYour OTP for Email verification is: ${otpGen}\n\nPlease fill this OTP in the OTP input textbox!`,
    };
    
    // Email bhejne ka wait kar
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent successfully:", info.response);
    
    // Success response
    res.status(200).json({ 
      status: 1, 
      mess: "OTP saved and sent successfully! Check your email." 
    });
    
  } catch (error) {
    console.error("Full error details:", error);
    
    // Specific error messages de
    if (error.code === 'EAUTH') {
      return res.status(500).json({ 
        status: 0, 
        mess: "Gmail authentication failed! App Password use kar bhai.",
        error: error.message 
      });
    }
    
    if (error.code === 'ESOCKET') {
      return res.status(500).json({ 
        status: 0, 
        mess: "Network issue! Internet check kar.",
        error: error.message 
      });
    }
    
    // Generic error
    res.status(500).json({ 
      status: 0, 
      mess: "OTP save to ho gaya but email send nahi hua",
      error: error.message 
    });
  }
};

// Baaki functions same rahenge
let ClubOtpView = async (req, res) => {
  try {
    let otp = await ClubOtpModel.find();
    res.status(200).json({ status: 1, mess: "otpList", otpList: otp });
  } catch (error) {
    res.status(500).json({ status: 0, mess: "Error fetching OTPs", error: error.message });
  }
};

let ClubotpDelete = async (req, res) => {
  try {
    let otpId = req.params.id;
    await ClubOtpModel.deleteOne({ _id: otpId });
    res.status(200).json({ status: 1, mess: "OTP deleted successfully" });
  } catch (error) {
    res.status(500).json({ status: 0, mess: "Error deleting OTP", error: error.message });
  }
};

module.exports = { ClubOtpInsert, ClubOtpView, ClubotpDelete };
