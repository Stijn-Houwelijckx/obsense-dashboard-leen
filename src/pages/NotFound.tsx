import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-secondary-900 px-4 text-center">
      <h1 className="text-[156px] lg:text-[676px] font-title font-bold text-primary-500 opacity-20 leading-none">
        404
      </h1>
      <h4 className="text-[18px] lg:text-[28px] text-neutral-50 font-bold mt-6 mb-2">
        Oops, seems you’ve wandered too far!
      </h4>
      <p className="text-neutral-300 text-sm lg:text-base mb-8 max-w-[360px] lg:max-w-[420px]">
        This page does not exist. Let’s get you back on track.
      </p>
      <button
        onClick={() => navigate("/")}
        className="bg-primary-500 hover:bg-primary-600 text-neutral-950 font-semibold px-6 py-2 rounded-xl transition w-[300px] lg:w-[320px]"
      >
        Home
      </button>
    </div>
  );
};

export default NotFound;
