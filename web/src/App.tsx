// import { useState } from "react";
import "./App.css";
import Navbar from "./components/Navbar";
import ServiceOrderCard from "./components/ServiceOrderCard";
import type { ServiceOrder } from "./components/ServiceOrderCard";

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

  // Service order card dummy data
  const dummyOrder: ServiceOrder = {
    orderType: "Handyman",
    orderStatus: "Scheduled",
    serviceDate: "7/24/2025",
    serviceTime: "10:00 am",
    providerName: "Jane Smith",
  };
  const dummyOrder2: ServiceOrder = {
    orderType: "Cleaning",
    orderStatus: "On the way",
    serviceDate: "7/23/2025",
    serviceTime: "6:00 pm",
    providerName: "John Doe",
  };
  const dummyOrder3: ServiceOrder = {
    orderType: "Handyman",
    orderStatus: "Working",
    serviceDate: "7/26/2025",
    serviceTime: "1:00 pm",
    providerName: "Bob Brown",
  };
  const dummyOrder4: ServiceOrder = {
    orderType: "Cleaning",
    orderStatus: "Completed",
    serviceDate: "7/25/2025",
    serviceTime: "2:00 pm",
    providerName: "Alice Johnson",
  };

  return (
    <div>
      <Navbar links={links} isLogged={false} />
      <ServiceOrderCard order={dummyOrder} />
      <ServiceOrderCard order={dummyOrder2} />
      <ServiceOrderCard order={dummyOrder3} />
      <ServiceOrderCard order={dummyOrder4} />
    </div>
  );
}

export default App;
