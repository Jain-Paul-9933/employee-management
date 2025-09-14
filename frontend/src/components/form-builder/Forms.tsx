"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FormTemplate } from "@/types/form";
// import { formTemplateApi } from '@/lib/api';
import toast, { Toaster } from "react-hot-toast";
import {
  Plus,
  Edit,
  Trash2,
  Eye,
  Users,
  Calendar,
  Search,
  Filter,
  MoreVertical,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Loading from "../general/Loading";
import { FormsService } from "@/services/forms";
import { formatDate } from "@/utils/common";

export default function Forms() {
  const router = useRouter();
  const [forms, setForms] = useState<FormTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedForm, setSelectedForm] = useState<FormTemplate | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    loadForms();
  }, []);

  const loadForms = async () => {
    try {
      setLoading(true);
      const data = await FormsService.getForms();
      setForms(data.results || []);
    } catch (error: any) {
      console.error("Error loading forms:", error);
      toast.error("Failed to load forms");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteForm = async (form_id: FormTemplate["id"]) => {
    try {
      if (form_id) {
        await FormsService.deleteForm(form_id);
        toast.success("Form deleted successfully");
        loadForms(); // Reload the list
      }
      setShowDeleteModal(false);
      setSelectedForm(null);
    } catch (error: any) {
      console.error("Error deleting form:", error);
      toast.error("Failed to delete form");
    }
  };

  const filteredForms = forms.filter(
    (form) =>
      form.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (form.description &&
        form.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loading message="Loading forms..." />
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
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Form Templates
              </h1>
              <p className="text-gray-600 mt-1">
                Manage your dynamic form templates
              </p>
            </div>

            <button
              onClick={() => router.push("/forms/create")}
              className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              <Plus className="w-5 h-5" />
              Create Form
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search forms by name or description..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:border-gray-400 transition-colors">
              <Filter className="w-4 h-4" />
              Filters
            </button>
          </div>

          <div className="mt-4 flex items-center gap-6 text-sm text-gray-600">
            <div>Total Forms: {forms.length}</div>
            <div>Showing: {filteredForms.length}</div>
          </div>
        </div>

        {/* Forms Grid */}
        {filteredForms.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border p-12 text-center">
            <div className="text-gray-400 mb-4">
              <Plus className="w-16 h-16 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-600 mb-2">
              {searchQuery ? "No forms found" : "No forms yet"}
            </h3>
            <p className="text-gray-500 mb-6">
              {searchQuery
                ? "Try adjusting your search criteria"
                : "Create your first form template to get started"}
            </p>
            {!searchQuery && (
              <button
                onClick={() => router.push("/forms/create")}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Create Your First Form
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredForms.map((form) => (
              <div
                key={form.id}
                className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg text-gray-900 mb-1">
                        {form.name}
                      </h3>
                      {form.description && (
                        <p className="text-gray-600 text-sm line-clamp-2">
                          {form.description}
                        </p>
                      )}
                    </div>

                    <div className="relative ml-2">
                      <button className="p-1 text-gray-400 hover:text-gray-600">
                        <MoreVertical className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  <div className="space-y-3 mb-6">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Users className="w-4 h-4" />
                      <span>{form.fields.length} fields</span>
                    </div>

                    {form.created_at && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Calendar className="w-4 h-4" />
                        <span>Created {formatDate(form.created_at)}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => router.push(`/forms/${form.id}`)}
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors text-sm font-medium"
                    >
                      <Eye className="w-4 h-4" />
                      View
                    </button>

                    <button
                      onClick={() => router.push(`/forms/${form.id}/edit`)}
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
                    >
                      <Edit className="w-4 h-4" />
                      Edit
                    </button>

                    <button
                      onClick={() => {
                        setSelectedForm(form);
                        setShowDeleteModal(true);
                      }}
                      className="px-3 py-2 text-red-600 border border-red-600 rounded-lg hover:bg-red-50 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="border-t bg-gray-50 px-6 py-3">
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>
                      Required:{" "}
                      {form.fields.filter((f) => f.is_required).length}
                    </span>
                    <span>
                      Optional:{" "}
                      {form.fields.filter((f) => !f.is_required).length}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Delete Form Template
            </h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete{" "}
              <strong>&quot;{selectedForm.name}&quot;</strong>? This action
              cannot be undone and will also delete all associated employee
              records.
            </p>

            <div className="flex items-center gap-3">
              <button
                onClick={() => handleDeleteForm(selectedForm.id)}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
              >
                Delete Form
              </button>
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setSelectedForm(null);
                }}
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
