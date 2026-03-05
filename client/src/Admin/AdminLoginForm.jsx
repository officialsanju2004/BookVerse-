import React, { use, useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";

export default function AdminLogin({ setIsAdmin }) {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const [updateFormData, setUpdateFormData] = useState({
    currentUsername: "",
    newUsername: "",
    currentPassword: "",
    newPassword: "",
  });

  const [forgotData, setForgotData] = useState({
    username: "",
    otp: "",
    newPassword: "",
  });
const [mainForm,setMainForm]=useState(false); 
  const [activeTab, setActiveTab] = useState(false); // for Update Credentials
  const [forgotTab, setForgotTab] = useState(false); // for Forgot Password

  // 🔹 Handle input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const handleUpdateChange = (e) => {
    setUpdateFormData({ ...updateFormData, [e.target.name]: e.target.value });
  };
  const handleForgotChange = (e) => {
    setForgotData({ ...forgotData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let res = await axios.post("http://localhost:8000/api/admin/login", formData);
   
     
      localStorage.setItem("token", res.data.token);
      toast.success("Login Successfully!");
      setIsAdmin(true);
    } catch (error) {
      toast.error("Login failed: " + (error.response?.data?.message || error.message));
    }
  };

  
  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:8000/web/api/admin/admin-update", updateFormData);
      toast.success("Credentials Updated!");
      setUpdateFormData({
    currentUsername: "",
    newUsername: "",
    currentPassword: "",
    newPassword: "",
  })
    } catch (error) {
      toast.error("Update failed: " + (error.response?.data?.message || error.message));
    }
  };

  // 🔹 Forgot Password – Step 1 (Send OTP)
  const handleForgotSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:8000/web/api/admin/forgot-password", {
        username: forgotData.username,
      });
      toast.info("OTP sent to your registered email!");
      setForgotTab(true);
      // prepare to show OTP + new password fields
      setForgotData({ ...forgotData, otp: " ", newPassword: "" });
    } catch (error) {
      toast.error("Error: " + (error.response?.data?.message || error.message));
    }
  };

  // 🔹 Forgot Password – Step 2 (Reset Password)
  const handleResetPassword = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:8000/web/api/admin/reset-password", forgotData);
      toast.success("Password reset successful!");
     
      setForgotTab(false);
    setMainForm(false);
      setForgotData({ username: "", otp: "", newPassword: "" });
    } catch (error) {
      toast.error("Reset failed: " + (error.response?.data?.message || error.message));
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black">
      <ToastContainer />
{mainForm? ( <>{/* 🔹 Forgot Password Section */}
      {!forgotTab ? (
        <div className="bg-white/10 backdrop-blur-lg shadow-xl rounded-2xl p-8 w-full max-w-md transition-transform duration-300 hover:scale-105">
          <h2 className="text-3xl font-bold text-center text-white mb-6">
            Reset Admin Password
          </h2>

         
            <form onSubmit={handleForgotSubmit} className="space-y-5">
              <div>
                <label className="block text-gray-200 mb-2 font-medium">Username</label>
                <input
                  type="text"
                  name="username"
                  value={forgotData.username}
                  onChange={handleForgotChange}
                  placeholder="Enter your admin username"
                  className="w-full px-4 py-2 rounded-lg bg-white/20 text-white placeholder-gray-300 
                  focus:ring-2 focus:ring-purple-500 focus:outline-none"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full bg-purple-600 hover:bg-purple-700 transition-colors duration-300 
                text-white font-semibold py-2 rounded-lg shadow-lg"
              >
                Send OTP
              </button>
            </form>
            </div>
        ):(
            <div className="bg-white/10 backdrop-blur-lg shadow-xl rounded-2xl p-8 w-full max-w-md transition-transform duration-300 hover:scale-105">
     
            <form onSubmit={handleResetPassword} className="space-y-5">
              <div>
                <label className="block text-gray-200 mb-2 font-medium">OTP</label>
                <input
                  type="text"
                  name="otp"
                  value={forgotData.otp}
                  onChange={handleForgotChange}
                  placeholder="Enter OTP"
                  className="w-full px-4 py-2 rounded-lg bg-white/20 text-white placeholder-gray-300 
                  focus:ring-2 focus:ring-purple-500 focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-200 mb-2 font-medium">New Password</label>
                <input
                  type="password"
                  name="newPassword"
                  value={forgotData.newPassword}
                  onChange={handleForgotChange}
                  placeholder="Enter new password"
                  className="w-full px-4 py-2 rounded-lg bg-white/20 text-white placeholder-gray-300 
                  focus:ring-2 focus:ring-purple-500 focus:outline-none"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full bg-green-600 hover:bg-green-700 transition-colors duration-300 
                text-white font-semibold py-2 rounded-lg shadow-lg"
              >
                Reset Password
              </button>
            </form>
        

          <button
            onClick={() => setForgotTab(false)}
            className="mt-3 text-white text-sm"
          >
            Go Back to Login <b className="text-red-500">Click here</b>
          </button>
        </div>)} </>):(<> {activeTab?   (<div className="bg-white/10 backdrop-blur-lg shadow-xl rounded-2xl p-8 w-full max-w-md transition-transform duration-300 hover:scale-105">
        <h2 className="text-3xl font-bold text-center text-white mb-6">
         Create your Admin Account
        </h2>

        <form onSubmit={handleUpdateSubmit} className="space-y-5">
          {/* username */}
          <div>
            <label className="block text-gray-200 mb-2 font-medium">
             Current Username
            </label>
            <input
              type="text"
              name="currentUsername"
              placeholder="Enter your Current username"
              value={updateFormData.currentUsername}
              onChange={handleUpdateChange}
              className="w-full px-4 py-2 rounded-lg bg-white/20 text-white placeholder-gray-300 
              focus:ring-2 focus:ring-purple-500 focus:outline-none"
              required
            />
          </div>
         <div>
            <label className="block text-gray-200 mb-2 font-medium">
            New Username
            </label>
            <input
              type="text"
              name="newUsername"
              placeholder="Enter yourNew username"
              value={updateFormData.newUsername}
              onChange={handleUpdateChange}
              className="w-full px-4 py-2 rounded-lg bg-white/20 text-white placeholder-gray-300 
              focus:ring-2 focus:ring-purple-500 focus:outline-none"
              required
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-gray-200 mb-2 font-medium">
              Password
            </label>
            <input
              type="password"
              name="currentPassword"
              placeholder="Enter your Current password"
              value={updateFormData.currentPassword}
              onChange={handleUpdateChange}
              className="w-full px-4 py-2 rounded-lg bg-white/20 text-white placeholder-gray-300 
              focus:ring-2 focus:ring-purple-500 focus:outline-none"
              required
            />
          </div>
        
          <div>
            <label className="block text-gray-200 mb-2 font-medium">
             New Password
            </label>
            <input
              type="password"
              name="newPassword"
              placeholder="Enter your New  password"
              value={updateFormData.newPassword}
              onChange={handleUpdateChange}
              className="w-full px-4 py-2 rounded-lg bg-white/20 text-white placeholder-gray-300 
              focus:ring-2 focus:ring-purple-500 focus:outline-none"
              required
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-purple-600 hover:bg-purple-700 transition-colors duration-300 
            text-white font-semibold py-2 rounded-lg shadow-lg"
          >
           Submit
          </button>
        </form>
        <button onClick={()=>{setActiveTab(false)}}className="my-1 text-white">Go to Admin Login Page <b className="text-red-500">Click here</b></button>
       <button onClick={()=>{setMainForm(true)}} className="text-white">Forgot password? <b className="text-red-500">click here</b></button>
      </div>) :(<div className="bg-white/10 backdrop-blur-lg shadow-xl rounded-2xl p-8 w-full max-w-md transition-transform duration-300 hover:scale-105">
        <h2 className="text-3xl font-bold text-center text-white mb-6">
        Enter your Admin credentials
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* username */}
          <div>
            <label className="block text-gray-200 mb-2 font-medium">
             Current Username
            </label>
            <input
              type="text"
              name="username"
              placeholder="Enter your Current username"
              value={formData.username}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg bg-white/20 text-white placeholder-gray-300 
              focus:ring-2 focus:ring-purple-500 focus:outline-none"
              required
            />
          </div>
        
          {/* Password */}
          <div>
            <label className="block text-gray-200 mb-2 font-medium">
              Password
            </label>
            <input
              type="password"
              name="password"
              placeholder="Enter your Current password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg bg-white/20 text-white placeholder-gray-300 
              focus:ring-2 focus:ring-purple-500 focus:outline-none"
              required
            />
          </div>
        
          
          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-purple-600 hover:bg-purple-700 transition-colors duration-300 
            text-white font-semibold py-2 rounded-lg shadow-lg"
          >
           Submit
          </button>
         
        </form>
        <button onClick={()=>{setActiveTab(true)}}className=" text-white">Wanna Change your credentials? <b className="text-red-500">Click here</b></button>
      <button onClick={()=>{setMainForm(true)}} className="text-white">Forgot password? <b className="text-red-500">click here</b></button>
      
      
      </div>) }</>)}
     
        
    </div>
  );
}
