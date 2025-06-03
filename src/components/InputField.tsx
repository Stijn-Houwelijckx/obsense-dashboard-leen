import React, { ChangeEvent, forwardRef } from "react";

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

const InputField = forwardRef<
  HTMLInputElement | HTMLTextAreaElement,
  InputFieldProps
>(
  (
    {
      label,
      placeholder,
      className = "",
      value,
      onChange,
      textarea = false,
      type = "text",
    },
    ref
  ) => (
    <div className="flex flex-col gap-1 w-full">
      <label className="text-sm font-medium">{label}</label>
      {textarea ? (
        <textarea
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className={className}
          ref={ref as React.Ref<HTMLTextAreaElement>}
        />
      ) : (
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className={className}
          ref={ref as React.Ref<HTMLInputElement>}
        />
      )}
    </div>
  )
);

export default InputField;
