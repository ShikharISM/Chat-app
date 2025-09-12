import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import assets from "../assets/assets.js";

const ResetPassword = () => {
  const { token } = useParams(); // get token from URL
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState("");
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${backendUrl}/api/auth/reset-password/${token}`, {
        newPassword,
      });
      toast.success("Password reset successfully!");
      navigate("/login");
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 bg-cover bg-center flex items-center justify-center gap-8 sm:justify-evenly max-sm:flex-col p-4">
      {/* Logo */}
      <img
        src={assets.logo_big}
        alt="App Logo"
        className="w-[min(30vw,250px)]"
      />

      {/* Reset Password Form */}
      <form
        onSubmit={handleSubmit}
        className="border-2 bg-white/10 text-gray-200 border-gray-700 p-6 flex flex-col gap-5 rounded-lg shadow-2xl w-full max-w-sm"
      >
        <h2 className="font-medium text-2xl">Reset Password</h2>
        <p className="text-gray-400 text-sm">
          Enter your new password to secure your account.
        </p>

        <input
          type="password"
          placeholder="Enter new password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
          className="p-3 bg-gray-800/50 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500"
        />

        <button
          type="submit"
          className="py-3 bg-gradient-to-r from-purple-500 to-violet-700 hover:from-purple-600 hover:to-violet-800 text-white font-semibold rounded-md cursor-pointer transition-all duration-300"
        >
          Change Password
        </button>

        <p
          onClick={() => navigate("/login")}
          className="text-sm text-gray-400 mt-2 text-center cursor-pointer hover:underline"
        >
          Back to Login
        </p>
      </form>
    </div>
  );
};

export default ResetPassword;
