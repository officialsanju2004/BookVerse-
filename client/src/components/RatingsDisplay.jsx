// src/components/BookClub/RatingsDisplay.jsx
import React, { useState, useEffect } from 'react';
import { StarIcon } from '@heroicons/react/solid';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';

const RatingsDisplay = ({ onAddRating, bookId }) => {
  const [userRating, setUserRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [ratings, setRatings] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
   const[author,setAuthor]=useState('');


  // Fetch ratings from backend
  const fetchRatings = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get('http://localhost:8000/web/api/review/review-view');
      if (response.data.status === 1) {
        setRatings(response.data.ratingList);
      } else {
        toast.error('Failed to fetch ratings');
      }
    } catch (err) {
      console.error('Error fetching ratings:', err);
      toast.error('Failed to load ratings');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRatings();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (userRating > 0) {
      setIsSubmitting(true);
      setError(null);
      
      try {
        const ratingData = {
          stars: userRating,
          review: reviewText,
          author: author,
      
          date: new Date().toISOString()
        };

        const response = await axios.post('http://localhost:8000/web/api/review/review-insert', ratingData);
        
        if (response.data) {
          toast.success('Rating submitted successfully!');
          // Refresh ratings after submission
          await fetchRatings();
          if (onAddRating) {
            onAddRating(response.data);
          }
        }
        
        setUserRating(0);
        setReviewText('');
      } catch (err) {
        console.error('Error submitting rating:', err);
        setError('Failed to submit rating. Please try again.');
        toast.error('Failed to submit rating');
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const averageRating = ratings.length > 0 
    ? (ratings.reduce((sum, rating) => sum + rating.stars, 0) / ratings.length).toFixed(1)
    : 0;

  if (isLoading) {
    return <div className="text-center py-4">Loading ratings...</div>;
  }

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <ToastContainer />
      <h2 className="text-2xl font-semibold text-indigo-700 mb-4">Ratings & Reviews</h2>
      
      <div className="flex items-center mb-6">
        <div className="text-4xl font-bold mr-4">{averageRating}</div>
        <div className="flex">
          {[1, 2, 3, 4, 5].map((star) => (
            <StarIcon
              key={star}
              className={`h-8 w-8 ${
                star <= averageRating ? 'text-yellow-400' : 'text-gray-300'
              }`}
            />
          ))}
        </div>
        <span className="ml-2 text-gray-600">({ratings.length} reviews)</span>
      </div>
      
      <form onSubmit={handleSubmit} className="mb-6">
        <div className="flex mb-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              type="button"
              key={star}
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
              onClick={() => setUserRating(star)}
              className="focus:outline-none"
            >
              <StarIcon
                className={`h-8 w-8 ${
                  star <= (hoverRating || userRating) ? 'text-yellow-400' : 'text-gray-300'
                }`}
              />
            </button>
          ))}
        </div>
        <label htmlFor="author" style={{ 
                  display: 'block', 
                  marginBottom: 8, 
                  fontWeight: 500, 
                  color: '#555' 
                }}>Your Name:</label>
           <input
                  type="text"
                  name="name"
                  value={author}
                  maxLength={10}
                  onChange={(e) =>{
                    const value =e.target.value.replace(/[^A-Za-z]/g,'')
                    
                    setAuthor(value)}}
                
                  id="name"
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 mb-2"
        
                  required
                />
        <textarea
          value={reviewText}
          onChange={(e) => setReviewText(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 mb-2"
          placeholder="Write your review (optional)..."
          rows="3"
        />
        <button
          type="submit"
          className="bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition duration-300 disabled:opacity-50"
          disabled={userRating === 0 || isSubmitting}
        >
          {isSubmitting ? 'Submitting...' : 'Submit Rating'}
        </button>
        {error && <p className="text-red-500 mt-2">{error}</p>}
      </form>
      
      <div className="space-y-4">
        {ratings.length === 0 ? (
          <p className="text-gray-500">No ratings yet. Be the first to rate!</p>
        ) : (
          ratings.map((rating, index) => (
            <div key={index} className="border-b pb-4 last:border-0">
              <div className="flex items-center mb-2">
                <div className="h-8 w-8 bg-indigo-100 rounded-full flex items-center justify-center mr-2">
                  <span className="text-indigo-600 font-medium">{rating.author?.charAt(0) || 'U'}</span>
                </div>
                <span className="font-medium">{rating.author}</span>
                <div className="flex ml-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <StarIcon
                      key={star}
                      className={`h-4 w-4 ${
                        star <= rating.stars ? 'text-yellow-400' : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-gray-500 text-sm ml-2">
                  {new Date(rating.date).toLocaleDateString()}
                </span>
              </div>
              {rating.review && <p className="text-gray-700">{rating.review}</p>}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default RatingsDisplay;