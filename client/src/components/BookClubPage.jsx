// src/pages/BookClubPage.jsx
import React, { useEffect, useState } from "react";

import JoinClub from "./JoinClub";
import CommentsSection from "./CommentSection";
import BookCard from "./BookCard";
import RatingsDisplay from "./RatingsDisplay";
import ClubMembers from "./ClubMembers";
import Swal from "sweetalert2";
import { toast, ToastContainer } from "react-toastify";
import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import axios from "axios";

const BookClubPage = ({ setWishlist, wishlist,removeBook,cart, setCart }) => {
  const [isMember, setIsMember] = useState(() => {
    return localStorage.getItem("joined") === "true";
  });
  useEffect(() => {
    const joined = localStorage.getItem("joined");
    const memberId=localStorage.getItem("memberId");
  }, []);
  const [members, setMembers] = useState([]);
  const [comments, setComments] = useState([]);
  const [ratings, setRatings] = useState([]);
 const [clubMember,setClubMember]=useState('');
  const [products, setProducts] = useState([]);
  const [currentBook, setCurrentBook] = useState({
    title: "",
    author: "",
    cover: "imageLink",
    _id:""
  });

  const navigate = useNavigate();
  useEffect(() => {
    axios.get("http://localhost:8000/web/api/books/books-view").then((res) => {
      const randomBook = Math.floor(Math.random() * 201);
      setProducts(res.data.productList);
      let BookData = res.data.productList[randomBook];
      
    
      setCurrentBook({
        title: BookData.title,
        author: BookData.author,
        cover: BookData.image,
        _id:BookData._id
      });
    });
  }, []);

  const addToCart = (book) => {
    if (isLogined) {
      setCart([...cart, book]);
    } else {
      toast.error("Please SignUp First!!");
      window.location.href = "/SignUp";
    }
  };
    
  const toggleWishlist = (book) => {
    if (wishlist.some((item) => item._id === book._id)) {
      setWishlist(wishlist.filter((item) => item._id !== book._id));
    } else {
      setWishlist([...wishlist, book]);
    }
  };

  const handleJoinClub = (userInfo) => {
    setIsMember(true);
    setMembers([...members, userInfo]);
    localStorage.setItem("joined", "true");
  };

  const addComment = (comment) => {
    setComments([...comments, comment]);
  };

  const addRating = (rating) => {
    setRatings([...ratings, rating]);
  };


const handleLeaveClub = (id) => {
    try {
       

      Swal.fire({
        title: "Do you want to leave this club?",
        showDenyButton: true,
        showCancelButton: true,
        confirmButtonText: "Yes",
      }).then(async (result) => {
        if (result.isConfirmed) {
          await axios.delete(
            `http://localhost:8000/web/api/userInfo/userInfo-delete/${id}`,
            
          );
          
          Swal.fire("leaved!", "", "success");
          setIsMember(false);
    localStorage.removeItem("joined");
    toast.info("You have left the Book club . We hope to see you again!");
    navigate("/");
        } else if (result.isDenied) {
          Swal.fire("user is not leaved from club", "", "info");
        }
      });
    } catch (error) {
      console.error("Error leaving Club:", error);
    }
  };


















  
    
  

  return (
    <div id="bookClub"className="min-h-screen bg-gradient-to-b from-blue-50 to-purple-50 p-6">
      <ToastContainer />
      <header className="mb-8 text-center">
        <h1 className="text-4xl font-bold text-indigo-800">
          BookVerse Book Club
        </h1>
        <p className="text-lg text-gray-600 mt-2">
          Join our community of book lovers
        </p>
      </header>

      {!isMember ? (
        <JoinClub onJoin={handleJoinClub} />
      ) : (
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <BookCard
                book={currentBook}
          cart={cart}
          setCart={setCart}
                addToCart={addToCart}
                removeBook={removeBook}
                wishlist={wishlist}
                setWishlist={setWishlist}
                products={products}
                toggleWishlist={toggleWishlist}
         
              />

              <CommentsSection
                comments={comments}
                onAddComment={addComment}
                currentBook={currentBook}
              />

              <RatingsDisplay ratings={ratings} onAddRating={addRating} />
            </div>

            <div className="lg:col-span-1">
              <ClubMembers members={members} />
            </div>
            <button
              className="bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition duration-300"
              onClick={()=>handleLeaveClub(localStorage.getItem("memberId"))}
            >
              Leave Club
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookClubPage;
