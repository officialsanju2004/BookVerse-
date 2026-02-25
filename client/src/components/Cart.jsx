import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaShoppingCart, FaCreditCard, FaCheckCircle } from "react-icons/fa";
import axios from "axios";
import { loadStripe } from "@stripe/stripe-js";

// Load Stripe with your publishable key
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

function CartPage({ cart, setCart }) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentStep, setPaymentStep] = useState("cart"); // 'cart' | 'payment' | 'confirmation'
  const [paymentMethod, setPaymentMethod] = useState(""); // 'online' | 'cod'
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  
  const [cardDetails, setCardDetails] = useState({
    number: "",
    name: "",
    expiry: "",
    cvv: "",
  });
  
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    phone: "",
    address: "",
    landmark: "",
  });

  // ✅ Group cart items by ID
  const cartItems = cart.reduce((acc, item) => {
    const existingItem = acc.find((i) => i._id === item._id);
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      acc.push({ ...item, quantity: 1 });
    }
    return acc;
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const removeFromCart = (bookId) => {
    setCart(cart.filter((item) => item._id !== bookId));
  };

  const updateQuantity = (bookId, newQuantity) => {
    if (newQuantity < 1) return;
    const item = cartItems.find((item) => item._id === bookId);
    if (!item) return;

    const currentQuantity = cart.filter((i) => i._id === bookId).length;
    const difference = newQuantity - currentQuantity;

    if (difference > 0) {
      const itemsToAdd = Array(difference).fill(item);
      setCart([...cart, ...itemsToAdd]);
    } else if (difference < 0) {
      let count = -difference;
      const newCart = [...cart];
      for (let i = newCart.length - 1; i >= 0 && count > 0; i--) {
        if (newCart[i]._id === bookId) {
          newCart.splice(i, 1);
          count--;
        }
      }
      setCart(newCart);
    }
  };

  // ✅ Price Calculation
  const subtotal = cart.reduce((sum, item) => sum + item.price, 0);
  const shipping = 3.99;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  
  const handleStripePayment = async () => {
  try {
    setIsProcessing(true);

    let userId = null;
    const rememberData = localStorage.getItem("rememberedSignUpData");
    const googleData = localStorage.getItem("googleEmail");

      
      if (rememberData) {
        userId = JSON.parse(rememberData)._id;
      } else if(googleData){
        userId = JSON.parse(googleData)._id;
      }
      else {
         userId = localStorage.getItem("lastUserId");
      }
    

    if (!userId) {
      alert("User not logged in!");
      setIsProcessing(false);
      return;
    }

    if (!formData.phone || !formData.address || !formData.landmark) {
      alert("Please fill in all shipping details!");
      setIsProcessing(false);
      return;
    }

    const paymentData = {
      cartItems: cartItems.map(item => ({
         bookId: item._id,
        title: item.title,
        price: item.price,
        quantity: item.quantity,
      })),
      userId,
      phone: formData.phone,
      address: formData.address,
      landmark: formData.landmark,
      total,
    };

    const response = await axios.post(
      "http://localhost:8000/web/api/payment/create-payment-intent",
      paymentData
    );

    // ✅ NEW STRIPE WAY (IMPORTANT)
    window.location.href = response.data.url;

  } catch (err) {
    console.error("❌ Payment Error:", err);
    alert("Payment failed. Please try again.");
    setIsProcessing(false);
  }
};


  // ✅ Handle Checkout for Cash on Delivery
  const handleCheckout = async () => {
    try {
      let userId = null;
      const rememberData = localStorage.getItem("rememberedSignUpData");
      const googleData = localStorage.getItem("googleEmail");
    
    
      if (rememberData) {
        userId = JSON.parse(rememberData)._id;
      } else if(googleData){
        userId = JSON.parse(googleData)._id;
      }
      else {
         userId = localStorage.getItem("lastUserId");
      }
      
      if (!userId) {
        alert("User not logged in!");
        return;
      }

      // Validate form data
      if (!formData.phone || !formData.address || !formData.landmark) {
        alert("Please fill in all shipping details!");
        return;
      }

      const orderData = {
        userId,
        items: cartItems.map((item) => ({
          bookId: item._id,
          title: item.title,
          quantity: item.quantity,
          price: item.price,
        })),
        total: total,
        paymentMethod: paymentMethod,
        phone: formData.phone,
        address: formData.address,
        landmark: formData.landmark,
        status: paymentMethod === "cod" ? "pending" : "paid"
      };
console.log(orderData);
      setIsCheckingOut(true);
      
      // For Cash on Delivery
      if (paymentMethod === "cod") {
        const res = await axios.post(
          "http://localhost:8000/admin/order/order-insert",
          orderData
        );
        
        setIsCheckingOut(false);
        setCart([]); // clear cart
        setPaymentStep("confirmation");
      }
      // For Stripe payment, handleStripePayment will be called instead
      
    } catch (err) {
      console.error("❌ Checkout Error:", err);
      alert("Order failed!");
      setIsCheckingOut(false);
    }
  };

  const handleCardInputChange = (e) => {
    const { name, value } = e.target;
    setCardDetails((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleReturnToShop = () => {
    navigate("/");
  };

  // Handle payment form submission
  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    
    if (paymentMethod === "online") {
      await handleStripePayment();
    } else if (paymentMethod === "cod") {
      await handleCheckout();
    }
  };

  return (
    <div id="cart" className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Your Shopping Cart</h1>

      {/* ✅ STEP 3: Confirmation Screen */}
      {paymentStep === "confirmation" ? (
        <div className="text-center py-12 bg-white rounded-lg shadow-md max-w-md mx-auto p-8">
          <FaCheckCircle className="text-5xl text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Order Confirmed!</h2>
          <p className="mb-6">
            Thank you for your purchase. Your order has been placed.
            {paymentMethod === "cod" && " You'll pay when you receive the order."}
          </p>
          <button
            onClick={handleReturnToShop}
            className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700"
          >
            Return to Shop
          </button>
        </div>
      ) : paymentStep === "payment" ? (
        // ✅ STEP 2: Payment Selection
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">
              Choose Payment Method
            </h2>
            <div className="space-y-4">
              {/* Credit Card */}
              <div
                className={`p-4 border rounded-lg mb-4 cursor-pointer ${
                  paymentMethod === "online"
                    ? "border-indigo-600 bg-indigo-50"
                    : "border-gray-300"
                }`}
                onClick={() => setPaymentMethod("online")}
              >
                <div className="flex items-center">
                  <FaCreditCard className="text-xl mr-3" />
                  <span className="font-medium">Credit/Debit Card (Stripe)</span>
                </div>

                {paymentMethod === "online" && (
                  <>
                    <h2 className="text-2xl font-bold text-gray-800 text-center my-6">
                      Enter Your Details
                    </h2>

                    <form
                      onSubmit={handlePaymentSubmit}
                      className="space-y-4"
                    >
                      {/* Shipping Details */}
                      <div className="bg-gray-50 p-4 rounded-lg mb-4">
                        <h3 className="font-semibold mb-2">Shipping Details</h3>
                        <div className="space-y-4">
                          <div>
                            <label className="block text-gray-700 font-medium mb-1">
                              Phone Number
                            </label>
                            <input
                              type="tel"
                              name="phone"
                              placeholder="Enter phone number with country code"
                              value={formData.phone}
                              onChange={handleChange}
                              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"
                              required
                            />
                          </div>

                          <div>
                            <label className="block text-gray-700 font-medium mb-1">
                              Address
                            </label>
                            <textarea
                              name="address"
                              placeholder="Enter full address"
                              value={formData.address}
                              onChange={handleChange}
                              rows="3"
                              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"
                              required
                            />
                          </div>

                          <div>
                            <label className="block text-gray-700 font-medium mb-1">
                              Landmark
                            </label>
                            <input
                              type="text"
                              name="landmark"
                              placeholder="Nearby landmark"
                              value={formData.landmark}
                              onChange={handleChange}
                              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"
                              required
                            />
                          </div>
                        </div>
                      </div>

                      <div className="text-center mb-4">
                        <p className="text-lg font-semibold">
                          Total Amount: <span className="text-indigo-600">Rs {total.toFixed(2)}</span>
                        </p>
                        <p className="text-sm text-gray-500">
                          You'll be redirected to Stripe's secure payment page
                        </p>
                      </div>

                      <button
                        type="submit"
                        disabled={isProcessing}
                        className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 disabled:bg-indigo-300"
                      >
                        {isProcessing
                          ? "Redirecting to Payment..."
                          : `Pay Rs ${total.toFixed(2)} with Stripe`}
                      </button>
                    </form>
                  </>
                )}
              </div>

              {/* Cash on Delivery */}
              <div
                className={`border rounded-lg p-4 cursor-pointer ${
                  paymentMethod === "cod"
                    ? "border-indigo-600 bg-indigo-50"
                    : "border-gray-300"
                }`}
                onClick={() => setPaymentMethod("cod")}
              >
                <div className="flex items-center">
                  <FaShoppingCart className="text-xl mr-3" />
                  <span className="font-medium">Cash on Delivery</span>
                </div>

                {paymentMethod === "cod" && (
                  <div className="mt-4">
                    <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">
                      Enter Your Details
                    </h2>

                    <form onSubmit={handlePaymentSubmit} className="space-y-4">
                      <div>
                        <label className="block text-gray-700 font-medium mb-1">
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          placeholder="Enter phone number with country code"
                          value={formData.phone}
                          onChange={handleChange}
                          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-gray-700 font-medium mb-1">
                          Address
                        </label>
                        <textarea
                          name="address"
                          placeholder="Enter full address"
                          value={formData.address}
                          onChange={handleChange}
                          rows="3"
                          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-gray-700 font-medium mb-1">
                          Landmark
                        </label>
                        <input
                          type="text"
                          name="landmark"
                          placeholder="Nearby landmark"
                          value={formData.landmark}
                          onChange={handleChange}
                          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"
                          required
                        />
                      </div>

                      <div className="text-center mb-4">
                        <p className="text-sm text-gray-600">
                          Pay when you receive your order
                        </p>
                        <p className="text-lg font-semibold mt-2">
                          Total Amount: <span className="text-indigo-600">Rs {total.toFixed(2)}</span>
                        </p>
                      </div>

                      <button
                        type="submit"
                        disabled={isCheckingOut}
                        className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 disabled:bg-indigo-300"
                      >
                        {isCheckingOut
                          ? "Placing Order..."
                          : `Place Order for Rs ${total.toFixed(2)}`}
                      </button>
                    </form>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : cart.length === 0 ? (
        // ✅ STEP 0: Empty Cart
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg mb-4">Your cart is empty</p>
          <Link
            to="/"
            className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition duration-300 inline-block"
          >
            Continue Shopping
          </Link>
        </div>
      ) : (
        // ✅ STEP 1: Cart View
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="divide-y">
                {cartItems.map((item) => (
                  <div key={item._id} className="p-4 flex">
                    <img
                
                       src={`http://localhost:8000${item.image}`} 
                      alt={item.title}
                      className="w-20 h-28 object-cover rounded-lg mr-4"
                    />
                    <div className="flex-grow">
                      <h3 className="font-semibold">{item.title}</h3>
                      <p className="text-gray-600 text-sm">{item.author}</p>
                      <p className="font-bold text-indigo-700 mt-1">
                        Rs {item.price.toFixed(2)}
                      </p>
                      <div className="flex items-center mt-2">
                        <button
                          onClick={() =>
                            updateQuantity(item._id, item.quantity - 1)
                          }
                          className="px-2 py-1 bg-gray-200 rounded-l hover:bg-gray-300"
                        >
                          -
                        </button>
                        <span className="px-4 py-1 bg-gray-100">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(item._id, item.quantity + 1)
                          }
                          className="px-2 py-1 bg-gray-200 rounded-r hover:bg-gray-300"
                        >
                          +
                        </button>
                        <button
                          onClick={() => removeFromCart(item._id)}
                          className="ml-4 text-red-500 hover:text-red-700"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ✅ Right Side Order Summary */}
          <div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span>Subtotal ({cart.length} items)</span>
                  <span>Rs {subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>Rs {shipping.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax (8%)</span>
                  <span>Rs {tax.toFixed(2)}</span>
                </div>
                <div className="border-t pt-3 flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>Rs {total.toFixed(2)}</span>
                </div>
              </div>

              {cart.length > 0 && (
                <button
                  onClick={() => setPaymentStep("payment")}
                  className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700"
                >
                  Proceed to Checkout
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CartPage;