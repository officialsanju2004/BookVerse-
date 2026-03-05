import React, { useEffect, useState,useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FaCheckCircle } from "react-icons/fa";
import axios from "axios";

function PaymentSuccess() {
  const location = useLocation();
  const navigate = useNavigate();
  const [orderDetails, setOrderDetails] = useState(null);
  const [loading, setLoading] = useState(true);
 const hasVerified = useRef(false);
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const sessionId = queryParams.get("session_id");

    // ✅ Check if we've already verified this payment
    if (sessionId && !hasVerified.current) {
      hasVerified.current = true; // Mark as verified
      verifyPayment(sessionId);
    } else if (!sessionId) {
      setLoading(false);
    }
  }, [location]);

  const verifyPayment = async (sessionId) => {
    try {
      const response = await axios.get(
        `http://localhost:8000/web/api/payment/verify-payment/${sessionId}`
      );
      
      if (response.data.success) {
        setOrderDetails(response.data.order);
        // Clear cart from localStorage if stored there
        localStorage.removeItem("cart");
      }
    } catch (err) {
      console.error("Payment verification failed:", err);
    } finally {
      setLoading(false);
    }
  };
 

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Verifying your payment...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-8">
        <div className="text-center mb-8">
          <FaCheckCircle className="text-6xl text-green-500 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Payment Successful!
          </h1>
          <p className="text-gray-600">
            Thank you for your purchase. Your order has been confirmed.
          </p>
           <p className="text-gray-600">
            Please Show the payment confirmation Receipt at the time of delivery.
          </p>
        </div>

        {orderDetails && (
          <div className="border-t border-b py-6 my-6">
            <h2 className="text-xl font-semibold mb-4">Order Details</h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Order ID:</span>
                <span className="font-medium">{orderDetails._id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Total Amount:</span>
                <span className="font-medium">Rs {orderDetails.total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Payment Method:</span>
                <span className="font-medium">Credit/Debit Card</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Status:</span>
                <span className="font-medium text-green-600">Paid</span>
              </div>
            </div>
          </div>
        )}

        <div className="text-center">
          <p className="text-gray-600 mb-6">
            A confirmation email has been sent to your registered email address.
            You will receive your order within 5-7 business days.
          </p>
          <button
            onClick={() => navigate("/")}
            className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition duration-300"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );
}

export default PaymentSuccess;