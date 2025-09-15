"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { FormTemplate } from "@/types/form";
import Navbar from "@/components/Navbar";
import toast, { Toaster } from "react-hot-toast";
import {
  Edit,
  Copy,
  Trash2,
  Users,
  Calendar,
  Eye,
  ArrowLeft,
  Settings,
  Download,
  Share2,
} from "lucide-react";
import { FormsService } from "@/services/forms";
import { renderFieldPreview } from "@/utils/form";
import { formatDate } from "@/utils/common";

export default function FormViewPage() {
  const router = useRouter();
  const params = useParams();
  const formId = parseInt(params.id as string);

  const [form, setForm] = useState<FormTemplate | null>(null);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    if (formId) {
      loadForm();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formId]);

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

  const handleDelete = async () => {
    if (!form) return;

    try {
      await FormsService.deleteForm(formId);
      toast.success("Form template deleted successfully");
      router.push("/forms");
    } catch (error: any) {
      console.error("Error deleting form:", error);
      toast.error("Failed to delete form template");
    }
  };

  //   const handleDuplicate = async () => {
  //     if (!form) return;

  //     try {
  //       // Create a duplicate form template
  //       const duplicateData = {
  //         name: `${form.name} (Copy)`,
  //         description: form.description,
  //         fields: form.fields.map((field) => ({
  //           field_type: field.field_type,
  //           label: field.label,
  //           placeholder: field.placeholder,
  //           is_required: field.is_required,
  //           order: field.order,
  //           options: field.options || [],
  //         })),
  //       };

  //       const newForm = await formTemplateApi.create(duplicateData);
  //       toast.success("Form template duplicated successfully");
  //       router.push(`/forms/${newForm.id}`);
  //     } catch (error: any) {
  //       console.error("Error duplicating form:", error);
  //       toast.error("Failed to duplicate form template");
  //     }
  //   };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center h-96">
          <div className="flex items-center space-x-2">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="text-gray-600">Loading form template...</span>
          </div>
        </div>
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
            The form template you&apos;re looking for doesn&apos;t exist.
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
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.push("/forms")}
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>

              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  {form.name}
                </h1>
                {form.description && (
                  <p className="text-gray-600 mt-1">{form.description}</p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowPreview(!showPreview)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  showPreview
                    ? "bg-gray-200 text-gray-700"
                    : "bg-blue-100 text-blue-700 hover:bg-blue-200"
                }`}
              >
                <Eye className="w-4 h-4" />
                {showPreview ? "Hide Preview" : "Preview Form"}
              </button>

              <button
                // onClick={handleDuplicate}
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
              >
                <Copy className="w-4 h-4" />
                Duplicate
              </button>

              <button
                onClick={() => router.push(`/forms/${formId}/edit`)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
              >
                <Edit className="w-4 h-4" />
                Edit Form
              </button>

              <button
                onClick={() => setShowDeleteModal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
              >
                <Trash2 className="w-4 h-4" />
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            {showPreview ? (
              /* Form Preview */
              <div className="bg-white rounded-lg shadow-sm border p-8">
                <div className="max-w-2xl mx-auto">
                  <div className="mb-8">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-2">
                      {form.name}
                    </h2>
                    {form.description && (
                      <p className="text-gray-600">{form.description}</p>
                    )}
                  </div>

                  <div className="space-y-6">
                    {form.fields.map((field) => (
                      <div key={field.id}>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          {field.label}
                          {field.is_required && (
                            <span className="text-red-500 ml-1">*</span>
                          )}
                        </label>
                        {renderFieldPreview(field)}
                        {field.placeholder && (
                          <p className="text-xs text-gray-500 mt-1">
                            Placeholder: {field.placeholder}
                          </p>
                        )}
                      </div>
                    ))}

                    <button
                      type="submit"
                      className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                      disabled
                    >
                      Submit Form (Preview Mode)
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              /* Form Structure View */
              <div className="bg-white rounded-lg shadow-sm border">
                <div className="border-b px-6 py-4">
                  <h2 className="text-lg font-semibold text-gray-800">
                    Form Structure
                  </h2>
                  <p className="text-sm text-gray-600 mt-1">
                    {form.fields.length} field
                    {form.fields.length !== 1 ? "s" : ""} •
                    {form.fields.filter((f) => f.is_required).length} required
                  </p>
                </div>

                <div className="p-6">
                  {form.fields.length === 0 ? (
                    <div className="text-center py-12">
                      <div className="text-gray-400 mb-4">
                        <Settings className="w-16 h-16 mx-auto" />
                      </div>
                      <h3 className="text-lg font-medium text-gray-600 mb-2">
                        No fields yet
                      </h3>
                      <p className="text-gray-500 mb-6">
                        This form template doesn&apos;t have any fields yet.
                      </p>
                      <button
                        onClick={() => router.push(`/forms/${formId}/edit`)}
                        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                      >
                        Add Fields
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {form.fields
                        .sort((a, b) => a.order - b.order)
                        .map((field, index) => (
                          <div
                            key={field.id}
                            className="bg-gray-50 border border-gray-200 rounded-lg p-4"
                          >
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-3">
                                <span className="w-8 h-8 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center text-sm font-medium">
                                  {index + 1}
                                </span>
                                <div>
                                  <h3 className="font-medium text-gray-900">
                                    {field.label}
                                    {field.is_required && (
                                      <span className="text-red-500 ml-1">
                                        *
                                      </span>
                                    )}
                                  </h3>
                                  <p className="text-sm text-gray-600">
                                    {field.field_type} field
                                  </p>
                                </div>
                              </div>

                              <div className="flex items-center gap-2">
                                {field.is_required && (
                                  <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full">
                                    Required
                                  </span>
                                )}
                                <span className="text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded-full">
                                  {field.field_type}
                                </span>
                              </div>
                            </div>

                            {field.placeholder && (
                              <p className="text-sm text-gray-600 mb-2">
                                <strong>Placeholder:</strong>{" "}
                                {field.placeholder}
                              </p>
                            )}

                            {field.field_type === "SELECT" && field.options && (
                              <div className="text-sm text-gray-600">
                                <strong>Options:</strong>{" "}
                                {field.options.join(", ")}
                              </div>
                            )}
                          </div>
                        ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="space-y-6">
              {/* Form Info */}
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h3 className="font-semibold text-gray-900 mb-4">
                  Form Information
                </h3>

                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Calendar className="w-4 h-4" />
                    <span>
                      Created{" "}
                      {form.created_at
                        ? formatDate(form.created_at)
                        : "Unknown"}
                    </span>
                  </div>

                  {form.updated_at && form.updated_at !== form.created_at && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar className="w-4 h-4" />
                      <span>Updated {formatDate(form.updated_at)}</span>
                    </div>
                  )}

                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Users className="w-4 h-4" />
                    <span>
                      {form.fields.length} field
                      {form.fields.length !== 1 ? "s" : ""}
                    </span>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h3 className="font-semibold text-gray-900 mb-4">
                  Quick Actions
                </h3>

                <div className="space-y-3">
                  <button
                    onClick={() =>
                      router.push(`/employees/create?template=${formId}`)
                    }
                    className="w-full flex items-center gap-2 px-3 py-2 text-left border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors text-sm"
                  >
                    <Users className="w-4 h-4 text-gray-600" />
                    Create Employee
                  </button>

                  <button
                    onClick={() => router.push(`/employees?template=${formId}`)}
                    className="w-full flex items-center gap-2 px-3 py-2 text-left border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors text-sm"
                  >
                    <Eye className="w-4 h-4 text-gray-600" />
                    View Employees
                  </button>

                  <button className="w-full flex items-center gap-2 px-3 py-2 text-left border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors text-sm">
                    <Download className="w-4 h-4 text-gray-600" />
                    Export Template
                  </button>

                  <button className="w-full flex items-center gap-2 px-3 py-2 text-left border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors text-sm">
                    <Share2 className="w-4 h-4 text-gray-600" />
                    Share Template
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Delete Form Template
            </h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete{" "}
              <strong>&quot;{form.name}&quot;</strong>? This action cannot be
              undone and will also delete all associated employee records.
            </p>

            <div className="flex items-center gap-3">
              <button
                onClick={handleDelete}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
              >
                Delete Form
              </button>
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
