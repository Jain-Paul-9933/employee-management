"use client";

import React, { useState, useMemo } from "react";
import { Employee } from "@/types/employee";
import {
  Search,
  Filter,
  Edit,
  Trash2,
  Eye,
  Users,
  Calendar,
} from "lucide-react";
import { EmployeeListProps } from "@/types/employee";
import { formatDate } from "@/utils/common";

export default function EmployeeList({
  employees,
  templates,
  loading = false,
  onEdit,
  onDelete,
  onView,
  onBulkDelete,
}: EmployeeListProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState<number | "">("");
  const [selectedEmployees, setSelectedEmployees] = useState<Set<number>>(
    new Set()
  );
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState<"created_at" | "updated_at" | "name">(
    "created_at"
  );
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const getTemplate = (templateId: number) => {
    return templates.find((t) => t.id === templateId);
  };
  
  const getEmployeeName = (employee: Employee) => {
    const template = getTemplate(employee.form_template);
    if (!template) return `Employee #${employee.id}`;

    const nameFields = [
      "name",
      "full_name",
      "first_name",
      "employee_name",
      "full name",
      "Name",
    ];

    for (const field of template.fields) {
      const fieldKey = field.id;
      if (
        nameFields.some((nf) =>
          field.label.toLowerCase().includes(nf.toLowerCase())
        )
      ) {
        const value = employee.data[fieldKey];
        if (value && value.toString().trim()) {
          return value.toString();
        }
      }
    }

    for (const field of template.fields) {
      if (field.field_type === "TEXT" || field.field_type === "EMAIL") {
        const value = employee.data[field.id];
        if (value && value.toString().trim()) {
          return value.toString();
        }
      }
    }

    return `Employee #${employee.id}`;
  };

  const filteredEmployees = useMemo(() => {
    const filtered = employees.filter((employee) => {
      if (selectedTemplate && employee.form_template !== selectedTemplate) {
        return false;
      }

      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const template = getTemplate(employee.form_template);

        const name = getEmployeeName(employee).toLowerCase();
        if (name.includes(query)) return true;

        if (template?.name.toLowerCase().includes(query)) return true;

        if (template) {
          for (const field of template.fields) {
            const value = employee.data[field.id];
            if (value && value.toString().toLowerCase().includes(query)) {
              return true;
            }
          }
        }

        return false;
      }

      return true;
    });

    filtered.sort((a, b) => {
      let aValue: any, bValue: any;

      switch (sortBy) {
        case "name":
          aValue = getEmployeeName(a).toLowerCase();
          bValue = getEmployeeName(b).toLowerCase();
          break;
        case "created_at":
          aValue = new Date(a.created_at || 0);
          bValue = new Date(b.created_at || 0);
          break;
        case "updated_at":
          aValue = new Date(a.updated_at || 0);
          bValue = new Date(b.updated_at || 0);
          break;
        default:
          return 0;
      }

      if (aValue < bValue) return sortOrder === "asc" ? -1 : 1;
      if (aValue > bValue) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });

    return filtered;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [employees, templates, searchQuery, selectedTemplate, sortBy, sortOrder]);

  const handleSelectEmployee = (employeeId: number) => {
    setSelectedEmployees((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(employeeId)) {
        newSet.delete(employeeId);
      } else {
        newSet.add(employeeId);
      }
      return newSet;
    });
  };

  const handleSelectAll = () => {
    if (selectedEmployees.size === filteredEmployees.length) {
      setSelectedEmployees(new Set());
    } else {
      setSelectedEmployees(
        new Set(filteredEmployees.map((e) => e.id!).filter(Boolean))
      );
    }
  };

  //   const handleBulkDelete = () => {
  //     if (onBulkDelete && selectedEmployees.size > 0) {
  //       onBulkDelete(Array.from(selectedEmployees));
  //       setSelectedEmployees(new Set());
  //     }
  //   };

  const getDisplayData = (employee: Employee) => {
    const template = getTemplate(employee.form_template);
    if (!template) return {};

    const displayData: Record<string, any> = {};
    template.fields.forEach((field) => {
      const value = employee.data[field.id];
      if (value !== undefined && value !== null && value !== "") {
        displayData[field.label] = value;
      }
    });

    return displayData;
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border p-8">
        <div className="animate-pulse space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center space-x-4">
              <div className="w-4 h-4 bg-gray-200 rounded"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
              <div className="w-8 h-4 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return (
    <div className="bg-white rounded-lg shadow-sm border">
      {/* Header and Filters */}
      <div className="border-b px-6 py-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Employee Records</h2>
            <p className="text-sm text-gray-600">
              {filteredEmployees.length} of {employees.length} employees
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              <Filter className="w-4 h-4" />
              Filters
            </button>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search employees..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Template
                </label>
                <select
                  value={selectedTemplate}
                  onChange={(e) => setSelectedTemplate(e.target.value ? Number(e.target.value) : "")}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Templates</option>
                  {templates.map((template) => (
                    <option key={template.id} value={template.id}>
                      {template.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Sort By
                </label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="created_at">Created Date</option>
                  <option value="updated_at">Updated Date</option>
                  <option value="name">Name</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Order
                </label>
                <select
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value as any)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="desc">Newest First</option>
                  <option value="asc">Oldest First</option>
                </select>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="divide-y divide-gray-200">
        {filteredEmployees.length === 0 ? (
          <div className="p-12 text-center">
            <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-600 mb-2">
              {employees.length === 0
                ? "No employees yet"
                : "No employees found"}
            </h3>
            <p className="text-gray-500">
              {employees.length === 0
                ? "Create your first employee using one of your form templates"
                : "Try adjusting your search criteria or filters"}
            </p>
          </div>
        ) : (
          <>
            {onBulkDelete && (
              <div className="px-6 py-3 bg-gray-50">
                <label className="flex items-center gap-2 text-sm text-gray-700">
                  <input
                    type="checkbox"
                    checked={
                      selectedEmployees.size === filteredEmployees.length &&
                      filteredEmployees.length > 0
                    }
                    onChange={handleSelectAll}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  Select all ({filteredEmployees.length})
                </label>
              </div>
            )}

            {filteredEmployees.map((employee) => {
              const template = getTemplate(employee.form_template);
              const displayData = getDisplayData(employee);
              const isSelected = selectedEmployees.has(employee.id!);

              return (
                <div
                  key={employee.id}
                  className={`px-6 py-4 hover:bg-gray-50 transition-colors ${
                    isSelected ? "bg-blue-50" : ""
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 flex-1">
                      {onBulkDelete && (
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleSelectEmployee(employee.id!)}
                          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                      )}

                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-medium text-gray-900">
                            {getEmployeeName(employee)}
                          </h3>
                          <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                            {template?.name || "Unknown Template"}
                          </span>
                        </div>

                        {/* Display key field values */}
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 text-sm text-gray-600">
                          {Object.entries(displayData)
                            .slice(0, 4)
                            .map(([label, value]) => (
                              <div key={label}>
                                <span className="font-medium">{label}:</span>{" "}
                                <span className="text-gray-900">
                                  {value.toString().length > 20
                                    ? `${value.toString().substring(0, 20)}...`
                                    : value.toString()}
                                </span>
                              </div>
                            ))}
                        </div>

                        {/* Metadata */}
                        <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            <span>
                              Created{" "}
                              {employee.created_at
                                ? formatDate(employee.created_at)
                                : "Unknown"}
                            </span>
                          </div>
                          {employee.updated_at &&
                            employee.updated_at !== employee.created_at && (
                              <div className="flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                <span>
                                  Updated {formatDate(employee.updated_at)}
                                </span>
                              </div>
                            )}
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onView(employee)}
                        className="p-2 rounded-full hover:bg-gray-100"
                      >
                        <Eye className="w-4 h-4 text-gray-600" />
                      </button>
                      <button
                        onClick={() => onEdit(employee)}
                        className="p-2 rounded-full hover:bg-gray-100"
                      >
                        <Edit className="w-4 h-4 text-gray-600" />
                      </button>
                      <button
                        onClick={() => onDelete(employee)}
                        className="p-2 rounded-full hover:bg-gray-100"
                      >
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </>
        )}
      </div>
    </div>
  );
}
