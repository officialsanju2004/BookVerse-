// AdminApp.jsx
import React, { useState } from "react";


import AdminLogin from "./AdminLoginForm";
import AdminPanel from "./AdminPanel";


export default function AdminApp() {
  const [isAdmin, setIsAdmin] = useState(
    !!localStorage.getItem("token") // check if token already present
  );

  return (
    <>
   
      {isAdmin ?  <AdminPanel setIsAdmin={setIsAdmin}/>  : <AdminLogin setIsAdmin={setIsAdmin} />}
       
    </>
  );
}