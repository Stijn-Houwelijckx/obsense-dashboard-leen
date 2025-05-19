interface InputFieldProps {
  label: string;
  placeholder?: string;
  className?: string;
  textarea?: boolean;
  type?: string;
}

const InputField = ({
  label,
  placeholder,
  className,
  textarea = false,
}: InputFieldProps) => {
  return (
    <div className="flex flex-col items-start w-full">
      <label className="text-sm font-medium text-neutral-50 mb-1">
        {label}
      </label>
      {textarea ? (
        <textarea placeholder={placeholder} className={className} />
      ) : (
        <input type="text" placeholder={placeholder} className={className} />
      )}
    </div>
  );
};

export default InputField;
