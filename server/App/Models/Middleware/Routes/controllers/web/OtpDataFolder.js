const otpModel = require("../../../../OtpSignUpModel");
const nodemailer = require("nodemailer");

let OtpInsert = async (req, res) => {

  let { otpGen, email } = req.body;

  if (!email) {
    return res.status(400).json({
      status: 0,
      mess: "Email required",
      EMAIL_USER: process.env.EMAIL_USER,
      EMAIL_PASS: process.env.EMAIL_PASS
    });
  }

  try {

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Email Verification for BookVerse SignUp",
      text: `Your OTP is ${otpGen}`
    });

    const existingOtp = await otpModel.findOne({ email });

    if (existingOtp) {
      existingOtp.otpGen = otpGen;
      await existingOtp.save();
    } else {
      let otpData = new otpModel({ email, otpGen });
      await otpData.save();
    }

    res.send({
      status: 1,
      mess: "OTP Sent Successfully!",
      EMAIL_USER: process.env.EMAIL_USER,
      EMAIL_PASS: process.env.EMAIL_PASS
    });

  } catch (err) {

    res.send({
      status: 0,
      mess: "OTP not sent",
      error: err.message,
      fullError: err,
      EMAIL_USER: process.env.EMAIL_USER,
      EMAIL_PASS: process.env.EMAIL_PASS
    });

  }
};

let OtpView = async (req, res) => {
  let otp = await otpModel.find();
  res.status(200).json({ status: 1, mess: "otpList", otpList: otp });
};


let otpDelete = async (req, res) => {
  let otpId = req.params.id;
  await otpModel.deleteOne({ _id: otpId });
  res.send({ status: 1, mess: "otp deleted" });
};


module.exports = { OtpInsert, OtpView, otpDelete };
