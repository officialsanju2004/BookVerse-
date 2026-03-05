const loginModel = require("../../../../LoginModel");
const bcrypt = require("bcrypt");
require('dotenv').config();
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.VITE_GOOGLE_CLIENT_ID);


const jwt =require("jsonwebtoken");
let loginDataInsert = async (req, res) => {
  let { name, email, password, rememberMe } = req.body; //data from api
  const hashedPassword = await bcrypt.hash(password, 10);
  let loginData = new loginModel({
    name, email, password: hashedPassword, rememberMe

  });

  loginData.save()
    .then(() => {
      res.send({ status: 1, mess: "Data Saved Sucessfully!", loginData: loginData });

    })
    .catch((err) => {
      res.send({ status: 0, mess: "Error While saving Data!", error: err });
    });


};


let googleLogin = async (req, res) => {

  try {
    const { token } = req.body;

    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.VITE_GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();

    let user = await loginModel.findOne({
      email: payload.email
    });

    if (!user) {
      user = new loginModel({
        name: payload.name,
        email: payload.email,
        profilePicture: payload.picture,
        googleId: payload.sub,
        authProvider: 'google',
        isVerified: true
      });
      await user.save();
    }

    const authToken = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(200).json({ token: authToken, user });

  } catch (error) {
    console.error('Google auth error:', error);
    res.status(400).json({ message: 'Google authentication failed' });
  }
};

let loginDelete = async (req, res) => {
  let loginId = req.params.id;

  let logindelete = await loginModel.deleteOne({ _id: loginId });
  res.send({ status: 1, mess: "login deleted", loginDelete });
}
let loginList = async (req, res) => {
  let login = await loginModel.find();
  res.status(200).json({ status: 1, mess: "login List", loginList: login });
}
module.exports = { loginDataInsert, loginDelete, loginList, googleLogin };