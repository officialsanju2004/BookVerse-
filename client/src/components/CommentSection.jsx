
import axios from 'axios';
import React, { useState, useEffect } from 'react';

const CommentsSection = ({ currentBook }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [newName, setNewName] = useState('');
  


  useEffect(() => {
    axios
      .get("http://localhost:8000/web/api/comment/comment-view")
      .then((res) => {
        setComments(res.data);
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);


  const handleSubmit = (e) => {
    e.preventDefault();
    if (newComment.trim()) {
      axios
        .post("http://localhost:8000/web/api/comment/comment-insert", {
          name:newName,
          comment: newComment,
          date:new Date().toISOString()
        })
        .then((res) => {
          axios
            .get("http://localhost:8000/web/api/comment/comment-view")
            .then((res) => {
              setComments(res.data);
            });
          setNewComment("");
        });
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <h2 className="text-2xl font-semibold text-indigo-700 mb-4">Discussion</h2>
      <p className="text-gray-600 mb-4">Share your thoughts about "{currentBook.title}"</p>
      <form onSubmit={handleSubmit} className="mb-6">
           <label htmlFor="name" style={{ 
                  display: 'block', 
                  marginBottom: 8, 
                  fontWeight: 500, 
                  color: '#555' 
                }}>Your Name:</label>
           <input
                  type="text"
                  name="name"
                  maxLength={10}

                  value={newName}
                  onChange={(e) =>{
                    const value =e.target.value.replace(/[^A-Za-z]/g,'')
                    
                    setNewName(value)}}
                  id="name"
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 mb-2"
        
                  required
                />
        <textarea
          type="text"
          name="comment"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 mb-2"
          placeholder="Write your comment here..."
          rows="3"
        />
        <button type="submit" className="bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition duration-300">
          Post Comment
        </button>
      </form>
      <div className="space-y-4">
        <h4>Other People comment:</h4>
         
        {comments.commentList && comments.commentList.map((comment, index) => (
          
          <div key={index} className="border-b pb-4 last:border-0 ">
            <div className='flex gap-2 my-3'>
         
              <div className="h-8 w-8 bg-indigo-100 rounded-full flex items-center justify-center mr-2">
                <span className="text-indigo-600 font-medium">{comment.name?.charAt(0) || 'U'}</span>
                </div>
                <span className="font-medium ">{comment.name}</span>
                 <span className="text-gray-500 text-sm ml-2">
               
                   {new Date(comment.date).toLocaleDateString()}
                </span>
          
               </div>
               
            <p className="text-gray-700">{comment.comment}</p>
          </div>
        ))}

      </div>
    </div>
  );
};

export default CommentsSection;

