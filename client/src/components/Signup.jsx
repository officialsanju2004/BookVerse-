

import { ToastContainer, toast } from "react-toastify";
import { useEffect, useState } from "react";
import axios from "axios";

import {useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";



export default function SignUp({isLogined,setIsLogined}) {
  const [formData, setFormData] = useState({
    
    name: "",
    email: "",
    password: "",

    rememberMe: false,
  });
   
  const [otpNumber,setOtpNumber]=useState({
    otpNo:"",
    
  })
  const [otp,setOtp]=useState({otpGen:""})
  const [otpList,setOtpList]=useState([ { otpNo:"",
    email:""}])
  const [formVisible,setFormVisible]=useState(false);
  const [loginList,setLoginList]=useState([]);
  const [lastEmail,setLastEmail]=useState('');
  const [lastUserId,setLastUserId]=useState('');
  const [googleEmail,setGoogleEmail]=useState('');

  
  const navigate = useNavigate();
  

  // Check for saved data when component mounts
  useEffect(() => {
    const savedData = localStorage.getItem("rememberedSignUpData");
    if (savedData) {
      setFormData(JSON.parse(savedData));
    }

  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };
  const handleOtpChange=(e)=>{
   setOtpNumber({otpNo:e.target.value});
  }
const handleLogOut = async () => {
  try {
    let Email = "";
    
    // Check remembered data
    const rememberData = localStorage.getItem("rememberedSignUpData");
    if (rememberData) {
      Email = JSON.parse(rememberData).email;
    }
    
    // Check lastEmail if no remembered data
    if (!Email) {
      const savedEmail = localStorage.getItem("lastEmail");
      if (savedEmail) Email = savedEmail;
    }
    
    // Check google email if still no email
    if (!Email) {
      const googleData = localStorage.getItem("googleEmail");
      if (googleData) {
        const parsed = JSON.parse(googleData);
        Email = parsed.email || parsed;
      }
    }

    if (!Email) {
      toast.error("No user email found for logout.");
      return;
    }
const response = await axios.get(`http://localhost:8000/web/api/login/login-view`);
    const userList = response.data.loginList || [];

    const matchingUsers = userList.filter(
      (user) => user.email.trim().toLowerCase() === Email.trim().toLowerCase()
    );

    if (matchingUsers.length === 0) {
      toast.error("User not found in database!");
      return;
    }

    await Promise.all(
      matchingUsers.map((user) =>
        axios.delete(`http://localhost:8000/web/api/login/login-delete/${user._id}`)
      )
    );

    // ✅ Clear data
    setIsLogined(false);
    localStorage.removeItem("rememberedSignUpData");
    localStorage.removeItem("isLogined");
    localStorage.removeItem("lastEmail");
    localStorage.removeItem("lastUserId");
    localStorage.removeItem('googleEmail');
    localStorage.removeItem('token');


    toast.success("Sign out successful!");
    navigate("/");
   
  } catch (error) {
    console.error("Logout error:", error);
    toast.error("Logout failed. Please try again.");
  }
};


// useEffect(()=>{
//    setIsLogined(false);
//     localStorage.removeItem("rememberedSignUpData");
//     localStorage.removeItem("isLogined");
//     localStorage.removeItem("lastEmail");
//     localStorage.removeItem("lastUserId");
//     localStorage.removeItem('googleEmail');
//     localStorage.removeItem('token');
// })
// const handleLogOut = async () => {
//   try {
//     const rememberData = localStorage.getItem("rememberedSignUpData");
//     const savedEmail = localStorage.getItem("lastEmail");
//     const googleData=localStorage.getItem("googleEmail");

//     const Email = rememberData
//       ? JSON.parse(rememberData).email
//       : savedEmail||googleData
//       ? JSON.parse(googleData).email:"";

//     if (!Email) {
//       toast.error("No user email found for logout.");
//       return;
//     }

//     const response = await axios.get(`http://localhost:8000/web/api/login/login-view`);
//     const userList = response.data.loginList || [];

//     const matchingUsers = userList.filter(
//       (user) => user.email.trim().toLowerCase() === Email.trim().toLowerCase()
//     );

//     if (matchingUsers.length === 0) {
//       toast.error("User not found in database!");
//       return;
//     }

//     await Promise.all(
//       matchingUsers.map((user) =>
//         axios.delete(`http://localhost:8000/web/api/login/login-delete/${user._id}`)
//       )
//     );

//     // ✅ Clear data
//     setIsLogined(false);
//     localStorage.removeItem("rememberedSignUpData");
//     localStorage.removeItem("isLogined");
//     localStorage.removeItem("lastEmail");
//     localStorage.removeItem("lastUserId");

//     toast.success("Sign out successful!");
//     navigate("/");
//   } catch (error) {
//     console.error("Logout error:", error);
//     toast.error("Logout failed. Please try again.");
//   }
// };


// 🔥 GOOGLE LOGIN LOGIC (IMPORTANT)
  const googleLogin = async (googleToken) => {
    try {
      const res = await axios.post("http://localhost:8000/web/api/login/google", {
        token: googleToken,
      });

      localStorage.setItem("token", res.data.token);
      console.log(res.data.user);
       
       localStorage.setItem("googleEmail", JSON.stringify(res.data.user));
  setIsLogined(true);
  localStorage.setItem("isLogined", true);
      

      toast.success("Logged in with Google");
    } catch (err) {
      toast.error("Google login failed");
      console.error(err);
    }
  };

  const handleReturnToShop = () => {
    navigate('/');
  }

  const SignUpFinish = async (e) => {
  e.preventDefault();
  if (formData.password.length < 6) {
    toast.error("Password must be at least 6 characters!");
    return;
  }
  if (!formData.email.endsWith("@gmail.com")) {
    toast.error("Incorrect email!");
    return;
  }

  try {
    const otpRes = await axios.get("http://localhost:8000/web/api/otp/otp-view");
    const data = otpRes.data.otpList;

    const matchedUser = data.find(
      (item) => item.email.trim().toLowerCase() === formData.email.trim().toLowerCase()
    );

    if (!matchedUser || String(otpNumber.otpNo).trim() !== String(matchedUser.otpGen).trim()) {
      toast.error("Incorrect OTP entered!");
      return;
    }

    const res = await axios.post("http://localhost:8000/web/api/login/login-insert", formData);
    const user = res.data.loginData;

    if (!user || !user._id) {
      toast.error("Invalid response from server!");
      return;
    }
    setIsLogined(true);
    localStorage.setItem("lastUserId", user._id);
    localStorage.setItem("isLogined", true);

    if (formData.rememberMe) {
      localStorage.setItem("rememberedSignUpData", JSON.stringify(user));
    } else {
      setFormData({ name: "", email: "", password: "", rememberMe: false });
      localStorage.removeItem("rememberedSignUpData");
    }

    setLastEmail(formData.email);
    localStorage.setItem("lastEmail", formData.email);
    toast.success("Sign up successful!");
    try {
      await axios.delete(`http://localhost:8000/web/api/otp/otp-delete/${matchedUser._id}`);
     
    } catch (deleteErr) {
      console.warn("Failed to delete OTP:", deleteErr);
    }

  } catch (error) {
    console.error("Sign up failed:", error);
    toast.error("Sign up failed. Please try again.");
  }
};


  const handleSubmit = (e) => {
    e.preventDefault();
 setFormVisible(true);
  const otpNo = Math.floor(1000 + Math.random() * 9000);
 setOtp({otpGen:otpNo});
   axios
      .post("http://localhost:8000/web/api/otp/otp-insert",{otpGen:otpNo,email:formData.email})
      .then((res) => {
       
      });

  };



return (
  <div className="fixed inset-0 flex flex-col justify-center items-center text-black bg-white/20 backdrop-blur-lg shadow-xl rounded-2xl p-4 sm:p-8 border-white/30 transition-transform duration-300 hover:scale-105 z-50">
    <ToastContainer />

    {!isLogined ? (
      <>
        {!formVisible ? (
          <div className="flex flex-col justify-between items-center w-full max-w-md sm:max-w-lg bg-white/30 rounded-2xl p-6 sm:p-10 shadow-lg">
            <form
              onSubmit={handleSubmit}
              className="space-y-5 w-full bg-white/80 backdrop-blur-sm p-6 sm:p-8 rounded-2xl"
            >
              <h2 className="text-2xl sm:text-3xl font-bold text-center mb-6">
                Sign Up
              </h2>

              {/* Name */}
              <div className="form-group">
                <label htmlFor="name" className="block mb-1 font-medium">
                  Name:
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 rounded-lg bg-white/20 ring-2 ring-purple-500 focus:outline-none focus:ring-purple-700"
                />
              </div>

              {/* Email */}
              <div className="form-group">
                <label htmlFor="email" className="block mb-1 font-medium">
                  Email:
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 rounded-lg bg-white/20 ring-2 ring-purple-500 focus:outline-none focus:ring-purple-700"
                />
              </div>

              {/* Password */}
              <div className="form-group">
                <label htmlFor="password" className="block mb-1 font-medium">
                  Password:
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 rounded-lg bg-white/20 ring-2 ring-purple-500 focus:outline-none focus:ring-purple-700"
                />
              </div>

              {/* Remember Me */}
              <div className="flex items-center text-sm">
                <input
                  type="checkbox"
                  id="rememberMe"
                  name="rememberMe"
                  checked={formData.rememberMe}
                  onChange={handleChange}
                  className="mr-2"
                />
                <label htmlFor="rememberMe">Remember Me</label>
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="w-full bg-purple-600 hover:bg-purple-700 transition-colors duration-300 text-white font-semibold py-2 rounded-lg shadow-lg"
              >
                Sign Up
              </button>
{/* Divider */}
              <div className="relative animate-slide-up" >
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="px-3 bg-white text-gray-500">Or continue with</span>
                </div>
              </div>

                         {/* Social Login Buttons */}
              <div className="w-full font-semibold py-2 rounded-lg">
                {/* Google Button */}
                <div className="">
                  <GoogleLogin
                    onSuccess={(res) => {
                      googleLogin(res.credential);
                     
                    }}
                    onError={() => toast.error("Google Login Failed")}

                  />
                </div>

              </div>
            </form>
       
          
          </div>
        ) : (
          <div className="fixed inset-0 flex items-center justify-center bg-white/20 backdrop-blur-md p-4 sm:p-6 z-50">
            <div className="w-full max-w-sm sm:max-w-md bg-white/80 backdrop-blur-md rounded-2xl p-6 sm:p-8 shadow-xl border border-white/30">
              <form onSubmit={SignUpFinish}>
                <h2 className="text-xl sm:text-2xl font-bold mb-4">
                  Enter OTP for Email Verification
                </h2>
                <p className="text-sm sm:text-base mb-3">
                  Hi {formData.email}, we’ve sent an OTP to your mailbox. Please
                  enter it below.
                </p>

                <input
                  type="number"
                  id="otpNo"
                  placeholder="Enter OTP"
                  name="otpNo"
                  value={otpNumber.otpNo}
                  onChange={handleOtpChange}
                  className="w-full border border-gray-300 p-2 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-green-600"
                />

                <button
                  type="submit"
                  className="w-full px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
                >
                  Confirm
                </button>
              </form>
            </div>
          </div>
        )}
      </>
    ) : (
      <div className="w-full max-w-sm sm:max-w-md text-center bg-gradient-to-r from-indigo-700 to-purple-700 p-8 sm:p-10 rounded-2xl text-white">
        <div className="mb-6">
          <svg
            className="w-16 h-16 mx-auto text-green-200"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <h4 className="text-lg sm:text-xl mb-4">
          You have already Signed Up!
        </h4>
        <div className="flex flex-col sm:flex-row justify-center gap-3">
          <button
            onClick={handleReturnToShop}
            className="bg-white text-indigo-700 px-6 py-2 rounded-lg hover:bg-indigo-100 transition"
          >
            Go to Shop
          </button>
          <button
            onClick={handleLogOut}
            className="bg-white text-indigo-700 px-6 py-2 rounded-lg hover:bg-indigo-100 transition"
          >
            Log out
          </button>
        </div>
      </div>
    )}
  </div>
);

}