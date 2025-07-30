// import { useState } from "react";
import "./App.css";
import Navbar from "./components/Navbar";

import ServiceDetailsPage from "./pages/ServiceDetails";
import SignUpPage from "./pages/SignUp";
import {
  BrowserRouter,
  Routes,
  Route,
 
} from "react-router-dom";
import type { Link } from "./Types";


function App() {
  const links: Link[] = [
    { url: "/home", label: "Home" },
    { url: "/portal", label: "Portal" },
    { url: "/account", label: "Account Info" },
  ];


  return (
    <BrowserRouter>
      <div className="flex w-full justify-end pr-4">
        <Navbar links={links} isLogged />
      </div>
      <div className="w-full h-full p-4">
      <Routes>
        <Route path="/services" element={<ServiceDetailsPage />} />
        <Route path="/sign-up" element={<SignUpPage />} />
      </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
