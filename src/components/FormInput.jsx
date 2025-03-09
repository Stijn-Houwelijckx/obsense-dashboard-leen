import PropTypes from "prop-types";

const FormInput = ({
  label,
  name,
  type,
  placeholder,
  register,
  errors,
  validation,
}) => {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="font-medium">{label}</label>
      <input
        className="border rounded-lg bg-secondary-700 placeholder-neutral-500 px-3 py-2.5"
        type={type}
        name={name}
        placeholder={placeholder}
        {...register(name, validation)}
      />
      {errors[name] && <p className="text-red-500">{errors[name]?.message}</p>}
    </div>
  );
};

FormInput.propTypes = {
  label: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  placeholder: PropTypes.string.isRequired,
  register: PropTypes.func.isRequired,
  errors: PropTypes.object.isRequired,
  validation: PropTypes.object.isRequired,
};

export default FormInput;
