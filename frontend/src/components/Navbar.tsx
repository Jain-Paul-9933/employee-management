// components/Navbar.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Users,
  FileText,
  Settings,
  LogOut,
  Menu,
  X,
  User,
  ChevronDown,
} from "lucide-react";
import { AuthService } from "@/services/auth";

export default function Navbar() {
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);

  // Mock user data - replace with actual user context
  const user = {
    name: "John Doe",
    email: "john@example.com",
    initials: "JD",
  };

  const handleLogout = async () => {
    await AuthService.logout();
    router.push("/auth/login");
  };

  const navigationItems = [
    {
      name: "Forms",
      href: "/forms",
      icon: FileText,
      current: false,
    },
    {
      name: "Employees",
      href: "/employees",
      icon: Users,
      current: false,
    },
  ];

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Left side */}
          <div className="flex">
            {/* Logo */}
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="flex items-center gap-2">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <Users className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-semibold text-gray-900">EMS</span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden sm:ml-8 sm:flex sm:space-x-8">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md transition-colors"
                  >
                    <Icon className="w-4 h-4" />
                    {item.name}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-4">
            {/* Profile dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md transition-colors"
              >
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium text-blue-700">
                    {user.initials}
                  </span>
                </div>
                <span className="hidden md:block">{user.name}</span>
                <ChevronDown className="w-4 h-4" />
              </button>

              {/* Dropdown menu */}
              {isProfileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 z-50">
                  <div className="py-1">
                    <div className="px-4 py-2 text-sm text-gray-700 border-b">
                      <div className="font-medium">{user.name}</div>
                      <div className="text-gray-500">{user.email}</div>
                    </div>

                    <Link
                      href="/profile"
                      className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setIsProfileDropdownOpen(false)}
                    >
                      <User className="w-4 h-4" />
                      Profile
                    </Link>

                    <Link
                      href="/settings"
                      className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setIsProfileDropdownOpen(false)}
                    >
                      <Settings className="w-4 h-4" />
                      Settings
                    </Link>

                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-2 w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-gray-100"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign out
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="sm:hidden p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md"
            >
              {isMobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <div className="sm:hidden border-t">
            <div className="pt-2 pb-3 space-y-1">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="flex items-center gap-3 px-3 py-2 text-base font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Icon className="w-5 h-5" />
                    {item.name}
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Overlay for mobile dropdown */}
      {(isMobileMenuOpen || isProfileDropdownOpen) && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => {
            setIsMobileMenuOpen(false);
            setIsProfileDropdownOpen(false);
          }}
        />
      )}
    </nav>
  );
}
