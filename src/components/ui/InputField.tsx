import { forwardRef, InputHTMLAttributes } from "react";
import { Label, TextInput } from "flowbite-react";

interface InputFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  helperText?: string;
}

export const InputField = forwardRef<HTMLInputElement, InputFieldProps>(
  ({ label, error, helperText, className, ...props }, ref) => (
    <div className="flex flex-col gap-2">
      <Label value={label} className="text-sm font-semibold text-text-primary" />
      <TextInput
        {...props}
        ref={ref}
        color={error ? "failure" : "gray"}
        helperText={error ?? helperText}
        className={className}
        theme={{
          field: {
            input: {
              colors: {
                gray:
                  "border border-border-subtle bg-white text-text-primary focus:border-primary focus:ring-primary",
                failure:
                  "border border-danger bg-white text-text-primary focus:border-danger focus:ring-danger",
              },
            },
          },
        }}
      />
    </div>
  ),
);
InputField.displayName = "InputField";
