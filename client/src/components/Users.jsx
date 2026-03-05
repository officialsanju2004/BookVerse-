import React from 'react'
import  { useEffect, useState,useRef } from "react";
import { motion, AnimatePresence } from 'framer-motion';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stars, useGLTF } from '@react-three/drei';
import { FiSearch, FiUser, FiShoppingCart, FiHeart, FiMenu, FiX, FiChevronDown, FiArrowRight } from 'react-icons/fi';
import { FaFacebook, FaTwitter, FaInstagram, FaPinterest, FaPhone, FaWhatsapp, FaMailBulk, FaMailchimp } from 'react-icons/fa';



import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import {  SubscriptionManager } from "framer-motion";

import {
  FaShoppingCart,
  FaSearch,
  FaStar,
  FaRegStar,
  FaHeart,
  FaRegHeart,
} from "react-icons/fa";

export default function Users() {
  return (
    <div>
      {/* Testimonials */}
      <section className="py-20 px-6 bg-white">
        <div className="container mx-auto">
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">What Our Readers Say</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Don't just take our word for it - hear from our community
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((item) => (
              <motion.div
                key={item}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: item * 0.2 }}
                className="bg-gray-50 rounded-xl p-8 shadow-md hover:shadow-lg transition-shadow duration-300"
              >
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className="w-5 h-5 text-yellow-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-gray-700 mb-6">
                  "I've discovered so many amazing books through BookVerse. Their recommendations are always spot on and the delivery is super fast!"
                </p>
                <div className="flex items-center">
                  <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold mr-4">
                    JD
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">Jane Doe</h4>
                    <p className="text-sm text-gray-600">Book Club Member</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section> 
    </div>
  )
}
