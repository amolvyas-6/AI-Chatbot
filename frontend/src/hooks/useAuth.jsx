import { useContext } from "react";
import { AuthContext } from "../AuthProvider.jsx";

// Wrapper for useContext(AuthContext)
export const useAuth = () => useContext(AuthContext);
