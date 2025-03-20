"use client";

import { JSX, useState } from "react";
import Link from "next/link";
import {
  FaUserMd,
  FaUsers,
  FaClipboardList,
  FaFileInvoiceDollar,
  FaComments,
  FaChartBar,
  FaCog,
  FaSignOutAlt,
  FaFlask, // Lab Test Icon
  FaFileMedical // View Uploaded Lab Tests Icon
} from "react-icons/fa";

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className={`h-screen ${isOpen ? "w-64" : "w-20"} bg-blue-900 text-white transition-all duration-300 flex flex-col`}>
      {/* Sidebar Header */}
      <div className="flex items-center justify-between p-4 border-b border-blue-700">
        <h2 className={`${isOpen ? "block" : "hidden"} text-xl font-bold`}>Clinical Officer Panel</h2>
        <button onClick={() => setIsOpen(!isOpen)} className="text-white focus:outline-none">
          {isOpen ? "✖" : "☰"}
        </button>
      </div>

      {/* Sidebar Items */}
      <nav className="flex-1 p-4">
        <ul className="space-y-4">
          <SidebarItem href="/doctor/dashboard" icon={<FaUserMd />} text="Dashboard" isOpen={isOpen} />
          <SidebarItem href="/doctor/patients" icon={<FaUsers />} text="Patients" isOpen={isOpen} />
          <SidebarItem href="/doctor/prescriptions" icon={<FaClipboardList />} text="Prescriptions" isOpen={isOpen} />
          <SidebarItem href="/doctor/billing" icon={<FaFileInvoiceDollar />} text="Billing" isOpen={isOpen} />
          <SidebarItem href="/doctor/messages" icon={<FaComments />} text="Messages" isOpen={isOpen} />
          <SidebarItem href="/doctor/reports" icon={<FaChartBar />} text="Reports" isOpen={isOpen} />
          <SidebarItem href="/doctor/request-labtest" icon={<FaFlask />} text="Request Lab Test" isOpen={isOpen} />
          <SidebarItem href="/doctor/settings" icon={<FaCog />} text="Settings" isOpen={isOpen} />
        </ul>
      </nav>

      {/* Logout Button */}
      <div className="p-4 border-t border-blue-700">
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
      <Link href={href} className="flex items-center space-x-4 p-2 hover:bg-blue-700 rounded">
        {icon}
        {isOpen && <span>{text}</span>}
      </Link>
    </li>
  );
};
