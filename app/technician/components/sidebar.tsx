"use client";

import { JSX, useState } from "react";
import Link from "next/link";
import { FaUsers, FaClipboardList, FaSignOutAlt, FaChartBar } from "react-icons/fa";

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className={`h-screen ${isOpen ? "w-64" : "w-20"} bg-gray-900 text-white transition-all duration-300 flex flex-col`}>
      {/* Sidebar Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-700">
        <h2 className={`${isOpen ? "block" : "hidden"} text-xl font-bold`}>Lab Technician</h2>
        <button onClick={() => setIsOpen(!isOpen)} className="text-gray-300 hover:text-white focus:outline-none">
          {isOpen ? "✖" : "☰"}
        </button>
      </div>

      {/* Sidebar Items */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          <SidebarItem href="/lab/dashboard" icon={<FaUsers />} text="Dashboard" isOpen={isOpen} />
          <SidebarItem href="/lab/patients" icon={<FaUsers />} text="Patients" isOpen={isOpen} />
          <SidebarItem href="/lab/lab-test-requests" icon={<FaClipboardList />} text="Lab Test Requests" isOpen={isOpen} />
          <SidebarItem href="/lab/reports" icon={<FaChartBar />} text="Reports" isOpen={isOpen} /> {/* Reports Button */}
        </ul>
      </nav>

      {/* Logout Button */}
      <div className="p-4 border-t border-gray-700">
        <SidebarItem href="/logout" icon={<FaSignOutAlt />} text="Logout" isOpen={isOpen} />
      </div>
    </div>
  );
}

// Sidebar Item Component
interface SidebarItemProps {
  href: string;
  icon: JSX.Element;
  text: string;
  isOpen: boolean;
}

const SidebarItem = ({ href, icon, text, isOpen }: SidebarItemProps) => {
  return (
    <li>
      <Link href={href} className="flex items-center space-x-4 p-3 hover:bg-gray-700 rounded transition-all">
        {icon}
        {isOpen && <span className="text-gray-300 hover:text-white">{text}</span>}
      </Link>
    </li>
  );
};
