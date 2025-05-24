import {
  FieldErrors,
  Path,
  RegisterOptions,
  UseFormRegister,
} from "react-hook-form";

interface Props<T extends Record<string, unknown>> {
  label: string;
  name: Path<T>;
  type: string;
  placeholder: string;
  register: UseFormRegister<T>;
  errors: FieldErrors<T>;
  validation?: RegisterOptions<T, Path<T>>;
  labelClassName?: string;
  inputClassName?: string;
  errorMessage?: string;
}

const FormInput = <T extends Record<string, unknown>>({
  label,
  name,
  type,
  placeholder,
  register,
  errors,
  validation,
  labelClassName = "",
  inputClassName = "",
}: Props<T>) => {
  return (
    <div className="flex flex-col gap-1.5">
      <label className={`font-medium ${labelClassName}`}>{label}</label>{" "}
      <input
        className={`border rounded-lg bg-secondary-700 placeholder-neutral-500 px-3 py-2.5 ${inputClassName}`}
        type={type}
        placeholder={placeholder}
        {...register(name, validation)}
      />
      {errors[name] && (
        <p className="text-sm text-red-500">
          {errors[name]?.message?.toString()}
        </p>
      )}
    </div>
  );
};

export default FormInput;
