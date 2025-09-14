import Forms from "@/components/form-builder/Forms";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Forms",
  description: "Manage forms",
};

function FormsPage() {
  return <Forms />;
}

export default FormsPage;
