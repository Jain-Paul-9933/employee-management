import { FormField } from "@/types/form";

export const renderFieldPreview = (field: FormField) => {
  const commonProps = {
    placeholder: field.placeholder || field.label,
    className:
      "w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent",
    disabled: true,
  };

  switch (field.field_type) {
    case "TEXT":
      return <input type="text" {...commonProps} />;
    case "NUMBER":
      return <input type="number" {...commonProps} />;
    case "EMAIL":
      return <input type="email" {...commonProps} />;
    case "PASSWORD":
      return <input type="password" {...commonProps} />;
    case "DATE":
      return <input type="date" {...commonProps} />;
    case "TEXTAREA":
      return <textarea {...commonProps} rows={4} />;
    case "SELECT":
      return (
        <select {...commonProps}>
          <option value="">Select an option</option>
          {field.options?.map((option: string, index: number) => (
            <option key={index} value={option}>
              {option}
            </option>
          ))}
        </select>
      );
    default:
      return <input type="text" {...commonProps} />;
  }
};
