import propTypes from "prop-types";

const LogoButton = ({ icon: Icon, type }) => {
  return (
    <button
      className="flex flex-1 justify-center bg-primary-500/20 border border-primary-500 rounded-lg p-2.5"
      type={type}
    >
      <Icon className="w-6 h-6 fill-current text-primary-500" />
    </button>
  );
};

LogoButton.propTypes = {
  icon: propTypes.elementType.isRequired,
  type: propTypes.string.isRequired,
};

export default LogoButton;
