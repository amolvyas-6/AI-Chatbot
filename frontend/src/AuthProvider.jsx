import { useState, createContext, useEffect, use } from "react";
import api from "@/lib/api.js";
import { set } from "react-hook-form";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState();
  const [loading, setLoading] = useState(true);
  const [chatHistory, setChatHistory] = useState([]);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await api.get("/user/logged-in");
        console.log(response.data);
        setUser(response.data.data);
      } catch (err) {
        setUser(null);
      }
    };
    const getChatHistory = async () => {
      try {
        const response = await api.get("/conversation");
        console.log(response.data);
        setChatHistory(response.data.data);
      } catch (err) {
        setChatHistory([]);
      }
    };
    fetchUser();
    getChatHistory();
  }, []);

  const login = async (userData) => {
    try {
      const response = await api.post("/user/login", userData);
      console.log(response.data.data);
      setUser(response.data.data);

      const response2 = await api.get("/conversation");
      setChatHistory(response2.data.data);

      alert("Login Successful");
    } catch (err) {
      console.error("Login failed:", err);
      setUser(null);
      setChatHistory([]);
      alert(err.response?.data?.message || "Login Failed");
    }
  };

  const logout = async () => {
    try {
      const response = await api.get("/user/logout");
      setUser(null);
      setChatHistory([]);
      alert("Logout Successful");
    } catch (err) {
      console.error("Logout failed:", err);
      alert(err.response?.data?.message || "Logout Failed");
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, chatHistory }}>
      {children}
    </AuthContext.Provider>
  );
};
