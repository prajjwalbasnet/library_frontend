// src/components/Layout.jsx
import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar"; // Adjust import path based on your folder structure
import Navbar from "./Navbar"; // Adjust import path based on your folder structure
import { FaBars, FaTimes } from "react-icons/fa";

const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Close sidebar when screen is resized to larger than mobile
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        // On larger screens, we'll show the sidebar by default
        setSidebarOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Close sidebar when clicking outside on mobile
  useEffect(() => {
    const handleClickOutside = (event) => {
      const sidebar = document.getElementById("sidebar");
      const menuButton = document.getElementById("menu-button");

      if (
        sidebarOpen &&
        sidebar &&
        !sidebar.contains(event.target) &&
        menuButton &&
        !menuButton.contains(event.target)
      ) {
        setSidebarOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [sidebarOpen]);

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      {/* Sidebar - Hidden on mobile by default */}
      <div
        id="sidebar"
        className={`fixed md:relative z-30 transition-all duration-300 ease-in-out ${
          sidebarOpen ? "left-0" : "-left-full md:left-0"
        }`}
      >
        <Sidebar onCloseMobile={() => setSidebarOpen(false)} />
      </div>

      {/* Dark overlay when sidebar is open on mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main content area */}
      <div className="flex flex-col flex-grow w-full md:w-[calc(100%-240px)] overflow-hidden">
        {/* Navbar with menu button for mobile */}
        <div className="flex items-center h-[100px]">
          <button
            id="menu-button"
            className="absolute top-8 left-4 md:hidden z-40 text-gray-600 focus:outline-none"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? (
              <FaTimes className="hidden text-2xl" />
            ) : (
              <FaBars className="text-2xl" />
            )}
          </button>
          <div className="w-full">
            <Navbar />
          </div>
        </div>

        {/* Page content */}
        <main className="flex-grow overflow-auto p-4">{children}</main>
      </div>
    </div>
  );
};

export default Layout;
