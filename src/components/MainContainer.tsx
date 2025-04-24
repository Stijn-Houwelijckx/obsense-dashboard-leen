interface Props {
  children: React.ReactNode;
}

const MainContainer = ({ children }: Props) => {
  return (
    <div className="font-text text-neutral-50 bg-secondary-900">{children}</div>
  );
};

export default MainContainer;
