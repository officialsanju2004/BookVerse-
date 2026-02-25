// src/components/BookClub/BookCard.jsx
import React, { useEffect } from "react";
import { Link, Route, Routes } from "react-router-dom";
import BookDetail from "./BookDetail";

const BookCard = ({
book,
          cart,
          setCart,
                addToCart,
                removeBook,
                wishlist,
                setWishlist,
                products,
                toggleWishlist
}) => {




  return (
    <>
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="md:flex">
          <div className="md:flex-shrink-0">
            <img
              className="h-48 w-full object-cover md:w-48"
          
               src={`http://localhost:8000${book.cover}`} 
              alt={`Cover of ${book.title}`}
            />
          </div>
          <div className="p-8">
            <div className="uppercase tracking-wide text-sm text-indigo-600 font-semibold">
              Current Read
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mt-1">
              {book.title}
            </h2>
            <p className="mt-2 text-gray-600">by {book.author}</p>
            <div className="mt-4">
              <span className="bg-indigo-100 text-indigo-800 text-xs font-semibold px-2.5 py-0.5 rounded">
                Book Club Pick
              </span>
            </div>
            <div className="mt-6">
              <Link to={`/book/${book._id}`}>
                <button className="text-indigo-600 hover:text-indigo-800 font-medium">
                  View Book Details →
                </button>
              </Link>
            
            </div>
          </div>
        </div>
         <Routes>
        <Route
          path="/book/:_id"
          element={
            <BookDetail
              books={products}
                  addToCart={addToCart}
                  toggleWishlist={toggleWishlist}
                  wishlist={wishlist}
                  removeBook={removeBook}
        
          
            />
          }
        />
      </Routes>
      </div>
     
    </>
  );
};

export default BookCard;
