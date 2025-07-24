import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Navbar from "./components/Navbar";
import DatePicker from "./components/DateTimePicker";
import * as React from "react";

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

  const [selectedTimestamp, setSelectedTimestamp] = React.useState<
    number | undefined
  >(undefined);
  const occupiedTimestamps = Array.from({ length: 37 }, (_, i) => {
    const date = new Date(2025, 6, 25, 9, i * 15);
    return date.getTime();
  });
  return (
    <div className="flex">
      <DatePicker
        selectedTimestamp={selectedTimestamp}
        setSelectedTimestamp={setSelectedTimestamp}
        occupiedTimestamps={occupiedTimestamps}
      />
    </div>
  );
}

export default App
