import { createContext, useContext, useState, useEffect } from "react";
import api from "../services/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  // On mount, check if token exists and validate it
  useEffect(() => {
    const token = localStorage.getItem("token");
    const savedAdmin = localStorage.getItem("admin");

    if (token && savedAdmin) {
      try {
        setAdmin(JSON.parse(savedAdmin));
        api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      } catch {
        localStorage.removeItem("token");
        localStorage.removeItem("admin");
      }
    }
    setLoading(false);
  }, []);

  const login = async (username, password) => {
    const response = await api.post("/auth/login", { username, password });
    const { token, admin: adminData } = response.data;

    // Persist token and admin info
    localStorage.setItem("token", token);
    localStorage.setItem("admin", JSON.stringify(adminData));
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

    setAdmin(adminData);
    return response.data;
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("admin");
    delete api.defaults.headers.common["Authorization"];
    setAdmin(null);
  };

  return (
    <AuthContext.Provider value={{ admin, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
