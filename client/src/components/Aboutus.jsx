import React from "react";
import { Navigate, useNavigate } from "react-router-dom";

const Aboutus= () => {
   const navigate=useNavigate();
  const  goToContact=()=>{
    navigate('/contactus');
  }
  return (
    <div id="about" className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">About <span className="text-blue-600">Sanju</span></h1>
          <p className="text-lg text-gray-600">MERN Stack Developer | Passionate Coder | Continuous Learner</p>
        </div>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="md:flex">
            <div className="md:w-1/3 bg-blue-50 p-8 flex items-center justify-center">
              <div className="text-center">
                <div className="w-32 h-32 rounded-full bg-blue-100 mx-auto mb-4 flex items-center justify-center">
                  <svg className="w-20 h-20 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-800">Sanju</h3>
                <p className="text-blue-600">Web Developer</p>
                <p className="text-sm text-gray-500 mt-2">Age: 20</p>
              </div>
            </div>
            
            <div className="md:w-2/3 p-8">
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Education</h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-gray-700">Bachelor of Computer Applications (BCA)</h3>
                    <p className="text-gray-600">Khalsa College - Final Year (3rd Year)</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-700">12th Standard</h3>
                    <p className="text-gray-600">Bibi Kaulan Ji Senior Secondary Public School, Branch 2 - 90%</p>
                  </div>
                </div>
              </div>

              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Technical Skills</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-semibold text-gray-700 mb-2">Frontend</h3>
                    <ul className="space-y-1 text-gray-600">
                      <li className="flex items-center">
                        <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                        React.js
                      </li>
                      <li className="flex items-center">
                        <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                        Tailwind CSS
                      </li>
                      <li className="flex items-center">
                        <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                        Bootstrap
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-700 mb-2">Backend</h3>
                    <ul className="space-y-1 text-gray-600">
                      <li className="flex items-center">
                        <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                        Node.js
                      </li>
                      <li className="flex items-center">
                        <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                        Express.js
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-700 mb-2">Databases</h3>
                    <ul className="space-y-1 text-gray-600">
                      <li className="flex items-center">
                        <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                        MongoDB
                      </li>
                      <li className="flex items-center">
                        <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                        SQL
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-700 mb-2">Programming</h3>
                    <ul className="space-y-1 text-gray-600">
                      <li className="flex items-center">
                        <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                        C
                      </li>
                      <li className="flex items-center">
                        <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                        C++
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Certifications</h2>
                <div className="bg-blue-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-700">C & C++ Programming</h3>
                  <p className="text-gray-600">HiFi Tech (2024)</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <p className="text-gray-600">
            "I love coding and learning new things. Passionate about creating efficient, scalable web applications with modern technologies."
          </p>
          <div className="mt-6">
            <button onClick={goToContact} className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
              Contact Me
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Aboutus;