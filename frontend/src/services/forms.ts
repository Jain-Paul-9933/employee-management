import { getAccessToken } from "@/utils/auth";
import { get } from "http";

const BASE_URL = process.env.BACKEND_URL || "http://localhost:8000";

const accessToken = getAccessToken();

export const FormsService = {
  getForms: async () => {
    const response = await fetch(`${BASE_URL}/api/forms/form-templates/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(JSON.stringify(errorData) || "Failed to fetch forms");
    }
    return response.json();
  },
  getFormById: async (id: number) => {
    const response = await fetch(
      `${BASE_URL}/api/forms/form-templates/${id}/`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(JSON.stringify(errorData) || "Failed to fetch form");
    }
    return response.json();
  },
  deleteForm: async (id: number) => {
    const response = await fetch(
      `${BASE_URL}/api/forms/form-templates/${id}/`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(JSON.stringify(errorData) || "Failed to delete form");
    }
  },
};
