import Image from "next/image";
export default function Navbar(){
    return(
        <header className="flex items-center justify-between bg-white px-4 py-3 shadow">
          <input
            type="text"
            placeholder="Search for anything here..."
            className="border px-4 py-2 rounded text-sm w-1/3"
          />
          <div className="flex items-center space-x-4">
            <p>Good Morning</p>
            <div className="flex items-center">
              <Image
                src="/profile-placeholder.png" // Replace with your image link
                alt="Profile"
                width={40}
                height={40}
                className="rounded-full"
              />
              <div className="ml-2 text-sm">
                {/* parse parameters from backend*/}
                <p className="font-bold">Dancan</p>
                <p className="text-gray-500">Admin</p>
              </div>
            </div>
          </div>
        </header>
    )
}