import proptypes from "prop-types";

const IconButton = ({ icon: Icon, type }) => {
  return (
    <button
      className="w-12 h-12 rounded-full text-neutral-200 bg-secondary-800 p-3"
      type={type}
    >
      <Icon />
    </button>
  );
};

IconButton.propTypes = {
  icon: proptypes.elementType.isRequired,
  type: proptypes.string.isRequired,
};

export default IconButton;
