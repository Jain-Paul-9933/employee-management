import { LucideProps } from "lucide-react";

export interface FormField {
  id: string;
  field_type:
    | "TEXT"
    | "NUMBER"
    | "DATE"
    | "PASSWORD"
    | "EMAIL"
    | "TEXTAREA"
    | "SELECT";
  label: string;
  placeholder?: string;
  is_required: boolean;
  order: number;
  options?: string[];
}

export interface FormTemplate {
   id?: number | string;
  name: string;
  description?: string;
  fields: FormField[];
  created_at?: string;
  updated_at?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: Record<string, string[]>;
}

export const FIELD_TYPES = [
  { value: "TEXT", label: "Text Input", icon: "Type" },
  { value: "NUMBER", label: "Number", icon: "Hash" },
  { value: "EMAIL", label: "Email", icon: "Mail" },
  { value: "PASSWORD", label: "Password", icon: "Lock" },
  { value: "DATE", label: "Date", icon: "Calendar" },
  { value: "TEXTAREA", label: "Textarea", icon: "FileText" },
  { value: "SELECT", label: "Select Dropdown", icon: "ChevronDown" },
] as const;

export interface FormBuilderProps {
  initialTemplate?: FormTemplate;
  onSave: (template: FormTemplate) => Promise<void>;
  onPreview?: (template: FormTemplate) => void;
}

export type IconType = React.ForwardRefExoticComponent<
  Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>
>;
