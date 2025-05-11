import React, { useState, useEffect } from "react";
import logo from "../assets/image.png";
import { MdSpaceDashboard } from "react-icons/md";
import { IoBookSharp } from "react-icons/io5";
import { AiFillBook } from "react-icons/ai";
import { FaUsers } from "react-icons/fa";
import { RiAdminFill } from "react-icons/ri";
import { Button } from "@/components/ui/button";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";
import { RiBookShelfLine } from "react-icons/ri";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { MdAdminPanelSettings } from "react-icons/md";
import { RxAvatar } from "react-icons/rx";
import { FaTimes } from "react-icons/fa";

const SidebarItem = ({ icon: Icon, label, to, active, onClick }) => {
  if (onClick) {
    return (
      <div
        onClick={onClick}
        className={`flex flex-row items-center gap-2 hover:bg-gray-100 p-2 rounded-md cursor-pointer ${
          active ? "bg-gray-100" : ""
        }`}
      >
        <div
          className={`relative rounded-sm flex items-center justify-center w-8 h-8 ${
            active ? "bg-blue-900" : "bg-gray-300"
          }`}
        >
          <Icon
            className={`text-xl absolute ${
              active ? "text-white" : "text-gray-600"
            }`}
          />
        </div>
        <p
          className={`text-gray-600 text-md ${
            active ? "font-bold" : "font-normal"
          }`}
        >
          {label}
        </p>
      </div>
    );
  } else {
    return (
      <NavLink
        to={to}
        className={({ isActive }) =>
          `flex flex-row items-center gap-2 hover:bg-gray-100 p-2 rounded-md ${
            isActive ? "bg-gray-100" : ""
          }`
        }
      >
        <div
          className={`relative rounded-sm flex items-center justify-center w-8 h-8 ${
            active ? "bg-blue-900" : "bg-gray-300"
          }`}
        >
          <Icon
            className={`text-xl absolute ${
              active ? "text-white" : "text-gray-600"
            }`}
          />
        </div>
        <p
          className={`text-gray-600 text-md ${
            active ? "font-bold" : "font-normal"
          }`}
        >
          {label}
        </p>
      </NavLink>
    );
  }
};

const Sidebar = ({ onCloseMobile }) => {
  const { logout, isAdmin, isUser } = useAuth();
  const navigate = useNavigate();

  const location = useLocation();
  const [activeItem, setActiveItem] = useState("/");

  const [isAddAdminOpen, setIsAddAdminOpen] = useState(false);
  const [addAdminForm, setAddAdminForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleAdminFormChange = (e) => {
    e.preventDefault();

    const [name, value] = e.target;

    setAddAdminForm(() => ({
      ...prev,
      name: value,
    }));
  };

  useEffect(() => {
    setActiveItem(location.pathname);
  }, [location]);

  const navItems = [
    { path: "/", label: "Dashboard", icon: MdSpaceDashboard },
    { path: "/books", label: "Books", icon: IoBookSharp },
  ];

  if (isAdmin) {
    navItems.push(
      { path: "/catalog", label: "Catalog", icon: AiFillBook },
      { path: "/users", label: "Users", icon: FaUsers }
    );
  }

  if (isUser) {
    navItems.push({
      path: "/myBorrowedBooks",
      label: "My Borrowed Books",
      icon: RiBookShelfLine,
    });
  }

  const logoutUser = async () => {
    logout();
    toast.success("Logged out successfully.");
    setTimeout(() => {
      navigate("/login");
    }, 1000);
  };

  // Close sidebar on mobile when navigating to a new page
  const handleNavLinkClick = () => {
    if (window.innerWidth < 768 && onCloseMobile) {
      onCloseMobile();
    }
  };

  return (
    <div className="flex flex-col h-screen w-[240px] border-r border-gray-200 shadow-xl bg-white">
      {/* Close button for mobile - only visible on smaller screens */}
      <button
        className="md:hidden absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        onClick={onCloseMobile}
      >
        <FaTimes className="text-xl" />
      </button>

      <div className="flex items-center justify-center py-6">
        <img className="max-w-[110px]" src={logo} alt="CIHE Library" />
      </div>

      <div className="flex flex-col px-3 gap-2 mt-4">
        {navItems.map((item) => (
          <div key={item.path} onClick={handleNavLinkClick}>
            <SidebarItem
              to={item.path}
              icon={item.icon}
              label={item.label}
              active={activeItem === item.path}
            />
          </div>
        ))}

        {isAdmin && (
          <Dialog open={isAddAdminOpen} onOpenChange={setIsAddAdminOpen}>
            <DialogTrigger asChild>
              <div>
                <SidebarItem
                  icon={RiAdminFill}
                  label="Add New Admin"
                  active={activeItem === "/add-admin"}
                  onClick={() => setIsAddAdminOpen(true)}
                />
              </div>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>
                  <div className="flex items-center gap-4 ">
                    <div className="flex relative  bg-gray-300 h-8 w-8 rounded-lg items-center justify-center">
                      <MdAdminPanelSettings className="absolute text-xl text-blue-800" />
                    </div>
                    <p>Add New Admin</p>
                  </div>
                  <hr className="mt-3" />
                </DialogTitle>
                <DialogDescription>Add new admin</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="flex flex-col gap-5">
                  <div className="flex items-center justify-center w-full">
                    <div className="flex relative h-20 w-20 bg-gray-300 items-center justify-center rounded-full">
                      <RxAvatar className="text-6xl text-gray-600" />
                    </div>
                  </div>

                  <div className="flex flex-col gap-3">
                    <Input className="w-full" placeholder="Enter Admin Name" />
                    <Input className="w-full" placeholder="Enter Admin email" />
                    <Input
                      className="w-full"
                      placeholder="Enter Admin Password"
                    />
                  </div>
                </div>
              </div>
              <DialogFooter className="flex items-center gap-3">
                <Button
                  onClick={() => setIsAddAdminOpen(false)}
                  className="w-[100px] text-gray-600 bg-gray-300 hover:bg-gray-200 cursor-pointer"
                  type="submit"
                >
                  Close
                </Button>
                <Button
                  className="w-[100px] text-white bg-blue-800 hover:bg-blue-700 cursor-pointer"
                  type="submit"
                >
                  Add
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>

      <div className="mt-auto p-4">
        <Button
          className="bg-blue-900 hover:bg-blue-800 w-full text-white cursor-pointer"
          onClick={logoutUser}
        >
          Logout
        </Button>
      </div>
    </div>
  );
};

export default Sidebar;
