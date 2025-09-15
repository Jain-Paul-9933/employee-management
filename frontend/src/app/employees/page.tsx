"use client";

import React, { useState, useEffect } from "react";
import EmployeeList from "@/components/employee/EmployeeList";
import EmployeeForm from "@/components/employee/EmployeeForm";
import { Employee } from "@/types/employee";
import { FormTemplate } from "@/types/form";
import { EmployeesService } from "@/services/employees";
import { FormsService } from "@/services/forms";
import { Plus, X, Users, FileText } from "lucide-react";
import toast from "react-hot-toast";
import Navbar from "@/components/Navbar";

type ViewMode = "list" | "create" | "edit" | "view";

export default function EmployeesPage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [templates, setTemplates] = useState<FormTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<FormTemplate | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [employeesData, templatesData] = await Promise.all([
        EmployeesService.getEmployees(),
        FormsService.getForms(),
      ]);
      
      setEmployees(employeesData.results || employeesData);
      setTemplates(templatesData.results || templatesData);
    } catch (error) {
      console.error("Error loading data:", error);
      toast.error("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateEmployee = async (formData: Record<string, any>) => {
    if (!selectedTemplate) {
      toast.error("No template selected");
      return;
    }

    try {
      setIsSubmitting(true);
      const newEmployee = await EmployeesService.createEmployee({
        form_template: selectedTemplate.id as number,
        data: formData,
      });
      
      setEmployees(prev => [newEmployee, ...prev]);
      toast.success("Employee created successfully");
      setViewMode("list");
      setSelectedTemplate(null);
    } catch (error) {
      console.error("Error creating employee:", error);
      toast.error("Failed to create employee");
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateEmployee = async (formData: Record<string, any>) => {
    if (!selectedEmployee) {
      toast.error("No employee selected");
      return;
    }

    try {
      setIsSubmitting(true);
      const updatedEmployee = await EmployeesService.updateEmployee(
        selectedEmployee.id!,
        { data: formData }
      );
      
      setEmployees(prev => 
        prev.map(emp => emp.id === selectedEmployee.id ? updatedEmployee : emp)
      );
      toast.success("Employee updated successfully");
      setViewMode("list");
      setSelectedEmployee(null);
    } catch (error) {
      console.error("Error updating employee:", error);
      toast.error("Failed to update employee");
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteEmployee = async (employee: Employee) => {
    if (!confirm(`Are you sure you want to delete Employee #${employee.id}?`)) {
      return;
    }

    try {
      await EmployeesService.deleteEmployee(employee.id!);
      setEmployees(prev => prev.filter(emp => emp.id !== employee.id));
      toast.success("Employee deleted successfully");
    } catch (error) {
      console.error("Error deleting employee:", error);
      toast.error("Failed to delete employee");
    }
  };

  const handleEditEmployee = (employee: Employee) => {
    const template = templates.find(t => t.id === employee.form_template);
    if (template) {
      setSelectedEmployee(employee);
      setSelectedTemplate(template);
      setViewMode("edit");
    } else {
      toast.error("Template not found for this employee");
    }
  };

  const handleViewEmployee = (employee: Employee) => {
    const template = templates.find(t => t.id === employee.form_template);
    if (template) {
      setSelectedEmployee(employee);
      setSelectedTemplate(template);
      setViewMode("view");
    } else {
      toast.error("Template not found for this employee");
    }
  };

  const handleCreateNew = (template: FormTemplate) => {
    setSelectedTemplate(template);
    setSelectedEmployee(null);
    setViewMode("create");
  };

  const handleCancel = () => {
    setViewMode("list");
    setSelectedEmployee(null);
    setSelectedTemplate(null);
  };

  const renderContent = () => {
    switch (viewMode) {
      case "create":
        if (!selectedTemplate) return null;
        return (
          <EmployeeForm
            template={selectedTemplate}
            onSubmit={handleCreateEmployee}
            onCancel={handleCancel}
            isLoading={isSubmitting}
            mode="create"
          />
        );

      case "edit":
        if (!selectedTemplate || !selectedEmployee) return null;
        return (
          <EmployeeForm
            template={selectedTemplate}
            initialData={selectedEmployee}
            onSubmit={handleUpdateEmployee}
            onCancel={handleCancel}
            isLoading={isSubmitting}
            mode="edit"
          />
        );

      case "view":
        if (!selectedTemplate || !selectedEmployee) return null;
        return (
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="border-b px-6 py-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">
                    View Employee
                  </h2>
                  <p className="text-sm text-gray-600 mt-1">
                    Template: <span className="font-medium">{selectedTemplate.name}</span>
                  </p>
                </div>
                <button
                  onClick={handleCancel}
                  className="p-2 rounded-full hover:bg-gray-100"
                >
                  <X className="w-5 h-5 text-gray-600" />
                </button>
              </div>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {selectedTemplate.fields.map((field: any) => {
                  const value = selectedEmployee.data[field.id];
                  return (
                    <div key={field.id}>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {field.label}
                      </label>
                      <div className="p-3 bg-gray-50 rounded-lg border">
                        {value ? (
                          <span className="text-gray-900">{value.toString()}</span>
                        ) : (
                          <span className="text-gray-400 italic">Not provided</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
              
              <div className="mt-6 pt-6 border-t">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-600">
                    Created: {selectedEmployee.created_at ? new Date(selectedEmployee.created_at).toLocaleDateString() : "Unknown"}
                    {selectedEmployee.updated_at && selectedEmployee.updated_at !== selectedEmployee.created_at && (
                      <span className="ml-4">
                        Updated: {new Date(selectedEmployee.updated_at).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() => handleEditEmployee(selectedEmployee)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Edit Employee
                  </button>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Employees</h1>
                  <p className="text-gray-600 mt-1">
                    Manage your employee records using dynamic forms
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-sm text-gray-600">
                    <Users className="w-4 h-4 inline mr-1" />
                    {employees.length} employees
                  </div>
                </div>
              </div>
            </div>

            {templates.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Create New Employee
                </h2>
                <p className="text-gray-600 mb-4">
                  Select a form template to create a new employee record:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {templates.map((template) => (
                    <button
                      key={template.id}
                      onClick={() => handleCreateNew(template)}
                      className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors text-left"
                    >
                      <div className="flex items-center gap-3">
                        <FileText className="w-5 h-5 text-blue-600" />
                        <div>
                          <h3 className="font-medium text-gray-900">{template.name}</h3>
                          <p className="text-sm text-gray-600">
                            {template.fields.length} fields
                          </p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            <EmployeeList
              employees={employees}
              templates={templates}
              loading={loading}
              onEdit={handleEditEmployee}
              onDelete={handleDeleteEmployee}
              onView={handleViewEmployee}
            />
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar/>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderContent()}
      </div>
    </div>
  );
}
