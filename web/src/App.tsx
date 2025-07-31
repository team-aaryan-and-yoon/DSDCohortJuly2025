
import './App.css'
import Navbar from "./components/Navbar";
import OrderPage from "./components/order-page";

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

  // const [selectedTimestamp, setSelectedTimestamp] = React.useState<
  //   number | undefined
  // >(undefined);
  // const occupiedTimestamps = Array.from({ length: 37 }, (_, i) => {
  //   const date = new Date(2025, 6, 25, 9, i * 15);
  //   return date.getTime();
  // });
  return (
    <div className="flex">
      <Navbar links={links} isLogged={false} />
      {/* <OrderConfirmationPage /> */}
      <OrderPage />
       </div>
  );
}

export default App;
