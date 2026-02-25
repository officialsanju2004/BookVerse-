import React from 'react';
import { Truck, Clock, MapPin, Package, Shield, Globe } from 'lucide-react';
import { Navigate, useNavigate } from "react-router-dom";
function ShippingPolicy() {
  const navigate=useNavigate();
    const  goToHome=()=>{
      navigate('/');
    }
  const policies = [
    {
      icon: <Package className="w-8 h-8" />,
      title: "Shipping Rates",
      description: "Free standard shipping on all book orders over $50. For orders under $50, a flat rate of $5.99 applies.",
      details: ["Book orders only", "Free shipping threshold: $50+", "Flat rate: $5.99 for orders under $50"],
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: <Clock className="w-8 h-8" />,
      title: "Shipping Times",
      description: "We aim to ship all orders within 24-48 hours of receipt. Delivery times vary depending on your location.",
      details: ["Processing: 24-48 hours", "Domestic: 3-7 business days", "Express: 1-2 business days"],
      color: "from-emerald-500 to-teal-500"
    },
    {
      icon: <Truck className="w-8 h-8" />,
      title: "Order Tracking",
      description: "You will receive tracking information via email once your order has shipped.",
      details: ["Email notifications", "Real-time tracking", "Delivery updates"],
      color: "from-purple-500 to-pink-500"
    },
    {
      icon: <Globe className="w-8 h-8" />,
      title: "International Shipping",
      description: "We ship worldwide! International shipping rates and times vary by destination.",
      details: ["Worldwide delivery", "Customs included", "Tracking available"],
      color: "from-amber-500 to-orange-500"
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Safe Delivery",
      description: "All books are carefully packaged to ensure they arrive in perfect condition.",
      details: ["Bubble wrap protection", "Weather-resistant packaging", "Secure book corners"],
      color: "from-red-500 to-rose-500"
    },
    {
      icon: <MapPin className="w-8 h-8" />,
      title: "Delivery Areas",
      description: "We deliver to all 50 states and over 150 countries worldwide.",
      details: ["USA: All states", "Canada & Mexico", "Europe, Asia, Australia"],
      color: "from-indigo-500 to-violet-500"
    }
  ];

  return (
    <div id="shipping" className="min-h-screen bg-gradient-to-b from-gray-50 to-blue-50 py-12 px-4">
      {/* Background Elements */}
      <div className="fixed top-0 left-0 w-full h-96 bg-gradient-to-r from-blue-400/10 to-cyan-400/10 -z-10"></div>
      
      <div className="container mx-auto max-w-7xl">
        {/* Hero Header */}
        <div className="text-center mb-16 animate-slide-up">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-3xl mb-8 shadow-2xl">
            <Truck className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Shipping <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-cyan-600">Policy</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            At BookVerse, we strive to get your beloved books to you as quickly and efficiently as possible. 
            Your literary adventure begins the moment you click "Buy."
          </p>
        </div>

        {/* Policy Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {policies.map((policy, index) => (
            <div 
              key={index}
              className="group bg-white rounded-2xl p-8 shadow-xl border border-gray-100 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 animate-fade-in-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r ${policy.color} rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-300`}>
                <div className="text-white">
                  {policy.icon}
                </div>
              </div>
              
              <h3 className="text-2xl font-bold text-gray-900 mb-4">{policy.title}</h3>
              <p className="text-gray-600 mb-6 leading-relaxed">{policy.description}</p>
              
              <ul className="space-y-3">
                {policy.details.map((detail, idx) => (
                  <li key={idx} className="flex items-center text-gray-700">
                    <div className={`w-2 h-2 bg-gradient-to-r ${policy.color} rounded-full mr-3`}></div>
                    {detail}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Timeline Section */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 mb-16 border border-gray-100">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">
            Your Book's Journey <span className="text-blue-600">Timeline</span>
          </h2>
          
          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-blue-400 to-cyan-400"></div>
            
            {/* Timeline Items */}
            {[
              { step: "Order Placed", time: "Within minutes", icon: "📚" },
              { step: "Processing", time: "24-48 hours", icon: "⚡" },
              { step: "Packaging", time: "Careful wrapping", icon: "🎁" },
              { step: "Shipped", time: "Tracking sent", icon: "🚚" },
              { step: "Delivery", time: "3-7 days", icon: "🏡" }
            ].map((item, index) => (
              <div 
                key={index}
                className={`flex items-center mb-12 ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}
              >
                <div className={`w-1/2 ${index % 2 === 0 ? 'pr-12 text-right' : 'pl-12'}`}>
                  <div className="inline-block bg-gradient-to-r from-blue-50 to-cyan-50 px-6 py-4 rounded-xl shadow-lg">
                    <h4 className="text-xl font-bold text-gray-900 mb-2">{item.step}</h4>
                    <p className="text-blue-600 font-semibold">{item.time}</p>
                  </div>
                </div>
                
                <div className="relative z-10 w-16 h-16 bg-white border-4 border-white rounded-full flex items-center justify-center shadow-xl">
                  <div className="text-2xl">{item.icon}</div>
                </div>
                
                <div className="w-1/2"></div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-blue-600 to-cyan-600 rounded-3xl p-12 text-center shadow-2xl transform hover:scale-[1.02] transition-transform duration-500">
          <h3 className="text-3xl font-bold text-white mb-6">
            Ready to Start Your Reading Journey?
          </h3>
          <p className="text-blue-100 text-lg mb-8 max-w-2xl mx-auto">
            Browse our curated collection of books and enjoy our premium shipping service.
          </p>
          <button onClick={goToHome} className="px-10 py-4 bg-white text-blue-600 rounded-xl font-bold text-lg hover:bg-blue-50 hover:scale-105 transform transition-all duration-300 shadow-lg">
            Shop Books Now
          </button>
        </div>
      </div>
    </div>
  );
}

export default ShippingPolicy;