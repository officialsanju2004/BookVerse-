import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaShoppingCart, FaSearch, FaStar, FaRegStar, FaHeart, FaRegHeart } from 'react-icons/fa';
// Wishlist Page Component
function WishlistPage({ wishlist, toggleWishlist }) {
    return (
      <div id='wishlist'> 
        <h1 className="text-3xl font-bold mb-8">Your Wishlist</h1>
        
        {wishlist.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg mb-4">Your wishlist is empty</p>
            <Link 
              to="/" 
              className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition duration-300 inline-block"
            >
              Browse Books
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {wishlist.map(book => (
              <motion.div 
                key={book._id}
                whileHover={{ y: -5 }}
                className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300"
              >
                <Link to={`/book/${book._id}`}>
                  <img 
                     src={`http://localhost:8000${book.image}`}  
                    alt={book.title} 
                    className="w-full h-64 object-cover"
                  />
                </Link>
                
                <div className="p-4">
                  <Link to={`/book/${book._id}`} className="hover:text-indigo-600 transition">
                    <h3 className="font-bold text-lg mb-1 line-clamp-1">{book.title}</h3>
                  </Link>
                  <p className="text-gray-600 mb-2">{book.author}</p>
                  
                  <div className="flex items-center mb-3">
                    {[...Array(5)].map((_, i) => (
                      i < Math.floor(book.ratings) ? 
                        <FaStar key={i} className="text-yellow-400" /> : 
                        <FaRegStar key={i} className="text-yellow-400" />
                    ))}
                    <span className="ml-1 text-gray-600">({book.ratings})</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-indigo-700">Rs {book.price.toFixed(2)}</span>
                    <button 
                      onClick={() => toggleWishlist(book)}
                      className="text-red-500 hover:text-red-700 transition"
                    >
                      <FaHeart />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    );
  }
export default WishlistPage;