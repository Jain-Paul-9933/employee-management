import { Metadata } from "next";
import {LoginForm} from "@/components/auth";

export const metadata: Metadata = {
  title: 'Login',
  description: 'Login to your account',
}

function LoginPage() {
  return <LoginForm />;
}

export default LoginPage;
