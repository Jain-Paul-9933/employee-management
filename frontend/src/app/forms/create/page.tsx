import CreateForm from "@/components/forms/CreateForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create Form",
  description: "Create a new form",
};

function CreateFormPage() {
  return <CreateForm />;
}

export default CreateFormPage;
