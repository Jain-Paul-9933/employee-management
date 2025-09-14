import { LoginFormData, RegisterFormData } from "@/types/auth";

const BASE_URL = process.env.BACKEND_URL || "http://localhost:8000";

export const AuthService = {
  register: async (userData: RegisterFormData) => {
    const response = await fetch(`${BASE_URL}/api/auth/users/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(JSON.stringify(errorData) || "Registration failed");
    }
    return response.json();
  },

  login: async (credentials: LoginFormData) => {
    const response = await fetch(`${BASE_URL}/api/auth/jwt/create/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(JSON.stringify(errorData) || "Login failed");
    }
    const data = await response.json();
    if (typeof window !== "undefined") {
      localStorage.setItem("accessToken", data.access);
      localStorage.setItem("refreshToken", data.refresh);
    }
    return data;
  },

  logout: async () => {
    try {
      const refreshToken = AuthService.getRefreshToken();
      const accessToken = AuthService.getAccessToken();

      if (refreshToken) {
        // Call the blacklist endpoint to invalidate the refresh token
        const response = await fetch(`${BASE_URL}/api/user/logout/`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({ refresh: refreshToken }),
        });

        // Don't throw error if blacklist fails - we still want to clear local storage
        if (!response.ok) {
          console.warn("Failed to blacklist refresh token on server");
        }
        return response;
      }
    } catch (error) {
      console.error("Error during server logout:", error);
    } finally {
      // Always clear local storage regardless of server response
      AuthService.clearTokens();
    }
  },

  getCurrentUser: async (accessToken: string) => {
    const response = await fetch(`${BASE_URL}/api/auth/users/me/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(JSON.stringify(errorData) || "Failed to fetch user data");
    }
    return response.json();
  },

  refreshToken: async (refreshToken: string) => {
    const response = await fetch(`${BASE_URL}/api/auth/jwt/refresh/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ refresh: refreshToken }),
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(JSON.stringify(errorData) || "Token refresh failed");
    }
    const data = await response.json();

    // Update access token in localStorage
    if (typeof window !== "undefined") {
      localStorage.setItem("accessToken", data.access);
      // Update refresh token if provided
      if (data.refresh) {
        localStorage.setItem("refreshToken", data.refresh);
      }
    }

    return data;
  },

  // Utility methods
  getAccessToken: (): string | null => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("accessToken");
    }
    return null;
  },

  getRefreshToken: (): string | null => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("refreshToken");
    }
    return null;
  },

  clearTokens: () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
    }
  },

  isAuthenticated: (): boolean => {
    return !!AuthService.getAccessToken();
  },

  // Helper method for making authenticated requests
  authenticatedFetch: async (url: string, options: RequestInit = {}) => {
    const accessToken = AuthService.getAccessToken();

    if (!accessToken) {
      throw new Error("No access token available");
    }

    const response = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        ...options.headers,
      },
    });

    // If token is expired, try to refresh
    if (response.status === 401) {
      const refreshToken = AuthService.getRefreshToken();

      if (refreshToken) {
        try {
          await AuthService.refreshToken(refreshToken);
          // Retry the original request with new token
          const newAccessToken = AuthService.getAccessToken();
          return fetch(url, {
            ...options,
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${newAccessToken}`,
              ...options.headers,
            },
          });
        } catch (refreshError) {
          // Refresh failed, clear tokens and redirect to login
          console.error("Token refresh failed:", refreshError);
          AuthService.clearTokens();
          throw new Error("Session expired. Please log in again.");
        }
      } else {
        // No refresh token, clear tokens
        AuthService.clearTokens();
        throw new Error("Session expired. Please log in again.");
      }
    }

    return response;
  },
};
