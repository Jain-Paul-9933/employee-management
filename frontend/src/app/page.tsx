import Dashboard from "@/components/Dashboard";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard - Employee Management",
  description: "Overview of employee management system",
};

export default function DashboardPage() {
  return <Dashboard />;
}
