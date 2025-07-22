import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Navbar from "./components/Navbar";
import { Rating } from "@smastrom/react-rating";
import "@smastrom/react-rating/style.css";

interface Link {
  url: string;
  label: string;
}

function App() {
  const links: Link[] = [
    { url: "/home", label: "Home" },
    { url: "/portal", label: "Portal" },
    { url: "/account", label: "Account Info" },
  ];
  return (
    <div>
      <Navbar links={links} isLogged={false} />
      <Rating style={{ maxWidth: 100, height: 20 }} value={3}  />
    </div>
  );
}

export default App
