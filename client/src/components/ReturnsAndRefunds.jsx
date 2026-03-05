import React, { useState } from 'react';
import { RefreshCw, Shield, Clock, CheckCircle, AlertCircle, Mail } from 'lucide-react';

function ReturnsAndRefund() {
  const [step, setStep] = useState(1);

  const steps = [
    { number: 1, title: "Initiate Return", description: "Contact us within 30 days" },
    { number: 2, title: "Package Book", description: "Original condition with tags" },
    { number: 3, title: "Ship Back", description: "Use prepaid return label" },
    { number: 4, title: "Receive Refund", description: "5-7 business days" }
  ];

  const returnConditions = [
    { status: "✓ Eligible", condition: "Books in original condition", color: "text-emerald-600 bg-emerald-50" },
    { status: "✓ Eligible", condition: "Damaged during shipping", color: "text-emerald-600 bg-emerald-50" },
    { status: "✗ Not Eligible", condition: "Books without original packaging", color: "text-rose-600 bg-rose-50" },
    { status: "✗ Not Eligible", condition: "Books purchased over 30 days ago", color: "text-rose-600 bg-rose-50" },
    { status: "✓ Eligible", condition: "Wrong book received", color: "text-emerald-600 bg-emerald-50" },
    { status: "✗ Not Eligible", condition: "Personalized or signed copies", color: "text-rose-600 bg-rose-50" }
  ];

  return (
    <div id="returns" className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 py-12 px-4">
      {/* Animated Background Elements */}
      <div className="fixed top-0 right-0 w-96 h-96 bg-emerald-300/20 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
      <div className="fixed bottom-0 left-0 w-96 h-96 bg-teal-300/20 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
      
      <div className="container mx-auto max-w-6xl relative z-10">
        {/* Header Section */}
        <div className="text-center mb-16 animate-fade-in">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-3xl mb-8 shadow-2xl">
            <Shield className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Returns & <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 to-teal-600">Refunds</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Your satisfaction is our priority. If you're not completely happy with your purchase, 
            we're here to make it right.
          </p>
        </div>

        {/* Stats Banner */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <div className="bg-white rounded-2xl p-8 shadow-xl transform hover:scale-105 transition-all duration-300">
            <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-r from-emerald-100 to-teal-100 rounded-2xl mb-6 mx-auto">
              <Clock className="w-8 h-8 text-emerald-600" />
            </div>
            <h3 className="text-3xl font-bold text-center text-gray-900 mb-2">30 Days</h3>
            <p className="text-gray-600 text-center">Return Window</p>
          </div>
          
          <div className="bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl p-8 shadow-xl transform hover:scale-105 transition-all duration-300">
            <div className="flex items-center justify-center w-16 h-16 bg-white/20 rounded-2xl mb-6 mx-auto">
              <RefreshCw className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-3xl font-bold text-center text-white mb-2">Easy Process</h3>
            <p className="text-emerald-100 text-center">4 Simple Steps</p>
          </div>
          
          <div className="bg-white rounded-2xl p-8 shadow-xl transform hover:scale-105 transition-all duration-300">
            <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-r from-emerald-100 to-teal-100 rounded-2xl mb-6 mx-auto">
              <CheckCircle className="w-8 h-8 text-emerald-600" />
            </div>
            <h3 className="text-3xl font-bold text-center text-gray-900 mb-2">5-7 Days</h3>
            <p className="text-gray-600 text-center">Refund Processing</p>
          </div>
        </div>

        {/* Return Process Steps */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 mb-16 border border-gray-100">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">
            Simple <span className="text-emerald-600">Return Process</span>
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            {steps.map((item) => (
              <div 
                key={item.number}
                className="text-center group cursor-pointer"
                onClick={() => setStep(item.number)}
              >
                <div className={`relative inline-flex items-center justify-center w-20 h-20 rounded-2xl mb-6 transition-all duration-300 ${
                  step === item.number 
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-500 scale-110' 
                    : 'bg-gradient-to-r from-emerald-100 to-teal-100'
                }`}>
                  <span className={`text-2xl font-bold ${
                    step === item.number ? 'text-white' : 'text-emerald-600'
                  }`}>
                    {item.number}
                  </span>
                  {step === item.number && (
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center animate-bounce">
                      <RefreshCw className="w-4 h-4 text-white" />
                    </div>
                  )}
                </div>
                <h3 className={`text-xl font-semibold mb-2 transition-colors ${
                  step === item.number ? 'text-emerald-600' : 'text-gray-900'
                }`}>
                  {item.title}
                </h3>
                <p className="text-gray-600">{item.description}</p>
              </div>
            ))}
          </div>

          {/* Step Details */}
          <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl p-8 border border-emerald-100">
            <div className={`transition-all duration-500 transform ${
              step === 1 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}>
              <h4 className="text-2xl font-bold text-emerald-700 mb-4">Step 1: Initiate Return</h4>
              <p className="text-gray-700 mb-4">Contact our support team within 30 days of delivery. Provide your order number and reason for return.</p>
              <button onClick={() => window.location.href = './contactus'} className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-300">
                Start Return Process
              </button>
            </div>
          </div>
        </div>

        {/* Return Conditions Grid */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">
            Return <span className="text-emerald-600">Eligibility</span>
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {returnConditions.map((item, index) => (
              <div 
                key={index}
                className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
              >
                <div className={`inline-block px-4 py-2 rounded-full ${item.color} font-semibold mb-4`}>
                  {item.status}
                </div>
                <p className="text-lg text-gray-900 font-medium">{item.condition}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Refund Policy */}
        <div className="bg-gradient-to-r from-emerald-500 to-teal-500 rounded-3xl p-12 shadow-2xl mb-16">
          <div className="flex items-center justify-center w-20 h-20 bg-white/20 rounded-2xl mb-8 mx-auto">
            <AlertCircle className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-center text-white mb-6">Refund Policy</h2>
          <p className="text-emerald-100 text-center text-lg mb-8 max-w-3xl mx-auto leading-relaxed">
            Once we receive your returned book, our team will inspect it within 24-48 hours. 
            Upon verification, we'll process your refund to the original payment method within 5-7 business days.
            You'll receive email confirmation at every stage.
          </p>
        </div>

        {/* Contact CTA */}
        <div className="bg-white rounded-3xl shadow-2xl p-12 text-center border border-gray-100">
          <div className="flex items-center justify-center w-24 h-24 bg-gradient-to-r from-emerald-100 to-teal-100 rounded-3xl mb-8 mx-auto">
            <Mail className="w-12 h-12 text-emerald-600" />
          </div>
          <h3 className="text-3xl font-bold text-gray-900 mb-6">
            Need Help With Your Return?
          </h3>
          <p className="text-gray-600 text-lg mb-8 max-w-2xl mx-auto">
            Our dedicated support team is here to assist you with any questions about returns or refunds.
          </p>
          <button 
            onClick={() => window.location.href = './contactus'}
            className="px-10 py-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl font-bold text-lg hover:shadow-2xl hover:scale-105 transform transition-all duration-300 shadow-lg"
          >
            Contact Support Team
          </button>
        </div>
      </div>
    </div>
  );
}

export default ReturnsAndRefund;