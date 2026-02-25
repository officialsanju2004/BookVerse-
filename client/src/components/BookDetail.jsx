import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link,useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaShoppingCart, FaSearch, FaStar, FaRegStar, FaHeart, FaRegHeart } from 'react-icons/fa';

// Book Detail Component
function BookDetail({ books,
                  addToCart,
                  toggleWishlist,
                  wishlist,removeBook}) {
    const { _id } = useParams();
    //const book = books.find(book => book._id === parseInt(_id));
    const [quantity, setQuantity] = useState(1);
    const [loading,setLoading]=useState(true);
    const [book,setBook]=useState(null);
  
    
useEffect(()=>{
  if(!Array.isArray(books)){
    setLoading(false);
    return;
  }
  const foundBook =books.find(book=>book._id===_id);
  setBook(foundBook||null);
 
  setLoading(false);
  //track browsing history when book is found
if(foundBook){
  updateBrowsingHistory(foundBook);
}
},[_id,books]);



 

  const updateBrowsingHistory = (currentBook) => {
        try {
            const userPrefs = JSON.parse(localStorage.getItem('userPreferences')) || {};
            const history = userPrefs.browsingHistory || [];
            
            // Update history - keep unique, limit to 10 items
            const updatedHistory = [
                ...history.filter(b => b._id !== currentBook._id), 
                { 
                    _id: currentBook._id,
                    title: currentBook.title,
                    category: currentBook.category,
                    image: currentBook.image,
                    price: currentBook.price,
                    viewedAt: new Date().toISOString()
                }
            ].slice(0, 10);
            
            localStorage.setItem('userPreferences', JSON.stringify({
                ...userPrefs,
                browsingHistory: updatedHistory
            }));
        } catch (error) {
            console.error("Failed to update browsing history:", error);
        }
    };

if(loading) {
  return <div className='text-center py-12'>Loading book details...</div>;
}

    if (!book) {
      return <div className="text-center py-12">Book not found</div>;
    }
  
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-6xl mx-auto"
        id="bookdetail"
      >
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="md:flex">
            <div className="md:w-1/3 p-6">
              <div className="relative">
                <img 
                   src={`http://localhost:8000${book.image}`}  
                  alt={book.title} 
                  className="w-full h-auto rounded-lg shadow-md"
                />
                <button 
                  onClick={() => toggleWishlist(book)}
                  className="absolute top-4 right-4 bg-white p-3 rounded-full shadow-lg hover:bg-red-100 transition"
                >
                  {wishlist.some(item => item._id === book._id) ? (
                    <FaHeart className="text-red-500 text-xl" />
                  ) : (
                    <FaRegHeart className="text-gray-500 text-xl" />
                  )}
                </button>
              </div>
            </div>
            
            <div className="md:w-2/3 p-6">
              <h1 className="text-3xl font-bold mb-2">{book.title}</h1>
              <p className="text-xl text-gray-600 mb-4">by {book.author}</p>
              
              <div className="flex items-center mb-4">
                <div className="flex mr-2">
                  {[...Array(5)].map((_, i) => (
                    i < Math.floor(book.ratings) ? 
                      <FaStar key={i} className="text-yellow-400" /> : 
                      <FaRegStar key={i} className="text-yellow-400" />
                  ))}
                </div>
                <span className="text-gray-600">({book.ratings} rating)</span>
              </div>
              
              <div className="bg-gray-100 p-4 rounded-lg mb-6">
                <p className="text-gray-800">{book.description}</p>
              </div>
              
              <div className="mb-6">
                <p className="text-gray-700 mb-2"><span className="font-semibold">Category:</span> {book.category}</p>
              </div>
              
              <div className="flex items-center mb-6">
                <span className="text-3xl font-bold text-indigo-700 mr-6">Rs{book.price.toFixed(2)}</span>
                
                <div className="flex items-center mr-6">
                  <span className="mr-2">Quantity:</span>
                  <div className="flex border rounded-lg overflow-hidden">
                    <button 
                      onClick={() => {setQuantity(Math.max(1, quantity - 1)); for (let i = 0; i < quantity; i++) {
                      removeBook(book);
                    }}}
                      className="px-3 py-1 bg-gray-200 hover:bg-gray-300 transition"
                    >
                      -
                    </button>
                    <span className="px-4 py-1">{quantity}</span>
                    <button 
                    disabled={quantity>=book.stock}
                      onClick={() => {
                        if(quantity <book.stock){
                          setQuantity(quantity+1);
                        }
                        
                        setQuantity(quantity + 1);  
                        for (let i = 0; i < quantity; i++) {
                      addToCart(book);
                    }
                  


                       }}
                      className="px-3 py-1 bg-gray-200 hover:bg-gray-300 transition"
                    >
                      +
                    </button>
                  </div>
                </div>
                
                <button 
                  onClick={() => {
                    for (let i = 0; i < quantity; i++) {
                      addToCart(book);
                    }
                  }}
                   disabled={book.stock<=0}
                  className={`${book.stock===0?"bg-red-600 hover:bg-red-700":"bg-indigo-600"} text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition duration-300`}
                >
                 {book.stock<=0?"Out Of Stock":"Add to Cart"}
                </button>
              </div>
              
              <div className="border-t pt-4">
                <h3 className="font-semibold mb-2">Product Details</h3>
                <ul className="text-gray-600 space-y-1">
                  <li><span className="font-medium">ISBN : </span>  {book.isbn}</li>
                  <li><span className="font-medium">Publisher : </span>  {book.publisher}</li>
                  <li><span className="font-medium">Publication Date : </span> { book.publicationDate}</li>
                  <li><span className="font-medium">Pages : </span>{book.pages}</li>
                  <li><span className="font-medium">Dimensions : </span>{book.dimensions}</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }
  export default BookDetail;