// src/components/BookClub/JoinClub.jsx
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import BookClubPage from './BookClubPage';
import { Navigate, Route, Router, Routes, useNavigate } from 'react-router-dom';
import ClubMembers from './ClubMembers';
import CommentsSection from './CommentSection';
import RatingsDisplay from './RatingsDisplay';



const JoinClub = ({ onJoin }) => {
  const [userInfo, setUserInfo] = useState({
    name: '',
    email: '',
    favoriteGenre: ''
  });
  const navigate=useNavigate();
  const [userData, setUserData] = useState('');
  const [joined, setJoined] = useState(false);
  const [otpNumber,setOtpNumber]=useState({
      otpNo:"",
      
    })
    const [otp,setOtp]=useState({otpGen:""})
    const [otpList,setOtpList]=useState([ { otpNo:"",
      email:""}])
    const [formVisible,setFormVisible]=useState(false);

  useEffect(() => {
    // Check localStorage when component mounts
    const storedJoined = localStorage.getItem('joined');
    if (storedJoined === 'true') {
      setJoined(true);
    }
    getAllUserdata();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserInfo(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async(e) => {
    e.preventDefault();
    
    if (!userInfo.email.endsWith("@gmail.com")) {
      toast.error("Incorrect email! Please use a Gmail address.");
      return;
    }
    const otpRes = await axios.get("http://localhost:8000/web/api/clubotp/clubotp-view");
    const data = otpRes.data.otpList;
    const matchedUser = data.find(
          (item) => item.email.trim().toLowerCase() === userInfo.email.trim().toLowerCase()
        );
    
        if (!matchedUser || String(otpNumber.otpNo).trim() !== String(matchedUser.otpGen).trim()) {
          toast.error("Incorrect OTP entered!");
          return;
        }

    onJoin(userInfo);
    
    await axios
      .post("http://localhost:8000/web/api/userInfo/userInfo-insert", userInfo)
      .then(async (res) => {
       
        const user = res.data.userList;
       
        if (!user || !user._id) {
              toast.error("Invalid response from server!");
              return;
            }
            localStorage.setItem("memberId", user._id);
        
        toast.success("Successfully joined the Book Club!");
        
        setUserInfo({ 
          name: '',
          email: '',
          favoriteGenre: '' 
        });
        
        setJoined(true);
        localStorage.setItem('joined', 'true');
        try {
              await axios.delete(`http://localhost:8000/web/api/clubotp/clubotp-delete/${matchedUser._id}`);
     
    } catch (deleteErr) {
      console.warn("Failed to delete OTP:", deleteErr);
    }  
        
        getAllUserdata(); // Refresh user data after joining
      })
      .catch((err) => {
        console.error("Error joining club:", err);
        toast.error("Failed to join the Book Club. Please try again.");
      });
     
  };


  const getAllUserdata = () => {
    axios
      .get("http://localhost:8000/web/api/userInfo/userInfo-view")
      .then((res) => {
        if (res.data.status === 1) {
          setUserData(res.data.userData);
        } else {
         
        }
      })
      .catch((err) => {
       
      });
  };
  const handleOtpChange=(e)=>{
   setOtpNumber({otpNo:e.target.value});
  }
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
          
          Swal.fire("Leaved!", "", "success");
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
    const handleOtPSubmit = (e) => {
    e.preventDefault();
 setFormVisible(true);
  const otpNo = Math.floor(1000 + Math.random() * 9000);
 setOtp({otpGen:otpNo});
   axios
      .post("http://localhost:8000/web/api/clubotp/clubotp-insert",{otpGen:otpNo,email:userInfo.email})
      .then((res) => {
       
      });

  };

  return (
   
    <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden p-6">
      {!joined ? (
        <>
        {!formVisible? (<><div>
          <h2 className="text-2xl font-semibold text-indigo-700 mb-4">Join the BookVerse Book Club</h2>
          <p className="text-gray-600 mb-6">Be part of our reading community and share your thoughts!</p>
          
          <form onSubmit={handleOtPSubmit} className="space-y-4">
            <div>
              <label className="block text-gray-700 mb-1">Name</label>
              <input
                type="text"
                name="name"
                value={userInfo.name}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>
            
            <div>
              <label className="block text-gray-700 mb-1">Email</label>
              <input
                type="email"
                name="email"
                value={userInfo.email}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>
            
            <div>
              <label className="block text-gray-700 mb-1">Favorite Genre</label>
              <select
                name="favoriteGenre"
                value={userInfo.favoriteGenre}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              >
                <option value="">Select a genre</option>
                <option value="Fantasy">Fantasy</option>
                <option value="Science Fiction">Science Fiction</option>
                <option value="Mystery">Mystery</option>
                <option value="Romance">Romance</option>
                <option value="Non-fiction">Non-fiction</option>
              </select>
            </div>
            
            <button
              type="submit"
              className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition duration-300"
            >
              Join Now
            </button>
          </form>
        </div></>):(<><div className="fixed inset-0 flex items-center justify-center text-black bg-opacity-50 z-50 bg-white/20 backdrop-blur-md rounded-2xl p-6 shadow-lg border border-white/30 ">
                <div className="bg-white/20 backdrop-blur-md rounded-2xl p-6 shadow-lg border border-white/30  p-6 rounded-lg shadow-xl w-96">
                  <form onSubmit={handleSubmit}>
                  <h2 className="text-xl  font-bold mb-4">
                    Enter OTP for Email Verification
                  </h2>
                  <p>Hii {userInfo.email},We have sent an Otp to your Mail Box,Please enter it below</p>

                  <input
                    type="number"
                    id="otpNo"
                    placeholder="Enter OTP :"
                    name="otpNo"
                    value={otpNumber.otpNo}
                    onChange={handleOtpChange}
                   
                    className="w-full border border-gray-300 p-2 rounded mb-4"
                  />

                 
                 
                  
                  
                    <button
                     type="submit"
                      className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                    >
                      Confirm
                    </button>
                   </form>
                  </div>
                </div></>)}
</>
        
      ) : (
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-indigo-700 mb-4">Welcome Back!</h2>
          <p className="text-gray-600 mb-6">You have already joined our book club!</p>
          <button
            className="bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition duration-300"
             onClick={()=>handleLeaveClub(localStorage.getItem("memberId"))}
          >
            Leave Club
          </button>
      
          
        </div>
      )}
     
    </div>
   
  );
};

export default JoinClub;