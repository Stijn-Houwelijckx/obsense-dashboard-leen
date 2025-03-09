import PropTypes from "prop-types";

const Button = ({ label, type }) => {
  return (
    <button
      className="w-full p-3.5 mt-10 font-bold rounded-lg text-neutral-950 bg-primary-500"
      type={type}
    >
      {label}
    </button>
  );
};

Button.propTypes = {
  label: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
};

export default Button;
