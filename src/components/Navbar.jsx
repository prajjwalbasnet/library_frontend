import React, { useEffect } from "react";
import { Input } from "@/components/ui/input";
import { FaSearch } from "react-icons/fa";
import { FaChevronDown } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import { RxAvatar } from "react-icons/rx";

const Navbar = () => {
  const { user, loadUserFromToken } = useAuth();

  useEffect(() => {
    const loadUser = async () => {
      if (!user) {
        await loadUserFromToken();
      }
    };

    loadUser();
  }, []);

  return (
    <div className="flex h-[80px] items-center justify-between border-b border-gray-300 shadow-lg">
      <div className="flex items-center mr-5 ml-10">
        <Input
          className="relative w-90 h-10 bg-gray-200 px-8"
          placeholder="Search books here...."
        />
        <FaSearch className="absolute mx-2 text-lg text-gray-400 " />
      </div>

      <div className="flex mx-4 gap-3 items-center">
        <div className="flex h-12 w-12 rounded-full bg-gray-300 items-center justify-center">
          <RxAvatar className="text-4xl text-gray-600" />
        </div>
        <div className="flex items-center gap-2 cursor-pointer">
          <p className="text-gray-700 font-medium">{user && user.name}</p>
          <FaChevronDown className="text-xl text-gray-600 cursor-pointer" />
        </div>
      </div>
    </div>
  );
};

export default Navbar;
