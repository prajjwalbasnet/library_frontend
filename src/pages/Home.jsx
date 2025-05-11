import React, { useEffect } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { ImBooks } from "react-icons/im";
import { RiRecycleFill } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import AdminHero from "../components/AdminHero";
import { useAuth } from "../context/AuthContext";
import UserHero from "../components/UserHero";

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
    <div className="w-full">
      <div className="">{isAdmin && <AdminHero />}</div>
      <div className="">{isUser && <UserHero />}</div>
    </div>
  );
};

export default Home;
