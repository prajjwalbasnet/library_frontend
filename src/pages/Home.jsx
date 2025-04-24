import React, { useEffect } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { ImBooks } from "react-icons/im";
import { RiRecycleFill } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import AdminHero from "../components/AdminHero";
import { useAuth } from "../context/AuthContext";

const Home = () => {
  const { isAdmin, isUser } = useAuth();
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
        <div className="w-full">
          <div className="">{isAdmin && <AdminHero />}</div>
        </div>
      </div>
    </div>
  );
};

export default Home;
