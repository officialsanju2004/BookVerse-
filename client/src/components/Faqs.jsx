import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Truck, Clock, RefreshCw, HelpCircle } from 'lucide-react';
import { Navigate, useNavigate } from "react-router-dom";
function Faqs() {
  const [openIndex, setOpenIndex] = useState(null);
const navigate=useNavigate();
  const  goToContact=()=>{
    navigate('/contactus');
  }
  const faqs = [
    {
      question: "What is your shipping policy?",
      answer: "We offer free standard shipping on all book orders over $50. For more information, please visit our shipping policy page.",
      icon: <Truck className="w-6 h-6" />
    },
    {
      question: "How do I track my order?",
      answer: "You can track your order by logging into your BookVerse account and viewing your order history. We also send email updates at every stage.",
      icon: <Clock className="w-6 h-6" />
    },
    {
      question: "Can I cancel or change my order?",
      answer: "Please contact us as soon as possible if you need to cancel or make changes to your order. We process orders quickly to get your books to you faster!",
      icon: <RefreshCw className="w-6 h-6" />
    },
    {
      question: "Do you ship internationally?",
      answer: "Yes! We ship worldwide with competitive international shipping rates. Shipping times vary by destination.",
      icon: <Truck className="w-6 h-6" />
    },
    {
      question: "How do I return a damaged book?",
      answer: "Contact our support team within 48 hours of delivery with photos of the damage, and we'll arrange a replacement or refund.",
      icon: <RefreshCw className="w-6 h-6" />
    }
  ];

  const toggleAccordion = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div id="faqs"className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 py-12 px-4">
      {/* Decorative Elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-amber-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-orange-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
      
      <div className="container mx-auto max-w-4xl relative z-10">
        {/* Header Section */}
        <div className="text-center mb-16 animate-fade-in">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl mb-6 shadow-lg">
            <HelpCircle className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-5xl font-serif font-bold text-gray-900 mb-4 bg-clip-text text-transparent bg-gradient-to-r from-amber-700 to-orange-700">
            Frequently Asked Questions
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Find answers to common questions about BookVerse. Your literary journey starts here.
          </p>
        </div>

        {/* FAQ Accordion */}
        <div className="space-y-6">
          {faqs.map((faq, index) => (
            <div 
              key={index}
              className={`bg-white rounded-2xl shadow-lg border border-amber-100 overflow-hidden transition-all duration-500 ease-out transform hover:scale-[1.02] ${
                openIndex === index ? 'ring-2 ring-amber-300 shadow-xl' : ''
              }`}
            >
              <button
                onClick={() => toggleAccordion(index)}
                className="w-full px-8 py-6 flex items-center justify-between hover:bg-amber-50 transition-colors duration-300"
              >
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-amber-100 to-orange-100 rounded-xl flex items-center justify-center">
                    <div className="text-amber-600">
                      {faq.icon}
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 text-left">
                    {faq.question}
                  </h3>
                </div>
                <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full flex items-center justify-center text-white transform transition-transform duration-300">
                  {openIndex === index ? (
                    <ChevronUp className="w-5 h-5" />
                  ) : (
                    <ChevronDown className="w-5 h-5" />
                  )}
                </div>
              </button>
              
              <div 
                className={`px-8 overflow-hidden transition-all duration-500 ease-in-out ${
                  openIndex === index ? 'max-h-96 pb-6' : 'max-h-0'
                }`}
              >
                <div className={`pl-16 pr-4 transform transition-all duration-500 ${
                  openIndex === index ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
                }`}>
                  <p className="text-gray-600 text-lg leading-relaxed border-l-4 border-amber-300 pl-4 py-2">
                    {faq.answer}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Additional Help Section */}
        <div className="mt-16 p-8 bg-gradient-to-r from-amber-500 to-orange-500 rounded-3xl shadow-2xl transform hover:scale-[1.02] transition-transform duration-300">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="mb-6 md:mb-0">
              <h3 className="text-2xl font-bold text-white mb-2">Still have questions?</h3>
              <p className="text-amber-100">Our book experts are here to help you!</p>
            </div>
            <button onClick={goToContact} className="px-8 py-4 bg-white text-amber-700 rounded-xl font-semibold hover:bg-amber-50 hover:scale-105 transform transition-all duration-300 shadow-lg">
              Contact Support
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Faqs;