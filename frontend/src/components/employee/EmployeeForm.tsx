// components/employee/EmployeeForm.tsx
"use client";

import React, { useState, useEffect } from "react";
import { FormField } from "@/types/form";
import { EmployeeFormProps } from "@/types/employee";
import { Save, X, AlertCircle, CheckCircle } from "lucide-react";
import toast from "react-hot-toast";

export default function EmployeeForm({
  template,
  initialData,
  onSubmit,
  onCancel,
  isLoading = false,
  mode = "create",
}: EmployeeFormProps) {
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize form data from initial employee data
  useEffect(() => {
    if (initialData && initialData.data) {
      setFormData(initialData.data);
    }
  }, [initialData]);

  const handleInputChange = (fieldId: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [fieldId]: value,
    }));

    // Clear error when user starts typing
    if (errors[fieldId]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[fieldId];
        return newErrors;
      });
    }
  };

  const handleInputBlur = (fieldId: string) => {
    setTouched((prev) => ({
      ...prev,
      [fieldId]: true,
    }));

    // Validate field on blur
    validateField(fieldId);
  };

  const validateField = (fieldId: string) => {
    const field = template.fields.find((f) => f.id === fieldId);
    if (!field) return;

    const value = formData[fieldId];
    let error = "";

    // Required field validation
    if (field.is_required && (!value || value.toString().trim() === "")) {
      error = `${field.label} is required`;
    }

    // Type-specific validation
    if (value && value.toString().trim() !== "") {
      switch (field.field_type) {
        case "EMAIL":
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(value)) {
            error = "Please enter a valid email address";
          }
          break;

        case "NUMBER":
          if (isNaN(Number(value))) {
            error = "Please enter a valid number";
          }
          break;

        case "DATE":
          const date = new Date(value);
          if (isNaN(date.getTime())) {
            error = "Please enter a valid date";
          }
          break;

        case "SELECT":
          if (field.options && !field.options.includes(value)) {
            error = "Please select a valid option";
          }
          break;
      }
    }

    if (error) {
      setErrors((prev) => ({
        ...prev,
        [fieldId]: error,
      }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    template.fields.forEach((field) => {
      const fieldId = field.id;
      const value = formData[fieldId];

      // Required field validation
      if (field.is_required && (!value || value.toString().trim() === "")) {
        newErrors[fieldId] = `${field.label} is required`;
        return;
      }

      // Skip other validations if field is empty and not required
      if (!value || value.toString().trim() === "") {
        return;
      }

      // Type-specific validation
      switch (field.field_type) {
        case "EMAIL":
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(value)) {
            newErrors[fieldId] = "Please enter a valid email address";
          }
          break;

        case "NUMBER":
          if (isNaN(Number(value))) {
            newErrors[fieldId] = "Please enter a valid number";
          }
          break;

        case "DATE":
          const date = new Date(value);
          if (isNaN(date.getTime())) {
            newErrors[fieldId] = "Please enter a valid date";
          }
          break;

        case "SELECT":
          if (field.options && !field.options.includes(value)) {
            newErrors[fieldId] = "Please select a valid option";
          }
          break;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Mark all fields as touched
    const touchedFields: Record<string, boolean> = {};
    template.fields.forEach((field) => {
      touchedFields[field.id] = true;
    });
    setTouched(touchedFields);

    if (!validateForm()) {
      toast.error("Please fix the errors in the form");
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(formData);
    } catch (error) {
      // Error handling is done in parent component
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderField = (field: FormField) => {
    const fieldId = field.id;
    const value = formData[fieldId] || "";
    const hasError = errors[fieldId];
    const isTouched = touched[fieldId];

    const commonProps = {
      id: fieldId,
      name: fieldId,
      value,
      onChange: (e: any) => handleInputChange(fieldId, e.target.value),
      onBlur: () => handleInputBlur(fieldId),
      className: `w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
        hasError && isTouched
          ? "border-red-300 focus:ring-red-500 focus:border-red-500"
          : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
      }`,
      placeholder: field.placeholder || `Enter ${field.label.toLowerCase()}`,
      required: field.is_required,
      disabled: isSubmitting || isLoading,
    };

    switch (field.field_type) {
      case "TEXT":
        return <input type="text" {...commonProps} />;

      case "NUMBER":
        return <input type="number" {...commonProps} step="any" />;

      case "EMAIL":
        return <input type="email" {...commonProps} />;

      case "PASSWORD":
        return <input type="password" {...commonProps} />;

      case "DATE":
        return <input type="date" {...commonProps} />;

      case "TEXTAREA":
        return (
          <textarea
            {...commonProps}
            rows={4}
            className={`${commonProps.className} resize-none`}
          />
        );

      case "SELECT":
        return (
          <select {...commonProps}>
            <option value="">Select {field.label}</option>
            {field.options?.map((option, index) => (
              <option key={index} value={option}>
                {option}
              </option>
            ))}
          </select>
        );

      default:
        return <input type="text" {...commonProps} />;
    }
  };

  const completedFields = template.fields.filter((field) => {
    const value = formData[field.id];
    return value && value.toString().trim() !== "";
  }).length;

  const requiredFields = template.fields.filter((field) => field.is_required);
  const completedRequiredFields = requiredFields.filter((field) => {
    const value = formData[field.id];
    return value && value.toString().trim() !== "";
  }).length;

  return (
    <div className="bg-white rounded-lg shadow-sm border">
      {/* Form Header */}
      <div className="border-b px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              {mode === "create" ? "Create" : "Edit"} Employee
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              Using form template:{" "}
              <span className="font-medium">{template.name}</span>
            </p>
          </div>

          <div className="flex items-center gap-2">
            {/* Progress indicator */}
            <div className="text-sm text-gray-600">
              <span className="font-medium">
                {completedRequiredFields}/{requiredFields.length}
              </span>{" "}
              required fields completed
            </div>
            <div className="w-16 bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{
                  width: `${
                    requiredFields.length > 0
                      ? (completedRequiredFields / requiredFields.length) * 100
                      : 0
                  }%`,
                }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Form Content */}
      <form onSubmit={handleSubmit} className="p-6">
        <div className="space-y-6">
          {template.fields
            .sort((a, b) => a.order - b.order)
            .map((field) => (
              <div key={field.id}>
                <label
                  htmlFor={field.id}
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  {field.label}
                  {field.is_required && (
                    <span className="text-red-500 ml-1">*</span>
                  )}
                </label>

                {renderField(field)}

                {errors[field.id] && touched[field.id] && (
                  <div className="mt-1 flex items-center gap-1 text-sm text-red-600">
                    <AlertCircle className="w-4 h-4" />
                    <span>{errors[field.id]}</span>
                  </div>
                )}

                {field.placeholder &&
                  field.placeholder !==
                    `Enter ${field.label.toLowerCase()}` && (
                    <p className="mt-1 text-xs text-gray-500">
                      Hint: {field.placeholder}
                    </p>
                  )}
              </div>
            ))}
        </div>

        {/* Form Actions */}
        <div className="mt-8 pt-6 border-t">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              {completedFields} of {template.fields.length} fields completed
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={onCancel}
                disabled={isSubmitting || isLoading}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={
                  isSubmitting || isLoading || Object.keys(errors).length > 0
                }
                className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>
                      {mode === "create" ? "Creating..." : "Updating..."}
                    </span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>
                      {mode === "create"
                        ? "Create Employee"
                        : "Update Employee"}
                    </span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </form>

      {/* Form Statistics */}
      <div className="border-t bg-gray-50 px-6 py-4">
        <div className="grid grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-lg font-semibold text-gray-900">
              {template.fields.length}
            </div>
            <div className="text-xs text-gray-600">Total Fields</div>
          </div>

          <div>
            <div className="text-lg font-semibold text-gray-900">
              {requiredFields.length}
            </div>
            <div className="text-xs text-gray-600">Required</div>
          </div>

          <div>
            <div className="text-lg font-semibold text-gray-900">
              {completedFields}
            </div>
            <div className="text-xs text-gray-600">Completed</div>
          </div>

          <div>
            <div className="text-lg font-semibold text-gray-900">
              {Object.keys(errors).length}
            </div>
            <div className="text-xs text-gray-600">Errors</div>
          </div>
        </div>
      </div>
    </div>
  );
}
