const nodemailer = require("nodemailer");
const ClubOtpModel = require("../../../../ClubOtpModel");

let ClubOtpInsert = async (req, res) => {

  let { otpGen, email } = req.body;

  if (!email) {
    return res.status(400).json({ status: 0, mess: "Email required" });
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
      subject: "Email Verification for BookVerse Club SignUp",
      html: `
        <h3>Email Verification</h3>
        <p>Hello ${email}</p>
        <p>Your OTP for verification is:</p>
        <h2>${otpGen}</h2>
        <p>Please enter this OTP in the verification box.</p>
      `
    });

    console.log("OTP Email Sent");

    let otpData = new ClubOtpModel({ email, otpGen });
    await otpData.save();

    res.send({ status: 1, mess: "OTP Sent Successfully!" });

  } catch (err) {
    console.log("OTP Email Error:", err);
    res.send({ status: 0, mess: "OTP not sent!", error: err });
  }

};


let ClubOtpView = async (req, res) => {
  let otp = await ClubOtpModel.find();
  res.status(200).json({ status: 1, mess: "otpList", otpList: otp });
};


let ClubotpDelete = async (req, res) => {
  let otpId = req.params.id;
  await ClubOtpModel.deleteOne({ _id: otpId });
  res.send({ status: 1, mess: "otp deleted" });
};


module.exports = { ClubOtpInsert, ClubOtpView, ClubotpDelete };
