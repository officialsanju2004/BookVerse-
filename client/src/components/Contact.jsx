import { ToastContainer, toast } from "react-toastify";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Mail, Phone, MapPin, Clock, Send, MessageSquare, User, BookOpen, Instagram, Facebook, Mail as MailIcon, MessageCircle } from "lucide-react";

export default function Contactme() {
  let [enquiryList, setEnquiryList] = useState([]);
  
  let [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  let [isSubmitting, setIsSubmitting] = useState(false);

  let saveEnquiry = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    if(!formData.email.includes("@")){
      toast.error("Please enter a valid email address!");
      setIsSubmitting(false);
      return;
    }

    axios
      .post("http://localhost:8000/web/api/enquiry/enquiry-insert", formData)
      .then((res) => {
        toast.success("Message Sent Successfully! We'll get back to you soon.");
        setFormData({ name: "", email: "", subject: "", message: "" });
      })
      .catch((err) => {
        toast.error("Something went wrong. Please try again.");
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  let getAllEnquiries = () => {
    axios
      .get("http://localhost:8000/web/api/enquiry/enquiry-view")
      .then((res) => {
        if (res.data.status === 1) {
          setEnquiryList(res.data.enquiryList);
        }
      })
      .catch((err) => {
        console.error("Error fetching enquiries:", err);
      });
  };
  
  let getValue = (e) => {
    let inputName = e.target.name;
    let inputValue = e.target.value;
    setFormData(prev => ({
      ...prev,
      [inputName]: inputValue
    }));
  };

  useEffect(() => {
    getAllEnquiries();
  }, []);

  const contactInfo = [
    {
      icon: <MapPin className="w-8 h-8" />,
      title: "Our Location",
      details: "House No.9131, Kot Baba Deep Singh, Ali No 7, Amritsar, Punjab",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: <Mail className="w-8 h-8" />,
      title: "Email Address",
      details: "godsanju21@gmail.com",
      link: "mailto:godsanju21@gmail.com",
      color: "from-purple-500 to-pink-500"
    },
    {
      icon: <Phone className="w-8 h-8" />,
      title: "Phone Number",
      details: "+91 9877583155",
      link: "tel:+919877583155",
      color: "from-emerald-500 to-teal-500"
    },
    {
      icon: <Clock className="w-8 h-8" />,
      title: "Working Hours",
      details: "Mon-Fri: 9am - 5pm\nWeekends: By appointment",
      color: "from-amber-500 to-orange-500"
    }
  ];

  const socialLinks = [
    { icon: <Phone className="w-5 h-5" />, href: "tel:+919877583155", color: "bg-emerald-500 hover:bg-emerald-600", label: "Call" },
    { icon: <Instagram className="w-5 h-5" />, href: "https://www.instagram.com/notsxnju", color: "bg-pink-500 hover:bg-pink-600", label: "Instagram" },
    { icon: <Facebook className="w-5 h-5" />, href: "https://www.facebook.com/profile.php?id=100093137492115", color: "bg-blue-600 hover:bg-blue-700", label: "Facebook" },
    { icon: <MailIcon className="w-5 h-5" />, href: "mailto:godsanju21@gmail.com", color: "bg-amber-500 hover:bg-amber-600", label: "Email" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-12 px-4">
      <ToastContainer />
      
      {/* Animated Background Elements */}
      <div className="fixed top-0 left-0 w-64 h-64 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
      <div className="fixed bottom-0 right-0 w-64 h-64 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
      
      <div className="container mx-auto max-w-6xl relative z-10">
        {/* Header Section */}
        <div className="text-center mb-16 animate-fade-in">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-500 rounded-3xl mb-8 shadow-2xl">
            <MessageCircle className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-5xl font-serif font-bold text-gray-900 mb-4">
            Contact <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">BookVerse</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Have questions about our books or need help with an order? Our literary experts are here to help you 
            embark on your next reading adventure.
          </p>
        </div>

        {/* Contact Information Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {contactInfo.map((info, index) => (
            <div 
              key={index}
              className="group bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-1 animate-fade-in-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r ${info.color} rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-300`}>
                <div className="text-white">
                  {info.icon}
                </div>
              </div>
              
              <h3 className="text-xl font-bold text-gray-900 mb-3">{info.title}</h3>
              {info.link ? (
                <a 
                  href={info.link}
                  className="text-gray-600 hover:text-blue-600 transition-colors duration-300"
                >
                  {info.details}
                </a>
              ) : (
                <p className="text-gray-600 whitespace-pre-line">{info.details}</p>
              )}
            </div>
          ))}
        </div>

        {/* Contact Form and Map Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Contact Form */}
          <div className="bg-white rounded-3xl shadow-2xl p-8 border border-gray-100 animate-slide-up">
            <div className="flex items-center mb-8">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center mr-4">
                <MessageSquare className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-gray-900">Send Us a Message</h2>
                <p className="text-gray-600">We typically respond within 24 hours</p>
              </div>
            </div>

            <form onSubmit={saveEnquiry}>
              <div className="space-y-6">
                {/* Name Input */}
                <div className="group">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <div className="flex items-center">
                      <User className="w-4 h-4 mr-2" />
                      Your Name
                    </div>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={getValue}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300 outline-none"
                    placeholder="John Doe"
                    required
                  />
                </div>

                {/* Email Input */}
                <div className="group">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <div className="flex items-center">
                      <Mail className="w-4 h-4 mr-2" />
                      Email Address
                    </div>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={getValue}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300 outline-none"
                    placeholder="john@example.com"
                    required
                  />
                </div>

                {/* Subject Input */}
                <div className="group">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <div className="flex items-center">
                      <BookOpen className="w-4 h-4 mr-2" />
                      Subject
                    </div>
                  </label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={getValue}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300 outline-none"
                    placeholder="Book Inquiry, Order Help, etc."
                    required
                  />
                </div>

                {/* Message Input */}
                <div className="group">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <div className="flex items-center">
                      <MessageSquare className="w-4 h-4 mr-2" />
                      Your Message
                    </div>
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={getValue}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300 outline-none min-h-[150px] resize-none"
                    placeholder="Tell us about your inquiry..."
                    required
                  ></textarea>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full py-4 px-6 rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-[1.02] ${
                    isSubmitting 
                      ? 'bg-gray-400 cursor-not-allowed' 
                      : 'bg-gradient-to-r from-blue-500 to-purple-500 hover:shadow-2xl'
                  } text-white shadow-lg flex items-center justify-center`}
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-3"></div>
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5 mr-3" />
                      Send Message
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Location Map/Info */}
          <div className="space-y-8">
            {/* Location Card */}
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-3xl p-8 shadow-xl border border-blue-100 animate-slide-up" style={{ animationDelay: "200ms" }}>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Visit Our Store</h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-4">
                  <MapPin className="w-6 h-6 text-blue-500 mt-1" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Address</h4>
                    <p className="text-gray-600">House No.9131, Kot Baba Deep Singh, Ali No 7, Amritsar, Punjab</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <Clock className="w-6 h-6 text-purple-500 mt-1" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Store Hours</h4>
                    <p className="text-gray-600">Monday - Friday: 9:00 AM - 8:00 PM</p>
                    <p className="text-gray-600">Saturday - Sunday: 10:00 AM - 6:00 PM</p>
                  </div>
                </div>
              </div>
            </div>

            {/* FAQ Preview */}
            <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100 animate-slide-up" style={{ animationDelay: "400ms" }}>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Quick Questions</h3>
              <div className="space-y-4">
                <div className="border-l-4 border-blue-500 pl-4 py-2">
                  <h4 className="font-semibold text-gray-900">How long for book delivery?</h4>
                  <p className="text-gray-600 text-sm">Typically 3-7 business days</p>
                </div>
                <div className="border-l-4 border-purple-500 pl-4 py-2">
                  <h4 className="font-semibold text-gray-900">Can I return a book?</h4>
                  <p className="text-gray-600 text-sm">Yes, within 30 days of purchase</p>
                </div>
                <div className="border-l-4 border-emerald-500 pl-4 py-2">
                  <h4 className="font-semibold text-gray-900">Do you have rare books?</h4>
                  <p className="text-gray-600 text-sm">Check our rare books collection</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Social Links */}
        <div className="text-center mb-16">
          <h3 className="text-2xl font-bold text-gray-900 mb-8">Connect With Us</h3>
          <div className="flex justify-center space-x-4">
            {socialLinks.map((social, index) => (
              <a
                key={index}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className={`${social.color} w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-lg transform hover:-translate-y-2 hover:shadow-2xl transition-all duration-300 animate-fade-in-up`}
                style={{ animationDelay: `${index * 100}ms` }}
                aria-label={social.label}
              >
                {social.icon}
              </a>
            ))}
          </div>
        </div>

        {/* Response Time Banner */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-500 rounded-3xl p-8 text-center shadow-2xl transform hover:scale-[1.02] transition-transform duration-500">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="mb-6 md:mb-0">
              <h3 className="text-2xl font-bold text-white mb-2">Quick Response Guaranteed</h3>
              <p className="text-blue-100">We respond to all inquiries within 24 hours</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="bg-white/20 p-3 rounded-xl">
                <Clock className="w-8 h-8 text-white" />
              </div>
              <div>
                <p className="text-white font-bold text-xl">24-Hour</p>
                <p className="text-blue-100 text-sm">Response Time</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}