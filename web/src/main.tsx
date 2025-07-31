import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import Navbar from "./components/Navbar.tsx";
import '@smastrom/react-rating/style.css'
interface Link {
  url: string;
  label: string;
}
const links: Link[] = [
  { url: "/home", label: "Home" },
  { url: "/portal", label: "Portal" },
  { url: "/account", label: "Account Info" },
];
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
