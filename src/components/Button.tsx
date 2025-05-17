interface Props {
  label: string;
  className?: string;

  type: "button" | "submit" | "reset";
  onClick?: () => void;
}

const Button = ({ label, type, onClick }: Props) => {
  return (
    <button
      className="w-full p-3.5 mt-10 font-bold rounded-lg text-neutral-50 bg-primary-500 hover:bg-primary-600 transition-all"
      type={type}
      onClick={onClick}
    >
      {label}
    </button>
  );
};

export default Button;
