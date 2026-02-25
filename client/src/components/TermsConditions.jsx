import React, { useState } from "react";
import { Shield, BookOpen, Lock, FileText, CheckCircle, AlertCircle, ChevronRight, Globe, CreditCard, Truck, RefreshCw } from "lucide-react";

function TermsAndConditions() {
  const [activeSection, setActiveSection] = useState("general");

  const sections = [
    {
      id: "general",
      title: "General Terms",
      icon: <FileText className="w-6 h-6" />,
      color: "from-blue-500 to-cyan-500"
    },
    {
      id: "orders",
      title: "Orders & Payments",
      icon: <CreditCard className="w-6 h-6" />,
      color: "from-purple-500 to-pink-500"
    },
    {
      id: "shipping",
      title: "Shipping & Delivery",
      icon: <Truck className="w-6 h-6" />,
      color: "from-emerald-500 to-teal-500"
    },
    {
      id: "returns",
      title: "Returns & Refunds",
      icon: <RefreshCw className="w-6 h-6" />,
      color: "from-amber-500 to-orange-500"
    },
    {
      id: "privacy",
      title: "Privacy & Security",
      icon: <Lock className="w-6 h-6" />,
      color: "from-red-500 to-rose-500"
    },
    {
      id: "intellectual",
      title: "Intellectual Property",
      icon: <BookOpen className="w-6 h-6" />,
      color: "from-indigo-500 to-violet-500"
    }
  ];

  const termsContent = {
    general: [
      {
        title: "Acceptance of Terms",
        content: "By accessing and using BookVerse, you accept and agree to be bound by these Terms and Conditions.",
        important: true
      },
      {
        title: "Eligibility",
        content: "You must be at least 18 years old to make purchases on BookVerse. By using our services, you represent that you meet this requirement.",
        important: false
      },
      {
        title: "Account Responsibility",
        content: "You are responsible for maintaining the confidentiality of your account and password and for restricting access to your computer.",
        important: true
      },
      {
        title: "Service Modifications",
        content: "BookVerse reserves the right to modify or discontinue any service at any time without prior notice.",
        important: false
      }
    ],
    orders: [
      {
        title: "Order Acceptance",
        content: "All orders are subject to acceptance and availability. We reserve the right to refuse any order without explanation.",
        important: true
      },
      {
        title: "Pricing",
        content: "Prices are subject to change without notice. We reserve the right to modify or discontinue products at any time.",
        important: true
      },
      {
        title: "Payment Methods",
        content: "We accept major credit cards, debit cards, PayPal, and other secure payment methods as indicated during checkout.",
        important: false
      },
      {
        title: "Order Confirmation",
        content: "You will receive an order confirmation email once your payment has been processed successfully.",
        important: false
      }
    ],
    shipping: [
      {
        title: "Shipping Times",
        content: "We aim to ship all orders within 24-48 hours. Delivery times vary based on location and shipping method selected.",
        important: true
      },
      {
        title: "Shipping Costs",
        content: "Shipping costs are calculated based on weight, destination, and shipping method. Free shipping may apply for orders over a certain amount.",
        important: false
      },
      {
        title: "Delivery Issues",
        content: "If your order does not arrive within the estimated delivery time, please contact our customer service team.",
        important: true
      },
      {
        title: "International Shipping",
        content: "We ship to most countries worldwide. Additional customs fees may apply and are the responsibility of the customer.",
        important: false
      }
    ],
    returns: [
      {
        title: "Return Window",
        content: "Books may be returned within 30 days of delivery, provided they are in their original condition with all packaging.",
        important: true
      },
      {
        title: "Refund Process",
        content: "Refunds are processed within 5-7 business days after we receive and inspect the returned item.",
        important: true
      },
      {
        title: "Non-Returnable Items",
        content: "Personalized books, digital products, and opened audiobooks cannot be returned unless defective.",
        important: true
      },
      {
        title: "Return Shipping",
        content: "Customers are responsible for return shipping costs unless the return is due to our error.",
        important: false
      }
    ],
    privacy: [
      {
        title: "Data Collection",
        content: "We collect personal information necessary for processing orders and providing better service.",
        important: true
      },
      {
        title: "Data Security",
        content: "We implement industry-standard security measures to protect your personal information.",
        important: true
      },
      {
        title: "Third-Party Services",
        content: "We may share information with trusted third parties only for order processing and delivery purposes.",
        important: false
      },
      {
        title: "Cookies",
        content: "Our website uses cookies to enhance user experience and analyze website traffic.",
        important: false
      }
    ],
    intellectual: [
      {
        title: "Copyright",
        content: "All content on BookVerse, including text, graphics, logos, and images, is our property and protected by copyright laws.",
        important: true
      },
      {
        title: "Book Content",
        content: "Book content remains the intellectual property of the respective authors and publishers.",
        important: true
      },
      {
        title: "Trademarks",
        content: "BookVerse and our logo are trademarks and may not be used without written permission.",
        important: false
      },
      {
        title: "User Content",
        content: "By submitting reviews or other content, you grant us a license to use it for promotional purposes.",
        important: false
      }
    ]
  };

  return (
    <div id="terms"className="min-h-screen bg-gradient-to-b from-gray-50 to-blue-50 py-12 px-4">
      {/* Background Elements */}
      <div className="fixed top-0 right-0 w-96 h-96 bg-blue-200/20 rounded-full mix-blend-multiply filter blur-3xl -z-10"></div>
      <div className="fixed bottom-0 left-0 w-96 h-96 bg-purple-200/20 rounded-full mix-blend-multiply filter blur-3xl -z-10"></div>
      
      <div className="container mx-auto max-w-6xl">
        {/* Header Section */}
        <div className="text-center mb-16 animate-fade-in">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-500 rounded-3xl mb-8 shadow-2xl">
            <Shield className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-5xl font-serif font-bold text-gray-900 mb-4">
            Terms & <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">Conditions</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Welcome to BookVerse. Please read these terms carefully before using our services. 
            By accessing our website, you agree to these terms.
          </p>
        </div>

        {/* Last Updated */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl p-6 text-center mb-12 shadow-xl">
          <div className="flex items-center justify-center space-x-4">
            <AlertCircle className="w-8 h-8 text-white" />
            <p className="text-white text-lg">
              <span className="font-bold">Last Updated:</span> December 15, 2024
            </p>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:w-1/3">
            <div className="bg-white rounded-2xl shadow-xl p-6 sticky top-6 border border-gray-100">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Quick Navigation</h3>
              <nav className="space-y-2">
                {sections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`w-full flex items-center justify-between p-4 rounded-xl transition-all duration-300 ${
                      activeSection === section.id
                        ? `bg-gradient-to-r ${section.color} text-white shadow-lg transform scale-[1.02]`
                        : 'bg-gray-50 hover:bg-gray-100 text-gray-700'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-lg ${
                        activeSection === section.id ? 'bg-white/20' : 'bg-white'
                      }`}>
                        {section.icon}
                      </div>
                      <span className="font-semibold">{section.title}</span>
                    </div>
                    <ChevronRight className={`w-5 h-5 transition-transform duration-300 ${
                      activeSection === section.id ? 'rotate-90' : ''
                    }`} />
                  </button>
                ))}
              </nav>
              
              {/* Important Notice */}
              <div className="mt-8 p-4 bg-amber-50 border border-amber-200 rounded-xl">
                <div className="flex items-start space-x-3">
                  <AlertCircle className="w-6 h-6 text-amber-500 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-bold text-amber-800 mb-1">Important Notice</h4>
                    <p className="text-amber-700 text-sm">
                      These terms constitute a legally binding agreement. If you disagree with any part, please discontinue use of our services.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:w-2/3">
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100 animate-fade-in-up">
              {/* Section Header */}
              <div className="flex items-center mb-8">
                <div className={`w-14 h-14 bg-gradient-to-r ${
                  sections.find(s => s.id === activeSection)?.color
                } rounded-2xl flex items-center justify-center mr-4`}>
                  {sections.find(s => s.id === activeSection)?.icon}
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-gray-900">
                    {sections.find(s => s.id === activeSection)?.title}
                  </h2>
                  <p className="text-gray-600">
                    Important information regarding this aspect of our service
                  </p>
                </div>
              </div>

              {/* Terms List */}
              <div className="space-y-8">
                {termsContent[activeSection]?.map((term, index) => (
                  <div 
                    key={index}
                    className={`p-6 rounded-xl border transition-all duration-300 transform hover:scale-[1.01] ${
                      term.important 
                        ? 'bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200' 
                        : 'bg-gray-50 border-gray-200'
                    }`}
                  >
                    <div className="flex items-start space-x-4">
                      <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                        term.important 
                          ? 'bg-gradient-to-r from-blue-500 to-purple-500' 
                          : 'bg-gray-200'
                      }`}>
                        {term.important ? (
                          <CheckCircle className="w-5 h-5 text-white" />
                        ) : (
                          <FileText className="w-5 h-5 text-gray-600" />
                        )}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">
                          {term.title}
                        </h3>
                        <p className="text-gray-600 leading-relaxed">
                          {term.content}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Acceptance Section */}
              <div className="mt-12 p-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-2xl mb-6">
                  <CheckCircle className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">
                  Acceptance of Terms
                </h3>
                <p className="text-blue-100 mb-6">
                  By using BookVerse services, you acknowledge that you have read, understood, 
                  and agree to be bound by these Terms and Conditions.
                </p>
              
              </div>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-16">
          <h3 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Frequently Asked <span className="text-blue-600">Questions</span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                question: "Can I modify these terms?",
                answer: "No, these terms are non-negotiable. We may update them periodically, and continued use constitutes acceptance.",
                icon: <FileText className="w-6 h-6" />
              },
              {
                question: "How are disputes resolved?",
                answer: "Disputes are resolved through arbitration in Amritsar, Punjab, according to Indian laws.",
                icon: <Shield className="w-6 h-6" />
              },
              {
                question: "Are there age restrictions?",
                answer: "Yes, you must be at least 18 years old to make purchases on BookVerse.",
                icon: <Lock className="w-6 h-6" />
              },
              {
                question: "How do I report violations?",
                answer: "Contact our legal department at legal@bookverse.com with details of the alleged violation.",
                icon: <AlertCircle className="w-6 h-6" />
              }
            ].map((faq, index) => (
              <div 
                key={index}
                className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
              >
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-100 to-purple-100 rounded-xl flex items-center justify-center">
                    <div className="text-blue-600">
                      {faq.icon}
                    </div>
                  </div>
                  <h4 className="text-lg font-semibold text-gray-900">{faq.question}</h4>
                </div>
                <p className="text-gray-600">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Final CTA */}
        <div className="mt-16 p-8 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-3xl text-center shadow-2xl">
          <h3 className="text-2xl font-bold text-white mb-4">
            Need Clarification on Our Terms?
          </h3>
          <p className="text-emerald-100 mb-8 max-w-2xl mx-auto">
            Our customer service team is here to help you understand our policies better.
          </p>
          <button 
            onClick={() => window.location.href = './contactus'}
            className="px-10 py-4 bg-white text-emerald-600 rounded-xl font-bold text-lg hover:bg-emerald-50 hover:scale-105 transform transition-all duration-300 shadow-lg"
          >
            Contact Support Team
          </button>
        </div>
      </div>
    </div>
  );
}

export default TermsAndConditions;