"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import { FileText, Users, TrendingUp, Clock, BarChart3 } from "lucide-react";
import { RecentActivity, Stats } from "@/types/common";

export default function Dashboard() {
  const router = useRouter();

  // Mock data - replace with real API calls
  const [stats, setStats] = useState<Stats>({
    totalForms: 0,
    totalEmployees: 0,
    recentActivities: [],
    loading: true,
  });

  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => {
      setStats({
        totalForms: 5,
        totalEmployees: 12,
        recentActivities: [
          {
            id: 1,
            action: 'Created form template "Employee Onboarding"',
            time: "2 hours ago",
            type: "form",
          },
          {
            id: 2,
            action: 'Added new employee "John Smith"',
            time: "4 hours ago",
            type: "employee",
          },
          {
            id: 3,
            action: 'Updated form template "Performance Review"',
            time: "1 day ago",
            type: "form",
          },
        ],
        loading: false,
      });
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const quickActions = [
    {
      title: "Create Form Template",
      description: "Build a new dynamic form",
      icon: FileText,
      color: "blue",
      href: "/forms/create",
    },
    {
      title: "Add Employee",
      description: "Create a new employee record",
      icon: Users,
      color: "green",
      href: "/employees/create",
    },
    {
      title: "View All Forms",
      description: "Manage your form templates",
      icon: BarChart3,
      color: "purple",
      href: "/forms",
    },
  ];

  if (stats.loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center h-96">
          <div className="flex items-center space-x-2">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="text-gray-600">Loading dashboard...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600 mt-1">
              Welcome to your Employee Management System
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Forms</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {stats.totalForms}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <Users className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Total Employees
                </p>
                <p className="text-2xl font-semibold text-gray-900">
                  {stats.totalEmployees}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">This Month</p>
                <p className="text-2xl font-semibold text-gray-900">
                  +{Math.floor(stats.totalEmployees * 0.3)}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Clock className="w-6 h-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Active Today
                </p>
                <p className="text-2xl font-semibold text-gray-900">
                  {Math.floor(stats.totalEmployees * 0.8)}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">
              Quick Actions
            </h2>

            <div className="space-y-4">
              {quickActions.map((action) => {
                const Icon = action.icon;
                const colorClasses = {
                  blue: "bg-blue-100 text-blue-600 hover:bg-blue-200",
                  green: "bg-green-100 text-green-600 hover:bg-green-200",
                  purple: "bg-purple-100 text-purple-600 hover:bg-purple-200",
                };

                return (
                  <button
                    key={action.title}
                    onClick={() => router.push(action.href)}
                    className="w-full flex items-center gap-4 p-4 border border-gray-200 rounded-lg hover:border-gray-300 hover:bg-gray-50 transition-all text-left"
                  >
                    <div
                      className={`p-3 rounded-lg transition-colors ${
                        colorClasses[action.color as keyof typeof colorClasses]
                      }`}
                    >
                      <Icon className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">
                        {action.title}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {action.description}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">
                Recent Activity
              </h2>
              <button className="text-sm text-blue-600 hover:text-blue-800">
                View all
              </button>
            </div>

            <div className="space-y-4">
              {stats.recentActivities.length === 0 ? (
                <p className="text-gray-500 text-center py-8">
                  No recent activity
                </p>
              ) : (
                stats.recentActivities.map((activity: RecentActivity) => (
                  <div key={activity.id} className="flex items-start gap-3">
                    <div
                      className={`p-2 rounded-full ${
                        activity.type === "form"
                          ? "bg-blue-100"
                          : "bg-green-100"
                      }`}
                    >
                      {activity.type === "form" ? (
                        <FileText
                          className={`w-4 h-4 ${
                            activity.type === "form"
                              ? "text-blue-600"
                              : "text-green-600"
                          }`}
                        />
                      ) : (
                        <Users className="w-4 h-4 text-green-600" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-900">{activity.action}</p>
                      <p className="text-xs text-gray-500">{activity.time}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
