import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import baseurl from "../utils/config";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // Configure axios defaults
  axios.defaults.baseURL = `${baseurl}`;
  axios.defaults.withCredentials = true;
  axios.defaults.headers.common["Content-Type"] = "application/json";

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const storedUser = localStorage.getItem("user");
      if (!storedUser) {
        setLoading(false);
        return;
      }

      const parsedUser = JSON.parse(storedUser);
      if (!parsedUser.token) {
        throw new Error("No token found");
      }

      axios.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${parsedUser.token}`;

      const res = await axios.get("/api/auth/check");
      const updatedUser = {
        ...res.data.user,
        token: parsedUser.token,
      };
      setUser(updatedUser);
      setIsAuthenticated(true);
      localStorage.setItem("user", JSON.stringify(updatedUser));
    } catch (error) {
      // Only log non-auth related errors
      if (!error.response || error.response.status !== 401) {
        console.error(
          "Auth check error:",
          error.response?.data || error.message
        );
      }
      setUser(null);
      setIsAuthenticated(false);
      localStorage.removeItem("user");
      delete axios.defaults.headers.common["Authorization"];
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      console.log("Attempting login with:", { email });
      const res = await axios.post("/api/auth/login", { email, password });
      console.log("Login response:", res.data);
      if (!res.data.user.token) {
        throw new Error("No token received from server");
      }

      axios.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${res.data.user.token}`;
      setUser(res.data.user);
      setIsAuthenticated(true);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      return { success: true };
    } catch (error) {
      console.error("Login error:", error.response?.data || error.message);
      return {
        success: false,
        message: error.response?.data?.message || "An error occurred",
      };
    }
  };

  const register = async (username, email, password, confirmPassword) => {
    try {
      await axios.post("/api/auth/register", {
        username,
        email,
        password,
        confirmPassword,
      });
      return { success: true };
    } catch (error) {
      console.error(
        "Registration error:",
        error.response?.data || error.message
      );
      return {
        success: false,
        message: error.response?.data?.message || "An error occurred",
      };
    }
  };

  const logout = async () => {
    try {
      await axios.post("/api/auth/logout");
      setUser(null);
      setIsAuthenticated(false);
      localStorage.removeItem("user");
      delete axios.defaults.headers.common["Authorization"];
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const updateUserProfile = async (username, email) => {
    try {
      const response = await axios.put(
        "/api/users/profile",
        { username, email },
        {
          headers: { Authorization: `Bearer ${user.token}` },
        }
      );
      const updatedUser = {
        ...user,
        username: response.data.user.username,
        email: response.data.user.email,
        token: response.data.user.token,
      };
      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));
      axios.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${response.data.user.token}`;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to update profile"
      );
    }
  };

  const updatePassword = async (oldPassword, newPassword) => {
    try {
      const response = await axios.put(
        "/api/users/password",
        { oldPassword, newPassword },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      console.log("Password update response:", response.data);
      const updatedUser = {
        ...user,
        token: response.data.token,
      };
      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));
      axios.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${response.data.token}`;
    } catch (error) {
      console.error("Password update error:", error.response?.data || error);
      throw new Error(
        error.response?.data?.message ||
          error.message ||
          "Failed to update password"
      );
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        loading,
        login,
        register,
        logout,
        updateUserProfile,
        updatePassword,
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
