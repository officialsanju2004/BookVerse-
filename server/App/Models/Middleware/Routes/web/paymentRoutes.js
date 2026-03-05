
let express=require("express");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const { paymentInsert, verifyPayment } = require("../controllers/web/payments");
const Order = require("../../../OrderModel");
const productModel = require("../../../ProductModel");

let PaymentRoutes=express.Router();
const webHookHandler = async (req, res) => {
  const sig = req.headers["stripe-signature"];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.log("⚠️ Webhook error:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  console.log("Event Type:", event.type);

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;

    try {
      // 🔒 CHECK: Order already exists?
      const existingOrder = await Order.findOne({
        stripeSessionId: session.id,
      });

      if (existingOrder) {
        console.log("⚠️ Order already exists for session:", session.id);
        return res.json({ received: true });
      }

      if (session.payment_status !== "paid") {
        console.log("❌ Payment not paid:", session.id);
        return res.json({ received: true });
      }

      // 🔽 SAME LOGIC AS verifyPayment (NO CHANGE)
      const { userId, phone, address, landmark, cartItems, total } =
        session.metadata;
console.log("META DATA :",session.metadata);
console.log("Parsed itsms:",session.metadata.cartItems);

      const orderData = {
        userId,
        items: JSON.parse(cartItems),
        total: parseFloat(total),
        paymentMethod: "online",
        phone,
        address,
        landmark,
        actualpaymentMethod: "online",
        paymentStatus: "paid",

        stripeSessionId: session.id, // 🔑 UNIQUE
        paymentIntentId: session.payment_intent,
      };

      const order = await Order.create(orderData);
      const items=JSON.parse(cartItems);
    
         for(const item of items){
           await productModel.findByIdAndUpdate(item.bookId,{$inc :{stock :-item.quantity}});
         }

      console.log("✅ Order created via webhook:", order._id);
    } catch (err) {
      console.error("❌ Webhook order creation failed:", err);
    }
  }

  res.json({ received: true });
};


PaymentRoutes.post('/create-payment-intent',paymentInsert);
PaymentRoutes.get('/verify-payment/:sessionId',verifyPayment);



module.exports={PaymentRoutes,webHookHandler};