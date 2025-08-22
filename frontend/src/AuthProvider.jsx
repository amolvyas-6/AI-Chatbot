import { createContext, useEffect, useState } from "react";
import api from "@/lib/api.js";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState();
  const [loading, setLoading] = useState(true);
  const [chatHistory, setChatHistory] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await api.get("/user/logged-in");
        setUser(response.data.data);
      } catch (err) {
        setUser(null);
      }
    };
    const getChatHistory = async () => {
      try {
        const response = await api.get("/conversation");
        setChatHistory(response.data.data || []);
      } catch (err) {
        setChatHistory([]);
      }
    };
    fetchUser();
    getChatHistory();
    setLoading(false);
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
      setCurrentChat(null);
      setMessages([]);
      alert("Logout Successful");
    } catch (err) {
      console.error("Logout failed:", err);
      alert(err.response?.data?.message || "Logout Failed");
    }
  };

  const register = async (userData) => {
    try {
      const response = await api.post("/user/register", userData);
      alert("Registration Successful. Please Login.");
    } catch (err) {
      console.error("Registration failed:", err);
      alert(err.response?.data?.message || "Registration Failed");
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        loading,
        chatHistory,
        setChatHistory,
        currentChat,
        setCurrentChat,
        messages,
        setMessages,
        register,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
