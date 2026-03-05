const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "logindata", required:true }, // 👈 same as login model
  items: [
    {
      bookId: { type: mongoose.Schema.Types.ObjectId, ref: "BookList" }, // 👈 same as Booklist model
      quantity: Number,
      price: Number,
    }
  ],
  total: Number,
  paymentMethod: { type: String, enum: ["online", "cod"], required: true },
  phone:{type:String },
  address:{type:String },
  landmark:{type:String},

stripeSessionId: {
  type: String,
  unique: true,
  sparse:true

},
paymentIntentId:{
  type: String,
  default:null
},

  actualpaymentMethod: { type: String, enum: ["pending","online", "cod"], default: "pending" },
  paymentStatus: { type: String, enum: ["pending", "paid", "failed"], default: "pending" },
  orderStatus: {   
    type: String,   
    enum: ["placed", "shipped", "on-the-way", "delivered", "cancelled"],   
    default: "placed"   
  },
   otp:{type:Number},
  createdAt: { type: Date, default: Date.now },
  });
module.exports = mongoose.model("Order", orderSchema);