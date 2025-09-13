import { RegisterForm } from "@/components/auth";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: 'Create Account',
  description: 'Create a new account',
}

function RegisterPage() {
  return <RegisterForm />;
}

export default RegisterPage;
