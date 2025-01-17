import Image from "next/image";

export default function Home() {
  return (
    <div className="flex h-screen">
      {/* Left Section */}
      <div className="flex flex-col justify-center items-center w-1/2 bg-gray-200 p-8">
        <h1 className="text-2xl font-bold text-gray-700 mb-6">
          EHOSPITAL MANAGEMENT SYSTEM
        </h1>
        <form className="w-full max-w-sm">
          <label className="block text-red-600 font-semibold mb-2">username</label>
          <input
            type="text"
            placeholder="Enter username"
            className="w-full mb-4 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <label className="block text-red-600 font-semibold mb-2">password</label>
          <input
            type="password"
            placeholder="Enter password"
            className="w-full mb-4 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
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
