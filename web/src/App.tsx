// import { useState } from "react";
import "./App.css";
import Navbar from "./components/Navbar";
import CustomerPortal from "./pages/CustomerPortal";
import ServiceDetailsPage from "./pages/ServiceDetails";
import SignUpPage from "./pages/SignUp";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import type { Link, serviceType } from "./Types";
import HomePage from "./pages/HomePage";


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
      <div className="w-full h-full pt-4">
        <Routes>
          <Route path="/" element={<HomePage/>} />
          <Route path="/services" element={<ServiceDetailsPage />} />
          <Route path="/sign-up" element={<SignUpPage />} />
          <Route path="/customer-portal" element={<CustomerPortal />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
