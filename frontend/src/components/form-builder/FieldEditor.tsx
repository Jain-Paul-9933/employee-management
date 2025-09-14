import React, { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { FormField } from '@/types/form';
import { Trash2, GripVertical, Edit3, Check, X, Plus } from 'lucide-react';

interface FieldEditorProps {
  field: FormField;
  onChange: (field: FormField) => void;
  onRemove: () => void;
}

export default function FieldEditor({ field, onChange, onRemove }: FieldEditorProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedField, setEditedField] = useState<FormField>(field);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: field.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const handleSave = () => {
    onChange(editedField);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedField(field);
    setIsEditing(false);
  };

  const addOption = () => {
    const newOptions = [...(editedField.options || []), ''];
    setEditedField({ ...editedField, options: newOptions });
  };

  const updateOption = (index: number, value: string) => {
    const newOptions = [...(editedField.options || [])];
    newOptions[index] = value;
    setEditedField({ ...editedField, options: newOptions });
  };

  const removeOption = (index: number) => {
    const newOptions = (editedField.options || []).filter((_, i) => i !== index);
    setEditedField({ ...editedField, options: newOptions });
  };

  const renderFieldPreview = () => {
    const commonProps = {
      placeholder: field.placeholder || field.label,
      className: "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent",
      disabled: true
    };

    switch (field.field_type) {
      case 'TEXT':
        return <input type="text" {...commonProps} />;
      case 'NUMBER':
        return <input type="number" {...commonProps} />;
      case 'EMAIL':
        return <input type="email" {...commonProps} />;
      case 'PASSWORD':
        return <input type="password" {...commonProps} />;
      case 'DATE':
        return <input type="date" {...commonProps} />;
      case 'TEXTAREA':
        return <textarea {...commonProps} rows={3} />;
      case 'SELECT':
        return (
          <select {...commonProps}>
            <option value="">Select an option</option>
            {field.options?.map((option, index) => (
              <option key={index} value={option}>
                {option || `Option ${index + 1}`}
              </option>
            ))}
          </select>
        );
      default:
        return <input type="text" {...commonProps} />;
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`bg-white border rounded-lg p-4 shadow-sm transition-all duration-200 ${
        isDragging ? 'shadow-lg scale-105 opacity-90' : 'hover:shadow-md'
      }`}
    >
      {/* Field Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div
            className="cursor-move p-1 text-gray-400 hover:text-gray-600"
            {...attributes}
            {...listeners}
          >
            <GripVertical className="w-5 h-5" />
          </div>
          <span className="font-medium text-gray-700">
            {field.field_type} Field
          </span>
          {field.is_required && (
            <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full">
              Required
            </span>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="p-1 text-gray-500 hover:text-blue-600 transition-colors"
              title="Edit field"
            >
              <Edit3 className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onRemove}
            className="p-1 text-gray-500 hover:text-red-600 transition-colors"
            title="Remove field"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {isEditing ? (
        /* Edit Mode */
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Field Label
              </label>
              <input
                type="text"
                value={editedField.label}
                onChange={(e) => setEditedField({ ...editedField, label: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter field label"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Placeholder
              </label>
              <input
                type="text"
                value={editedField.placeholder || ''}
                onChange={(e) => setEditedField({ ...editedField, placeholder: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter placeholder text"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={editedField.is_required}
                onChange={(e) => setEditedField({ ...editedField, is_required: e.target.checked })}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">Required field</span>
            </label>
          </div>

          {/* Options for SELECT field */}
          {editedField.field_type === 'SELECT' && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  Options
                </label>
                <button
                  type="button"
                  onClick={addOption}
                  className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800"
                >
                  <Plus className="w-3 h-3" />
                  Add Option
                </button>
              </div>
              <div className="space-y-2">
                {editedField.options?.map((option, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <input
                      type="text"
                      value={option}
                      onChange={(e) => updateOption(index, e.target.value)}
                      placeholder={`Option ${index + 1}`}
                      className="flex-1 px-3 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                    <button
                      type="button"
                      onClick={() => removeOption(index)}
                      className="p-1 text-gray-400 hover:text-red-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex items-center gap-2 pt-2">
            <button
              onClick={handleSave}
              className="flex items-center gap-1 px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors"
            >
              <Check className="w-4 h-4" />
              Save
            </button>
            <button
              onClick={handleCancel}
              className="flex items-center gap-1 px-3 py-1 bg-gray-200 text-gray-700 text-sm rounded hover:bg-gray-300 transition-colors"
            >
              <X className="w-4 h-4" />
              Cancel
            </button>
          </div>
        </div>
      ) : (
        /* Preview Mode */
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {field.label}
            {field.is_required && <span className="text-red-500 ml-1">*</span>}
          </label>
          {renderFieldPreview()}
        </div>
      )}
    </div>
  );
}