"use client";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode"; // Import the jwt-decode library

// Define a custom JWT payload type
interface CustomJwtPayload {
  role: string; // Add the 'role' field
  full_name: string;
  [key: string]: any; // Allow other fields
}

export default function Home() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();

    try {
      // Access the API endpoint from the environment variable
      const apiEndpoint = process.env.NEXT_PUBLIC_API_ENDPOINT;
      console.log(apiEndpoint);

      // Send a POST request to the backend
      const response = await fetch(`${apiEndpoint}/admin/doctor/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
        credentials: "include", // Include cookies in the request
      });

      // Parse the response
      const data = await response.json();

      if (response.ok) {
        // Extract the token from the response
        const token = data.data.token;

        // Store the token in a cookie
        document.cookie = `Authorization=${token}; path=/; Secure; SameSite=Strict`;

        // Decode the token using the custom type
        const decodedToken = jwtDecode<CustomJwtPayload>(token);
        const userRole = decodedToken.role; // Access the 'role' field
        const fullName = decodedToken.full_name;
        console.log(fullName);

        // Redirect the user based on their role
        if (userRole === "doctor") {
          router.push("/doctor");
        } else if (userRole === "admin") {
          router.push("/admin");
        } else if (userRole === "reception") {
          router.push("/reception");
        } else if (userRole === "pharmacist") {
          router.push("/pharmacy");
        }else if (userRole === "technician") {
            router.push("/technician");
        } else {
          // Default fallback for unknown roles
          router.push("/dashboard");
        }
      } else {
        // Login failed: Show an error message
        setError(data.message || "Invalid username or password");
      }
    } catch (err) {
      console.error("Error during login:", err);
      setError("An error occurred. Please try again.");
    }
  };

  return (
    <div className="flex h-screen">
      {/* Left Section */}
      <div className="flex flex-col justify-center items-center w-1/2 bg-gray-200 p-8">
        <h1 className="text-2xl font-bold text-gray-700 mb-6">
          DISPENSARY MANAGEMENT SYSTEM
        </h1>
        <form onSubmit={handleSubmit} className="w-full max-w-sm">
          <label className="block text-red-600 font-semibold mb-2">Username</label>
          <input
            type="text"
            placeholder="Enter username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full mb-4 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <label className="block text-red-600 font-semibold mb-2">Password</label>
          <input
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full mb-4 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {error && <p className="text-red-500 mb-4">{error}</p>}
          <button
            type="submit"
            className="w-full bg-gray-300 text-gray-800 font-bold py-2 rounded hover:bg-gray-400 transition"
          >
            LOGIN
          </button>
        </form>
      </div>

      {/* Right Section */}
      <div className="flex justify-center items-center w-1/2 bg-blue-50">
        <Image
          src="https://firebasestorage.googleapis.com/v0/b/chat-f427d.appspot.com/o/logo.png?alt=media&token=612c39fa-68a8-4e31-b5dd-e2392fb024bf" // Replace with your image URL
          alt="Logo"
          width={200}
          height={200}
        />
      </div>
    </div>
  );
}