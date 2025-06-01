import React, { ChangeEvent } from "react";

interface InputFieldProps {
  label: string;
  placeholder: string;
  className?: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  textarea?: boolean;
  error?: string;
  type?: string;
  autoComplete?: string;
}

const InputField: React.FC<InputFieldProps> = ({
  label,
  placeholder,
  className = "",
  value,
  onChange,
  textarea = false,
  type = "text",
}) => {
  return (
    <div className="flex flex-col gap-1 w-full">
      <label className="text-sm font-medium">{label}</label>
      {textarea ? (
        <textarea
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className={className}
        />
      ) : (
        <input
          type={type || "text"}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className={className}
        />
      )}
    </div>
  );
};

export default InputField;
