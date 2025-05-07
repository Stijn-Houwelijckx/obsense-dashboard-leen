interface Props {
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  type: "button" | "submit" | "reset";
  onClick?: () => void;
}

const IconButton = ({ icon: Icon, type, onClick }: Props) => {
  return (
    <button
      className="w-12 h-12 rounded-full text-neutral-200 bg-secondary-800 p-3"
      type={type}
      onClick={onClick}
    >
      <Icon className="w-6 h-6 fill-current text-neutral-50" />
    </button>
  );
};

export default IconButton;
