import type { AuthProvider } from "@refinedev/core";
import { notification } from "antd";
import { loginUser, logoutUser } from "@/services/authService";

export const authProvider: AuthProvider = {
  login: async ({ email, password }: { email: string; password: string }) => {
    try {
      const response = await loginUser(email, password);
      
      if (response.data.accessToken) {
        // Lưu token và role
        localStorage.setItem("token", response.data.accessToken);
        localStorage.setItem("role", response.data.role || "");
        
        return {
          success: true,
          redirectTo: "/",
        };
      }

      return {
        success: false,
        error: {
          name: "Login Error",
          message: "Invalid credentials",
        },
      };
    } catch (error: any) {
      notification.error({
        message: "Login Failed",
        description: error.message || "Invalid credentials",
      });
      
      return {
        success: false,
        error: {
          name: "Login Error",
          message: error.message || "Invalid credentials",
        },
      };
    }
  },

  logout: async () => {
    logoutUser();
    return {
      success: true,
      redirectTo: "/login",
    };
  },

  check: async () => {
    const token = localStorage.getItem("token");
    
    if (!token) {
      return {
        authenticated: false,
        error: {
          name: "Not Authenticated",
          message: "You must be logged in",
        },
        logout: true,
        redirectTo: "/login",
      };
    }

    return {
      authenticated: true,
    };
  },

  getPermissions: async () => {
    const role = localStorage.getItem("role");
    if (!role) return null;
    return role;
  },

  getIdentity: async () => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    
    if (!token || !role) return null;

    return {
      token,
      role,
    };
  },

  onError: async (error: any) => {
    console.error(error);
    notification.error({
      message: "Error",
      description: error?.message || "Something went wrong",
    });
    return { error };
  },
};