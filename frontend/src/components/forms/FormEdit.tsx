"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { FormTemplate } from "@/types/form";
import FormBuilder from "@/components/forms/FormBuilder";
import Navbar from "@/components/Navbar";
import toast, { Toaster } from "react-hot-toast";
import { ArrowLeft, Save, Eye } from "lucide-react";
import { FormsService } from "@/services/forms";
import Loading from "../general/Loading";

export default function FormEditPage() {
  const router = useRouter();
  const params = useParams();
  const formId = parseInt(params.id as string);

  const [form, setForm] = useState<FormTemplate | null>(null);
  const [loading, setLoading] = useState(true);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  useEffect(() => {
    if (formId) {
      loadForm();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formId]);

  // Warn user about unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = "";
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [hasUnsavedChanges]);

  const loadForm = async () => {
    try {
      setLoading(true);
      const data = await FormsService.getFormById(formId);
      setForm(data);
    } catch (error: any) {
      console.error("Error loading form:", error);
      toast.error("Failed to load form template");
      router.push("/forms");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateForm = async (updatedTemplate: FormTemplate) => {
    try {
      //   // Prepare the update payload
      const updatePayload = {
        name: updatedTemplate.name,
        description: updatedTemplate.description || "",
        fields: updatedTemplate.fields.map((field, index) => ({
          ...(field.id && typeof field.id === "number" ? { id: field.id } : {}),
          field_type: field.field_type,
          label: field.label,
          placeholder: field.placeholder || "",
          is_required: field.is_required,
          order: index,
          options: field.options || [],
        })),
      };

      await FormsService.updateForm(formId, updatePayload);

      toast.success("Form template updated successfully!");
      setHasUnsavedChanges(false);

      // Redirect back to view page
      router.push(`/forms/${formId}`);
    } catch (error: any) {
      console.error("Error updating form:", error);

      if (error.response?.data?.errors) {
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
      } else {
        toast.error("Failed to update form template");
      }

      throw error;
    }
  };

  const handleFormChange = () => {
    setHasUnsavedChanges(true);
  };

  const handleCancel = () => {
    if (hasUnsavedChanges) {
      const confirmed = window.confirm(
        "You have unsaved changes. Are you sure you want to leave? Your changes will be lost."
      );
      if (!confirmed) {
        return;
      }
    }
    router.push(`/forms/${formId}`);
  };

  const handlePreview = (template: FormTemplate) => {
    console.log("Previewing template:", template);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loading message="Loading forms..." />
      </div>
    );
  }

  if (!form) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="text-center py-12">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            Form Not Found
          </h2>
          <p className="text-gray-600 mb-6">
            The form template you&apos;re trying to edit doesn&apos;t exist.
          </p>
          <button
            onClick={() => router.push("/forms")}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to Forms
          </button>
        </div>
      </div>
    );
  }

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
            <div className="flex items-center gap-4">
              <button
                onClick={handleCancel}
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>

              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Edit Form: {form.name}
                </h1>
                <p className="text-gray-600 mt-1">
                  Make changes to your form template structure
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {hasUnsavedChanges && (
                <div className="flex items-center gap-2 text-sm text-amber-600">
                  <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                  <span>Unsaved changes</span>
                </div>
              )}

              <button
                onClick={handleCancel}
                className="px-4 py-2 text-gray-600 hover:text-gray-900 border border-gray-300 rounded-lg hover:border-gray-400 transition-colors text-sm font-medium"
              >
                Cancel
              </button>

              <button
                onClick={() => router.push(`/forms/${formId}`)}
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
              >
                <Eye className="w-4 h-4" />
                View Form
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Form Builder */}
      <div className="py-8">
        <FormBuilder
          initialTemplate={form}
          onSave={handleUpdateForm}
          onPreview={handlePreview}
        />
      </div>

      {/* Save Changes Reminder */}
      {hasUnsavedChanges && (
        <div className="fixed bottom-6 right-6 bg-white border border-gray-200 rounded-lg shadow-lg p-4 max-w-sm">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 bg-amber-500 rounded-full animate-pulse"></div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">
                Unsaved Changes
              </p>
              <p className="text-xs text-gray-600">
                Don&apos;t forget to save your changes
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
