import { FormErrors, RegisterFormData } from "@/types/auth";

// Validation functions
const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validatePassword = (password: string): boolean => {
  // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;
  return passwordRegex.test(password);
};

export const validateForm = (
  formData: RegisterFormData,
  setErrors: (errors: FormErrors) => void
): boolean => {
  const newErrors: FormErrors = {};

  // Username validation
  if (!formData.username.trim()) {
    newErrors.username = "Username is required";
  } else if (formData.username.length < 3) {
    newErrors.username = "Username must be at least 3 characters";
  }

  // Email validation
  if (!formData.email.trim()) {
    newErrors.email = "Email is required";
  } else if (!validateEmail(formData.email)) {
    newErrors.email = "Please enter a valid email address";
  }

  // Password validation
  if (!formData.password) {
    newErrors.password = "Password is required";
  } else if (!validatePassword(formData.password)) {
    newErrors.password =
      "Password must be at least 8 characters with uppercase, lowercase, and number";
  }

  // Confirm password validation
  if (!formData.confirmPassword) {
    newErrors.confirmPassword = "Please confirm your password";
  } else if (formData.password !== formData.confirmPassword) {
    newErrors.confirmPassword = "Passwords do not match";
  }

  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
};
