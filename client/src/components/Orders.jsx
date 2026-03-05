import React, { useEffect, useState } from "react";
import axios from "axios";

export default function UserOrders({ userId }) {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
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

      const res = await axios.get(`http://localhost:8000/admin/order/order-view/${userId}`);
      setOrders(res.data);
    } catch (err) {
      console.error("Error fetching orders:", err);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "placed":
        return "bg-blue-500";
      case "shipped":
        return "bg-indigo-500";
      case "on-the-way":
        return "bg-yellow-500";
      case "delivered":
        return "bg-green-600";
      case "cancelled":
        return "bg-red-600";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <div id="orders" className="p-6 bg-gradient-to-br from-gray-100 to-gray-200 min-h-screen">
      <h1 className="text-4xl font-extrabold mb-8 text-center text-gray-800 drop-shadow-lg">
        📖 My Orders
      </h1>

      {orders.length === 0 ? (
        <div className="text-center p-10 bg-white shadow-xl rounded-xl">
          <p className="text-lg text-gray-500">🚫 You have no orders yet.</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {orders.map((order) => (
            <div
              key={order._id}
              className="bg-white shadow-lg rounded-xl p-5 hover:shadow-2xl transition-all"
            >
              <div className="flex justify-between items-center mb-3">
                <h2 className="font-bold text-lg text-gray-700">
                  Order #{order._id.slice(-6)}
                </h2>
               
                 
                <span
                  className={`px-3 py-1 text-sm rounded-full text-white ${getStatusColor(
                    order.orderStatus
                  )}`}
                >
                  {order.orderStatus.toUpperCase()}
                </span>
              </div>

              <div className="mb-4">
                <h3 className="text-md font-semibold text-gray-800 mb-1">
                  📦 Items:
                </h3>
                <ul className="list-disc list-inside text-gray-600">
                  {order.items.map((item, idx) => (
                    <li key={idx}>
                      {item.bookId?.title || "Book"} (x{item.quantity})
                    </li>
                  ))}
                </ul>
              </div>

              <div className="text-gray-700 mb-2">
                <span className="font-semibold">💰 Total:</span> ₹{order.total}
              </div>
               <div className="text-gray-700 mb-2">
                <span className="font-semibold">🏡 Adresss</span> {order.address}
              </div>
               <div className="text-gray-700 mb-2">
                <span className="font-semibold">🗼 Landmark:</span> {order.landmark}
              </div>
              <div className="text-gray-700 mb-2">
                <span className="font-semibold">📞 Phone No:</span> {order.phone}
              </div>
              <div className="text-gray-700 mb-2">
                <span className="font-semibold">💳 Payment:</span>{" "}
                {order.paymentMethod.toUpperCase()} (
                <span
                  className={`font-bold ${
                    order.paymentStatus === "paid"
                      ? "text-green-600"
                      : order.paymentStatus === "pending"
                      ? "text-yellow-600"
                      : "text-red-600"
                  }`}
                >
                  {order.paymentStatus.toUpperCase()}
                </span>
                )
              </div>
              <p className="text-sm text-gray-500">
                📅 Ordered on: {new Date(order.createdAt).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
