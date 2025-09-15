import { FormTemplate } from "./form";

export interface Employee {
  id?: number;
  form_template: number;
  data: Record<string, any>;
  created_at?: string;
  updated_at?: string;
}

export interface EmployeeFormProps {
  template: FormTemplate;
  initialData?: Employee;
  onSubmit: (data: Record<string, any>) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
  mode?: 'create' | 'edit';
}

export interface EmployeeListProps {
  employees: Employee[];
  templates: FormTemplate[];
  loading?: boolean;
  onEdit: (employee: Employee) => void;
  onDelete: (employee: Employee) => void;
  onView: (employee: Employee) => void;
  onBulkDelete?: (employeeIds: number[]) => void;
}