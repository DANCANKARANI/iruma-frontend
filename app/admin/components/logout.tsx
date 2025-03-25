"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { deleteCookie } from "cookies-next";

export default function Logout() {
  const router = useRouter();

  useEffect(() => {
    // Clear authentication cookies or tokens
    deleteCookie("Authorization");
    deleteCookie("token");
    
    // Clear any user data from localStorage if needed
    localStorage.removeItem("user");
    
    // Redirect to login page
    router.push("/");
  }, [router]);

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
        <p className="mt-4 text-lg">Logging out...</p>
      </div>
    </div>
  );
}