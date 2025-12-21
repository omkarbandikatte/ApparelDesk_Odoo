import React, { createContext, useContext, useState, useEffect } from "react";
import api from "../lib/api";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");
    if (token && userData) {
      setUser(JSON.parse(userData));
      // Verify token is still valid
      api
        .getCurrentUser()
        .then((response) => {
          if (response.success) {
            setUser(response.user);
            localStorage.setItem("user", JSON.stringify(response.user));
          } else {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            setUser(null);
          }
        })
        .catch(() => {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          setUser(null);
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    try {
      const response = await api.login(email, password);
      if (response.success) {
        localStorage.setItem("token", response.token);
        const userData = {
          id: response.user.id,
          email: response.user.email,
          name: response.user.name,
          role: response.user.role, // 'internal' | 'portal'
        };
        const isAdmin = response.user.role === 'internal';
        localStorage.setItem("user", JSON.stringify(userData));
        setUser(userData);
        return { success: true, user: userData };
      }
      return { success: false, error: "Invalid email or password" };
    } catch (error) {
      return { success: false, error: error.message || "Login failed" };
    }
  };

  const signup = async (userData) => {
    try {
      const response = await api.signup(userData);
      if (response.success) {
        localStorage.setItem("token", response.token);
        const userDataToStore = {
          id: response.user.id,
          email: response.user.email,
          isAdmin: response.user.isAdmin,
          name: response.user.contact?.name || response.user.email,
          role: response.user.isAdmin ? "seller" : "customer",
          contact: response.user.contact,
        };
        localStorage.setItem("user", JSON.stringify(userDataToStore));
        setUser(userDataToStore);
        return { success: true, user: userDataToStore };
      }
      return { success: false, error: response.error || "Signup failed" };
    } catch (error) {
      return { success: false, error: error.message || "Signup failed" };
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
