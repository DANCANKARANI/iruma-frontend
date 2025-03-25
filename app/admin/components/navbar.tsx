"use client"; // Ensure this is a Client Component
import { useEffect, useState } from "react";
import { FaUserCircle } from "react-icons/fa"; // Import the profile icon

// Define the props interface
interface NavbarProps {
  name: string; // The user's name passed as a prop
}

export default function Navbar({ name }: NavbarProps) {
  const [greeting, setGreeting] = useState(""); // State to store the greeting

  // Function to determine the greeting based on the current time
  const getGreeting = () => {
    const currentHour = new Date().getHours();

    if (currentHour >= 5 && currentHour < 12) {
      return "Good Morning";
    } else if (currentHour >= 12 && currentHour < 18) {
      return "Good Afternoon";
    } else {
      return "Good Evening";
    }
  };

  // Set the greeting when the component mounts
  useEffect(() => {
    setGreeting(getGreeting());
  }, []);

  return (
    <header className="sticky top-0 z-50 flex items-center justify-between bg-white px-4 py-3 shadow">
      {/* Left side can be used for other elements if needed */}
      <div></div>
      
      {/* Right-aligned greeting and user profile */}
      <div className="flex items-center space-x-4">
        <div className="flex items-center">
          <p className="mr-4">
            {greeting}, {name} {/* Display the greeting and user's name */}
          </p>
          <FaUserCircle className="text-3xl text-gray-500" />
        </div>
      </div>
    </header>
  );
}