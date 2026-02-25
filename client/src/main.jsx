import { createRoot } from "react-dom/client";
import "./index.css";

import "sweetalert2/src/sweetalert2.scss";

import SignUp from "./components/Signup";

import Contactme from "./components/Contact";

import Home from "./components/Home";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AddProducts from "./Admin/AdminPanel";
import AdminLoginForm from "./Admin/AdminLoginForm";
import AppRouter from "./App";
 import { GoogleOAuthProvider } from "@react-oauth/google";
import ScrollToHash from "./components/ScrollToTop";

 

createRoot(document.getElementById("root")).render(
  <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
  <BrowserRouter>
  <ScrollToHash/>
    <AppRouter/>
  </BrowserRouter>
</GoogleOAuthProvider>
);
