import { createContext, useEffect, useState } from "react";
import api from "@/lib/api.js";

// Create global Auth Context
export const AuthContext = createContext();

// Create the Auth Provider component which will wrap the application
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(); // state to store currently logged in user
  const [loading, setLoading] = useState(true); // state to manage loading state
  const [chatHistory, setChatHistory] = useState([]); // state to store chat history
  const [currentChat, setCurrentChat] = useState(null); // state to store id of currently active chat
  const [messages, setMessages] = useState([]); // state to store messages of currently active chat

  // get info of user if logged in during app startup
  useEffect(() => {
    // get user info
    const fetchUser = async () => {
      try {
        const response = await api.get("/user/logged-in");
        setUser(response.data.data);
      } catch (err) {
        setUser(null);
      }
    };
    // get chat history
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
    setLoading(false); // currently useless state
  }, []);

  // login function
  const login = async (userData) => {
    try {
      const response = await api.post("/user/login", userData); // returns user info in response data
      setUser(response.data.data);

      const response2 = await api.get("/conversation");
      setChatHistory(response2.data.data);

      alert("Login Successful");
    } catch (err) {
      console.error("Login failed:", err);
      setUser(null);
      setChatHistory([]);
      alert(err.response?.data?.message || "Login Failed"); // Display error message
    }
  };

  // logout function
  const logout = async () => {
    try {
      await api.get("/user/logout");
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

  // register function
  const register = async (userData) => {
    try {
      await api.post("/user/register", userData);
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
