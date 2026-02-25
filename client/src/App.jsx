import { useState } from "react";


import "./App.css";

import { createRoot } from "react-dom/client";
import "./index.css";

import "sweetalert2/src/sweetalert2.scss";

import SignUp from "./components/Signup";
import App from "./components/Home";
import Contactme from "./components/Contact";

import Home from "./components/Home";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import AdminApp from "./Admin/AdminApp";


export default function AppRouter() {
  return (
   
      <Routes>
        <Route path="/*" element={<Home />} />
        <Route path="/admin/*" element={<AdminApp/>} />
      
      </Routes>
    

  );
}


