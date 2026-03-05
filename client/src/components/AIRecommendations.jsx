import { motion } from 'framer-motion';
import { FaStar, FaRegStar, FaHeart, FaRegHeart } from 'react-icons/fa';
import { RiAiGenerate } from 'react-icons/ri';
import { BsStars } from 'react-icons/bs';

const AIRecommendations = ({ recommendations, onAddToCart, onToggleWishlist, wishlist, onGenerateSummary }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
    >
      {recommendations.map((book) => (
        <motion.div
          key={book._id}
          data-aos="slide-up"
          

         
          whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
          className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 border border-indigo-100 relative"
        >
          <div className="absolute top-2 left-2 bg-indigo-100 text-indigo-800 text-xs px-2 py-1 rounded-full flex items-center">
            <BsStars className="mr-1" /> AI Pick
          </div>
          
          <div className="relative"  >
            <img
               src={`http://localhost:8000${book.image}`} 
               onClick={() => {
                    window.location.href = `/book/${book._id}#bookdetail`;
                  }}
              alt={book.title}
              className="w-full h-64 object-cover"
            />
            <button
              onClick={(e) => {
                e.preventDefault();
                onToggleWishlist(book);
              }}
              className="absolute top-2 right-2 bg-white p-2 rounded-full shadow-md hover:bg-red-100 transition"
            >
              {wishlist.some((item) => item._id === book._id) ? (
                <FaHeart className="text-red-500" />
              ) : (
                <FaRegHeart className="text-gray-500" />
              )}
            </button>
          </div>
          
          <div className="p-4">
            <h3 className="font-bold text-lg mb-1 line-clamp-1">
              {book.title}
            </h3>
            <p className="text-gray-600 mb-2">{book.author}</p>
            <p className="text-xs text-indigo-600 mb-2 italic">{book.reason}</p>
            
            <div className="flex items-center mb-3">
              {[...Array(5)].map((_, i) =>
                i < Math.floor(book.ratings) ? (
                  <FaStar key={i} className="text-yellow-400" />
                ) : (
                  <FaRegStar key={i} className="text-yellow-400" />
                )
              )}
              <span className="ml-1 text-gray-600">({book.ratings})</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="font-bold text-indigo-700">
                Rs {book.price.toFixed(2)}
              </span>
              <div className="flex space-x-2">
                <button
                  onClick={() => onGenerateSummary(book)}
                  className="bg-gray-200 text-gray-700 p-2 rounded-lg hover:bg-gray-300 transition"
                  title="AI Summary"
                >
                  <RiAiGenerate />
                </button>
                <button
                  onClick={() => onAddToCart(book)}
                  disabled={book.stock<=0}
                  className={`${book.stock===0? "bg-red-600 hover:bg-red-700 ": "bg-indigo-600"} text-white px-3 py-2 rounded-lg hover:bg-indigo-700 transition`}
                >
                  {book.stock<=0? "Out Of Stock":"Add to Cart"}
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
};

export default AIRecommendations;