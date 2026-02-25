const express = require("express");
const path = require("path");
const app = express();
const cors = require('cors');
require('dotenv').config();

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const mongoose = require("mongoose");
const { enquiryRoutes } = require("./App/Models/Middleware/Routes/web/EnquiryRoutes");
const { loginRoutes } = require("./App/Models/Middleware/Routes/web/loginDataRoutes");
const { productRoutes } = require("./App/Models/Middleware/Routes/web/ProductRoutes");
const { userRoutes } = require("./App/Models/Middleware/Routes/web/UserInfoRoutes");
const router = require("./App/Models/Middleware/Routes/web/RatingRoutes");
const { commentRoutes } = require("./App/Models/Middleware/Routes/web/commentRoutes");
const { subscriberRoutes } = require("./App/Models/Middleware/Routes/web/SubscriberRoutes");
const verifyAdmin = require("./App/Models/Middleware/AdminAuthMiddleware");
const { loginRouter, adminLoginRouter } = require("./App/Models/Middleware/Routes/controllers/web/AdminDataFolder");
const orderRouter = require("./App/Models/Middleware/Routes/controllers/web/OrderDataFolder");
const { otpRoutes } = require("./App/Models/Middleware/Routes/web/otpRoutes");
const { ImageCarouselRoutes } = require("./App/Models/Middleware/Routes/web/ImageCarouselRoutes");
const { websiteratingRoutes } = require("./App/Models/Middleware/Routes/web/WebsiteRatingRoutes");
const { ClubOtpRoutes } = require("./App/Models/Middleware/Routes/web/ClubOtpRoutes");
const { PaymentRoutes, webHookHandler } = require("./App/Models/Middleware/Routes/web/paymentRoutes");

// Webhook route - must be before express.json()
app.post("/web/api/payment/webhook", express.raw({ type: "application/json" }), webHookHandler);

// Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));
app.use("/Images", express.static(path.join(process.cwd(), "Images")));
app.use(cors());
app.get("/", (req, res) => {
  res.status(200).json({
    status: "success",
    message: "Server is running successfully 🚀",
  });
});
// Routes
app.use("/web/api/enquiry", enquiryRoutes);
app.use('/admin/order', orderRouter);
app.use('/images', express.static(path.join(__dirname, 'Images')));
app.use("/api/admin", loginRouter);
app.use("/web/api/login", loginRoutes);
app.use("/web/api/books", productRoutes);
app.use("/web/api/userInfo", userRoutes);
app.use("/web/api/comment", commentRoutes);
app.use("/web/api/review", router);
app.use("/web/api/subscriber", subscriberRoutes);
app.use("/web/api/otp", otpRoutes);
app.use("/web/api/admin", adminLoginRouter);
app.use("/web/api/ImageCarousel", ImageCarouselRoutes);
app.use("/web/api/websiterating", websiteratingRoutes);
app.use("/web/api/clubotp", ClubOtpRoutes);
app.use("/web/api/payment", PaymentRoutes);

// MongoDB connection (only in serverless environment)
let isConnected = false;

const connectToDatabase = async () => {
  if (mongoose.connections[0].readyState) {
    return;
  }

  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB");
  } catch (err) {
    console.log("MongoDB connection error:", err);
  }
};
// Vercel serverless export
module.exports = async (req, res) => {
  // Connect to database for each request (connection pooling handled by mongoose)
  await connectToDatabase();
  
  // Return the app as a serverless function
  return app(req, res);
};



// Commented routes for reference
//http://localhost:8000/web/api/clubotp/clubotp-insert
//http://localhost:8000/web/api/websiterating/websiterating-insert
//http://localhost:8000/web/api/ImageCarousel/ImageCarousel-insert
//http://localhost:8000/web/api/admin/admin-update
//http://localhost:8000/web/api/otp/otp-insert
//http://localhost:8000/web/api/otp/otp-view
//http://localhost:8000/web/api/books/books-view
//http://localhost:8000/web/api/review/review-insert
//http://localhost:8000/images/book7.jpg
//http://localhost:8000/web/api/userInfo/userInfo-view
//http://localhost:8000/web/api/comment/comment-insert
//http://localhost:8000/web/api/subscriber/subscriber-insert
//http://localhost:8000/web/api/login/login-insert
//http://localhost:8000/web/api/enquiry/enquiry-view
