// routes/orderRoutes.js
const express = require("express");
const Order = require("../../../../OrderModel");

const orderRouter = express.Router();
const nodemailer = require("nodemailer");
const verifyAdmin = require("../../../AdminAuthMiddleware");
const productModel = require("../../../../ProductModel");


const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "bably1937@gmail.com",

    pass: "fjup jvkd olzl osyz", //app password
  },
});

// ✅ Place Order
orderRouter.post("/order-insert", async (req, res) => {
  try {
    const newOrder = new Order(req.body);
    await newOrder.save();
    const items=req.body.items;
    for(const item of items){
      await productModel.findByIdAndUpdate(item.bookId,{$inc :{stock :-item.quantity}});
    }
    res.status(201).json(newOrder);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

orderRouter.put("/:id/status", async (req, res) => {
  try {
    const { status, actualpayment } = req.body;

    let order = await Order.findById(req.params.id).populate(
      "userId",
      "name email"
    );
    if (!order) return res.status(404).json({ error: "Order not found" });

    // Update order status
    order.orderStatus = status;
    order.actualpaymentMethod = actualpayment;

    // ✅ OTP generate jab order "on-the-way" ho
    if (status === "on-the-way") {
      const otp = Math.floor(1000 + Math.random() * 9000);
      console.log(otp);
      order.otp = otp;

      if (order.userId?.email) {
        const mailOptions = {
          from: "bably1937@gmail.com",
          to: order.userId.email,
          subject: `Your Delivery OTP for Order ${order._id}`,
          text: `Hello ${order.userId.name},\n\nYour OTP for confirming the delivery of your order is: ${otp}\n\nPlease give this OTP to the delivery boy.`,
        };

        setImmediate(() => {
          transporter
            .sendMail(mailOptions)
            .then(() => console.log("OTP sent to :", order.userId.email))
            .catch((err) => {
              console.error("OTP email error:", err);
            });
        });
      }
          
    }



    // 🔹 Jab "delivered" ho tabhi actualpaymentMethod ek baar set ho
    if (status === "delivered") {
      if (!order.actualpaymentMethod) {
        order.actualpaymentMethod = actualpayment || order.paymentMethod; // agar frontend se na bheje to default original method
      }

      // Payment status logic
      if (order.paymentMethod === "cod") {
        order.paymentStatus = "paid"; // COD collect hua
      } else if (order.paymentMethod === "online") {
        order.paymentStatus = "paid"; // Already paid
      }
    }

    // ✅ Special handling on cancelled
    if (status === "cancelled") {
       for(const item of order.items){
      await productModel.findByIdAndUpdate(item.bookId,{$inc :{stock : item.quantity}});
    }




      if (order.paymentMethod === "online" && order.paymentStatus === "paid") {
        order.paymentStatus = "refunded"; // Refund process
      } else {
        order.paymentStatus = "failed"; // COD cancel
      }
    }

    await order.save();

    // ✅ Response sirf yaha ek hi baar bhejna
    return res.json(order);
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ error: "Failed to update order status", err });
  }
});
// ✅ Get All Orders
orderRouter.get("/order-view", async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("userId", "name email")
      .populate("items.bookId", "title author price");

 
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
// Get all orders of a particular user
orderRouter.get("/order-view/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    const orders = await Order.find({ userId })
      .populate("userId", "name email")
      .populate("items.bookId", "title author price");

    if (!orders || orders.length === 0) {
      return res
        .status(404)
        .json({ message: "No orders found for this user." });
    }

    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = orderRouter;
