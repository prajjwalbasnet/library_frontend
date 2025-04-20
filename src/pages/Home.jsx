import React, { useEffect } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { ImBooks } from "react-icons/im";
import { RiRecycleFill } from "react-icons/ri";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  const isLoggedIn = () => {
    const token = localStorage.getItem("auth_token");

    if (!token) {
      navigate("/login");
    }
  };

  useEffect(() => {
    isLoggedIn();
  }, []);

  return (
    <div className="flex h-screen w-screen overflow-hidden">
      {/* ------Sidebar------- */}
      <Sidebar />

      <div className="flex flex-col flex-1 overflow-hidden">
        <Navbar />

        {/* -----Main content------ */}
        <div className="flex items-center mx-5 mt-6 justify-between">
          <div className="flex flex-col items-center justify-center border border-gray-300 rounded-sm px-10 py-3 hover:bg-gray-100 cursor-pointer w-60">
            <ImBooks className="text-blue-800 text-6xl" />
            <p className="text-gray-500 text-base mt-3">10</p>
            <p className="text-gray-500 text-base">Books Listed</p>
          </div>

          <div className="flex flex-col items-center justify-center border border-gray-300 rounded-sm px-10 py-3 hover:bg-gray-100 cursor-pointer w-60">
            <RiRecycleFill className="text-red-300 text-6xl" />
            <p className="text-gray-500 text-base mt-3">1</p>
            <p className="text-gray-500 text-base">Books Not Returned</p>
          </div>

          <div className="flex flex-col items-center justify-center border border-gray-300 rounded-sm px-10 py-3 hover:bg-gray-100 cursor-pointer w-60">
            <RiRecycleFill className="text-red-300 text-6xl" />
            <p className="text-gray-500 text-base mt-3">1</p>
            <p className="text-gray-500 text-base">Books Not Returned</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
