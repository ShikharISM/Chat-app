import { createContext, useEffect, useState } from "react";
import axios from 'axios'
import toast from "react-hot-toast";
import { io } from 'socket.io-client';
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

const backendUrl = import.meta.env.VITE_BACKEND_URL;
axios.defaults.baseURL = backendUrl;

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [authUser, setAuthUser] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [socket, setsocket] = useState(null);

  // checkAuth: request to backend to validate token and get user
  const checkAuth = async () => {
    try {
      // send token in header — axios.get(url, config)
      const { data } = await axios.get('/api/auth/check');
      if (data.success) {
        setAuthUser(data.user);
        connectSocket(data.user)
      }
    } catch (error) {
      toast.error(error.message)
    }
  };

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common["token"] = token;
    }
    checkAuth()
  }, [])

  const login = async (state, credentials) => {
    try {
      const { data } = await axios.post(`/api/auth/${state}`, credentials);
      if (data.success) {
        setAuthUser(data.userData);
        connectSocket(data.userData);
        axios.defaults.headers.common["token"] = data.token;
        setToken(data.token);
        localStorage.setItem("token", data.token);
        toast.success(data.message || "Logged in successfully!!")
      } else {
        toast.error(data.message || "Login failed")
      }
    } catch (error) {
      toast.error(error.message || "Login error")
      console.log(error.message);
    }
  };

  const logout = async () => {
    try {
      localStorage.removeItem("token")
      setToken(null);
      setAuthUser(null);
      setOnlineUsers([]);
      axios.defaults.headers.common["token"] = null;
      toast.success("Logged Out Successfully!!");
      socket.disconnect();
    } catch (err) {
      console.log("logout error", err);
    }
  };

  const updateProfile = async (body) => {
    try {
      const { data } = await axios.put("/api/auth/update-profile", body);
      if (data.success) {
        setAuthUser(data.user);
        toast.success("Profile Updated Successfully!!");
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const connectSocket = async (userData) => {
    if (!userData || socket?.connected) return;
    const newSocket = io(backendUrl, {
      query: { userId: userData._id }
    });
    newSocket.connect();
    setsocket(newSocket);
    newSocket.on("getOnlineUsers", (userIds) => {
      setOnlineUsers(userIds);
    });
  };


  const resetEmail = async (email) => {
    try {
      const { data } = await axios.post('/api/auth/verify-email', { email})
      if(data.success){
        toast.success("Email sent successfully!!")
      }
      else{
        toast.error("Enter correct Email")
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  const value = {
    axios,
    authUser,
    onlineUsers,
    socket,
    login,
    logout,
    updateProfile,
    resetEmail,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
