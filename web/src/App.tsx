import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Navbar from "./components/Navbar";
import DatePicker from "./components/Datepicker";
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
  const [date, setDate] = React.useState<Date | undefined>(new Date());
  const occupied: Date[] = [];
  return (
    <div>
      <DatePicker
        selectedDate={date}
        setSelectedDate={setDate}
        occupiedDates={occupied}
      />
    </div>
  );
}

export default App
