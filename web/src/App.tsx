// import { useState } from "react";
import "./App.css";

import CustomerPortal from "./pages/CustomerPortal";
import ServiceDetailsPage from "./pages/ServiceDetails";
import SignUpPage from "./pages/SignUp";
import { SignInPage } from "./pages/SignIn";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import type { Link } from "./Types";
import HomePage from "./pages/HomePage";

import ProviderPortal from "./pages/ProviderPortal";

import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import AuthCallback from "./pages/AuthCallback";
import LandingPage from "./pages/LandingPage";
import NavbarPages from "./components/NavbarPages";
import NavbarAuth from "./components/NavbarAuth";
import { CartProvider } from "./contexts/CartContext";
import OrderPage from "./pages/OrderPage";

function App() {
  const links: Link[] = [
    { url: "/home", label: "Home" },
    { url: "/portal", label: "Portal" },
  ];
  return (
    <AuthProvider>
      <CartProvider>
        <BrowserRouter>
          {/* Header */}
          <div className="sticky top-0 z-50 flex bg-white/90 backdrop-blur-md shadow-sm">
            <div className="flex w-2/12 h-full justify-end items-center gap-2 px-4 py-2 ">
              <img
                src="/images/icon_no_text.png"
                alt="icon"
                height={50}
                width={50}
              />
              <span className="text-xl text-center font-bold text-gray-900">
                HandsOff
              </span>
            </div>

            <div className="flex w-full h-full justify-center">
              <NavbarPages links={links} />
            </div>
            <div className="flex w-2/12 justify-center">
              <NavbarAuth />
            </div>
          </div>

          {/* Body */}
          <div className="w-full h-full ">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route
                path="/services"
                element={<Navigate to="/services/cleaning" replace />}
              />
              <Route path="/services/:type" element={<ServiceDetailsPage />} />
              <Route path="/sign-up" element={<SignUpPage />} />
              <Route path="/sign-in" element={<SignInPage />} />
              <Route path="/auth/callback" element={<AuthCallback />} />
              <Route
                path="/customer-portal"
                element={
                  <ProtectedRoute>
                    <CustomerPortal />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/provider-portal"
                element={
                  <ProtectedRoute>
                    <ProviderPortal />
                  </ProtectedRoute>
                }
              />
              <Route path="/landing" element={<LandingPage />} />
              <Route path="/orders" element={<OrderPage />} />
            </Routes>
          </div>
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
