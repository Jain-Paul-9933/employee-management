"use client";

import React from "react";
import {
  Users,
  FileText,
  Settings,
  BarChart3,
  UserPlus,
  FormInput,
} from "lucide-react";
import { AuthService } from "@/services/auth";
import { useRouter } from "next/navigation";

function HomePage() {
  const router = useRouter();
  const handleNavigation = (page: string) => {
    // TODO: Replace with actual navigation logic (Next.js router, React Router, etc.)
    console.log(`Navigate to ${page}`);
    alert(`Navigating to ${page} page`);
  };

  const handleLogout = () => {
    try {
      const response = AuthService.logout();
      if (!response) {
        throw new Error("Server logout failed");
      } else router.push("/auth/login");
    } catch (error) {
      console.error("Logout failed:", error);
      alert("Logout failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-indigo-600 rounded-lg p-2">
                <Users className="h-8 w-8 text-white" />
              </div>
              <div className="ml-4">
                <h1 className="text-2xl font-bold text-gray-900">
                  Employee Management System
                </h1>
                <p className="text-sm text-gray-600">
                  Manage your workforce efficiently
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => handleNavigation("profile")}
                className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Profile
              </button>
              <button
                onClick={() => handleLogout()}
                className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Welcome Section */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Welcome to Your Dashboard
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Streamline your employee management with our comprehensive tools.
            Create employee profiles, build custom forms, and manage your
            workforce efficiently.
          </p>
        </div>

        {/* Navigation Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {/* Employee Creation Card */}
          <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden">
            <div className="p-8">
              <div className="flex items-center justify-center w-16 h-16 bg-indigo-100 rounded-lg mb-6 mx-auto">
                <UserPlus className="h-8 w-8 text-indigo-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 text-center mb-4">
                Employee Creation
              </h3>
              <p className="text-gray-600 text-center mb-6">
                Add new employees to your system with detailed profiles and
                information.
              </p>
              <button
                onClick={() => handleNavigation("employee-creation")}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200"
              >
                Create Employee
              </button>
            </div>
          </div>

          {/* Dynamic Form Builder Card */}
          <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden">
            <div className="p-8">
              <div className="flex items-center justify-center w-16 h-16 bg-purple-100 rounded-lg mb-6 mx-auto">
                <FormInput className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 text-center mb-4">
                Form Builder
              </h3>
              <p className="text-gray-600 text-center mb-6">
                Create custom forms dynamically for various employee-related
                processes.
              </p>
              <button
                onClick={() => handleNavigation("form-builder")}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200"
              >
                Build Forms
              </button>
            </div>
          </div>

          {/* Employee Directory Card */}
          <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden">
            <div className="p-8">
              <div className="flex items-center justify-center w-16 h-16 bg-green-100 rounded-lg mb-6 mx-auto">
                <Users className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 text-center mb-4">
                Employee Directory
              </h3>
              <p className="text-gray-600 text-center mb-6">
                View, search, and manage all employees in your organization.
              </p>
              <button
                onClick={() => handleNavigation("employee-directory")}
                className="w-full bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200"
              >
                View Directory
              </button>
            </div>
          </div>
        </div>

        {/* Quick Stats Section */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-12">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Quick Overview
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-6 bg-blue-50 rounded-lg">
              <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg mb-4 mx-auto">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <p className="text-3xl font-bold text-blue-600 mb-2">156</p>
              <p className="text-gray-600">Total Employees</p>
            </div>
            <div className="text-center p-6 bg-green-50 rounded-lg">
              <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-lg mb-4 mx-auto">
                <BarChart3 className="h-6 w-6 text-green-600" />
              </div>
              <p className="text-3xl font-bold text-green-600 mb-2">12</p>
              <p className="text-gray-600">Departments</p>
            </div>
            <div className="text-center p-6 bg-purple-50 rounded-lg">
              <div className="flex items-center justify-center w-12 h-12 bg-purple-100 rounded-lg mb-4 mx-auto">
                <FileText className="h-6 w-6 text-purple-600" />
              </div>
              <p className="text-3xl font-bold text-purple-600 mb-2">8</p>
              <p className="text-gray-600">Custom Forms</p>
            </div>
          </div>
        </div>

        {/* Additional Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex items-center mb-4">
              <Settings className="h-6 w-6 text-gray-600 mr-3" />
              <h3 className="text-lg font-semibold text-gray-900">
                System Settings
              </h3>
            </div>
            <p className="text-gray-600 mb-4">
              Configure system preferences, user roles, and organizational
              settings.
            </p>
            <button
              onClick={() => handleNavigation("settings")}
              className="text-indigo-600 hover:text-indigo-700 font-medium transition-colors"
            >
              Manage Settings →
            </button>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex items-center mb-4">
              <BarChart3 className="h-6 w-6 text-gray-600 mr-3" />
              <h3 className="text-lg font-semibold text-gray-900">
                Reports & Analytics
              </h3>
            </div>
            <p className="text-gray-600 mb-4">
              Generate comprehensive reports and analyze employee data and
              trends.
            </p>
            <button
              onClick={() => handleNavigation("reports")}
              className="text-indigo-600 hover:text-indigo-700 font-medium transition-colors"
            >
              View Reports →
            </button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-500 text-sm">
            <p>&copy; 2025 Employee Management System. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default HomePage;
