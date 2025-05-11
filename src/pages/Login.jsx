import React, { useState } from "react";
import bgImg from "../assets/login_bg.jpg";
import { MdEmail } from "react-icons/md";
import { RiLockPasswordFill } from "react-icons/ri";
import { FaUser } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { FaAddressCard } from "react-icons/fa";
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const { loading, registerUser, error, loginUser } = useAuth();
  const navigate = useNavigate();

  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    studentId: "",
    password: "",
  });

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
    // Reset form data when switching modes
    setFormData({
      fullName: "",
      email: "",
      studentId: "",
      password: "",
    });
    setFormErrors({});
  };

  const validateForm = () => {
    const errors = {};

    if (!isLogin) {
      if (!formData.fullName.trim()) errors.fullName = "Name is required";

      if (!formData.studentId.trim())
        errors.studentId = "Student ID is required";
    }

    if (!formData.email) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Email is invalid";
    }

    if (!formData.password) {
      errors.password = "Password is required";
    } else if (
      !isLogin &&
      (formData.password.length < 8 || formData.password.length > 16)
    ) {
      errors.password = "Password must be between 8 to 16 characters";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      const firstError = Object.values(formErrors)[0];
      toast.error(firstError);
      return;
    }

    if (isLogin) {
      try {
        const response = await loginUser({
          email: formData.email,
          password: formData.password,
        });

        toast.success(response.message);

        setTimeout(() => {
          navigate("/");
        }, 1000);
      } catch (error) {
        console.log(error);
        toast.error(error?.response?.data?.message || "Login failed");
      }
    } else {
      try {
        const response = await registerUser({
          name: formData.fullName,
          email: formData.email,
          password: formData.password,
          studentId: formData.studentId,
        });
        toast.success(response.message);
        localStorage.setItem("registration_email", formData.email);
        navigate(`/verify_email?userId=${response.userId}`);
      } catch (error) {
        console.log(error);
        toast.error(error?.response?.data?.message || "Registration failed");
      }
    }
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-r from-blue-500 to-blue-800 items-center justify-center p-4">
      <div className="container max-w-6xl bg-white flex flex-col md:flex-row rounded-lg overflow-hidden shadow-xl">
        <form
          onSubmit={handleSubmit}
          className="w-full md:w-1/2 flex flex-col p-4 md:p-8 gap-3"
        >
          <div className="flex flex-col items-center gap-1 text-center justify-center mb-2 md:mb-6">
            <p className="text-2xl md:text-3xl text-blue-800 font-bold">
              {isLogin ? "Login" : "Sign Up"}
            </p>
            <div className="h-[1.5px] bg-blue-800 w-7 md:w-10"></div>
          </div>

          {/* Form fields */}
          {!isLogin && (
            <div className="flex items-center mt-4 relative w-full">
              <FaUser className="absolute left-0 mx-2 text-lg text-blue-800" />
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Enter your fullname"
                className={`w-full border-b ${
                  formErrors.fullName ? "border-red-500" : "border-gray-300"
                } pl-8 py-2 outline-none text-sm md:text-base`}
              />
              {formErrors.fullName && (
                <p className="absolute -bottom-5 text-red-500 text-xs">
                  {formErrors.fullName}
                </p>
              )}
            </div>
          )}

          <div
            className={`flex items-center relative w-full ${
              isLogin ? "mt-6" : "mt-8"
            }`}
          >
            <MdEmail className="absolute left-0 mx-2 text-lg text-blue-800" />
            <input
              type="email"
              placeholder="Enter your email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full border-b ${
                formErrors.email ? "border-red-500" : "border-gray-300"
              } pl-8 py-2 outline-none text-sm md:text-base`}
            />
            {formErrors.email && (
              <p className="absolute -bottom-5 text-red-500 text-xs">
                {formErrors.email}
              </p>
            )}
          </div>

          {!isLogin && (
            <div className="flex items-center mt-8 relative w-full">
              <FaAddressCard className="absolute left-0 mx-2 text-lg text-blue-800" />
              <input
                type="text"
                placeholder="Enter your student Id"
                name="studentId"
                value={formData.studentId}
                onChange={handleChange}
                className={`w-full border-b ${
                  formErrors.studentId ? "border-red-500" : "border-gray-300"
                } pl-8 py-2 outline-none text-sm md:text-base`}
              />
              {formErrors.studentId && (
                <p className="absolute -bottom-5 text-red-500 text-xs">
                  {formErrors.studentId}
                </p>
              )}
            </div>
          )}

          <div className="flex items-center mt-8 relative w-full">
            <RiLockPasswordFill className="absolute left-0 mx-2 text-lg text-blue-800" />
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              className={`w-full border-b ${
                formErrors.password ? "border-red-500" : "border-gray-300"
              } pl-8 py-2 outline-none text-sm md:text-base`}
            />
            {showPassword ? (
              <FaEyeSlash
                onClick={handleTogglePassword}
                className="absolute right-0 mx-2 text-blue-800 cursor-pointer"
              />
            ) : (
              <FaEye
                onClick={handleTogglePassword}
                className="absolute right-0 mx-2 text-blue-800 cursor-pointer"
              />
            )}
            {formErrors.password && (
              <p className="absolute -bottom-5 text-red-500 text-xs">
                {formErrors.password}
              </p>
            )}
          </div>

          <Button
            type="submit"
            disabled={loading}
            className={`bg-blue-800 text-white text-md cursor-pointer hover:bg-blue-900 mt-10 py-2`}
          >
            {isLogin ? "Login" : "Sign Up"}
          </Button>

          <p className="mt-4 text-gray-500 text-center text-sm md:text-base">
            {isLogin ? (
              <>
                Don't have an account?{" "}
                <span
                  className="text-blue-800 cursor-pointer font-medium"
                  onClick={toggleAuthMode}
                >
                  Sign Up
                </span>
              </>
            ) : (
              <>
                Already have an account?{" "}
                <span
                  className="text-blue-800 cursor-pointer font-medium"
                  onClick={toggleAuthMode}
                >
                  Login
                </span>
              </>
            )}
          </p>
        </form>

        {/* Image section - hidden on small screens */}
        <div className="hidden md:flex md:w-1/2 md:items-center md:justify-center bg-blue-50">
          <img
            className="w-full h-full object-cover object-center"
            src={bgImg}
            alt="Login background"
          />
        </div>
      </div>
    </div>
  );
};

export default Login;
