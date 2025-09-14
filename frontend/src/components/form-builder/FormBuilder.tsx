"use client";

import React, { useState } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import {
  restrictToVerticalAxis,
  restrictToFirstScrollableAncestor,
} from "@dnd-kit/modifiers";

import {
  FormField,
  FormTemplate,
  FIELD_TYPES,
  IconType,
  FormBuilderProps,
} from "@/types/form";
import FieldEditor from "./FieldEditor";
import {
  Save,
  Eye,
  EyeOff,
  Download,
  Type,
  Hash,
  Mail,
  Lock,
  Calendar,
  FileText,
  ChevronDown,
} from "lucide-react";
import toast from "react-hot-toast";

// Icon mapping for field types
const IconMap: Record<string, IconType> = {
  Type,
  Hash,
  Mail,
  Lock,
  Calendar,
  FileText,
  ChevronDown,
};

export default function FormBuilder({
  initialTemplate,
  onSave,
  onPreview,
}: FormBuilderProps) {
  const [template, setTemplate] = useState<FormTemplate>(
    initialTemplate || {
      name: "",
      description: "",
      fields: [],
    }
  );
  const [showPreview, setShowPreview] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Generate unique ID for new fields
  const generateFieldId = () =>
    `field_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  const addField = (fieldType: FormField["field_type"]) => {
    const newField: FormField = {
      id: generateFieldId(),
      field_type: fieldType,
      label: `New ${fieldType.toLowerCase()} field`,
      placeholder: "",
      is_required: false,
      order: template.fields.length,
      ...(fieldType === "SELECT" && { options: ["Option 1", "Option 2"] }),
    };

    setTemplate((prev) => ({
      ...prev,
      fields: [...prev.fields, newField],
    }));

    toast.success(`${fieldType} field added!`);
  };

  const updateField = (fieldId: string, updatedField: FormField) => {
    setTemplate((prev) => ({
      ...prev,
      fields: prev.fields.map((field) =>
        field.id === fieldId ? updatedField : field
      ),
    }));
  };

  const removeField = (fieldId: string) => {
    setTemplate((prev) => ({
      ...prev,
      fields: prev.fields.filter((field) => field.id !== fieldId),
    }));
    toast.success("Field removed!");
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      setTemplate((prev) => {
        const oldIndex = prev.fields.findIndex(
          (field) => field.id === active.id
        );
        const newIndex = prev.fields.findIndex(
          (field) => field.id === over?.id
        );

        const newFields = arrayMove(prev.fields, oldIndex, newIndex);

        // Update order values
        const updatedFields = newFields.map((field, index) => ({
          ...field,
          order: index,
        }));

        return {
          ...prev,
          fields: updatedFields,
        };
      });
    }
  };

  const handleSave = async () => {
    if (!template.name.trim()) {
      toast.error("Please enter a form name");
      return;
    }

    if (template.fields.length === 0) {
      toast.error("Please add at least one field");
      return;
    }

    setIsSaving(true);
    try {
      await onSave(template);
      toast.success("Form saved successfully!");
    } catch (error: any) {
      toast.error(error.message || "Failed to save form");
    } finally {
      setIsSaving(false);
    }
  };

  const handlePreview = () => {
    if (template.fields.length === 0) {
      toast.error("Add some fields to preview the form");
      return;
    }
    setShowPreview(!showPreview);
    onPreview?.(template);
  };

  const exportTemplate = () => {
    const dataStr = JSON.stringify(template, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${template.name || "form-template"}.json`;
    link.click();
    URL.revokeObjectURL(url);
    toast.success("Template exported!");
  };

  const renderFormField = (field: FormField) => {
    const commonProps = {
      placeholder: field.placeholder || field.label,
      className:
        "w-full px-4 py-2 text-black border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent",
    };

    switch (field.field_type) {
      case "TEXT":
        return <input type="text" {...commonProps} />;
      case "NUMBER":
        return <input type="number" {...commonProps} />;
      case "EMAIL":
        return <input type="email" {...commonProps} />;
      case "PASSWORD":
        return <input type="password" {...commonProps} />;
      case "DATE":
        return <input type="date" {...commonProps} />;
      case "TEXTAREA":
        return <textarea {...commonProps} rows={4} />;
      case "SELECT":
        return (
          <select {...commonProps}>
            <option value="">Select an option</option>
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

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Form Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={template.name}
                onChange={(e) =>
                  setTemplate((prev) => ({ ...prev, name: e.target.value }))
                }
                placeholder="Enter form name"
                className="w-full px-4 py-2 text-black border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                value={template.description || ""}
                onChange={(e) =>
                  setTemplate((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                placeholder="Enter form description (optional)"
                rows={3}
                className="w-full px-4 py-2 text-black border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              />
            </div>
          </div>

          <div className="flex flex-col justify-center space-y-3">
            <div className="text-sm text-gray-600">
              <div>Fields: {template.fields.length}</div>
              <div>
                Required: {template.fields.filter((f) => f.is_required).length}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Form Builder */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-lg shadow-sm border">
            {/* Toolbar */}
            <div className="border-b px-6 py-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-800">
                  Form Builder
                </h2>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handlePreview}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      showPreview
                        ? "bg-gray-200 text-gray-700"
                        : "bg-blue-100 text-blue-700 hover:bg-blue-200"
                    }`}
                  >
                    {showPreview ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                    {showPreview ? "Edit" : "Preview"}
                  </button>

                  <button
                    onClick={exportTemplate}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    Export
                  </button>

                  <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors disabled:opacity-50"
                  >
                    <Save className="w-4 h-4" />
                    {isSaving ? "Saving..." : "Save Form"}
                  </button>
                </div>
              </div>
            </div>

            {/* Form Content */}
            <div className="p-6">
              {showPreview ? (
                /* Preview Mode */
                <div className="max-w-2xl mx-auto">
                  <div className="mb-6">
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">
                      {template.name || "Untitled Form"}
                    </h3>
                    {template.description && (
                      <p className="text-gray-600">{template.description}</p>
                    )}
                  </div>

                  <form className="space-y-6">
                    {template.fields.map((field) => (
                      <div key={field.id}>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          {field.label}
                          {field.is_required && (
                            <span className="text-red-500 ml-1">*</span>
                          )}
                        </label>
                        {renderFormField(field)}
                      </div>
                    ))}

                    <button
                      type="submit"
                      className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                      onClick={(e) => e.preventDefault()}
                    >
                      Submit Form (Preview)
                    </button>
                  </form>
                </div>
              ) : (
                /* Edit Mode */
                <>
                  {template.fields.length === 0 ? (
                    <div className="text-center py-12">
                      <div className="text-gray-400 mb-4">
                        <FileText className="w-16 h-16 mx-auto" />
                      </div>
                      <h3 className="text-lg font-medium text-gray-600 mb-2">
                        No fields yet
                      </h3>
                      <p className="text-gray-500 mb-6">
                        Start building your form by adding some fields
                      </p>
                    </div>
                  ) : (
                    <DndContext
                      sensors={sensors}
                      collisionDetection={closestCenter}
                      onDragEnd={handleDragEnd}
                      modifiers={[
                        restrictToVerticalAxis,
                        restrictToFirstScrollableAncestor,
                      ]}
                    >
                      <SortableContext
                        items={template.fields.map((field) => field.id)}
                        strategy={verticalListSortingStrategy}
                      >
                        <div className="space-y-4">
                          {template.fields.map((field) => (
                            <FieldEditor
                              key={field.id}
                              field={field}
                              onChange={(updatedField) =>
                                updateField(field.id, updatedField)
                              }
                              onRemove={() => removeField(field.id)}
                            />
                          ))}
                        </div>
                      </SortableContext>
                    </DndContext>
                  )}
                </>
              )}
            </div>
          </div>
        </div>

        {/* Field Types Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm border sticky top-6">
            <div className="border-b px-4 py-3">
              <h3 className="font-semibold text-gray-800">Field Types</h3>
            </div>

            <div className="p-4">
              <div className="grid grid-cols-1 gap-2">
                {FIELD_TYPES.map((fieldType) => {
                  const Icon = IconMap[fieldType.icon];
                  return (
                    <button
                      key={fieldType.value}
                      onClick={() => addField(fieldType.value)}
                      className="flex items-center gap-3 p-3 text-left border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-all duration-200 group"
                    >
                      <div className="p-2 bg-gray-100 rounded-lg group-hover:bg-blue-100 transition-colors">
                        <Icon className="w-4 h-4 text-gray-600 group-hover:text-blue-600" />
                      </div>
                      <div>
                        <div className="font-medium text-sm text-gray-800">
                          {fieldType.label}
                        </div>
                        <div className="text-xs text-gray-500">
                          {fieldType.value}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
