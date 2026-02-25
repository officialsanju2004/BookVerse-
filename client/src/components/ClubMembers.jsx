// src/components/BookClub/ClubMembers.jsx
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';


const ClubMembers = ({ members }) => {
    const [userData,setUserData]=useState('');
  
  useEffect(() => {
    axios
      .get("http://localhost:8000/web/api/userInfo/userInfo-view")
      .then((res) => {
        setUserData(res.data);
      })
      .catch((err) => {
        console.error(err);
        
      });
  }, []);


  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      {userData.length === 0 ? (
          <p className="text-gray-500">No user yet. Be the first to Join!</p>
        ) : (
          <>
      <h2 className="text-2xl font-semibold text-indigo-700 mb-4">Club Members</h2>
      <p className="text-gray-600 mb-4">{userData.userList.length} book lovers in our community</p>
      
      <div className="space-y-3">
        {userData.userList&& userData.userList.map ((member, index) => (
          <div key={index} className="flex items-center">
            <div className="h-10 w-10 bg-indigo-100 rounded-full flex items-center justify-center mr-3">
              <span className="text-indigo-600 font-medium">{member.name.charAt(0)}</span>
            </div>
            <div>
              <p className="font-medium">{member.name}</p>
              <p className="text-sm text-gray-500">{member.favoriteGenre} enthusiast</p>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-6 p-4 bg-indigo-50 rounded-lg">
        <h3 className="font-medium text-indigo-700 mb-2">Next Meeting</h3>
        <p className="text-gray-700">Thursday, June 15 at 7:00 PM</p>
        <p className="text-sm text-gray-500 mt-1">Virtual on BookVerse</p>
      </div></>)}
    </div>
  );
};

export default ClubMembers;