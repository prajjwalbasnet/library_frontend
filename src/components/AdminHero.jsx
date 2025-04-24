import React, { useEffect } from "react";
import { PiUsersThreeLight } from "react-icons/pi";
import { useAuth } from "../context/AuthContext";
import { Separator } from "@/components/ui/separator";
import { PiBooksLight } from "react-icons/pi";
import { Button } from "@/components/ui/button";
import bg from "../assets/bg.png";
import { useNavigate } from "react-router-dom";

const AdminHero = () => {
  const { getAllUsers, userList, isAdmin, isUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    getAllUsers();
  }, []);
  return (
    <div className="w-full m-2">
      {isUser && (
        <div className="relative w-full h-[600px] mb-7">
          {/* Background Image with Overlay */}
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url(${bg})`,
            }}
          />
          <div className="relative z-10 flex flex-col px-4 py-6">
            <h1 className="text-blue-800 font-semibold text-4xl">
              Discover Worlds Within Pages
            </h1>
            <p className="text-xl text-gray-600 w-[50%] sm:w-[40%] my-4 text-center justify-center">
              Your journey of knowledge and imagination begins here, where every
              book opens a door to new possibilities.
            </p>
            <Button
              className="bg-blue-700 hover:bg-blue-800 text-white px-6 py-2 text-lg rounded-md transition-all duration-300 font-medium flex items-center justify-center cursor-pointer w-40 ml-10 mt-3"
              onClick={() => navigate("/books")}
            >
              Explore Books
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 ml-2"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </Button>
          </div>
        </div>
      )}
      <div className="flex flex-row gap-4 ">
        <div className="flex flex-row items-center p-6 m-2 border border-gray-100 shadow-lg rounded-2xl hover:bg-">
          <div className="flex flex-row gap-3 w-[260px]">
            <div className="p-3 bg-[#cbdbfb] rounded-full">
              <PiUsersThreeLight className="text-4xl text-[#2d65ba]" />
            </div>
            <div>
              <p className="text-base text-gray-400">Total Active Users</p>
              <h1 className="text-3xl font-semibold text-gray-800">
                {userList.length}
              </h1>
            </div>
          </div>
        </div>
        <div className="flex flex-row items-center p-6 m-2 border border-gray-100 shadow-lg rounded-2xl">
          <div className="flex flex-row gap-3 w-[260px]">
            <div className="p-3 bg-[#cbdbfb] rounded-full">
              <PiBooksLight className="text-4xl text-[#1F509A]" />
            </div>
            <div>
              <p className="text-base text-gray-400">Total Books Listed</p>
              <h1 className="text-3xl font-semibold text-gray-800">8</h1>
            </div>
          </div>
        </div>
        <div className="flex flex-row items-center p-6 m-2 border border-gray-100 shadow-lg rounded-2xl">
          <div className="flex flex-row gap-3 w-[260px]">
            <div className="p-3 bg-[#cbdbfb] rounded-full">
              <PiBooksLight className="text-4xl text-[#1F509A]" />
            </div>
            <div>
              <p className="text-base text-gray-400">Total Books Listed</p>
              <h1 className="text-3xl font-semibold text-gray-800">8</h1>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminHero;
