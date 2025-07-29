// import { useState } from "react";
import "./App.css";
import Navbar from "./components/Navbar";
import ServiceDetailsPage from "./pages/ServiceDetails";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  BrowserRouter,
} from "react-router-dom";
interface Link {
  url: string;
  label: string;
}

function App() {
  const [rating, setRating] = useState(3);
  const links: Link[] = [
    { url: "/home", label: "Home" },
    { url: "/portal", label: "Portal" },
    { url: "/account", label: "Account Info" },
  ];

  return (
    <BrowserRouter>
      <div className="flex w-full justify-end">
        <Navbar links={links} isLogged />
      </div>
      <Routes>
        <Route path="/services" element={<ServiceDetailsPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
