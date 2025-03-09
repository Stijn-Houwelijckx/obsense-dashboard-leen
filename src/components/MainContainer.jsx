import PropTypes from "prop-types";

const MainContainer = ({ children }) => {
  return (
    <div className="min-h-dvh font-text text-neutral-50 bg-secondary-900">
      {children}
    </div>
  );
};

MainContainer.propTypes = {
  children: PropTypes.node.isRequired,
};

export default MainContainer;
