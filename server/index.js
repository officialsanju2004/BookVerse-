let express=require("express");
let path=require("path");
let app=express();
let cors=require('cors');
require('dotenv').config();


const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
let mongoose=require("mongoose");
const { enquiryRoutes } = require("./App/Models/Middleware/Routes/web/EnquiryRoutes");
const { loginRoutes } = require("./App/Models/Middleware/Routes/web/loginDataRoutes");
const { productRoutes } = require("./App/Models/Middleware/Routes/web/ProductRoutes");
const { userRoutes } = require("./App/Models/Middleware/Routes/web/UserInfoRoutes");

const router = require("./App/Models/Middleware/Routes/web/RatingRoutes");
const { commentRoutes } = require("./App/Models/Middleware/Routes/web/CommentRoutes");
const { subscriberRoutes } = require("./App/Models/Middleware/Routes/web/SubscriberRoutes");
const verifyAdmin = require("./App/Models/Middleware/AdminAuthMiddleware");
const { loginRouter, adminLoginRouter } = require("./App/Models/Middleware/Routes/controllers/web/AdminDataFolder");
const orderRouter = require("./App/Models/Middleware/Routes/controllers/web/OrderDataFolder");
const { otpRoutes } = require("./App/Models/Middleware/Routes/web/otpRoutes");
const { ImageCarouselRoutes } = require("./App/Models/Middleware/Routes/web/ImageCarouselRoutes");
const { websiteratingRoutes } = require("./App/Models/Middleware/Routes/web/WebsiteRatingRoutes");
const { ClubOtpRoutes } = require("./App/Models/Middleware/Routes/web/ClubOtpRoutes");
const { PaymentRoutes, webHookHandler } = require("./App/Models/Middleware/Routes/web/paymentRoutes");








app.post("/web/api/payment/webhook",express.raw({type:"application/json"}),webHookHandler);
// server.js ya app.js mein
app.use(express.json({ limit: '10mb' })); // Default: 100kb
app.use(express.urlencoded({ limit: '10mb', extended: true }));
app.use("/Images",express.static(path.join(process.cwd(),"Images")));
app.use(cors());



app.use("/web/api/enquiry",enquiryRoutes)
mongoose.connect(process.env.DBURL).then(()=>{
    console.log("Connected to MongoDb");
    app.listen(process.env.PORT||3000,()=>{
        console.log('Server is running...') 
    })
}).catch((err)=>{
    console.log(err)
});




app.use('/admin/order',orderRouter);
app.use('/images',express.static(path.join(__dirname,'Images')));
app.use("/api/admin",loginRouter)
app.use("/web/api/login",loginRoutes);
app.use("/web/api/books",productRoutes);
app.use("/web/api/userInfo",userRoutes);
app.use("/web/api/comment",commentRoutes);
app.use("/web/api/review",router);
app.use("/web/api/subscriber",subscriberRoutes);
app.use("/web/api/otp",otpRoutes);
app.use("/web/api/admin",adminLoginRouter);
app.use("/web/api/ImageCarousel",ImageCarouselRoutes);
 app.use("/web/api/websiterating",websiteratingRoutes);
app.use("/web/api/clubotp",ClubOtpRoutes);
app.use("/web/api/payment",PaymentRoutes);


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
