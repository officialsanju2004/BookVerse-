const Stripe = require("stripe");
const Order = require("../../../../OrderModel");
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

const paymentInsert = async (req, res) => {
  try {
    const { cartItems, userId, phone, address, landmark, total } = req.body;

    // Validate required fields
    if (!cartItems || !Array.isArray(cartItems) || cartItems.length === 0) {
      return res.status(400).json({ error: "Cart items are required" });
    }

    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: cartItems.map(item => ({
        price_data: {
          currency: "inr",
          product_data: {
            name: item.title,
            description: `Author: ${item.author || "N/A"}`,
            images: [item.image] // Optional: add book cover image
          },
          unit_amount: Math.round(item.price * 100), // Convert to paise
        },
        quantity: item.quantity,
      })),
      
      // Add shipping cost as a separate line item
      shipping_options: [
        {
          shipping_rate_data: {
            type: 'fixed_amount',
            fixed_amount: {
              amount: 399, // Rs 3.99 in paise
              currency: 'inr',
            },
            display_name: 'Standard shipping',
            delivery_estimate: {
              minimum: {
                unit: 'business_day',
                value: 5,
              },
              maximum: {
                unit: 'business_day',
                value: 7,
              },
            },
          },
        },
      ],
      
      success_url: `${process.env.FRONTEND_URL}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}/cart`,
      
      metadata: {
        userId,
        phone,
        address,
        landmark,
        cartItems: JSON.stringify(cartItems),
        total: total.toString()
      },
      
      customer_email: req.body.email || undefined, // Optional: if you have user email
    });

    // Return session ID for frontend to redirect
    res.json({ 
      sessionId: session.id, 
      url: session.url 
    });
    
  } catch (err) {
    console.error("Stripe error:", err);
    res.status(500).json({ 
      error: "Stripe session failed", 
      message: err.message 
    });
  }
};
const verifyPayment = async (req, res) => {
  try {
    const { sessionId } = req.params;

    // 🔒 CHECK: Order already created by webhook?
    const existingOrder = await Order.findOne({
      stripeSessionId: sessionId,
    });

    if (existingOrder) {
      return res.json({
        success: true,
        order: existingOrder,
        message: "Order already created",
      });
    }

    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status !== "paid") {
      return res.status(400).json({
        success: false,
        message: "Payment not completed",
      });
    }

    // ❗ Order creation REMOVED
    return res.json({
      success: true,
      message: "Payment verified, order will be created via webhook",
      sessionId: session.id,
      paymentIntentId: session.payment_intent,
    });
  } catch (err) {
    console.error("Verification error:", err);
    res.status(500).json({
      success: false,
      message: "Payment verification failed",
    });
  }
};


module.exports = { paymentInsert,verifyPayment };