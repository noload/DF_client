import React from "react";
import { Link, useLocation } from "react-router-dom";
import { FaAngleRight } from "react-icons/fa";

const Sidebar = () => {
  const location = useLocation();

  const menuItems = [
    {
      path: "/home",
      label: "Home",
      icon: "https://www.figma.com/file/c10JKVfIx31dqgTvPohneq/image/572bd84a693d97155dcaaf3c78d15fac981c7b80",
    },
    {
      path: "/state",
      label: "State",
      icon: "https://www.figma.com/file/c10JKVfIx31dqgTvPohneq/image/4c1492ea70d2d60430d0da391b821845a63b4562",
    },
    {
      path: "/city",
      label: "City",
      icon: "https://www.figma.com/file/c10JKVfIx31dqgTvPohneq/image/b83ca030b79f23376eb70bb5879634cbf6e7c89d",
    },
    {
      path: "/warehouse",
      label: "Warehouse",
      icon: "https://www.figma.com/file/c10JKVfIx31dqgTvPohneq/image/c0007c2b33c71569db418f9bf0423e0120209ee9",
    },
  ];

  return (
    <div className="bg-white shadow-lg w-[15vw] h-screen pt-8">
      <ul className="flex flex-col gap-6 pl-6">
        {menuItems.map((item) => (
          <li
            key={item.path}
            className={`flex justify-between items-center px-4 py-3 rounded-lg transition-all duration-200 ${
              location.pathname === item.path
                ? "bg-blue-100 text-blue-600 font-semibold shadow-sm"
                : "hover:bg-gray-100 text-gray-700"
            }`}
          >
            <div className="flex items-center">
              <img
                src={item.icon}
                width="24"
                height="24"
                alt={`${item.label} Icon`}
                className="rounded-full"
              />
              <Link
                to={item.path}
                className="ml-3 text-lg font-medium"
              >
                {item.label}
              </Link>
            </div>
            <FaAngleRight
              className={`text-lg ${
                location.pathname === item.path ? "text-blue-500" : "text-gray-400"
              }`}
            />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
