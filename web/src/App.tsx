import "./App.css";
import CustomerPortal from "./pages/CustomerPortal";
import ServiceDetailsPage from "./pages/ServiceDetails";
import SignUpPage from "./pages/SignUp";
import { SignInPage } from "./pages/SignIn";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import type { Link } from "./Types";
import HomePage from "./pages/HomePage";
import SelectedOrderPage from "./pages/SelectedOrderPage";
import OrderConfirmationPage from "./pages/OrderConfirmationPage";

import ProviderPortal from "./pages/ProviderPortal";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import AuthCallback from "./pages/AuthCallback";
import StripeSuccessPage from "./pages/StripeSuccessPage";
import StripeCancelPage from "./pages/StripeCancelPage";
import NavbarPages from "./components/NavbarPages";
import NavbarAuth from "./components/NavbarAuth";
import { CartProvider } from "./contexts/CartContext";

function App() {
  const links: Link[] = [
    { url: "/home", label: "Home" },
    { url: "/portal", label: "Portal" },
  ];
  return (
    <AuthProvider>
      <CartProvider>
        <BrowserRouter>
          <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md shadow-sm">
            <div className="mx-auto max-w-7xl px-3 sm:px-4">
              <div className="flex items-center gap-3 min-h-16">
                {/* Left: Logo + brand */}
                <div className="flex items-center gap-2 shrink-0 overflow-visible">
                  <img
                    src="/images/icon_no_text.png"
                    alt="HandsOff"
                    className="h-10 sm:h-12 w-auto object-contain"
                  />
                  <span className="text-lg sm:text-xl font-bold text-gray-900">HandsOff</span>
                </div>

                {/* Center: Nav */}
                <nav className="flex-1 flex justify-center">
                  <NavbarPages links={links} />
                </nav>

                {/* Right: Auth */}
                <div className="shrink-0">
                  <NavbarAuth />
                </div>
              </div>
            </div>
          </header>

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
              <Route path="/landing" element={<HomePage />} />
              <Route path="/book-service" element={<SelectedOrderPage />} />
              <Route path="/order-confirmation" element={<OrderConfirmationPage />} />
              <Route path="/checkout/success" element={<StripeSuccessPage />} />
              <Route path="/checkout/cancel" element={<StripeCancelPage />} />
            </Routes>
          </div>
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
