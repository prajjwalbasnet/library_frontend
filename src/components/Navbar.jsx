import React, { useEffect } from "react";
import { Input } from "@/components/ui/input";
import { FaSearch } from "react-icons/fa";
import { FaChevronDown } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import { GoBell } from "react-icons/go";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

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
    <div className="flex h-[100px] items-center justify-end border-b border-gray-300 shadow-lg">
      <div className="bg-[#E78B48] rounded-full p-1 hover:bg-yellow-500 cursor-pointer">
        <GoBell className="text-[#FDFAF6]" />
      </div>
      <div className="flex mx-4 gap-3 items-center mr-7">
        <div className="flex items-center gap-2 cursor-pointer">
          <p className="text-gray-700 text-lg font-semibold">
            {user && user.name}
          </p>
          <FaChevronDown className="text-gray-600 cursor-pointer" />
        </div>
        <div>
          <Avatar className="h-16 w-16 bg-gray-400">
            {/* <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" /> */}
            <AvatarFallback className="font-medium text-[#547792] text-3xl">
              {user?.name
                ? (() => {
                    const nameParts = user.name.trim().split(/\s+/);
                    const firstInitial = nameParts[0]?.[0] || "";
                    const lastInitial =
                      nameParts.length > 1
                        ? nameParts[nameParts.length - 1][0]
                        : "";
                    return (firstInitial + lastInitial).toUpperCase();
                  })()
                : ""}
            </AvatarFallback>
          </Avatar>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
