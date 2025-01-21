import React from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

const Layout = ({ children }) => {
  return (
    <>
      <Navbar />
      <div className="flex h-[90vh]">
        <Sidebar />
        <div className="flex-1 p-4">{children}</div>
       
      </div>
    </>
  );
};

export default Layout;
