import { getAccessToken } from "@/utils/auth";
import { Employee } from "@/types/employee";
import { FormTemplate } from "@/types/form";

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";

const getAuthHeaders = () => {
  const accessToken = getAccessToken();
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${accessToken}`,
  };
};

export const EmployeesService = {
  // Get all employees
  getEmployees: async (params?: {
    search?: string;
    template_id?: number;
    ordering?: string;
    page?: number;
  }) => {
    const queryParams = new URLSearchParams();
    
    if (params?.search) queryParams.append("search", params.search);
    if (params?.template_id) queryParams.append("form_template", params.template_id.toString());
    if (params?.ordering) queryParams.append("ordering", params.ordering);
    if (params?.page) queryParams.append("page", params.page.toString());

    const url = `${BASE_URL}/api/employees/employees/${queryParams.toString() ? `?${queryParams.toString()}` : ""}`;
    
    const response = await fetch(url, {
      method: "GET",
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || errorData.message || "Failed to fetch employees");
    }

    return response.json();
  },

  // Get employee by ID
  getEmployeeById: async (id: number) => {
    const response = await fetch(`${BASE_URL}/api/employees/employees/${id}/`, {
      method: "GET",
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || errorData.message || "Failed to fetch employee");
    }

    return response.json();
  },

  // Create new employee
  createEmployee: async (employeeData: {
    form_template: number;
    data: Record<string, any>;
  }) => {
    const response = await fetch(`${BASE_URL}/api/employees/employees/`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(employeeData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || errorData.message || "Failed to create employee");
    }

    return response.json();
  },

  // Update employee
  updateEmployee: async (id: number, employeeData: {
    data: Record<string, any>;
  }) => {
    const response = await fetch(`${BASE_URL}/api/employees/employees/${id}/`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify(employeeData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || errorData.message || "Failed to update employee");
    }

    return response.json();
  },

  // Partial update employee
  partialUpdateEmployee: async (id: number, employeeData: {
    data?: Record<string, any>;
    is_active?: boolean;
  }) => {
    const response = await fetch(`${BASE_URL}/api/employees/employees/${id}/`, {
      method: "PATCH",
      headers: getAuthHeaders(),
      body: JSON.stringify(employeeData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || errorData.message || "Failed to update employee");
    }

    return response.json();
  },

  // Delete employee
  deleteEmployee: async (id: number) => {
    const response = await fetch(`${BASE_URL}/api/employees/employees/${id}/`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || errorData.message || "Failed to delete employee");
    }

    return true;
  },

  // Get employees by template
  getEmployeesByTemplate: async (templateId: number) => {
    const response = await fetch(
      `${BASE_URL}/api/employees/employees/by_template/?template_id=${templateId}`,
      {
        method: "GET",
        headers: getAuthHeaders(),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || errorData.message || "Failed to fetch employees by template");
    }

    return response.json();
  },

  // Search employees
  searchEmployees: async (query: string, templateId?: number) => {
    const queryParams = new URLSearchParams();
    queryParams.append("q", query);
    if (templateId) queryParams.append("template_id", templateId.toString());

    const response = await fetch(
      `${BASE_URL}/api/employees/employees/search/?${queryParams.toString()}`,
      {
        method: "GET",
        headers: getAuthHeaders(),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || errorData.message || "Failed to search employees");
    }

    return response.json();
  },

  // Validate employee data
  validateEmployeeData: async (id: number) => {
    const response = await fetch(
      `${BASE_URL}/api/employees/employees/${id}/validate_data/`,
      {
        method: "POST",
        headers: getAuthHeaders(),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || errorData.message || "Failed to validate employee data");
    }

    return response.json();
  },

  // Bulk delete employees
  bulkDeleteEmployees: async (employeeIds: number[]) => {
    const response = await fetch(`${BASE_URL}/api/employees/employees/bulk_delete/`, {
      method: "DELETE",
      headers: getAuthHeaders(),
      body: JSON.stringify({ employee_ids: employeeIds }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || errorData.message || "Failed to delete employees");
    }

    return response.json();
  },
};
