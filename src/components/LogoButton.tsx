interface Props {
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  type: "button" | "submit" | "reset";
  label?: string;
}

const LogoButton = ({ icon: Icon, type, label }: Props) => {
  return (
    <button
      type={type}
      className="flex flex-1 items-center justify-center gap-2 bg-primary-500/20 border border-primary-500 rounded-lg p-2.5 text-neutral-50 font-medium text-sm"
    >
      <Icon className="w-5 h-5 fill-current text-primary-500" />
      {label && <span>{label}</span>}
    </button>
  );
};

export default LogoButton;
