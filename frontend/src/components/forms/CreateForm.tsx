"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import FormBuilder from "@/components/forms/FormBuilder";
import { FormTemplate } from "@/types/form";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import Navbar from "../Navbar";
import { getAccessToken } from "@/utils/auth";

// Configure axios defaults
axios.defaults.baseURL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

// Add token to requests if available
if (typeof window !== "undefined") {
  const token = getAccessToken();
  if (token) {
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  }
}

export default function CreateForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleSaveForm = async (template: FormTemplate) => {
    setIsLoading(true);

    try {
      // Transform template for API
      const payload = {
        name: template.name,
        description: template.description || "",
        fields: template.fields.map((field, index) => ({
          field_type: field.field_type,
          label: field.label,
          placeholder: field.placeholder || "",
          is_required: field.is_required,
          order: index,
          options: field.options || [],
        })),
      };

      console.log("Saving form template:", payload);

      const response = await axios.post("/forms/form-templates/", payload);

      if (response.data) {
        toast.success("Form template created successfully!");
        // Redirect to forms list or edit page
        router.push("/forms");
      }
    } catch (error: any) {
      console.error("Error saving form:", error);

      if (error.response?.data?.errors) {
        // Handle validation errors
        const errors = error.response.data.errors;
        Object.entries(errors).forEach(([field, messages]: [string, any]) => {
          toast.error(
            `${field}: ${
              Array.isArray(messages) ? messages.join(", ") : messages
            }`
          );
        });
      } else if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else if (error.message) {
        toast.error(error.message);
      } else {
        toast.error("Failed to save form template");
      }

      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const handlePreview = (template: FormTemplate) => {
    console.log("Previewing template:", template);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: "#363636",
            color: "#fff",
          },
        }}
      />

      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Create Form Template
              </h1>
              <p className="text-gray-600 mt-1">
                Build dynamic forms with drag-and-drop field arrangement
              </p>
            </div>

            <button
              onClick={() => router.push("/forms")}
              className="px-4 py-2 text-gray-600 hover:text-gray-900 border border-gray-300 rounded-lg hover:border-gray-400 transition-colors"
            >
              Back to Forms
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="py-8">
        <FormBuilder onSave={handleSaveForm} onPreview={handlePreview} />
      </div>

      {/* Loading Overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <div className="flex items-center space-x-3">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
              <span className="text-gray-700">Saving form template...</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
