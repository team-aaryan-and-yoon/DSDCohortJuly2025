
import './App.css'
import Navbar from "./components/Navbar";
import OrderConfirmationPage from './components/order-confirmation-page';

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
      <OrderConfirmationPage />
    </div>
  );
}

export default App
