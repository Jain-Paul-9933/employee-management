import { Metadata } from "next";
import RegisterForm from "@/components/auth/RegisterForm";

export const metadata: Metadata = {
  title: 'Create Account',
  description: 'Create a new account',
}

function page() {
  return <RegisterForm />;
}

export default page;
