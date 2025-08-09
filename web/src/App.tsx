// import { useState } from "react";
import "./App.css";
import Navbar from "./components/Navbar";
import CustomerPortal from "./pages/CustomerPortal";
import ServiceDetailsPage from "./pages/ServiceDetails";
import SignUpPage from "./pages/SignUp";
import { SignInPage } from "./pages/SignIn";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import type { Link } from "./Types";
import HomePage from "./pages/HomePage";

import ProviderPortal from "./pages/ProviderProtal";

import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import AuthCallback from "./pages/AuthCallback";

import { CartProvider } from "./contexts/CartContext";
import OrderPage from "./pages/OrderPage";

import LandingPage from "./pages/LandingPage";



function App() {
  const links: Link[] = [
    { url: "/home", label: "Home" },
    { url: "/portal", label: "Portal" },
  ];
  return (
    <AuthProvider>
      <CartProvider>
        <BrowserRouter>
          <div className="flex w-full">
            <div className="flex w-full justify-start"><img src="/images/icon.png" alt="icon" height={100} width={100}/></div>
            <div className="flex w-full h-full justify-end pr-4">
              <Navbar links={links} isLogged={false} />
            </div>
          </div>

          <div className="w-full h-full pt-4">
            <Routes>
              <Route path="/" element={<HomePage/>} />
              <Route path="/services/:type" element={<ServiceDetailsPage />} />
              <Route path="/sign-up" element={<SignUpPage />} />
              <Route path="/sign-in" element={<SignInPage />} />
              <Route path="/auth/callback" element={<AuthCallback />} />
              <Route path="/customer-portal" element={
                <ProtectedRoute>
                  <CustomerPortal />
                </ProtectedRoute>
              } />
              <Route path="/provider-portal" element={<ProviderPortal />} />
              <Route path="orders" element={<OrderPage/>} />
            </Routes>
          </div>
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>

  );
}

export default App;
